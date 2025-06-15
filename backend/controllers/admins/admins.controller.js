const Admins = require('../../models/Admins');
const RESPONSE_CODES = require('../../constants/RESPONSE_CODES');
const RESPONSE_STATUS = require('../../constants/RESPONSE_STATUS');

/**
 * Get businesses filtered by sector_id
 * @param {Request} req 
 * @param {Response} res 
 */
const getBusinessesBySector = async (req, res) => {
  try {
    const sector_id = req.query.sector_id;
    let whereClause = {};
    if (sector_id) {
      whereClause.sector_id = sector_id;
    }
    const businesses = await Admins.findAll({ where: whereClause });
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Businesses fetched successfully",
      result: businesses,
    });
  } catch (err) {
    console.error("Error fetching businesses:", err);
    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
      statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
      message: "An error occurred while fetching businesses.",
      error: err.message,
    });
  }
};

/**
 * Get single business by admin_id
 * @param {Request} req 
 * @param {Response} res 
 */
const getBusinessById = async (req, res) => {
  try {
    const id = req.params.id;
    const business = await Admins.findOne({ where: { admin_id: id } });
    if (!business) {
      return res.status(RESPONSE_CODES.NOT_FOUND).json({
        statusCode: RESPONSE_CODES.NOT_FOUND,
        httpStatus: RESPONSE_STATUS.NOT_FOUND,
        message: "Business not found",
        result: [],
      });
    }
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Business fetched successfully",
      result: business,
    });
  } catch (err) {
    console.error("Error fetching business:", err);
    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
      statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
      message: "An error occurred while fetching business.",
      error: err.message,
    });
  }
};

module.exports = {
  getBusinessesBySector,
  getBusinessById,
};
