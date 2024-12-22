const { DataTypes } = require("sequelize");
const sequlize = require("../config/db.config");
const courseDetails = require("./courseDetails.model");

const Course = sequlize.define(
  "Course",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
    type: {
      type: DataTypes.ENUM("course", "practice-test"),
      allowNull: false,
      defaultValue: "Course",
    },
    title: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    timeSpendperWeak: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "courses",
    timestamps: true,
  }
);
Course.hasOne(courseDetails, {
  foreignKey: "course_id",
  constraints: false,
});

module.exports = Course;
