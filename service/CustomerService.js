const bcrypt = require("bcrypt");
const pool = require("../data_access/database/db");
const CustomerQueries = require("../data_access/queries/CustomerQueries");




/**
 * @function registerUser
 * @description Registers a new user by hashing the password and storing user details in the database.
 * @param {string} email - User's email address.
 * @param {string} password - User's password.
 * @returns {Object} The created user data.
 * @throws Will throw an error if there's an issue with the registration process.
 */
const registerUser = async (name,email, password) => {
  try {
    // Hash the user's password before storing in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store user details in the database
    const result = await pool.query(CustomerQueries.register, [
     name,
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
      const result = await pool.query(CustomerQueries.login, [email]);
      
      // Return the user details
      return result.rows[0];
    } catch (error) {
  
      throw error;
    }
  };

module.exports = {
    registerUser,
    loginUser
    
  };