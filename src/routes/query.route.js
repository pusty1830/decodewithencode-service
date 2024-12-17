const router = require("express").Router({ mergeParams: true });
const { prepareBody } = require("../utils/response");
const { asyncHandler } = require("../middleware/asyncHandler");
const {
  createData,
  insertManyData,
  getAllRecod,
  getAllRecordBelongsTo,
  updaterecord,
  deleterecord,
} = require("../controller/query.controller");
const { modelvalidate } = require("../validators/root.validator");
const { verifySign } = require("../utils/token");

router.route("/create").post(
  prepareBody,
  //  modelvalidate,
  asyncHandler("", createData)
);
router.route("/insertMany").post(
  // prepareBody,
  asyncHandler("", insertManyData)
);
router
  .route("/get-all-record")
  .post(prepareBody, verifySign, asyncHandler("", getAllRecod));
router
  .route("/get-all-record-with-belongs-to")
  .post(prepareBody, asyncHandler("", getAllRecordBelongsTo));
router.route("/update-record/:id").patch(
  // prepareBody,
  asyncHandler("", updaterecord)
);
router.route("/delete-record/:id").delete(asyncHandler("", deleterecord));

//getone record
module.exports = router;
