/**
 * Project Name : Weather Mangement System
 * @company YMSLI
 * @author  Apoorva Singh
 * @date    Feb 21, 2024
 * Copyright (c) 2024, Yamaha Motor Solutions (INDIA) Pvt Ltd.
 * -----------------------------------------------------------------------------------
 * Description
 * -----------------------------------------------------------------------------------
 * - register: Function for handling user registration.
 * - login: Function for handling user login.
 * - duplicateEmail: Function for checking duplicate email.
 * -
 * -----------------------------------------------------------------------------------
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By          Modified On         Description
 * Apoorva Singh       Feb 21,2024           Initially created
 
 * -----------------------------------------------------------------------------------
 */
const status = require('http-status');


const customerService = require("../service/CustomerService");
const bcrypt = require("bcrypt");
const { generateToken } = require("../middleware/AuthMiddleware");

/**
 * @function register
 * @description Handles user registration.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {JSON} Response containing a success message or an error message.
 */
const register = async (req, res) => {
 
  try {
    const {name, email,password } = req.body;

    const result = await customerService.registerUser(name,email,password);
    res
      .status(status.OK)
      .json({ message: global.messages.userCreated, result });
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ error: global.messages.registerFail });
      console.log(error.message)
  }
  
};
/**
 * @function login
 * @description Handles user login.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {JSON} Response containing a success message, token, and user information or an error message.
 */
const login = async (req, res) => {
 

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res
        .status(status.BAD_REQUEST)
        .json({ error: global.messages.allFieldsRequired });
    }
    const user = await customerService.loginUser(email);

    if (!user) {
      return res
        .status(status.NOT_FOUND)
        .json({ error: global.messages.notFound });
    }
    const ispassvalid = await bcrypt.compare(password, user.password);

    if (!ispassvalid) {
      return res
        .status(status.UNAUTHORIZED)
        .json({ error: global.messages.invalidPass });
    }
    const token = generateToken(user);

    const userInfo = user.email;
    const userName = user.name

    
    res
      .status(status.OK)
      .json({ message: global.messages.userLogin, token, userInfo,userName});
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ error: global.messages.loginFail });
      console.log(error.message)
  }
  
};


const duplicateEmail = async (req, res) => {
  

    const { email } = req.params;
  
    try {
      const user = await customerService.loginUser(email);
  
      if (user) {
        res.status(status.OK).json({ exists: true, user });
      } else {
        res.status(status.OK).json({ exists: false, user: null });
      }
    } catch (error) {
      res
        .status(status.INTERNAL_SERVER_ERROR)
        .json({ error: global.messages.duplicateFail });
        
    }
  
   
  };


module.exports = {
  register,
  login,
  duplicateEmail
  
};
