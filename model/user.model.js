const { pool } = require("../config/database");
// async function getUsers() {
//   try {
//     const [rows] = await pool.query("SELECT * FROM user");
//     return rows;
//   } catch (error) {
//     console.log(error);
//   }
// }
// module.exports = getUsers;

class UserModel {
  async createUser(userData) {
    // console.log(userData);
    let connection;
    const {
      name,
      dob,
      email,
      password,
      role,
      gender,
      primaryContact,
      secondaryContact,
      temp_address,
      perm_address,
    } = userData;
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      // console.log(image_result);
      const [result] = await connection.query(
        `INSERT INTO user ( name, dob, email, password, role, gender) Values (?,?, ?, ?, ?,?,?,?)`,
        [name, dob, email, password, role, gender]
      );
      const user_id = result.insertId;
      await connection.query(
        "INSERT INTO user_contact (user_id, contact) VALUES (?,?)",
        [user_id, primaryContact]
      );
      if (secondaryContact) {
        await connection.query(
          "INSERT INTO user_contact (user_id, contact) VALUES (?,?)",
          [user_id, secondaryContact]
        );
      }

      await connection.query(
        "INSERT INTO user_address (user_id, address, address_type) VALUES (?,?,?)",
        [user_id, temp_address, "temporary"]
      );
      await connection.query(
        "INSERT INTO user_address (user_id, address, address_type) VALUES (?,?,?)",
        [user_id, perm_address, "permanent"]
      );
      await connection.commit();
      return result;
    } catch (error) {
      console.log("error in userModel", error);
      throw error;
    }
  }
  async getUsers() {
    try {
      const [rows] = await pool.query(`
      SELECT
      user.user_id,
                  user.name,
                  user.role,
                  user.email,
                  user.dob,
                  user.image,
      GROUP_CONCAT(DISTINCT user_contact.contact ORDER BY user_contact.user_id) as contacts,
      MAX(CASE WHEN user_address.address_type = 'temporary' THEN user_address.address END) as temp_address,
      MAX(CASE WHEN user_address.address_type = 'permanent' THEN user_address.address END) as permanent_address
  FROM 
      user 
      LEFT JOIN user_address ON user.user_id = user_address.user_id 
      LEFT JOIN user_contact ON user.user_id = user_contact.user_id
  GROUP BY 
      user.user_id;
        `);

      return [rows];
    } catch (error) {
      console.log(error);
    }
  }

  async getUserByEmail(email) {
    try {
      const [rows] = await pool.query(
        "SELECT user.* FROM user where email = ?",
        [email]
      );
      return [rows];
    } catch (error) {
      console.log(error);
    }
  }
  async getUserById(id) {
    try {
      const [rows] = await pool.query(
        `SELECT user.user_id,user.fname,password,user.mname,user.lname,user.email,user.dob,user.role,gender,image FROM user WHERE user_id = ?`,
        [id]
      );
      return [rows];
    } catch (error) {
      console.log(error);
    }
  }
  async getUserCount() {
    try {
      const [rows] = await pool.query(
        `SELECT role, COUNT(*) as no_of_user FROM user GROUP BY role`
      );
      return [rows];
    } catch (error) {
      console.log(error);
    }
  }
  async deleteUserById(user_id) {
    let connection;
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      await connection.query("DELETE FROM user WHERE user_id = ?", [user_id]);
      await connection.commit();
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(password, user_id) {
    try {
      const [result] = await pool.query(
        "UPDATE user SET password = ? WHERE user_id = ?",
        [password, user_id]
      );
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getOwnData(user_id) {
    try {
      const [result] = await pool.query(
        `SELECT
        user.user_id,
                    user.fname,
                    user.mname,
                    user.lname,
                    user.role,
                    user.email,
                    user.dob,
                    user.image,
                    user.gender,
        GROUP_CONCAT(DISTINCT user_contact.contact ORDER BY user_contact.user_id) as contacts,
        MAX(CASE WHEN user_address.address_type = 'temporary' THEN user_address.address END) as temp_address,
        MAX(CASE WHEN user_address.address_type = 'permanent' THEN user_address.address END) as permanent_address
    FROM 
        user 
        LEFT JOIN user_address ON user.user_id = user_address.user_id 
        LEFT JOIN user_contact ON user.user_id = user_contact.user_id
        WHERE user.user_id = ?
    GROUP BY 
        user.user_id `,
        [user_id]
      );
      return [result];
    } catch (error) {
      throw error;
    }
  }
  async changeProfile(image, user_id) {
    try {
      const result = await pool.query(
        "UPDATE user SET image = ? WHERE user_id = ?",
        [image, user_id]
      );
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = new UserModel();
