const router = require("express").Router({ mergeParams: true });
const { prepareBody } = require("../utils/response");
const { asyncHandler } = require("../middleware/asyncHandler");
const {
  createData,
  insertManyData,
  getAllRecod,
  updaterecord,
  deleterecord,
  searchRecord,
  getOneData,
  getAllDataBelongsTo,
  getAllDataWithHasAll,
} = require("../controller/query.controller");
const { modelvalidate, search } = require("../validators/root.validator");
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
  .route("/update-record/:id")
  .patch(prepareBody, asyncHandler("", updaterecord));
router.route("/search-record").post(
  prepareBody,
  verifySign,
  // search,
  asyncHandler("", searchRecord)
);

router
  .route("/get-one-record/:id")
  .get(verifySign, asyncHandler("", getOneData));
router.route("/delete-record/:id").delete(asyncHandler("", deleterecord));

//BElongsTo
router.route("/get-all-data-belongs-to").post(
  prepareBody,
  //  verifySign,
  asyncHandler("", getAllDataBelongsTo)
);
//HAS ALL
router.route("/get-all-data-has-all").post(
  prepareBody,
  //  verifySign,
  asyncHandler("", getAllDataWithHasAll)
);

//getone record
module.exports = router;
