const sequlizeConfig = require("../config/db.config");
const Sequlize = require("sequelize");

const adminLogin = sequlizeConfig.define(
  "adminLogin",
  {
    id: {
      type: Sequlize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userName: {
      type: Sequlize.STRING(50),
      allowNull: false,
    },
    roll: {
      allowNull: false,
      type: Sequlize.STRING(10),
    },
    email: {
      allowNull: false,
      type: Sequlize.STRING(50),
    },
    password: {
      allowNull: false,
      type: Sequlize.STRING(100),
    },
    source: {
      allowNull: false,
      type: Sequlize.STRING(20),
    },
    status: {
      allowNull: false,
      type: Sequlize.STRING(10),
    },
  },
  {
    tableName: "adminLogin",
    timestamps: true,
    indexes: [
      {
        fields: ["id"],
      },
      {
        fields: ["userName"],
      },
      {
        fields: ["roll"],
      },
      {
        fields: ["source"],
      },
      {
        fields: ["status"],
      },
    ],
  }
);
module.exports = adminLogin;
