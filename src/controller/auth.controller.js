const User = require("../service/user.service");
const { prepareResponse } = require("../utils/response");
const { getRawData } = require("../utils/function");
const httpRes = require("../utils/http");
const { storeOtpInRedis, verifyOtpInRedis } = require("../redis/redisOtp");
const queryService = require("../service/query.service");
const {
  SERVER_ERROR_MESSAGE,
  VERIFY_EMAIL_BEFORE_LOGIN,
  INVALID_OTP,
  PROFILE_CREATION,
  CURRENT_PASSWORD_INCORRECT,
  LOGIN,
  ACCOUNT_NOT_FOUND,
  USER_PROFILE,
  UPDATE_PROFILE_SUCCESS,
  UPLOADED,
} = require("../utils/messages");
const { hashPassword, comparePassword } = require("../utils/Password");
const logger = require("../utils/logger");
const sendEmail = require("../utils/mail");
const { generateSign } = require("../utils/token");

//for cretation of verification code
exports.Signup = async (req, res) => {
  try {
    const body = req.body;

    // Hash the password
    body.password = await hashPassword(body.password);

    // Generate OTP
    const otp = generateOTP();

    // Store user data and OTP in Redis (combine as one object)
    const redisData = { ...body, otp };
    await storeOtpInRedis(body.email, redisData, 300);

    // Send OTP to the user's email
    await sendEmail(
      body.email,
      "Email Verification",
      `Your OTP For User Registration is: ${otp}`
    );

    // Respond to the user
    const response = prepareResponse(
      "OK",
      VERIFY_EMAIL_BEFORE_LOGIN,
      { email: body.email },
      null
    );
    return res.status(httpRes.OK).json(response);
  } catch (error) {
    logger.error(error);
    return res
      .status(httpRes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};

// Function to generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

//verify and insert into the database

exports.verifyAndCreation = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Retrieve data from Redis using the email as the key
    const redisData = await verifyOtpInRedis(email);
    logger.info("Stored data in Redis:", redisData);

    if (!redisData) {
      console.log("Redis data is nothis ");
      return res
        .status(httpRes.BAD_REQUEST)
        .json(prepareResponse("BAD_REQUEST", INVALID_OTP, null, null));
    }

    // Validate OTP
    const { otp: storedOtp, ...userData } = redisData;
    logger.info(userData);
    if (String(storedOtp) !== String(otp)) {
      console.log("error is here :", otp);
      return res
        .status(httpRes.BAD_REQUEST)
        .json(prepareResponse("BAD_REQUEST", INVALID_OTP, null, null));
    }

    // OTP is valid, extract user data from Redis

    // Save the user to the database
    await User.addData(userData);

    const response = prepareResponse(
      "CREATED",
      PROFILE_CREATION,
      // getRawData(result),
      null,
      null
    );

    // Remove data from Redis after successful verification
    // await storeOtpInRedis(email, null); // Optionally use a deleteRedisKey function

    return res.status(httpRes.CREATED).json(response);
  } catch (error) {
    logger.error(error);
    return res
      .status(httpRes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};

//Login controller

exports.Signin = async (req, res) => {
  try {
    let result = await User.getOneUserByCond({ email: req.body.email });
    result = getRawData(result);
    if (result) {
      const hash = await comparePassword(req.body.password, result.password);
      if (!hash) {
        logger.error("CurrentPassword is incorrect ");
        res
          .status(httpRes.FORBIDDEN)
          .json(
            prepareResponse("FORBIDDEN", CURRENT_PASSWORD_INCORRECT, null, null)
          );
      } else {
        let token = await generateSign(
          result.email,
          result.userName,
          result.status,
          result.id,
          result.roll
        );
        result.accessToken = token;
        const { password, ...responseData } = result;
        res
          .status(httpRes.OK)
          .json(prepareResponse("OK", LOGIN, responseData, null));
      }
    } else {
      logger.error("Account not found");
      res
        .status(httpRes.NOT_FOUND)
        .json(prepareResponse("NOT_FOUND", ACCOUNT_NOT_FOUND, null, null));
    }
  } catch (error) {
    logger.error(error);
    return res
      .status(httpRes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};
//get the user data;
exports.getProfile = async (req, res) => {
  try {
    let user = await User.getOneUserByCond({ id: req.decoded.id });
    if (user) {
      res
        .status(httpRes.OK)
        .json(prepareResponse("OK", USER_PROFILE, user, null));
    } else {
      res
        .status(httpRes.NOT_FOUND)
        .json(prepareResponse("NOT_FOUND", ACCOUNT_NOT_FOUND, null, null));
    }
  } catch (error) {
    logger.error(error);
    return res
      .status(httpRes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};

// update the user data
exports.updateProfile = async (req, res) => {
  try {
    let user = await User.getOneUserByCond({ id: req.decoded.id });
    if (req.body.password) {
      req.body.password = await hashPassword(req.body.password);
      if (user) {
        const hash = await comparePassword(
          req.body.currentPassword,
          user.password
        );
        if (!hash) {
          res
            .status(httpRes.FORBIDDEN)
            .json(
              prepareResponse(
                "FORBIDDEN",
                CURRENT_PASSWORD_INCORRECT,
                null,
                null
              )
            );
        } else {
          await User.updateUser(req.decoded.id, req.body);
          res
            .status(httpRes.OK)
            .json(prepareResponse("OK", UPDATE_PROFILE_SUCCESS, user, null));
        }
      } else {
        res
          .status(httpRes.NOT_FOUND)
          .json(prepareResponse("NOT_FOUND", ACCOUNT_NOT_FOUND, null, null));
      }
    } else {
      await User.updateUser(req.decoded.id, req.body);
      res
        .status(httpRes.OK)
        .json(prepareResponse("OK", UPDATE_PROFILE_SUCCESS, user, null));
    }
  } catch (error) {
    logger.error(error);
    return res
      .status(httpRes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};

//delete the user data
exports.deleteProfile = async (req, res) => {
  try {
    let userid = req.decoded.id;
    let user = await User.getOneUserByCond({ id: userid });
    if (user) {
      await User.deleteUser(userid);
      res
        .status(httpRes.OK)
        .json(prepareResponse("OK", DELETE_PROFILE_SUCCESS, null, null));
    } else {
      res
        .status(httpRes.FORBIDDEN)
        .json(prepareResponse("FORBIDDEN", ACCOUNT_NOT_FOUND, null, null));
    }
  } catch (error) {
    logger.error(error);
    return res
      .status(httpRes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};

//adminSignin
exports.adminSignin = async (req, res) => {
  try {
    let result = await queryService.getOneDataByCond("adminLogin", {
      email: req.body.email,
      password: req.body.password,
    });
    result = getRawData(result);
    if (result) {
      let token = await generateSign(
        result.email,
        result.userName,
        result.id,
        result.role,
        result.status
      );
      result.accessToken = token;
      res.status(httpRes.OK).json(prepareResponse("OK", LOGIN, result, null));
    } else {
      res
        .status(httpRes.NOT_FOUND)
        .json(prepareResponse("NOT_FOUND", ACCOUNT_NOT_FOUND, null, null));
    }
  } catch (error) {
    logger.error(error);
    return res
      .status(httpRes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};

//documents uploder
exports.fileUploader = (req, res) => {
  if (Array.isArray(req.files)) {
    let files = req.files;
    let data = {};
    files.forEach((file, index) => {
      data[`doc${index}`] = file.location;
    });
    res.status(httpRes.OK).json(prepareResponse("OK", UPLOADED, data, null));
  } else {
    res
      .status(httpRes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, null));
  }
};

//forgot-password
exports.forgotPassword = () => {};
//Reset-password
exports.resetPassword = () => {};
