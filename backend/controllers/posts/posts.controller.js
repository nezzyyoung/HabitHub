const express = require("express");
const RESPONSE_CODES = require('../../constants/RESPONSE_CODES');
const RESPONSE_STATUS = require('../../constants/RESPONSE_STATUS');
const Validation = require("../../class/Validation");
const moment = require("moment");
const Posts = require("../../models/Posts");
const Upload = require("../../class/Upload");  // Import Upload class
const Admins = require("../../models/Admins"); // Import Admins model

/**
 * Function to handle posting a product to the database
 * @param {Request} req 
 * @param {Response} res 
 * @author Nestor Kariuki
 * @Date 05/01/2025
 * @returns 
 */
const postProduct = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);

    // For express-fileupload, files are in req.files
    const { name, price, product_description } = req.body;
    const imageFile = req.files ? req.files.image : null;

    // Validation rules
    const validation = new Validation(
      req.body,
      {
        name: {
          required: true,
        },
        price: {
          required: true,
          number: true,
        },
        product_description: {
          required: true,
        },
        // Removed admin_id validation since it's set from req.userId
      },
    );

    await validation.run();
    const isValid = await validation.isValidate();
    const errors = await validation.getErrors();

    if (!isValid) {
      return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
        statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
        httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
        message: "Validation failed",
        result: errors,
      });
    }

    // Save uploaded file if present using Upload class
    let imagePath = null;
    if (imageFile) {
      const uploader = new Upload();
      const uploadResult = await uploader.upload(imageFile, true);
      imagePath = '/uploads/' + uploadResult.fileInfo.fileName;
    }

    // Fetch admin's sector_id
    const admin = await Admins.findByPk(req.userId);
    const sectorId = admin ? admin.sector_id : null;

    // Create a new post object
    const newPost = {
      admin_id: req.userId, // Assuming admin_id is the logged-in user's ID
      created_at: moment().format("YYYY-MM-DD HH:mm:ss"), // Current timestamp
      image: imagePath,
      name,
      price: parseFloat(price), // Ensure price is a float
      product_description,
      sector_id: sectorId, // Assign sector_id from admin
    };

    // Insert the new post into the database
    const createdPost = await Posts.create(newPost);

    // Return success response
    res.status(RESPONSE_CODES.CREATED).json({
      success: true,
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "Product posted successfully!",
      result: createdPost,
    });
  } catch (err) {
    console.error("Error posting product:", err);
    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
      statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
      message: "An error occurred while posting the product.",
      error: err.message,
    });
  }
};

/**
 * Function to get posts filtered by sector_id
 * @param {Request} req 
 * @param {Response} res 
 */
const getPosts = async (req, res) => {
  try {
    const sector_id = req.query.sector_id;
    const admin_id = req.query.admin_id;
    let whereClause = {};
    if (sector_id) {
      whereClause.sector_id = sector_id;
    }
    if (admin_id) {
      whereClause.admin_id = admin_id;
    }
    const posts = await Posts.findAll({ where: whereClause });
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Posts fetched successfully",
      result: posts,
    });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
      statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
      message: "An error occurred while fetching posts.",
      error: err.message,
    });
  }
};

const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Posts.findByPk(postId);
    if (!post) {
      return res.status(404).json({
        statusCode: 404,
        httpStatus: "Not Found",
        message: "Post not found",
        result: null,
      });
    }
    res.status(200).json({
      statusCode: 200,
      httpStatus: "OK",
      message: "Post fetched successfully",
      result: post,
    });
  } catch (err) {
    console.error("Error fetching post by ID:", err);
    res.status(500).json({
      statusCode: 500,
      httpStatus: "Internal Server Error",
      message: "An error occurred while fetching the post.",
      error: err.message,
    });
  }
};

module.exports = {
  postProduct,
  getPosts,
  getPostById,
};
