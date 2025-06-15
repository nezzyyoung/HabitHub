const express = require("express");
const RESPONSE_STATUS = require('../../constants/RESPONSE_STATUS');
const RESPONSE_CODES = require('../../constants/RESPONSE_CODES');
const generateToken = require("../../utils/generateToken");
const Validation = require("../../class/Validation");
const Users = require("../../models/Users");
const md5 = require("md5");
const moment = require("moment");
const Admins = require("../../models/Admins");
const Wallet = require("../../models/Wallet");

/**
 * Fonction pour faire l'authentification de l'utilisateurs
 * @param {Request} req 
 * @param {Response} res 
 * @author Vanny
 * @Date 22/11/2024
 * @returns 
 */

const loginUsers = async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;
        const validation = new Validation(
            req.body,
            {
                phoneNumber: {
                    required: true,
                },
                password: {
                    required: true,
                },
            },
            {
                password: {
                    required: "Le mot de passe est obligatoire",
                },
                phoneNumber: {
                    required: "L'email est obligatoire",
                },
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
        const userObject = await Users.findOne({
            where: { phoneNumber: phoneNumber },
            attributes: ["id_users", "created_at", "name", "image", "adress", "pin", "phoneNumber", "remember_me", "hashed_pin"],
        });

        if (userObject) {
            const user = userObject.toJSON();
            if (user.hashed_pin == md5(password)) {
                const token = generateToken(
                    { user: user.id_users },
                    3 * 12 * 30 * 24 * 3600
                );
                const { hashed_pin, ...other } = user
                res.status(RESPONSE_CODES.CREATED).json({
                    statusCode: RESPONSE_CODES.CREATED,
                    httpStatus: RESPONSE_STATUS.CREATED,
                    message: "Vous êtes connecté avec succès",
                    result: {
                        ...user,
                        token,
                    },
                });
            } else {
                validation.setError("main", "Identifiants incorrects");
                const errors = await validation.getErrors();
                res.status(RESPONSE_CODES.NOT_FOUND).json({
                    statusCode: RESPONSE_CODES.NOT_FOUND,
                    httpStatus: RESPONSE_STATUS.NOT_FOUND,
                    message: "Utilisateur n'existe pas",
                    result: errors,
                });
            }
        } else {
            validation.setError("main", "Identifiants incorrects");
            const errors = await validation.getErrors();
            res.status(RESPONSE_CODES.NOT_FOUND).json({
                statusCode: RESPONSE_CODES.NOT_FOUND,
                httpStatus: RESPONSE_STATUS.NOT_FOUND,
                message: "Utilisateur n'existe pas",
                result: errors,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",
        });
    }
};

/**
 * Fonction pour creer un utilisateurs clients
 * @param {Request} req 
 * @param {Response} res 
 * @author Vanny
 * @Date 22/11/2024
 * @returns 
 */
const createUsers = async (req, res) => {
    try {
        const { name, password, phoneNumber } = req.body;
        const validation = new Validation(
            req.body,
            {
                name: {
                    required: true,
                },
                password: {
                    required: true,
                },
                phoneNumber: {
                    required: true,
                },

            },
            {
                name: {
                    required: "Le nom est obligatoire",
                },
                password: {
                    required: "Le mot de passe est obligatoire",
                },
                phoneNumber: {
                    required: "Le mot de passe est obligatoire",
                },

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

        const ecosBonus = 200
        const date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
        const userNew = await Users.create({
            created_at: date,
            name: name,
            pin: password,
            hashed_pin: md5(password),
            phoneNumber:phoneNumber
        })
        const lastUser = userNew.toJSON()
        if (lastUser) {
            await Wallet.create({
                created_at: date,
                id_users: userNew.id_users,
                amount: ecosBonus,
                id_type_wallet: 2
            })
            const token = generateToken(
                { user: lastUser.id_users },
                3 * 12 * 30 * 24 * 3600
            );
            const { hashed_pin, ...other } = lastUser
            res.status(RESPONSE_CODES.CREATED).json({
                statusCode: RESPONSE_CODES.CREATED,
                httpStatus: RESPONSE_STATUS.CREATED,
                message: "L'utilisateur a ete creer avec succès",
                result: {
                    ...lastUser,
                    token,
                },
            });
        } else {
            validation.setError("main", "Identifiants incorrects");
            const errors = await validation.getErrors();
            res.status(RESPONSE_CODES.NOT_FOUND).json({
                statusCode: RESPONSE_CODES.NOT_FOUND,
                httpStatus: RESPONSE_STATUS.NOT_FOUND,
                message: "Utilisateur n'existe pas",
                result: errors,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",
        });
    }
}


/**
 * Fonction pour faire l'authentification de l'utilisateurs marchant
 * @param {Request} req 
 * @param {Response} res 
 * @author Vanny
 * @Date 23/11/2024
 * @returns 
 */

const loginUsersMarchant = async (req, res) => {
    try {
        const { phone_number, password } = req.body;
        const validation = new Validation(
            req.body,
            {
                phone_number: {
                    required: true,
                },
                password: {
                    required: true,
                },
            },
            {
                password: {
                    required: "Le mot de passe est obligatoire",
                },
                phone_number: {
                    required: "Le telephone est obligatoire",
                },
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
        const userObject = await Admins.findOne({
            where: { phone_number: phone_number },
            attributes: ["admin_id", "created_at", "company_name", "image", "adress", "phone_number", "name", "pin", "email", "hashed_pin", "sector_id", "remember_me"],
        });

        if (userObject) {
            const user = userObject.toJSON();
            if (user.hashed_pin == md5(password)) {
                const token = generateToken(
                    { user: user.admin_id },
                    3 * 12 * 30 * 24 * 3600
                );
                const { hashed_pin, ...other } = user
                res.status(RESPONSE_CODES.CREATED).json({
                    statusCode: RESPONSE_CODES.CREATED,
                    httpStatus: RESPONSE_STATUS.CREATED,
                    message: "Vous êtes connecté avec succès",
                    result: {
                        ...user,
                        token,
                    },
                });
            } else {
                validation.setError("main", "Identifiants incorrects");
                const errors = await validation.getErrors();
                res.status(RESPONSE_CODES.NOT_FOUND).json({
                    statusCode: RESPONSE_CODES.NOT_FOUND,
                    httpStatus: RESPONSE_STATUS.NOT_FOUND,
                    message: "Utilisateur n'existe pas",
                    result: errors,
                });
            }
        } else {
            validation.setError("main", "Identifiants incorrects");
            const errors = await validation.getErrors();
            res.status(RESPONSE_CODES.NOT_FOUND).json({
                statusCode: RESPONSE_CODES.NOT_FOUND,
                httpStatus: RESPONSE_STATUS.NOT_FOUND,
                message: "Utilisateur n'existe pas",
                result: errors,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",
        });
    }
};


/**
 * Fonction pour creer un utilisateurs marchand
 * @param {Request} req 
 * @param {Response} res 
 * @author Vanny
 * @Date 22/11/2024
 * @returns 
 */
const createUsersMarchant = async (req, res) => {
    try {
        const { name, email, password, company_name, adress, phone_number } = req.body;
        const validation = new Validation(
            req.body,
            {
                name: {
                    required: true,
                },
                email: {
                    required: true,
                    // email: true,
                    // unique: "Users,email",
                },
                password: {
                    required: true,
                },
                company_name: {
                    required: true,
                },
                adress: {
                    required: true,
                },
                phone_number: {
                    required: true,
                },

            },
            {
                name: {
                    required: "Le nom est obligatoire",
                },
                email: {
                    required: "L'email est obligatoire",
                    // email: "Email invalide",
                    // unique: "Email déjà utilisé",
                },
                password: {
                    required: "Le mot de passe est obligatoire",
                },
                company_name: {
                    required: "L'entreprise de l est obligatoire",
                },
                adress: {
                    required: "L'adresse est obligatoire",
                },
                phone_number: {
                    required: "Le numero est obligatoire",
                },

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
        const userNew = await Admins.create({
            created_at: date,
            company_name: company_name,
            adress: adress,
            phone_number: phone_number,
            name: name,
            pin: password,
            email: email,
            hashed_pin: md5(password)

        })
        const lastUser = userNew.toJSON()
        if (lastUser) {
            const token = generateToken(
                { user: lastUser.admin_id },
                3 * 12 * 30 * 24 * 3600
            );
            const { hashed_pin, ...other } = lastUser
            res.status(RESPONSE_CODES.CREATED).json({
                statusCode: RESPONSE_CODES.CREATED,
                httpStatus: RESPONSE_STATUS.CREATED,
                message: "L'utilisateur a ete creer avec succès",
                result: {
                    ...lastUser,
                    token,
                },
            });
        } else {
            validation.setError("main", "Identifiants incorrects");
            const errors = await validation.getErrors();
            res.status(RESPONSE_CODES.NOT_FOUND).json({
                statusCode: RESPONSE_CODES.NOT_FOUND,
                httpStatus: RESPONSE_STATUS.NOT_FOUND,
                message: "Utilisateur n'existe pas",
                result: errors,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",
        });
    }
}

module.exports = {
    loginUsers,
    createUsers,
    loginUsersMarchant,
    createUsersMarchant
}