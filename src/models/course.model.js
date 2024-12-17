const { DataTypes } = require("sequelize");
const sequlize = require("../config/db.config");

const Course = sequlize.define(
  "Course",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
    cousePreviewImg: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    isCourse: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "courses",
    timestamps: true,
  }
);

// Inside Course.js model
Course.associate = (models) => {
  // A course belongs to one user (teacher)
  Course.belongsTo(models.User, {
    foreignKey: "teacher_id", // teacher_id in courses table
    as: "teacher", // Alias for the relationship
  });
};

module.exports = Course;
