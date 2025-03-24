function renderPatientsData(data) {
    const tableBody = document.querySelector("#data-table tbody");
    tableBody.innerHTML = ""; // Clear existing rows
console.log('hi',data)
    data.forEach(patient => {
        // Parse appointment date string to Date object
        console.log(patient)
        const appointmentDate = new Date(patient.appointment_date);
        // Format appointment date as "MM/DD/YYYY"
        const formattedDate = `${appointmentDate.getMonth() + 1}/${appointmentDate.getDate()}/${appointmentDate.getFullYear()}`;

        const row = tableBody.insertRow();
        row.setAttribute('data-appointment-date', patient.appointment_date); // Add data attribute for filtering
        row.innerHTML = `
            <td>${patient.customer_email}</td>
            <td>${formattedDate}</td>
            <td >${patient.appointment_time}</td>
            <td>${patient.status}</td>
            <td>
                ${patient.status !== 'Complete' ? `
                    <button class="btn btn-success editBtn" data-row-data-id="${patient.id}">Complete</button>
                    <button class="btn btn-danger deleteBtn" data-row-data-id="${patient.id}">Cancelled</button>
                ` : ''}
            </td>
        `;
        
        // Attach event listener for completing appointments
        if (patient.status !== 'Complete' && patient.status !== 'Cancelled' ) {
            const completeButton = row.querySelector('.editBtn');
            completeButton.addEventListener('click', () => {
                const appointmentId = completeButton.dataset.rowDataId;
                completeAppointment(appointmentId);
            });
            
            // Attach event listener for cancelling appointments
            const cancelButton = row.querySelector('.deleteBtn');
            cancelButton.addEventListener('click', () => {
                const appointmentId = cancelButton.dataset.rowDataId;
                cancelAppointment(appointmentId);
            });
        }
        // else{
        //     showErrorMessage("Already Complete or Cancelled")
        // }
    });
}

// Function to fetch all patients
function getAllPatients() {
    // Get the doctor's email
    const doctoremail = window.sessionStorage.userInfo// Replace with actual doctor's email or retrieve dynamically
  
    // Make a GET request to the backend API endpoint
    fetch(`/doctor/getAllCustomer/${doctoremail}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Handle the received data (list of patients)
        console.log("All patients:", data);
renderPatientsData(data)
        // Here you can update your UI to display the list of patients
      })
      .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
        // Handle errors or display an error message to the user
      });
  }

// Function to add event listeners to the buttons
// function addEventListenersToButtons() {
//     const completeButtons = document.querySelectorAll('.editBtn');
//     const cancelButtons = document.querySelectorAll('.deleteBtn');

//     // Add event listener for completing appointments
//     completeButtons.forEach(button => {
//         button.addEventListener('click', () => {
//             const appointmentId = button.dataset.rowDataId;
//             completeAppointment(appointmentId);
//         });
//     });

//     // Add event listener for cancelling appointments
//     cancelButtons.forEach(button => {
//         button.addEventListener('click', () => {
//             const appointmentId = button.dataset.rowDataId;
//             cancelAppointment(appointmentId);
//         });
//     });
// }

// Function to complete an appointment
function completeAppointment(appointmentId) {
    console.log(appointmentId)
    fetch(`/doctor/appointment/${appointmentId}/complete`, {
        method: 'PUT'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Appointment completed successfully, you can update UI if needed
        console.log('Appointment completed:', data);
        // Refresh the list of patients
        getAllPatients();
    })
    .catch(error => {
        console.error('There was a problem with completing the appointment:', error);
        // Handle errors or display an error message to the user
    });
}

// setInterval(getAllPatients,2000)
// Function to cancel an appointment
function cancelAppointment(appointmentId) {
    fetch(`/doctor/appointment/${appointmentId}/cancel`, {
        method: 'PUT'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Appointment cancelled successfully, you can update UI if needed
        console.log('Appointment cancelled:', data);
        // Refresh the list of patients
        getAllPatients();
    })
    .catch(error => {
        console.error('There was a problem with cancelling the appointment:', error);
        // Handle errors or display an error message to the user
    });
}

// Call the function to fetch all patients when the page loads or when needed
window.onload = function() {
    getAllPatients();
};
document.addEventListener("DOMContentLoaded", function() {
    var filterSelect = document.getElementById("filter");

    function filterPatientsByDate(filterOption) {
        var patientRows = document.querySelectorAll("#data-table tbody tr");
console.log(patientRows);
        patientRows.forEach(function(row) {
            var appointmentDate = new Date(row.getAttribute("data-appointment-date"));
            var currentDate = new Date();
            var statusCell = row.querySelectorAll("td")[3]; // Get the fourth td element
            var appointmentStatus = statusCell.textContent.trim();
       
            switch (filterOption) {
                case "upcoming":
                    if (appointmentDate > currentDate && appointmentStatus === 'Pending') {
                        row.style.display = "table-row";
                    } else {
                        row.style.display = "none";
                    }
                    break;
                case "nextTwoDays":
                    var twoDaysLater = new Date();
                    twoDaysLater.setDate(currentDate.getDate() + 2);
                    if (appointmentDate <= twoDaysLater && appointmentStatus === 'Pending') {
                        row.style.display = "table-row";
                    } else {
                        row.style.display = "none";
                    }
                    break;
                default:
                    row.style.display = "table-row";
                    break;
            }
        });
    }

    filterSelect.addEventListener("change", function() {
        var selectedOption = this.value;
        filterPatientsByDate(selectedOption);
    });

    filterPatientsByDate(filterSelect.value);
});
function showErrorMessage(message) {
    new Noty({
      text: message,
      type: "error",
      layout: "topRight",
      timeout: 2000,
    }).show();
  }
  
  // Function to show success message
  function showSuccessMessage(message) {
    new Noty({
      text: message,
      type: "success",
      layout: "topRight",
      timeout: 2000,
    }).show();
  }