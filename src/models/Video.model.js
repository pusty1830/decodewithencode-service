const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Video = sequelize.define(
  "Video",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    course_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "courses",
        key: "id",
      },
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
    preview_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },

    video_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    // s3_key: {
    //   type: DataTypes.STRING(500),
    //   allowNull: false,
    // },
  },
  {
    tableName: "videos",
    timestamps: true,
  }
);

module.exports = Video;
