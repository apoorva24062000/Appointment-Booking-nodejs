const bcrypt = require("bcrypt");
const pool = require("../data_access/database/db");
const AdminQueries = require("../data_access/queries/AdminQueries");




/**
 * @function registerUser
 * @description Registers a new user by hashing the password and storing user details in the database.
 * @param {string} email - User's email address.
 * @param {string} password - User's password.
 * @returns {Object} The created user data.
 * @throws Will throw an error if there's an issue with the registration process.
 */
const registerUser = async (email, password) => {
  try {
    // Hash the user's password before storing in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store user details in the database
    const result = await pool.query(AdminQueries.register, [
    
     email,
      hashedPassword,
    ]);
    return result.rows[0]; // Assuming the query returns the created user data
  } catch (error) {
    throw error;
  }
};


/**
 * @function loginUser
 * @description Retrieves user details from the database based on the provided email.
 * @param {string} email - User's email address.
 * @returns {Object} The user details.
 * @throws Will throw an error if there's an issue with the login process.
 */
const loginUser = async (email) => {
    try {
      // Fetch user details from the database based on the email
      const result = await pool.query(AdminQueries.login, [email]);
      
      // Return the user details
      return result.rows[0];
    } catch (error) {
  
      throw error;
    }
  };



  const createDoctor = async (email, name, password, expertise, experience, address, latitude, longitude, from_timings, to_timings, mobile_no, image_url) => {
    try {
        // Insert the doctor details into the doctor_master table
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            "INSERT INTO doctor_master (email, name, password, expertise, experience, address, latitude, longitude, from_timings, to_timings, mobile_no, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
            [email, name, hashedPassword, expertise, experience, address, latitude, longitude, from_timings, to_timings, mobile_no, image_url]
        );
    } catch (error) {
        console.error("Error in adding doctor:", error.message);
        throw new Error("Error in adding doctor");
    }
};

const checkDuplicateEmail= async (email) => {
  try {
    const query = 'SELECT * FROM doctor_master WHERE email = $1';
    const values = [email];
    const result = await pool.query(query, values);

    // If a user with the provided email exists, return true
    return result.rows.length > 0;
  } catch (error) {
    throw error;
  }
}



module.exports = {
    registerUser,
    loginUser,
createDoctor,
checkDuplicateEmail
    
  }; 