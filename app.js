const express = require("express");
const app = express();
const routes=require("./routes/route")
// const path = require("path");

app.use(express.json());
app.use("/doctor", routes);
app.use(express.static(path.join(__dirname, "public")));

// // Set the 'views' directory for HTML files
 app.set("views", path.join(__dirname, "views"));

 //Admin Login
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
  })
//Admin Dashboard
  app.get("/AdminPortal", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "admin.html"));
  })

//Customer  Register
  app.get("/CustomerRegister", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "register.html"));
  })

//Customer Login
  app.get("/CustomerLogin", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "login.html"));
  })


  //Doctor Login
app.get("/DoctorLogin", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "doctorLogin.html"));
  })
//Customer Dashboard
  app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "home.html"));
  })
  // booking for customer
  app.get("/appointment", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "appointment.html"));
  })

  app.get("/Doctordashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "doctordashboard.html"));
  })

module.exports = app;