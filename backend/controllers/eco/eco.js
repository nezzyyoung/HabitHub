const RESPONSE_CODES = require('../../constants/RESPONSE_CODES');
const RESPONSE_STATUS = require('../../constants/RESPONSE_STATUS');
const Wallet = require("../../models/Wallet");
const Eco = require("../../models/Eco");
const Notifications = require("../../models/Notifications");
const DeviceTokens = require("../../models/DeviceTokens");
const Users = require('../../models/Users');
const fetch = require("node-fetch");

// Helper function to send push notification via Expo
const sendPushNotification = async (expoPushToken, message) => {
    const body = {
        to: expoPushToken,
        sound: 'default',
        title: 'Eco Points Transfer',
        body: message,
        data: { message },
    };

    try {
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        if (data.errors) {
            console.error('Expo push notification error:', data.errors);
        }
    } catch (error) {
        console.error('Error sending push notification:', error);
    }
};

// Fetch eco points and recent transfer history for authenticated user
const getEcoPoints = async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(RESPONSE_CODES.UNAUTHORIZED).json({
            statusCode: RESPONSE_CODES.UNAUTHORIZED,
            httpStatus: RESPONSE_STATUS.UNAUTHORIZED,
            message: 'User not authenticated',
        });
    }

    try {
        const ecoPointsWallet = await Wallet.findOne({
            where: { id_users: userId, id_type_wallet: 2 },
        });

        const transferHistory = await Eco.findAll({
            where: { sender_id: userId },
            order: [['transfer_date', 'DESC']],
            limit: 10,
        });

        return res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Eco points and transfer history fetched successfully",
            result: {
                ecoPoints: ecoPointsWallet,
                transferHistory,
            },
        });
    } catch (error) {
        console.error('Error in getEcoPoints:', error);
        return res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Internal server error, please try again later",
        });
    }
};

// Transfer eco points from authenticated user to recipient by phone number
const transferEcoPoints = async (req, res) => {
    const senderId = req.userId;
    const { recipientPhoneNumber, amount } = req.body;

    if (!recipientPhoneNumber || !amount) {
        return res.status(RESPONSE_CODES.BAD_REQUEST).json({
            statusCode: RESPONSE_CODES.BAD_REQUEST,
            httpStatus: RESPONSE_STATUS.BAD_REQUEST,
            message: "Recipient phone number and amount are required",
        });
    }

    try {
        const senderWallet = await Wallet.findOne({
            where: { id_users: senderId, id_type_wallet: 2 },
        });

        if (!senderWallet || Number(senderWallet.amount) < Number(amount)) {
            return res.status(RESPONSE_CODES.BAD_REQUEST).json({
                statusCode: RESPONSE_CODES.BAD_REQUEST,
                httpStatus: RESPONSE_STATUS.BAD_REQUEST,
                message: "Insufficient eco points",
            });
        }

        const recipientUser = await Users.findOne({
            where: { phoneNumber: recipientPhoneNumber },
        });

        if (!recipientUser) {
            return res.status(RESPONSE_CODES.NOT_FOUND).json({
                statusCode: RESPONSE_CODES.NOT_FOUND,
                httpStatus: RESPONSE_STATUS.NOT_FOUND,
                message: "Recipient user not found",
            });
        }

        const recipientWallet = await Wallet.findOne({
            where: { id_users: recipientUser.id_users, id_type_wallet: 2 },
        });

        if (!recipientWallet) {
            return res.status(RESPONSE_CODES.NOT_FOUND).json({
                statusCode: RESPONSE_CODES.NOT_FOUND,
                httpStatus: RESPONSE_STATUS.NOT_FOUND,
                message: "Recipient eco points record not found",
            });
        }

        await Wallet.sequelize.transaction(async (t) => {
            senderWallet.amount -= amount;
            await senderWallet.save({ transaction: t });

            recipientWallet.amount += amount;
            await recipientWallet.save({ transaction: t });

            await Notifications.create({
                created_at: new Date(),
                title: `You have sent ${amount} eco points to user with phone ${recipientPhoneNumber}.`,
            }, { transaction: t });

            await Notifications.create({
                created_at: new Date(),
                title: `You have received ${amount} eco points from user with ID ${senderId}.`,
            }, { transaction: t });

            await Eco.create({
                created_at: new Date(),
                sender_id: senderId,
                recipient_id: recipientUser.id_users,
                description: `Transfer to ${recipientUser.name} (${recipientPhoneNumber})`,
                amount,
                transfer_date: new Date(),
            }, { transaction: t });
        });

        const senderTokens = await DeviceTokens.findAll({ where: { id_users: senderId } });
        const recipientTokens = await DeviceTokens.findAll({ where: { id_users: recipientUser.id_users } });

        const senderMessage = `You have sent ${amount} eco points to user with phone ${recipientPhoneNumber}.`;
        const recipientMessage = `You have received ${amount} eco points from user with ID ${senderId}.`;

        for (const tokenObj of senderTokens) {
            await sendPushNotification(tokenObj.token, senderMessage);
        }
        for (const tokenObj of recipientTokens) {
            await sendPushNotification(tokenObj.token, recipientMessage);
        }

        return res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Eco points transferred successfully",
        });
    } catch (error) {
        console.error('Error in transferEcoPoints:', error);
        return res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Internal server error",
        });
    }
};

// Get user details by phone number
const getUserByPhoneNumber = async (req, res) => {
    const { phoneNumber } = req.params;
    if (!phoneNumber) {
        return res.status(RESPONSE_CODES.BAD_REQUEST).json({
            statusCode: RESPONSE_CODES.BAD_REQUEST,
            httpStatus: RESPONSE_STATUS.BAD_REQUEST,
            message: "Phone number is required",
        });
    }
    try {
        const user = await Users.findOne({ where: { phoneNumber } });
        if (!user) {
            return res.status(RESPONSE_CODES.NOT_FOUND).json({
                statusCode: RESPONSE_CODES.NOT_FOUND,
                httpStatus: RESPONSE_STATUS.NOT_FOUND,
                message: "User not found",
            });
        }
        return res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "User found",
            result: {
                id: user.id_users,
                name: user.name,
                phoneNumber: user.phoneNumber,
            },
        });
    } catch (error) {
        console.error('Error in getUserByPhoneNumber:', error);
        return res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Internal server error",
        });
    }
};

module.exports = {
    getEcoPoints,
    transferEcoPoints,
    getUserByPhoneNumber,
};
