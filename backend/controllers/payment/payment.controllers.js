// ecoPoints.js
const express = require("express");
const RESPONSE_CODES = require('../../constants/RESPONSE_CODES');
const RESPONSE_STATUS = require('../../constants/RESPONSE_STATUS');
const Validation = require("../../class/Validation");
const moment = require("moment");
const History = require("../../models/History");
const Wallet = require("../../models/Wallet");
const Products = require("../../models/Products");
const generateEco = require("../../utils/generateEco");
const Eco = require("../../models/Eco");
const Wallet_type = require("../../models/Wallet_type");
const { Op } = require('sequelize');
const sequelize = require('../../utils/sequerize');
const Users = require("../../models/Users");

/**
 * Fonction qui permet d'exucuter le paiement
 * @param {Request} req 
 * @param {Response} res 
 * @author Vanny
 * @Date 10/12/2024
 * @returns 
 */

const paymentProduct = async (req, res) => {
    const t = await sequelize.transaction(); // 🔹 Démarrer la transaction
    try {
        const { desciption, id_product, amount, id_type_wallet } = req.body;

        const validation = new Validation(
            req.body,
            {
                id_product: { required: true },
                amount: { required: true },
                id_type_wallet: { required: true },
            }
        );
        await validation.run();
        const isValid = await validation.isValidate();
        const errors = await validation.getErrors();
        if (!isValid) {
            return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
                statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
                httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
                message: "Probleme de validation des donnees",
                result: errors,
            });
        }

        const date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        var ecoPoints = generateEco(amount, 2);

        const typeWallet = await Wallet_type.findOne({
            where: { id_type_wallet },
            transaction: t,
        });

        const isExist = typeWallet?.toJSON();
        if (!isExist) throw new Error("Type de wallet non trouvé");

        const amountWallet = await Wallet.findOne({
            where: {
                [Op.and]: [
                    { id_type_wallet: isExist.id_type_wallet },
                    { id_users: req.userId }
                ]
            },
            transaction: t,
        });

        const wallet = amountWallet?.toJSON();
        if (!wallet) throw new Error("Wallet introuvable");

        if (amount > wallet.amount) {
            await t.rollback();
            validation.setError("main", "Montant est trop grand");
            const errors = await validation.getErrors();
            return res.status(RESPONSE_CODES.NOT_FOUND).json({
                statusCode: RESPONSE_CODES.NOT_FOUND,
                httpStatus: RESPONSE_STATUS.NOT_FOUND,
                message: "Montant est trop grand",
                result: errors,
            });
        }

        var amountRestant = wallet.amount - amount;

        // 🔹 1. Créer l'historique
        await History.create({
            created_at: date,
            id_product,
            id_users: req.userId,
            admin_id: req.userId,
            amount,
            id_type_wallet
        }, { transaction: t });

        // 🔹 2. Mettre à jour le wallet (débit)
        await Wallet.update({
            amount: amountRestant
        }, {
            where: {
                [Op.and]: [
                    { id_type_wallet: wallet.id_type_wallet },
                    { id_users: req.userId }
                ]
            },
            transaction: t
        });

        // 🔹 3. Mettre à jour le produit (statut)
        await Products.update({
            statut: 1
        }, {
            where: { id_product },
            transaction: t
        });

        // 🔹 4. Gérer les ecoPoints (wallet type 2)
        if (wallet.id_type_wallet != 2) {
            const isExistEco = await Wallet.findOne({
                where: {
                    [Op.and]: [
                        { id_type_wallet: 2 },
                        { id_users: req.userId }
                    ]
                },
                transaction: t
            });

            if (isExistEco) {
                const ecoPointsData = isExistEco.toJSON();
                const newEco = ecoPointsData.amount + ecoPoints;

                await Wallet.update({
                    amount: newEco
                }, {
                    where: {
                        [Op.and]: [
                            { id_type_wallet: 2 },
                            { id_users: req.userId }
                        ]
                    },
                    transaction: t
                });
            } else {
                await Wallet.create({
                    created_at: date,
                    id_users: req.userId,
                    amount: ecoPoints,
                    id_type_wallet: 2
                }, { transaction: t });
            }

            // New logic: credit eco points to the business wallet
            const product = await Products.findOne({
                where: { id_product },
                transaction: t,
            });

            if (product) {
                const productData = product.toJSON();
                const businessId = productData.admin_id;

                const businessWallet = await Wallet.findOne({
                    where: {
                        [Op.and]: [
                            { id_type_wallet: 2 },
                            { id_users: businessId }
                        ]
                    },
                    transaction: t,
                });

                if (businessWallet) {
                    const businessWalletData = businessWallet.toJSON();
                    const updatedAmount = businessWalletData.amount + ecoPoints;

                    await Wallet.update({
                        amount: updatedAmount
                    }, {
                        where: {
                            [Op.and]: [
                                { id_type_wallet: 2 },
                                { id_users: businessId }
                            ]
                        },
                        transaction: t,
                    });
                } else {
                    await Wallet.create({
                        created_at: date,
                        id_users: businessId,
                        amount: ecoPoints,
                        id_type_wallet: 2
                    }, { transaction: t });
                }
            }
        }

        // 🔹 Tout est bon, on commit
        await t.commit();

        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "Payment fait avec succès",
            result: { id_product, amount },
        });

    } catch (err) {
        await t.rollback(); // 🔴 En cas d'erreur, rollback
        console.error(err);
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",
        });
    }
};

