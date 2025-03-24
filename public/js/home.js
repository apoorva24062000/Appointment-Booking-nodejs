const fetchAllDoctors = async () => {
    try {
        const userLocation = await getUserLocation();
        const response = await axios.get('http://localhost:2000/doctor/getAllDoctor');
        const allDoctors = response.data.alldoctor;
        const doctorsWithinRadius = allDoctors.filter(doctor => {
            const doctorLocation = {
                latitude: doctor.latitude,
                longitude: doctor.longitude
            };
            const distance = calculateDistance(userLocation, doctorLocation);
            console.log(distance)
            return distance <= 10; // Check if the distance is less than or equal to 10 km
        });
        console.log("Doctors within 10 km radius:", doctorsWithinRadius);
        displayDoctorsOnMap(doctorsWithinRadius, userLocation);
        return doctorsWithinRadius;
    } catch (error) {
        console.error('Error fetching doctors:', error);
        return [];
    }
};


const calculateDistance = (location1, location2) => {
    const earthRadiusKm = 6371;

    const lat1 = degreesToRadians(location1.latitude);
    const lon1 = degreesToRadians(location1.longitude);
    const lat2 = degreesToRadians(location2.latitude);
    const lon2 = degreesToRadians(location2.longitude);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c;
};

const degreesToRadians = (degrees) => {
    return degrees * (Math.PI / 180);
};

// Function to display all doctors in the table
const displayAllDoctors = async () => {
    const doctors = await fetchAllDoctors();

    const tableBody = document.querySelector('#data-table tbody');
    tableBody.innerHTML = ''; // Clear existing table rows

    doctors.forEach(doctor => {
        const row = document.createElement('tr');

        // Profile Image column
        const profileImageCell = document.createElement('td');
        profileImageCell.innerHTML = `<img src="${doctor.image_url}" alt="Profile Image" width="50" height="50">`;
        row.appendChild(profileImageCell);

        // Doctor Name column
        const doctorNameCell = document.createElement('td');
        doctorNameCell.textContent = doctor.name;
        row.appendChild(doctorNameCell);

        // Expertise column
        const expertiseCell = document.createElement('td');
        expertiseCell.textContent = doctor.expertise;
        row.appendChild(expertiseCell);

        // Actions column
        const actionsCell = document.createElement('td');
        const viewDetailsButton = document.createElement('button');
        viewDetailsButton.textContent = "View Details";
        viewDetailsButton.classList.add('btn', 'btn-primary', 'btn-sm');
        viewDetailsButton.setAttribute('data-toggle', 'modal');
        viewDetailsButton.setAttribute('data-target', '#doctorModal');
        viewDetailsButton.addEventListener('click', () => {
            displayDoctorDetailsModal(doctor);
        });
        actionsCell.appendChild(viewDetailsButton);
        row.appendChild(actionsCell);

        tableBody.appendChild(row);
    });
};

// Function to display doctor details in a modal
const displayDoctorDetailsModal = (doctor) => {
    // Populate modal with doctor details
    const modalTitle = document.querySelector('.modal-title');
    const modalName = document.querySelector('.modal-name');
    const modalExpertise = document.querySelector('.modal-expertise');
    const modalExperience = document.querySelector('.modal-experience');
    const modalAddress = document.querySelector('.modal-address');
    const modalContactInformation = document.querySelector('.modal-contact-information');
    const modalImage = document.querySelector('.modal-image');
    const modalTimings = document.querySelector('.modal-timings');

    modalTitle.textContent = doctor.name;
    modalName.textContent = `Name: ${doctor.name}`;
    modalExpertise.textContent = `Expertise: ${doctor.expertise}`;
    modalExperience.textContent = `Experience: ${doctor.experience}`;
    modalAddress.textContent = `Address: ${doctor.address}`;
    modalContactInformation.textContent = `Contact Information: ${doctor.mobile_no}`;
    modalTimings.textContent = `Timings: ${doctor.from_timings} - ${doctor.to_timings}`;

    modalImage.src = doctor.image_url;
    // document.getElementById("bookAppointmentBtn").addEventListener("click", function() {
    //     // Redirect to the next page (appointment.html)
    //     window.location.href = "./appointment";
    // });
//    let dEmail=doctor.doctor_email
bookAppointmentBtn.addEventListener('click', async () => {
    // Store doctor's email ID in session storage
    
    const doctorEmail = doctor.email;
    const customerEmail = window.sessionStorage.userInfo;

    try {
        const response = await axios.post('http://localhost:2000/doctor/appointments/alreadybooked', {
            doctorEmail,
            customerEmail
        });

        // console.log('Response:', response.data);
        if ( response.data.length===0 || (response.data.length!==0 && response.data[0].status !== 'Pending')) {
            sessionStorage.setItem('doctorEmail', doctor.email);
            window.location.href = "./appointment";
        } else {
            alert('Already Booked With Doctor');
            window.location.href = "./dashboard";

        }
    } catch (error) {
        console.error('Error fetching appointments:', error);
        alert('An error occurred. Please try again later.');
    }
});
}
// Execute displayAllDoctors function when the document content is fully loaded
document.addEventListener('DOMContentLoaded', displayAllDoctors);

