const DeviceTokens = require("../models/DeviceTokens");
const RESPONSE_CODES = require("../constants/RESPONSE_CODES");
const RESPONSE_STATUS = require("../constants/RESPONSE_STATUS");

const registerDeviceToken = async (req, res) => {
    const userId = req.userId;
    const { token } = req.body;

    if (!token) {
        return res.status(RESPONSE_CODES.BAD_REQUEST).json({
            statusCode: RESPONSE_CODES.BAD_REQUEST,
            httpStatus: RESPONSE_STATUS.BAD_REQUEST,
            message: "Device token is required",
        });
    }

    try {
        // Check if token already exists
        let deviceToken = await DeviceTokens.findOne({ where: { token } });
        if (!deviceToken) {
            deviceToken = await DeviceTokens.create({
                id_users: userId,
                token,
                created_at: new Date(),
            });
        }
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Device token registered successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Internal server error",
        });
    }
};

module.exports = {
    registerDeviceToken,
};
