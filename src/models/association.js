// models/index.js
const Course = require("./course.model");
const CourseDetails = require("./courseDetails.model");

// Define associations
CourseDetails.belongsTo(Course, {
  foreignKey: "course_id",
  constraints: false,
});

Course.hasOne(CourseDetails, {
  foreignKey: "course_id",
  constraints: false,
});

module.exports = {
  Course,
  CourseDetails,
};
