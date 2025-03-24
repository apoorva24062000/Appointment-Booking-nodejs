document.getElementById("appointmentForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent form submission

    const doctorEmail = window.sessionStorage.doctorEmail;
    const customerEmail = window.sessionStorage.userInfo;
    const appointmentDate = document.getElementById("appointmentDate").value;
    const appointmentTime = document.getElementById("appointmentTime").value;

    try {
        // Check appointment time availability first
        const checkTimeResponse = await axios.post('http://localhost:2000/doctor/checkTime', {
            doctorEmail,
            appointmentDate,
            appointmentTime
        });
        console.log(checkTimeResponse.data.isValid)

        if (checkTimeResponse.data.isValid) {
            // Time is available, proceed to book appointment
            const bookAppointmentResponse = await axios.post('http://localhost:2000/doctor/appointments', {
                doctorEmail,
                customerEmail,
                appointmentDate,
                appointmentTime
            });
            if (bookAppointmentResponse.data.success) {
                alert('Appointment booked successfully!');
                // Redirect to another page if needed
                window.location.href = './dashboard';
            } else {
                alert('Failed to book appointment.');
            }
        } else {
            alert('Appointment time is not available.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
});
