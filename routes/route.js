const express = require("express");
const router = express.Router();
const admincontroller = require("../controller/AdminController");
const customercontroller = require("../controller/CustomerController");
const doctorcontroller = require("../controller/DoctorController");

// Admin routes
router.post('/admin/login', admincontroller.login);
router.post('/admin/register', admincontroller.register);
router.post('/admin/registerdoctor', admincontroller.registerDoctor);

// Customer routes
router.post('/registeruser', customercontroller.register);
router.post('/loginuser', customercontroller.login);
router.get("/checkEmail/:email", customercontroller.duplicateEmail);
router.get("/acheckEmail/:email", admincontroller.duplicateEmail);


// Doctor routes
router.post("/logindoctor", doctorcontroller.login);
router.get("/getAllDoctor", doctorcontroller.getAllDoctors);
router.post('/appointments', doctorcontroller.bookAppointment);
router.get('/appointments/:customerEmail', doctorcontroller.getAppointments);
router.post('/appointments/alreadybooked', doctorcontroller.appointmentalreadybooked);
router.post('/checkTime', doctorcontroller.validateAppointmentTimeController);


router.get("/getAllCustomer/:doctoremail",doctorcontroller.getAllPatients)

router.put('/appointment/:appointmentId/complete', doctorcontroller.completeAppointment);
router.put('/appointment/:appointmentId/cancel', doctorcontroller.cancelAppointment);


module.exports = router;