/**
 * Fonction qui permet d'exucuter le paiement en payant par cash 
 * @param {Request} req 
 * @param {Response} res 
 * @author Vanny
 * @Date 6/5/2025
 * @returns 
 */

const paymentCashProduct = async (req, res) => {
    const t = await sequelize.transaction(); // Démarre la transaction

    try {
        const { description, id_product, amount, id_type_wallet } = req.body;

        // 🔹 Validation des données
        const validation = new Validation(req.body, {
            id_product: { required: true },
            amount: { required: true },
            id_type_wallet: { required: true },
        });

        await validation.run();
        const isValid = await validation.isValidate();

        if (!isValid) {
            const errors = await validation.getErrors();
            await t.rollback();
            return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
                statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
                httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
                message: "Problème de validation des données",
                result: errors,
            });
        }

        const date = moment().format("YYYY-MM-DD HH:mm:ss");
        const ecoPoints = generateEco(amount, 2);

        // 🔹 Vérifier le produit
        const product = await Products.findOne({
            where: { id_product },
            transaction: t,
        });

        if (!product) {
            await t.rollback();
            return res.status(RESPONSE_CODES.NOT_FOUND).json({
                statusCode: RESPONSE_CODES.NOT_FOUND,
                httpStatus: RESPONSE_STATUS.NOT_FOUND,
                message: "Produit introuvable",
            });
        }

        const productData = product.toJSON();

        if (amount < productData.price) {
            await t.rollback();
            validation.setError("amount", "Le montant est insuffisant");
            const errors = await validation.getErrors();
            return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
                statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
                httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
                message: "Montant insuffisant pour ce produit",
                result: errors,
            });
        }

        // 🔹 Créer l'historique d'achat
        await History.create({
            created_at: date,
            id_product,
            id_users: req.userId,
            admin_id: req.userId,
            amount,
            id_type_wallet,
            description: description || null,
        }, { transaction: t });

        // 🔹 Mettre à jour le produit (changement de statut)
        await Products.update(
            { statut: 1 },
            { where: { id_product }, transaction: t }
        );

        // 🔹 Mettre à jour le wallet (eco-points)
        const wallet = await Wallet.findOne({
            where: { id_users: req.userId },
            transaction: t,
        });

        if (wallet) {
            const newAmount = wallet.amount + ecoPoints;

            await Wallet.update(
                { amount: newAmount },
                {
                    where: { id_users: req.userId },
                    transaction: t,
                }
            );
        }

        // 🔹 Valider la transaction
        await t.commit();

        return res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "Paiement effectué avec succès",
            result: { id_product, amount },
        });

    } catch (err) {
        await t.rollback(); // 🔴 Annule la transaction en cas d'erreur
        console.error("Erreur dans paymentCashProduct:", err);

        return res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur. Veuillez réessayer plus tard.",
        });
    }
};


/**
 * Fonction qui permet de recuperer les types de wallet
 * @param {Request} req 
 * @param {Response} res 
 * @author Vanny
 * @Date 8/01/2025
 * @returns 
 */
const getAllTypeWallet = async (req, res) => {
    try {
        const typeWallet = await Wallet_type.findAll({
        })
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "liste de type Wallet",
            result: typeWallet,
        });

    } catch (err) {
        console.log(err);
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",
        });
    }
};