// Close the modal when the close button is clicked
document.querySelector('.close').addEventListener('click', () => {
    $('#doctorModal').modal('hide');
});

// Close the modal when clicking outside of it
window.addEventListener('click', (event) => {
    const modal = document.getElementById('doctorModal');
    if (event.target === modal) {
        $('#doctorModal').modal('hide');
    }
});

// Function to fetch and display appointments
const fetchAppointments = async () => {
    try {
        console.log('hi')
      const response = await axios.get(`http://localhost:2000/doctor/appointments/${window.sessionStorage.userInfo}`); // Assuming customerEmail is available
      const appointments = response.data;
  console.log(appointments)
      const appointmentsTableBody = document.getElementById('appointmentsTableBody');
      appointmentsTableBody.innerHTML = ''; // Clear previous content
      
      appointments.forEach(appointment => {
        const formattedDate = new Date(appointment.appointment_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    
        const row = `
          <tr>
            <td>${appointment.id}</td>
            <td>${appointment.doctor_email}</td>
            <td>${appointment.customer_email}</td>
            <td>${formattedDate}</td>
            <td>${appointment.appointment_time}</td>
            <td>${appointment.status}</td>
          </tr>
        `;
        appointmentsTableBody.innerHTML += row;
      });
    } catch (error) {
      console.error('Error fetching appointments:', error);
      // Handle error
    }
  };
  
  setInterval(fetchAppointments,2000)
  // Event listener for modal shown event
  $('#appointmentsModal').on('shown.bs.modal', function (e) {
    fetchAppointments();
  });
  
  const onLoad = async () => {
    await fetchAppointments();
  };
  
  // Event listener for content loaded event
  window.addEventListener('load', onLoad);

/////////////////////////////////////////////////////////////////////////////////////////
//Location 

// Function to get the user's current location
const getUserLocation = () => {
    return new Promise((resolve, reject) => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                error => {
                    reject(error);
                }
            );
        } else {
            reject(new Error('Geolocation is not supported by this browser.'));
        }
    });
};

// Function to display doctors and user location on the map
const displayDoctorsOnMap = (doctors, userLocation) => {
    // console.log(userLocation)
    const map = L.map('map').setView([userLocation.latitude, userLocation.longitude], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add a marker for the user's current location
    L.marker([userLocation.latitude, userLocation.longitude], { icon: blueIcon }).addTo(map)
        .bindPopup('Your current location')
        .openPopup();

    // Add markers for doctors within 10 km radius
    doctors.forEach(doctor => {
        const doctorLocation = [doctor.latitude, doctor.longitude];
        const doctorPopupContent = `<strong>${doctor.name}</strong><br>Expertise: ${doctor.expertise}<br><img src="${doctor.image_url}" alt="Profile Image" width="50" height="50">`;
    
        const doctorMarker = L.marker(doctorLocation, { icon: redIcon }).addTo(map)
            .bindPopup(doctorPopupContent);
    
        // Add mouseover event to display expertise and profile picture
        doctorMarker.on('mouseover', function (e) {
            this.openPopup();
        });
    
        // Close popup on mouseout
        doctorMarker.on('mouseout', function (e) {
            this.closePopup();
        });
    });
};

// Define custom marker icons
const blueIcon = L.icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

const redIcon = L.icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});



// Execute displayMapWithUserLocation function when the document content is fully loaded
document.addEventListener('DOMContentLoaded', displayMapWithUserLocation);

