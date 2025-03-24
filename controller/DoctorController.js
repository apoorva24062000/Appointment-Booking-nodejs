const status = require('http-status');


const doctorService = require("../service/DoctorService");
const bcrypt = require("bcrypt");
const { generateToken } = require("../middleware/AuthMiddleware");



const login = async (req, res) => {
 

    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        res
          .status(status.BAD_REQUEST)
          .json({ error: global.messages.allFieldsRequired });
      }
      const user = await doctorService.loginUser(email);
  
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


  const getAllDoctors = async (req, res) => {
    try {
    
        const alldoctor = await doctorService.getAllDoctors();
        res.status(200).json({ message: "Fetched" ,alldoctor});
      
    } catch (error) {
      console.error(Messages.transcFail, error);
      res.status(500).json({ error: "Failed" });
    }
  };

  const bookAppointment = async (req, res) => {
    try {
        const { doctorEmail, customerEmail, appointmentDate, appointmentTime } = req.body;
        
        // Call service method to book appointment
        const appointment = await doctorService.bookAppointment(doctorEmail, customerEmail, appointmentDate, appointmentTime);

        res.status(201).json({ success: true, appointment });
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ success: false, message: 'Failed to book appointment' });
    }
};

const getAppointments = async (req, res) => {
    const { customerEmail } = req.params;
    // console.log(customerEmail)
    try {
        const appointments = await doctorService.getAppointmentsByCustomerEmail(customerEmail);
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const appointmentalreadybooked = async (req, res) => {
    const { customerEmail, doctorEmail } = req.body;

    try {
        const appointments = await doctorService.appointmentcheck(customerEmail, doctorEmail);
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const validateAppointmentTimeController = async (req, res) => {
    const { doctorEmail, appointmentTime, appointmentDate } = req.body;

    try {
        // Assuming you have access to the database pool
        const isValid = await doctorService.validateAppointmentTime(doctorEmail, appointmentTime,appointmentDate);
        
        res.json({ isValid });
    } catch (error) {
        console.error('Error validating appointment time:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
const getAllPatients = async (req, res) => {
    const { doctoremail } = req.params;
    // console.log(customerEmail)
    try {
        const customers = await doctorService.getpaitentsByDoctorEmail(doctoremail);
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const completeAppointment= async(req, res)=> {
    const appointmentId = req.params.appointmentId;
    try {
        await doctorService.completeAppointment(appointmentId);
        res.status(200).json({ message: 'Appointment completed successfully' });
    } catch (error) {
        console.error('Error completing appointment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Controller function to handle cancelling an appointment
const cancelAppointment=async(req, res)=> {
    const appointmentId = req.params.appointmentId;
    try {
        await doctorService.cancelAppointment(appointmentId);
        res.status(200).json({ message: 'Appointment cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

  module.exports = {
    login,
    getAllDoctors,
    bookAppointment,
    getAppointments,
    appointmentalreadybooked,
    validateAppointmentTimeController,
    getAllPatients,
    completeAppointment,
    cancelAppointment
  } 