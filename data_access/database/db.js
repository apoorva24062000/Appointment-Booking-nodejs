/**
 * Project Name : Weather Mangement System
 * @company YMSLI
 * @author Apoorva Singh
 * @date Feb 21, 2024
 * @copyright 2024, Yamaha Motor Solutions (INDIA) Pvt Ltd.

/**
 * @fileoverview PostgreSQL Database Connection
 * @description Creates a connection pool to PostgreSQL using the provided global settings.
 * -----------------------------------------------------------------------------------
 * Dependencies:
 * - pg: PostgreSQL client for Node.js.
 * -----------------------------------------------------------------------------------
 * * Revision History
* -----------------------------------------------------------------------------------
* Modified By          Modified On         Description
* Apoorva Singh       Feb 21,2024           Initially created

* -----------------------------------------------------------------------------------
*/

const { Pool } = require("pg");
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'WeatherManagement',
  password: 'root',
  port: 5432,
});

module.exports = pool;