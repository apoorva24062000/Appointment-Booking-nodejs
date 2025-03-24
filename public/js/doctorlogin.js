document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    // // Validation checks
    // if (!email || !password) {
    //   showErrorMessage("Email and password are required.");
    //   return;
    // }

    // // // Check if the email is in the format of gmail.com
    // // if (!/^[a-zA-Z0-9._-]+@gmail\.com$/.test(email)) {
    // //     showErrorMessage("Please enter a valid Gmail address.");
    // //     return;
    // // }
    // if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    //   showErrorMessage("Please enter a valid email address.");
    //   return;
    // }

    const logininfo = {
      email,
      password,
    };

    axios
      .post("http://localhost:2000/doctor/logindoctor", logininfo)
      .then((response) => {
        console.log("User Logged In Successfully ", response.data);

        window.sessionStorage.token = response.data.token;
        window.sessionStorage.userInfo = response.data.userInfo;
        window.sessionStorage.username = response.data.userName
        window.location.href = "./Doctordashboard";

        showSuccessMessage("Login Successful");

        // document.getElementById("login-email").value= "";
        // document.getElementById("login-password").value = "";

      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            showErrorMessage("Invalid password. Please try again.");
          } else if (error.response.status === 404) {
            console.log(error.message)
            showErrorMessage("Email not registered. Please register first.");
          } else {
            console.log("Error in Logging a user", error.response.data);
          }
        } else {
          console.log("Error in Logging a user", error.message);
        }
      });
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