/**
 * Fonction qui permet de recuperer l'argent du wallet
 * @param {Request} req 
 * @param {Response} res 
 * @author Vanny
 * @Date 8/01/2025
 * @returns 
 */
const getMoneyWallet = async (req, res) => {
    try {
        const { id_type_wallet } = req.params
        const typeWallet = await Wallet.findOne({
            where: {
                [Op.and]: [
                    { id_type_wallet: id_type_wallet },
                    { id_users: req.userId }
                ]
            },
        })
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "Money",
            result: typeWallet,
        });

    } catch (err) {
        console.log(err);
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",
        });
    }
};



/**
 * Fonction qui permet d'exucuter le paiement en payant par cash cote marchant
 * @param {Request} req 
 * @param {Response} res 
 * @author Vanny
 * @author Nestor
 * @Date 21/5/2025
 * @returns 
 */

const marchantProductCash = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const { description, amount, phoner_number } = req.body;

        // 🔹 Validation des données
        const validation = new Validation(req.body, {
            description: { required: true },
            amount: { required: true },
            phoner_number: { required: true },
        });

        await validation.run();
        const isValid = await validation.isValidate();

        if (!isValid) {
            const errors = await validation.getErrors();
            await t.rollback();
            return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
                statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
                httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
                message: "Problème de validation des données",
                result: errors,
            });
        }

        const date = moment().format("YYYY-MM-DD HH:mm:ss");
        const ecoPoints = generateEco(amount, 2);

        const utilisateur = await Users.findOne({
            where: { phoneNumber: phoner_number },
            transaction: t,
        });

        // 🔹 Toujours créer une ligne dans l'historique
        await History.create({
            created_at: date,
            admin_id: req.userId,
            amount: amount,
            id_type_wallet: 2,
            description: description || null,
        }, { transaction: t });

        if (utilisateur) {
            const wallet = await Wallet.findOne({
                where: { id_users: utilisateur.id_users },
                transaction: t,
            });

            if (wallet) {
                // 🔹 Mise à jour du portefeuille
                const newAmount = wallet.amount + ecoPoints;
                await Wallet.update(
                    { amount: newAmount },
                    {
                        where: { id_users: utilisateur.id_users },
                        transaction: t,
                    }
                );
            }
        }

        await t.commit(); // ✅ Commit explicite après succès

        return res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "Paiement effectué avec succès",
            result: { amount },
        });

    } catch (err) {
        console.error("Erreur dans marchantProductCash:", err);
        await t.rollback(); // 🔴 Rollback si exception

        return res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur. Veuillez réessayer plus tard.",
        });
    }
};





/**
 * Fonction qui permet de recuperer l'argent du wallet
 * @param {Request} req 
 * @param {Response} res 
 * @author Nestor
 * @Date 23/5/2025
 * @returns 
 */

const getExpenditureHistory = async (req, res) => {
    try {
        const { paymentMethod } = req.query; // optional filter by id_type_wallet
        const userId = req.userId;

        const whereClause = { id_users: userId };
        if (paymentMethod) {
            whereClause.id_type_wallet = paymentMethod;
        }

        const history = await History.findAll({
            where: whereClause,
            include: [
                { model: Products, as: 'product' },
                { model: Wallet_type, as: 'typewallet' }
            ],
            order: [['created_at', 'DESC']],
        });

        res.status(200).json({
            statusCode: 200,
            message: "Expenditure history fetched successfully",
            result: history,
        });
    } catch (error) {
        console.error("Error fetching expenditure history:", error);
        res.status(500).json({
            statusCode: 500,
            message: "Internal server error",
        });
    }
};

const getMerchantEcoPoints = async (req, res) => {
    try {
        const wallet = await Wallet.findOne({
            where: {
                id_users: req.userId,
                id_type_wallet: 2
            }
        });

        const ecoPoints = wallet ? wallet.amount : 0;

        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Merchant eco points fetched successfully",
            result: { ecoPoints }
        });
    } catch (error) {
        console.error("Error fetching merchant eco points:", error);
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Internal server error, please try again later"
        });
    }
};

module.exports = {
    paymentProduct,
    getAllTypeWallet,
    getMoneyWallet,
    paymentCashProduct,
    getExpenditureHistory,
    marchantProductCash,
    getMerchantEcoPoints
}
