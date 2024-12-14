const Sequilize = require("sequelize");
const sequlizeConfig = require("../config/db.config");

const user = sequlizeConfig.define(
  "user",
  {
    id: {
      type: Sequilize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userName: {
      type: Sequilize.STRING(50),
      allowNull: false,
    },
    email: {
      type: Sequilize.STRING(100),
      allowNull: false,
    },
    password: {
      type: Sequilize.STRING(100),
      allowNull: false,
    },
    role: {
      type: Sequilize.ENUM("Teacher", "User", "Mentor", "Admin"),
      allowNull: false,
      // defaultValue: "User",
    },
    status: {
      type: Sequilize.ENUM("Created", "Varified"),
      allowNull: false,
      defaultValue: "Created",
    },
    phoneNumber: {
      type: Sequilize.STRING(20),
      allowNull: false,
    },
    coverImage: {
      allowNull: true,
      type: Sequilize.STRING(300),
    },
    profileImage: {
      allowNull: true,
      type: Sequilize.STRING(300),
    },
    isVerified: {
      allowNull: false,
      type: Sequilize.BOOLEAN,
      defaultValue: false,
    },
    token: {
      type: Sequilize.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    indexes: [
      {
        fields: ["id"],
      },
      {
        fields: ["userName"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["email"],
      },
    ],
  }
);

module.exports = user;
