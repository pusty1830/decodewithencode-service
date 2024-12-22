const { asyncHandler } = require('../middleware/asyncHandler');
const { prepareBody } = require('../utils/response');
const { verifySign } = require('../utils/token');

const router=require('express').Router();

router.route('/create-payment').post(prepareBody,verifySign,asyncHandler(""))

module.exports=router;