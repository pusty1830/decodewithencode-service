const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const mentoravailability = sequelize.define(
  "MentorAvailability",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    mentor_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
    available_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
  },
  {
    tableName: "mentor_availability",
    timestamps: true,
  }
);

module.exports = mentoravailability;
