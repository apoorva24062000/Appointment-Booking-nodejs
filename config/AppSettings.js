module.exports = {
    port: process.env.PORT || 2000,
    pgUser: process.env.PGUSER || "postgres",
    pgHost: process.env.PGHOST || "localhost",
    pgDatabase: process.env.PGDATABASE || "UserMangement",
    pgPassword: process.env.PGPASSWORD || "12345",
    pgPort: process.env.PGPORT || 5432,
KEY: "pp",
     TIME: "2h",
//     LOG_FILE_MAX_SIZE: "10m",
//   LOG_FILE_DELETE_DAYS: "14",


}