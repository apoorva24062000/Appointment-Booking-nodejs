const app = require("../app")

function startServer(){
    app.listen(global.settings.port, () => {
        console.log(`Server Running on port : ${global.settings.port}`);
    });
}


module.exports = { startServer };