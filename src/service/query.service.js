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
const getAllDataByCond = async (tableName, cond) => {
  const queryCond = {}; // Define a new condition object

  if (cond.fieldName && cond.fieldValue) {
    if (cond.fieldName.toLowerCase().includes("date")) {
      // Handle date-based filtering
      queryCond[cond.fieldName] = { [Op.gte]: new Date(cond.fieldValue) };
    } else {
      // Assign the field name dynamically
      queryCond[cond.fieldName] = cond.fieldValue;
    }
  } else {
    Object.assign(queryCond, cond); // Use the original condition if no fieldName/fieldValue
  }

  // Fetch data using the dynamically created condition
  return await model[tableName].findAll({ where: queryCond });
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

let getAllDataByCondAndPagination = async (
  tableName,
  cond,
  page,
  pageSize,
  order
) => {
  const offset = page * pageSize;
  const limit = pageSize;
  const filter = cond.filter;
  const fields = cond.fields;
  delete cond.filter;
  if (filter !== "") {
    let fieldToSearch = [];
    return async
      .each(fields, (field, after_field) => {
        fieldToSearch.push({ [field]: { [Op.like]: `%${filter}%` } });
        after_field();
      })
      .then(async () => {
        cond = {
          ...cond,
          [Op.or]: fieldToSearch,
        };
        return await model[tableName].findAndCountAll({
          limit,
          offset,
          where: cond,
          order,
          // order: [['createdAt', order]],
        });
      });
  } else {
    return await model[tableName].findAndCountAll({
      limit,
      offset,
      where: cond,
      order: order,
    });
  }
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
  getAllDataByCondAndPagination,
};
