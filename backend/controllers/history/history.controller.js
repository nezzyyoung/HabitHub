const express = require("express");
const RESPONSE_CODES = require('../../constants/RESPONSE_CODES');
const RESPONSE_STATUS = require('../../constants/RESPONSE_STATUS');
const History = require("../../models/History");
const Users = require("../../models/Users");
const Products = require("../../models/Products");
const { Op } = require("sequelize");
const Wallet_type = require("../../models/Wallet_type");
const Wallet = require("../../models/Wallet");

// Function to fetch eco points for a specific user
const getHistoryClient = async (req, res) => {
    try {
        const { rows = 10, first = 0, search } = req.query
        const globalSearchColumns = [
            '$product.name_product$'
        ]

        var globalSearchWhereLike = {}
        if (search && search.trim() != "") {
            const searchWildCard = {}
            globalSearchColumns.forEach(column => {
                searchWildCard[column] = {
                    [Op.substring]: search
                }
            })
            globalSearchWhereLike = {
                [Op.or]: searchWildCard
            }
        }
        const allHistory = await History.findAll({
            limit: parseInt(rows),
            offset: parseInt(first),
            where: {
                ...globalSearchWhereLike,
                id_users: req.userId
            },
            attributes: ["id_history", "created_at", "description", "amount"],
            include: [
                {
                    model: Products,
                    as: "product",
                    attributes: ["id_product", 'name_product', "price"],
                    required: false,
                },
                {
                    model: Wallet_type,
                    as: "typewallet",
                    attributes: ["id_type_wallet", 'created_at', "name_type"],
                    required: false,
                },
            ],
            order: [['created_at', 'DESC']]
        });

        // Respond with success
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "Toutes les historiques",
            result: allHistory,
        });
    } catch (err) {
        console.error(err);
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",
        });
    }
};


/**
 * Fonction qui permet de recuperer les montants des ecos que tu as deja utilise pour le paiement
 * @param {Request} req 
 * @param {Response} res 
 * @author Vanny
 * @Date 10/01/2025
 * @returns 
 */
const getHistoryClientEcos = async (req, res) => {
    try {
        const totalSum = await History.sum('amount',{
            where: {
                [Op.and]: [
                    { id_type_wallet: 2 },
                    { id_users: req.userId }
                ]
            },
        });
        // Respond with success
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "Toutes les historiques",
            result: totalSum,
        });
    } catch (err) {
        console.error(err);
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",
        });
    }
};

/**
 * Fonction qui permet de recuperer les montants totals des ecos que tu as dans ton wallet
 * @param {Request} req 
 * @param {Response} res 
 * @author Vanny
 * @Date 10/01/2025
 * @returns 
 */
const getHistoryEcos = async (req, res) => {
    try {
        const allHistory = await Wallet.findOne({
            where: {
                [Op.and]: [
                    { id_type_wallet: 2 },
                    { id_users: req.userId }
                ]
            },
            attributes: ["id_wallet", "created_at","amount"]
        });
        // Respond with success
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "Toutes les historiques",
            result: allHistory,
        });
    } catch (err) {
        console.error(err);
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",
        });
    }
};


const getHistoryBusinessTransactions = async (req, res) => {
    try {
        const { rows = 10, first = 0, search } = req.query;
        const globalSearchColumns = [
            '$product.name_product$',
            '$merchant.name$'
        ];

        let globalSearchWhereLike = {};
        if (search && search.trim() !== '') {
            const searchWildCard = {};
            globalSearchColumns.forEach(column => {
                searchWildCard[column] = {
                    [Op.substring]: search
                };
            });
            globalSearchWhereLike = {
                [Op.or]: searchWildCard
            };
        }

        const allHistory = await History.findAll({
            limit: parseInt(rows),
            offset: parseInt(first),
            where: {
                ...globalSearchWhereLike,
                admin_id: req.userId
            },
            attributes: ['id_history', 'created_at', 'description', 'amount'],
            include: [
                {
                    model: Products,
                    as: 'product',
                    attributes: ['id_product', 'name_product', 'price'],
                    required: false,
                },
                {
                    model: Users,
                    as: 'merchant',
                    attributes: ['id_users', 'name'],
                    required: false,
                },
                {
                    model: Wallet_type,
                    as: 'typewallet',
                    attributes: ['id_type_wallet', 'created_at', 'name_type'],
                    required: false,
                },
            ],
            order: [['created_at', 'DESC']]
        });

        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: 'Business transaction history',
            result: allHistory,
        });
    } catch (err) {
        console.error(err);
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: 'Internal server error, please try again later',
        });
    }
};

module.exports = {
    getHistoryClient,
    getHistoryClientEcos,
    getHistoryEcos,
    getHistoryBusinessTransactions
}
