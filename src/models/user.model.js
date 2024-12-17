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
    accountHolderName: {
      type: Sequilize.STRING(100),
    },
    accountNumber: {
      type: Sequilize.STRING(100),
    },
    bankName: {
      type: Sequilize.STRING(100),
    },
    ifscCode: {
      type: Sequilize.STRING(100),
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

// Inside user.js model
user.associate = (models) => {
  // A user (teacher) can have many courses
  user.hasMany(models.Course, {
    foreignKey: "teacher_id", // teacher_id in courses table
    as: "courses", // Alias for the relationship
  });
};

module.exports = user;
