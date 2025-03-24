const bcrypt = require("bcrypt");
const pool = require("../data_access/database/db");
const DoctorQueries = require("../data_access/queries/DoctorQueries");



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
      const result = await pool.query(DoctorQueries.login, [email]);
      
      // Return the user details
      return result.rows[0];
    } catch (error) {
  
      throw error;
    }
  };


  const getAllDoctors = async () => {
    try {
        // Fetch all doctor details from the database
    const result = await pool.query('SELECT * FROM doctor_master');
        
        // Return the array of doctor details
        return result.rows;
    } catch (error) {
        throw error;
    }
};



const getpaitentsByDoctorEmail = async (doctoremail) => {
    try {
        const query = 'SELECT * FROM appointment WHERE doctor_email = $1';
        const values = [doctoremail];
        const result = await pool.query(query, values);
        // console.log(result.rows)
        return result.rows;
    } catch (error) {
        throw error;
    }
};

const bookAppointment = async (doctorEmail, customerEmail, appointmentDate, appointmentTime) => {
   

    try {
        // Begin transaction
        
        // Insert appointment into the database
        const queryText = 'INSERT INTO appointment (doctor_email, customer_email, appointment_date, appointment_time, status) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const values = [doctorEmail, customerEmail, appointmentDate, appointmentTime, 'Pending'];
        const result = await pool.query(queryText, values);

        // Commit transaction

        return result.rows[0];
    } catch (error) {
        // Rollback transaction on errothrow error;
    } finally {
        // client.release();
    }
};
// appointmentService.js

const getAppointmentsByCustomerEmail = async (customerEmail) => {
    try {
        const query = 'SELECT * FROM appointment WHERE customer_email = $1';
        const values = [customerEmail];
        const result = await pool.query(query, values);
        // console.log(result.rows)
        return result.rows;
    } catch (error) {
        throw error;
    }
};

const appointmentcheck = async (customerEmail,doctorEmail) => {
    try {
        const query = 'SELECT * FROM appointment WHERE customer_email = $1 AND doctor_email =$2';
        const values = [customerEmail,doctorEmail];
        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
};

const validateAppointmentTime = async (doctorEmail, appointmentTime,appointmentDate) => {
    try {
        console.log(doctorEmail, appointmentTime);
        const query = 'SELECT from_timings, to_timings FROM doctor_master WHERE email = $1';
        const values = [doctorEmail];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            throw new Error('Doctor not found.');
        }

        const doctor = result.rows[0];
        const fromTimings = doctor.from_timings;
        const toTimings = doctor.to_timings;

        // Convert appointmentTime, fromTimings, and toTimings to Date objects for comparison
        const appointmentTimeDate = new Date('1970-01-01 ' + appointmentTime);
        const fromTimingsDate = new Date('1970-01-01 ' + fromTimings);
        const toTimingsDate = new Date('1970-01-01 ' + toTimings);

        // Check if appointmentTime is between fromTimings and toTimings
        if (!(appointmentTimeDate >= fromTimingsDate && appointmentTimeDate <= toTimingsDate)) {
            return false; // Appointment time is outside doctor's working hours
        }

        // Check if the appointment is booked with another patient at the same time and the status is pending
        const bookingQuery = 'SELECT * FROM appointment WHERE doctor_email = $1 AND appointment_time = $2 AND status = $3 AND appointment_date =$4';
        const bookingValues = [doctorEmail, appointmentTime, 'Pending',appointmentDate];
        const bookingResult = await pool.query(bookingQuery, bookingValues);
        // console.log(bookingResult)

        if (bookingResult.rows.length > 0) {
            return false; // Another appointment is already booked with the same doctor at the same time and status is pending
        }

        return true; // Appointment time is valid

    } catch (error) {
        throw error;
    }
};


const completeAppointment= async(appointmentId)=> {
    try {
        const query = 'UPDATE appointment SET status = $1 WHERE id = $2';
        const values = ['Complete', appointmentId];
        await pool.query(query, values);
        return true; // Successfully updated status
    } catch (error) {
        console.error('Error completing appointment:', error);
        throw error;
    }
}

// Function to update appointment status to 'Cancelled'
const cancelAppointment=async(appointmentId)=> {
    try {
        const query = 'UPDATE appointment SET status = $1 WHERE id = $2';
        const values = ['Cancelled', appointmentId];
        await pool.query(query, values);
        return true; // Successfully updated status
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        throw error;
    }
}



  module.exports= {
    loginUser,
    getAllDoctors,
    bookAppointment,
    validateAppointmentTime,
    appointmentcheck,
    getAppointmentsByCustomerEmail,
   getpaitentsByDoctorEmail,
   completeAppointment,
   cancelAppointment
  }