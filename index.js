global.settings = require("./config/AppSettings")
 global.messages = require("./common/Messages")
 global.path = require("path")
// global.appBasePath = process.cwd();

const { startServer } = require('./bin/server');
startServer();
// const logger = require('./common/Logger').Log;
// global.log = logger;