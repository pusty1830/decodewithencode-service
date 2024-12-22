const { DataTypes } = require("sequelize");
const sequlizeConfig = require("../config/db.config");
const Course = require("./course.model");

const courseDetails = sequlizeConfig.define(
  "courseDetails",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    course_desc: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    courseImage: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    previewVideo: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    courseVideo: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    Price: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    progress: {
      type: DataTypes.STRING(200),
      defaultValue: "Completed",
    },
  },
  {
    tableName: "courseDetails",
    timestamps: true,
  }
);

module.exports = courseDetails;
