document
  .getElementById("register-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
   
    const name = document.getElementById("name").value;
     const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmpassword = document.getElementById("confirm-password").value;
  

//     // Validation checks
//     if ( !email || !name || !password || !confirmpassword ) {
//       showErrorMessage("All fields are required.");
//       return;
//     }


//     const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]*@(gmail\.com|yahoo\.com|rediff\.com|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;


//     if (!emailRegex.test(email)) {
//         showErrorMessage("Please enter a valid email address");
//         return;
//     }




// if (!/^[a-zA-Z]+$/.test(name.trim())) {
//   showErrorMessage("Name should only contain alphabets");
//   return;
// }


  


//     if (password.length < 8) {
//       showErrorMessage("Password should be at least 8 characters long and contain at least one special character.");

//       return;
//     }

//     const specialCharacterRegex = /^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])(?!.*\s).{8,}$/;

//     if (!specialCharacterRegex.test(password)) {
//       showErrorMessage("Password should be at least 8 characters long, contain at least one special character, and should not contain spaces.");
//       return;
//     }
    

//     if (password !== confirmpassword) {
//         showErrorMessage("Passwords do not match.");
//         return;
//       }


  


    try {
      const duplicateCheckResponse = await axios.get(
        `http://localhost:2000/doctor/checkEmail/${email}`
      );

      // Check if duplicateCheckResponse.data exists
      if (duplicateCheckResponse && duplicateCheckResponse.data) {
        const { exists, user } = duplicateCheckResponse.data;

        if (exists) {
          showErrorMessage(
            "Email already exists. Please choose another email."
          );
          return;
        }
      }



      // Continue with registration if email is not duplicate
      const userinfo = {
      
     name,
     email,
        password,
    
      };

      axios
        .post("http://localhost:2000/doctor/registeruser", userinfo)
        .then((response) => {
          console.log("User registered Successfully ", response.data);
          showSuccessMessage("Registered Successfully");
      
        
          document.getElementById("name").value = "";
          document.getElementById("email").value= "";
        document.getElementById("password").value = "";
        document.getElementById("confirm-password").value = "";


     
        })
        .catch((error) => {
          console.log("Error in registering user", error.response.data);
        });
    } catch (error) {
      console.error("Error checking duplicate email:", error);
      // Handle the error (e.g., show an error message to the user)
    }
  });



  // Replace the existing showErrorMessage function with Swal alerts
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

