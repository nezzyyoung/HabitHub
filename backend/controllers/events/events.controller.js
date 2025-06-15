const express = require("express");
const RESPONSE_CODES = require('../../constants/RESPONSE_CODES');
const RESPONSE_STATUS = require('../../constants/RESPONSE_STATUS');
const { Op } = require("sequelize");
const Validation = require("../../class/Validation");
const PubliciteUpload = require("../../class/uploads/PubliciteUpload");
const Events = require("../../models/Events");
const IMAGES_DESTINATIONS = require("../../constants/IMAGES_DESTINATIONS");
const Users = require("../../models/Users");
const Admins = require("../../models/Admins");
const Category = require("../../models/Category");
/**
 * Fonction qui permet de creer un evenements a publier au clients
 * @param {Request} req 
 * @param {Response} res 
 * @author Vanny
 * @Date 19/02/2025
 * @returns 
 */
const createEvents = async (req, res) => {
    try {
        const { category_id, parteners_id, sponsors_id, title, description, date, time, location, address, longitude, laltitude } = req.body;
        // const { PHOTO } = req.files || {}
        // const file = req.files ? req.files.PHOTO : undefined;
        // console.log(file)
        // if (!file) {
        //     return res.status(400).json({ message: 'No file uploaded' });
        // }
        const data = { ...req.body, ...req.files };
        const validation = new Validation(data, {
            category_id: {
                required: true,
            },
            parteners_id: {
                required: true,
            },
            title: {
                required: true,
            },
            description: {
                required: true,
            },
            date: {
                required: true,
            },
            time: {
                required: true,
            },
            location: {
                required: true,
            },
            address: {
                required: true,
            }
        }, {
            category_id: {
                required: "Ce Champ est obligatoire",
            },
            parteners_id: {
                required: "Ce Champ est obligatoire",
            },
            title: {
                required: "Ce Champ est obligatoire",
            },
            description: {
                required: "Ce Champ est obligatoire",
            },
            date: {
                required: "Ce Champ est obligatoire",
            },
            time: {
                required: "Ce Champ est obligatoire",
            },
            location: {
                required: "Ce Champ est obligatoire",
            },
            address: {
                required: "Ce Champ est obligatoire",
            },
            // PHOTO: {
            //     required: req.__('publicite_admin.controller.create.required'),
            //     fileTypes: req.__('publicite_admin.controller.create.filetype'),

            // }
        });
        await validation.run()
        const isValid = await validation.isValidate()
        if (!isValid) {
            const errors = await validation.getErrors()
            return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
                statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
                httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
                message: "Probleme de validation des donnees",
                result: errors
            })
        }
        // const publiciteUpload = new PubliciteUpload()
        // const { fileInfo } = await publiciteUpload.upload(PHOTO, false)
        // const image = `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS .publicite}/${fileInfo.fileName}`

        const publication = await Events.create({
            category_id: category_id,
            parteners_id: parteners_id,
            sponsors_id: sponsors_id,
            title: title,
            description: description,
            date: date,
            time: time,
            location: location,
            address: address,
            longitude: longitude,
            laltitude: laltitude,
            // image: image,
        });
        // Respond with success
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "L'enregistrement est faites avec success",
            result: publication,
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

const getAllEventsClient = async (req, res) => {
    try {
        const { rows = 10, first = 0, search } = req.query
        // const globalSearchColumns = [
        //     '$product.name_product$'
        // ]

        // var globalSearchWhereLike = {}
        // if (search && search.trim() != "") {
        //     const searchWildCard = {}
        //     globalSearchColumns.forEach(column => {
        //         searchWildCard[column] = {
        //             [Op.substring]: search
        //         }
        //     })
        //     globalSearchWhereLike = {
        //         [Op.or]: searchWildCard
        //     }
        // }
        const allEvents = await Events.findAll({
            limit: parseInt(rows),
            offset: parseInt(first),
            where: {
                // ...globalSearchWhereLike,
            },
            attributes: ["id_events", "category_id", "attendees_id", "parteners_id","sponsors_id","title","description","date","time","location",
                "address","longitude","laltitude","attending","image"
            ],
            include: [
                {
                    model: Users,
                    as: "user",
                    attributes: ["id_users", 'created_at', "name","image"],
                    required: false,
                },
                {
                    model: Admins,
                    as: "admin",
                    attributes: ["admin_id", 'created_at', "company_name","image","adress","phone_number","name"],
                    required: false,
                },
                {
                    model: Category,
                    as: "category",
                    attributes: ["id_category", 'description'],
                    required: false,
                },
            ],
            // order: [['created_at', 'DESC']]
        });

        // Respond with success
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "Toutes les evenements",
            result: allEvents,
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



module.exports = {
    createEvents,
    getAllEventsClient
}