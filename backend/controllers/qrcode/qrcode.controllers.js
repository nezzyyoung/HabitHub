const express = require("express");
const RESPONSE_STATUS = require('../../constants/RESPONSE_STATUS');
const RESPONSE_CODES = require('../../constants/RESPONSE_CODES');
const Validation = require("../../class/Validation");
const Products = require("../../models/Products");
const moment = require("moment");

/**
 * Fonction qui permet de creer un qrcode
 * @param {Request} req 
 * @param {Response} res 
 * @author Vanny
 * @Date 22/11/2024
 * @returns 
 */

const createQrcode = async (req, res) => {
    try {
        const {name, price, description, code } = req.body
        const validation = new Validation(
            req.body,
            {
                name: {
                    required: true,
                },
                price: {
                    required: true,
                },
                description: {
                    required: true,
                },
                code: {
                    required: true,
                },
            },
            {
                name: {
                    required: "Le nom est obligatoire",
                },
                price: {
                    required: "Le prix est obligatoire",
                },
                description: {
                    required: "La description est obligatoire",
                },
                code: {
                    required: "Le code est obligatoire",
                }
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
        const date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
        const qrcode = await Products.create({
            created_at: date,
            name_product: name,
            price: price,
            description:description,
            code: code,
            admin_id:req.userId
        })
        const lastqrcode = qrcode.toJSON()
        if(lastqrcode){
            res.status(RESPONSE_CODES.CREATED).json({
                statusCode: RESPONSE_CODES.CREATED,
                httpStatus: RESPONSE_STATUS.CREATED,
                message: "Le Qrcode a ete creer avec succès",
                result:lastqrcode,
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",
        });
    }
};

/**
 * Fonction qui permet de verifier si le qrcode existe deja dans la base
 * @param {Request} req 
 * @param {Response} res 
 * @author Vanny
 * @Date 22/11/2024
 * @returns 
 */

const checkQrcodeExist = async (req, res) => {
    try {
        const {code} = req.params
        const oneProduct = await Products.findOne({
            where: { code: code, statut:0 },
        })
        // Vérifiez si le produit existe
        if (!oneProduct) {
            return res.status(RESPONSE_CODES.NOT_FOUND).json({
                statusCode: RESPONSE_CODES.NOT_FOUND,
                httpStatus: RESPONSE_STATUS.NOT_FOUND,
                message: "Produit non trouvé",
                result: null,
            });
        }
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "Votre produit",
            result:oneProduct,
        });
    }
    catch (error) {
        console.log(error);
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",
        });
    }
};

module.exports = {
    createQrcode,
    checkQrcodeExist
}