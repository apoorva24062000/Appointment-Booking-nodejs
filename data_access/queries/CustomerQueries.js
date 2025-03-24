/*
 * Project Name : Weather Mangement System
 * @company YMSLI
 * @author Apoorva Singh
 * @date Feb 21, 2024
 * @copyright 2023, Yamaha Motor Solutions (INDIA) Pvt Ltd.
 * -----------------------------------------------------------------------------------
 * @fileoverview User Queries
 * @description Helper functions to generate SQL queries for user-related operations.
 * -----------------------------------------------------------------------------------
 * Functions:
 * - InsertUserQuery: Generates an SQL query for inserting user data into a table.
 * - SelectUserQuery: Generates an SQL query for selecting user data from a table based on a condition.
 * - UserQueries: Object containing predefined queries for user registration, login, and username check.
 *
 * 
 * -----------------------------------------------------------------------------------
 * * -----------------------------------------------------------------------------------
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By          Modified On         Description
 * Apoorva Singh       Feb 21,2024           Initially created
 
 * -----------------------------------------------------------------------------------
 */



/**
 * @description Helper function to generate an SQL query for inserting user data into a table.
 * @param {string} table - The name of the table.
 * @param {string[]} columns - An array of column names.
 * @returns {string} - The SQL query for inserting user data.
 */

const InsertUserQuery = (table, columns) => {
    const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
    return `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
  };


  const SelectUserQuery = (table, condition) => {
    return `SELECT * FROM ${table} WHERE ${condition}`;
  };
   

/**
 * @description Helper function to generate an SQL query for selecting user data from a table based on a condition.
 * @param {string} table - The name of the table.
 * @param {string} condition - The condition to be used in the WHERE clause.
 * @returns {string} - The SQL query for selecting user data.
 */
  const CustomerQueries = {
    register: InsertUserQuery('customer_master', ['name','email' ,'password']),
    login:SelectUserQuery('customer_master','email = $1'),
    


  }


  module.exports = CustomerQueries;