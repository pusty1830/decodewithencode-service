const router = require("express").Router();
const { prepareBody } = require("../utils/response");
const { asyncHandler } = require("../middleware/asyncHandler");
const {
  Signup,
  Signin,
  verifyAndCreation,
  getProfile,
  updateProfile,
  deleteProfile,
  fileUploader,
  resetPassword,
  forgotPassword,
} = require("../controller/auth.controller");
const {
  signupValidation,
  signinValidation,
  update,
  resetPassword: reset,
  forgotPassword: forgot,
} = require("../validators/auth.validator");
const checkMail = require("../middleware/checkMail");
const { verifySign } = require("../utils/token");
const upload = require("../middleware/multer");

//profile REGISTER
router
  .route("/register")
  .post(
    prepareBody,
    signupValidation,
    asyncHandler("user", checkMail),
    asyncHandler("user", Signup)
  );

//VERIFY THAT USER
router
  .route("/verify-user")
  .post(prepareBody, asyncHandler("user", verifyAndCreation));

//USER_LOGIN
router
  .route("/login")
  .post(
    prepareBody,
    signinValidation,
    asyncHandler("user", asyncHandler("", Signin))
  );

//GET the PROFILE
router
  .route("/profile")
  .get(verifySign, asyncHandler("user", asyncHandler("user", getProfile)));

//update the PROFILE
router.route("/update-profile").patch(
  //prepareBody,
  verifySign,
  asyncHandler("user", update, updateProfile)
);

//delete the PROFILE
router
  .route("/delete-profile")
  .delete(verifySign, asyncHandler("user", deleteProfile));

//adminSignin
router.route("/admin-signin").post(
  // prepareBody,
  asyncHandler("user", signinValidation)
);

//File-Uploader
router.route("/upload-doc").post(upload.array("files", 5), fileUploader);

//RESET-PASSWORD
router.route("/reset-password").patch(
  // prepareBody,
  reset,
  asyncHandler("user", resetPassword)
);

//Forgot-PASSWORD
router.route("forgot-password").patch(
  // prepareBody,
  forgot,
  asyncHandler("user", forgotPassword)
);

module.exports = router;
