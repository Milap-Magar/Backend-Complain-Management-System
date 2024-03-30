const { pool } = require("../config/database");

class StudentModel {
  async insertStudentData(
    user_id,
    class_id,
    section_id,
    blood_group,
    nationality,
    admission_id
  ) {
    try {
      const [result] = await pool.query(
        "INSERT INTO student (user_id,class_id,section_id,admission_id,blood_group,nationality) VALUES (?,?,?,?,?,?)",
        [user_id, class_id, section_id, admission_id, blood_group, nationality]
      );
      return result;
    } catch (error) {
      console.log("Error at student Model", error);
      throw error;
    }
  }
  async getAllStudents() {
    try {
      const [result] = await pool.query(
        "select fname, mname, lname,role,email,image, dob, student.user_id,student_id,student.class_id, student.section_id,admission_id, blood_group, nationality,class_name, section_name from student inner join user on student.user_id = user.user_id inner join class on student.class_id = class.class_id inner join section on student.section_id = section.section_id"
      );
      return [result];
    } catch (error) {
      console.log("Error ar student model", error);
      throw error;
    }
  }
}

module.exports = new StudentModel();
