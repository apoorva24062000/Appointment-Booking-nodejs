document.getElementById('registrationForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const name = document.getElementById('name').value;
  const password = document.getElementById('password').value;
  const expertise = document.getElementById('expertise').value;
  const experience = document.getElementById('experience').value;
  const address = document.getElementById('address').value;
  const latitude = document.getElementById('latitude').value;
  const longitude = document.getElementById('longitude').value;
  const from_timings = document.getElementById('from_timings').value;
  const to_timings = document.getElementById('to_timings').value;
  const mobile_no = document.getElementById('mobile_no').value;
  const image_url = window.sessionStorage.image;


  // Validation checks
  if (!email || !name || !password || !expertise || !experience || !address || !latitude || !longitude || !from_timings || !to_timings || !mobile_no) {
      showErrorMessage('All fields are required');
      return;
  }

  // Additional validation checks
  if (mobile_no.length !== 10 || isNaN(mobile_no)) {
      showErrorMessage('Mobile number must be a 10-digit numeric value');
      return;
  }

  if (latitude < 0 || longitude < 0) {
      showErrorMessage('Latitude and Longitude must be positive values');
      return;
  }

  axios.get(
      `http://localhost:2000/doctor/acheckEmail/${email}`
  ).then(duplicateCheckResponse => {
      const { exists, user } = duplicateCheckResponse.data;

      if (exists) {
          showErrorMessage("Email already exists. Please choose another email.");
          return;
      } else {
          const userinfo = {
              email,
              name,
              password,
              expertise,
              experience,
              address,
              latitude,
              longitude,
              from_timings,
              to_timings,
              mobile_no,
              image_url
          }

          axios.post('http://localhost:2000/doctor/admin/registerdoctor', userinfo)
              .then(response => {
                  console.log('Doctor Registered Successfully', response.data);
                  showSuccessMessage('Doctor Registered Successfully')
                  document.getElementById('email').value = "";

              })
              .catch(error => {
                  console.log("Error in registering Doctor", error.response.message);
                  showErrorMessage("Error in registering Doctor")
                  console.log(error.message)
              })
      }
  }).catch(error => {
      console.error("Error in checking email duplication", error);
      showErrorMessage("Error in checking email duplication");
  });
});

// Rest of your code remains the same...



document
.getElementById("logoutLink")
.addEventListener("click", function (event) {
  event.preventDefault();

  // Show a SweetAlert confirmation dialog
  Swal.fire({
    title: "Logout",
    text: "Are you sure you want to logout?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, logout!",
  }).then((result) => {
    if (result.isConfirmed) {
      // Clear user-related information from sessionStorage
      window.sessionStorage.removeItem("token");
 

      // Redirect to the logout page or perform any other necessary actions
      window.location.href = "/";
    }
  });
});

function showSuccessMessage(message) {
  new Noty({
    text: message,
    type: "success",
    layout: "topRight",
    timeout: 2000,
  }).show();
}

function showErrorMessage(message) {
  new Noty({
    text: message,
    type: "error",
    layout: "topRight",
    timeout: 2000,
  }).show();
} 