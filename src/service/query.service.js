const { Op } = require("sequelize");
const model = require("../models/mappingIndex");

let addData = async (tableName, obj) => {
  return await model[tableName].create(obj);
};

let addBulkCreate = async (tableName, obj) => {
  return await model[tableName].bulkCreate(obj);
};

let updateData = async (tableName, cond, obj) => {
  return await model[tableName].update(obj, { where: cond });
};

let deleteData = async (tableName, cond) => {
  return await model[tableName].destroy({ where: cond });
};

let getAllData = async (tableName) => {
  return await model[tableName].findAll();
};
let getAllDataByCond = async (tableName, cond) => {
  if (cond.fieldName) {
    if (cond.fieldName.toLowerCase().inclueds("date")) {
      cond[cond.fieldName] = { [Op.gte]: new Date(cond.fieldValue) };
      delete cond.fieldName;
      delete cond.fieldValue;
    }
    return await model[tableName].findAll({ where: cond });
  } else {
    return await model[tableName].findAll({ where: cond });
  }
};
let findAndCountAllDataByCond = async (tableName, cond, other) => {
  return await model[tableName].findAndCountAll({ where: cond, ...other });
};
let getOneDataByCond = async (tableName, cond) => {
  return await model[tableName].findOne({
    where: cond,
  });
};

let getAllDataByAttr = async (tableName, attr) => {
  return await model[tableName].findAll({
    attributes: attr,
  });
};
let getAllDataByCondWithHasAll = async (tableName, cond, secondTable) => {
  return await model[tableName].findAll({
    where: cond,
    include: model[secondTable],
  });
};
let getOneDataByCondWithHasAll = async (tableName, cond, secondTable) => {
  return await model[tableName].findOne({
    where: cond,
    include: model[secondTable],
  });
};

let getAllDataByCondWithBelongsTo = async (tableName, cond, secondTable) => {
  return await model[tableName].findAll({
    where: cond,
    include: model[secondTable],
  });
};
let getOneDataByCondWithBelongsTo = async (tableName, cond, secondTable) => {
  return await model[tableName].findOne({
    where: cond,
    include: model[secondTable],
  });
};
module.exports = {
  addData,
  addBulkCreate,
  updateData,
  deleteData,
  getAllData,
  getAllDataByCond,
  getAllDataByAttr,
  getAllDataByCondWithBelongsTo,
  getOneDataByCond,
  getOneDataByCondWithBelongsTo,
  getAllDataByCondWithHasAll,
  getOneDataByCondWithHasAll,
  findAndCountAllDataByCond,
};
