// ======================================================
// SMART COLLEGE EVENT MANAGEMENT SYSTEM
// Main JavaScript File
// ======================================================

console.log("Smart College Event System Loaded");
let editingEventId = null;

// ======================================================
// BACKEND API URL
// ======================================================

const API_URL = "http://localhost:5000";

let allEvents = [];

// ======================================================
// GENERAL BUTTON CLICK
// ======================================================

const buttons = document.querySelectorAll(".btn-primary");

buttons.forEach(function (button) {

    button.addEventListener("click", function () {

        console.log("Button Clicked");

    });

});


// ======================================================
// USER REGISTRATION
// ======================================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        console.log("Registration form submitted");


        // Get form values

        const nameElement = document.getElementById("name");
        const emailElement = document.getElementById("email");
        const passwordElement = document.getElementById("password");
        const confirmPasswordElement =
            document.getElementById("confirmPassword");

        const studentIdElement =
            document.getElementById("studentId");

        const courseElement =
            document.getElementById("course");

        const message =
            document.getElementById("registerMessage");


        // Check required elements

        if (
            !nameElement ||
            !emailElement ||
            !passwordElement ||
            !confirmPasswordElement
        ) {

            console.error("Registration form fields are missing.");

            if (message) {

                message.innerHTML = `
                    <div class="alert alert-danger">
                        Registration form is not configured correctly.
                    </div>
                `;

            }

            return;
        }


        // Get values

        const name = nameElement.value.trim();

        const email = emailElement.value.trim();

        const password = passwordElement.value;

        const confirmPassword =
            confirmPasswordElement.value;


        // Optional fields

        const studentId = studentIdElement
            ? studentIdElement.value.trim()
            : "";

        const course = courseElement
            ? courseElement.value.trim()
            : "";


        // ==================================================
        // VALIDATION
        // ==================================================

        if (name === "") {

            alert("Please enter your name.");

            return;
        }


        if (email === "") {

            alert("Please enter your email.");

            return;
        }


        if (password.length < 6) {

            alert(
                "Password must contain at least 6 characters."
            );

            return;
        }


        if (password !== confirmPassword) {

            alert("Passwords do not match.");

            return;
        }


        // ==================================================
        // SEND DATA TO BACKEND
        // ==================================================

        try {

            if (message) {

                message.innerHTML = `
                    <div class="alert alert-info">
                        Creating your account...
                    </div>
                `;

            }


            const response = await fetch(
                `${API_URL}/api/auth/register`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        name: name,

                        email: email,

                        password: password,

                        studentId: studentId,

                        course: course

                    })

                }
            );


            const data = await response.json();


            console.log("Registration response:", data);


            // ==================================================
            // SUCCESS
            // ==================================================

            if (data.success) {

                if (message) {

                    message.innerHTML = `
                        <div class="alert alert-success">
                            Registration successful!
                            Redirecting to login...
                        </div>
                    `;

                }


                registerForm.reset();


                // Redirect to login page

                setTimeout(function () {

                    window.location.href = "login.html";

                }, 1500);


            }


            // ==================================================
            // ERROR FROM SERVER
            // ==================================================

            else {

                if (message) {

                    message.innerHTML = `
                        <div class="alert alert-danger">
                            ${data.message || "Registration failed."}
                        </div>
                    `;

                } else {

                    alert(
                        data.message || "Registration failed."
                    );

                }

            }


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );


            if (message) {

                message.innerHTML = `
                    <div class="alert alert-danger">
                        Cannot connect to server.
                        Please make sure your backend is running.
                    </div>
                `;

            } else {

                alert(
                    "Cannot connect to server. Make sure the backend is running."
                );

            }

        }

    });

}


// ======================================================
// USER LOGIN
// ======================================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        console.log("Login form submitted");


        // Get fields

        const emailElement =
            document.getElementById("loginEmail");

        const passwordElement =
            document.getElementById("loginPassword");

        const message =
            document.getElementById("loginMessage");


        // Check fields

        if (!emailElement || !passwordElement) {

            console.error(
                "Login form fields are missing."
            );

            if (message) {

                message.innerHTML = `
                    <div class="alert alert-danger">
                        Login form is not configured correctly.
                    </div>
                `;

            }

            return;
        }


        const email =
            emailElement.value.trim();

        const password =
            passwordElement.value;


        // ==================================================
        // VALIDATION
        // ==================================================

        if (email === "") {

            alert("Please enter your email.");

            return;
        }


        if (password === "") {

            alert("Please enter your password.");

            return;
        }


        if (password.length < 6) {

            alert(
                "Password must contain at least 6 characters."
            );

            return;
        }


        // ==================================================
        // SEND LOGIN REQUEST
        // ==================================================

        try {

            if (message) {

                message.innerHTML = `
                    <div class="alert alert-info">
                        Logging in...
                    </div>
                `;

            }


            const response = await fetch(
                `${API_URL}/api/auth/login`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        email: email,

                        password: password

                    })

                }
            );


            const data = await response.json();


            console.log("Login response:", data);


            // ==================================================
            // LOGIN SUCCESS
            // ==================================================

            if (data.success) {

                // Save JWT token

                localStorage.setItem(
                    "token",
                    data.token
                );


                // Save user information

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );


                if (message) {

                    message.innerHTML = `
                        <div class="alert alert-success">
                            Login successful!
                        </div>
                    `;

                }


                // Redirect according to role

                setTimeout(function () {

                    if (data.user.role === "admin") {

                        window.location.href =
                            "admin.html";

                    } else {

                        window.location.href =
                            "dashboard.html";

                    }

                }, 1000);

            }


            // ==================================================
            // LOGIN FAILED
            // ==================================================

            else {

                if (message) {

                    message.innerHTML = `
                        <div class="alert alert-danger">
                            ${data.message || "Invalid login details."}
                        </div>
                    `;

                } else {

                    alert(
                        data.message ||
                        "Invalid login details."
                    );

                }

            }


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            if (message) {

                message.innerHTML = `
                    <div class="alert alert-danger">
                        Cannot connect to server.
                        Please make sure your backend is running.
                    </div>
                `;

            }

        }

    });

}


// ======================================================
// EVENT SEARCH
// ======================================================

const searchEvent =
    document.getElementById("searchEvent");

const categoryFilter =
    document.getElementById("categoryFilter");

const eventCards =
    document.querySelectorAll(".event-card");


function filterEvents() {

    // If these elements don't exist on current page,
    // simply stop.

    if (!searchEvent || !categoryFilter) {

        return;

    }


    const searchText =
        searchEvent.value.toLowerCase();

    const selectedCategory =
        categoryFilter.value;


    eventCards.forEach(function (card) {

        const eventName =
            card.getAttribute("data-name");


        const eventCategory =
            card.getAttribute("data-category");


        if (!eventName || !eventCategory) {

            return;

        }


        const matchesSearch =
            eventName
                .toLowerCase()
                .includes(searchText);


        const matchesCategory =
            selectedCategory === "all" ||
            eventCategory === selectedCategory;


        if (
            matchesSearch &&
            matchesCategory
        ) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });

}


// Search

if (searchEvent) {

    searchEvent.addEventListener(
        "input",
        filterEvents
    );

}


// Category

if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        filterEvents
    );

}


// ======================================================
// REGISTER FOR EVENT BUTTON
// ======================================================

const registerButtons =
    document.querySelectorAll(".register-event");


registerButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        alert(
            "Please login or register before registering for an event."
        );

    });

});


// ======================================================
// CONTACT FORM
// ======================================================

const contactForm =
    document.getElementById("contactForm");


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document.getElementById("contactName")
                    ?.value
                    .trim();


            const email =
                document.getElementById("contactEmail")
                    ?.value
                    .trim();


            const subject =
                document.getElementById("contactSubject")
                    ?.value
                    .trim();


            const message =
                document.getElementById("contactMessage")
                    ?.value
                    .trim();


            if (
                !name ||
                !email ||
                !subject ||
                !message
            ) {

                alert("Please fill all fields.");

                return;

            }


            alert(
                "Thank you " +
                name +
                "! Your message has been submitted."
            );


            contactForm.reset();

        }
    );

}


// ======================================================
// STUDENT LOGOUT
// ======================================================

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (confirmLogout) {

                // Remove login information

                localStorage.removeItem("token");

                localStorage.removeItem("user");


                alert(
                    "You have been logged out."
                );


                window.location.href =
                    "login.html";

            }

        }
    );

}


// ======================================================
// ADMIN - ADD EVENT TO MONGODB
// ======================================================

const addEventForm =
    document.getElementById("addEventForm");


if (addEventForm) {

    addEventForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const eventName =
                document.getElementById("eventName").value.trim();

            const category =
                document.getElementById("eventCategory").value;

            const date =
                document.getElementById("eventDate").value;

            const time =
                document.getElementById("eventTime").value;

            const seats =
                document.getElementById("eventSeats").value;

            const venue =
                document.getElementById("eventVenue").value.trim();

            const organizerElement =
                document.getElementById("eventOrganizer");

            const descriptionElement =
                document.getElementById("eventDescription");

            const organizer =
                organizerElement
                    ? organizerElement.value.trim()
                    : "";

            const description =
                descriptionElement
                    ? descriptionElement.value.trim()
                    : "";


            // =====================================
            // CHECK IF WE ARE EDITING AN EVENT
            // =====================================

            const editingEventId =
                localStorage.getItem("editingEventId");

            console.log(
            "Editing ID:",
            editingEventId
            );
            // =====================================
            // CHOOSE POST OR PUT
            // =====================================

            let url =
                `${API_URL}/api/events`;

            let method =
                "POST";


            if (editingEventId) {

                url =
                    `${API_URL}/api/events/${editingEventId}`;

                method =
                    "PUT";

            }


            try {

                const response =
                    await fetch(
                        url,
                        {

                            method: method,

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                name: eventName,

                                category: category,

                                date: date,

                                time: time,

                                capacity: Number(seats),

                                venue: venue,

                                organizer: organizer,

                                description: description

                            })

                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "Event response:",
                    data
                );


                if (data.success) {

                    if (editingEventId) {

                        alert(
                            "Event updated successfully!"
                        );

                    } else {

                        alert(
                            "Event added successfully!"
                        );

                    }


                    // Remove edit mode
                    localStorage.removeItem(
                        "editingEventId"
                    );


                    // Clear form
                    addEventForm.reset();
                    


                    // Reload events
                    loadAdminEvents();


                } else {

                    alert(
                        data.message ||
                        "Failed to save event."
                    );

                }


            } catch (error) {

                console.error(
                    "Save event error:",
                    error
                );


                alert(
                    "Error: " + error.message
                );

            }

        }
    );

}


// =====================================
// DELETE EVENT
// =====================================

async function deleteEvent(eventId) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this event?"
        );

    if (!confirmDelete) return;

    try {

        const response =
            await fetch(
                `${API_URL}/api/events/${eventId}`,
                {
                    method: "DELETE"
                }
            );

        const data =
            await response.json();

        alert(data.message);

        loadAdminEvents();

    } catch (error) {

        console.error(error);

        alert("Failed to delete event");

    }

}


// =====================================
// EDIT EVENT
// =====================================

window.editEvent = async function(eventId) {

    try {

        const response =
            await fetch(
                `${API_URL}/api/events/${eventId}`
            );

        const data =
            await response.json();

        const event =
            data.event;

        document.getElementById("eventName").value =
            event.name;

        document.getElementById("eventCategory").value =
            event.category;

        document.getElementById("eventDate").value =
            event.date;

        document.getElementById("eventTime").value =
            event.time;

        document.getElementById("eventSeats").value =
            event.capacity;

        document.getElementById("eventVenue").value =
            event.venue;

        document.getElementById("eventOrganizer").value =
            event.organizer;

        document.getElementById("eventDescription").value =
            event.description;

        localStorage.setItem(
            "editingEventId",
            eventId
        );

        console.log(
            "Stored ID:",
            eventId
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {

        console.error(error);

    }

};


// ======================================================
// ADMIN - SEND NOTIFICATION
// ======================================================

const notificationForm =
    document.getElementById("notificationForm");


if (notificationForm) {

   notificationForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const title =
            document.getElementById(
                "notificationTitle"
            ).value.trim();

        const message =
            document.getElementById(
                "notificationMessage"
            ).value.trim();

        const token =
            localStorage.getItem("token");

        try {

            const response =
                await fetch(
                    `${API_URL}/api/notifications`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({
                            title,
                            message
                        })
                    }
                );

            const data =
                await response.json();

            if (data.success) {

                alert(
                    "Notification sent successfully!"
                );

                notificationForm.reset();

                loadAdminNotifications();

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.error(error);

            alert(
                "Failed to send notification."
            );

        }

    }
);

}


// ======================================================
// ADMIN LOGOUT
// ======================================================

const adminLogoutBtn =
    document.getElementById("adminLogoutBtn");


if (adminLogoutBtn) {

    adminLogoutBtn.addEventListener(
        "click",
        function () {

            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (confirmLogout) {

                // Remove login information

                localStorage.removeItem("token");

                localStorage.removeItem("user");


                window.location.href =
                    "login.html";

            }

        }
    );

}


// ======================================================
// LOAD USER INFORMATION ON DASHBOARD
// ======================================================

const user =
    JSON.parse(
        localStorage.getItem("user")
    );


if (user) {

    console.log(
        "Logged in user:",
        user
    );


    // Welcome text

    const welcomeUser =
        document.getElementById("welcomeUser");


    if (welcomeUser) {

        welcomeUser.textContent =
            "Welcome, " + user.name;

    }


    // Profile name

    const profileName =
        document.getElementById("profileName");


    if (profileName) {

        profileName.textContent =
            user.name;

    }


    // Profile email

    const profileEmail =
        document.getElementById("profileEmail");


    if (profileEmail) {

        profileEmail.textContent =
            user.email;

    }


    // Profile student ID

    const profileStudentId =
        document.getElementById("profileStudentId");


    if (profileStudentId) {

        profileStudentId.textContent =
            user.studentId || "Not available";

    }


    // Profile course

    const profileCourse =
        document.getElementById("profileCourse");


    if (profileCourse) {

        profileCourse.textContent =
            user.course || "Not available";

    }

}


// ======================================================
// END OF SCRIPT
// ======================================================

console.log("Smart College Event System JavaScript Ready");
// ======================================================
// LOAD LOGGED-IN USER FROM BACKEND
// ======================================================

async function loadLoggedInUser() {

    console.log("Checking logged-in user...");

    const token = localStorage.getItem("token");

    console.log("Token:", token);


    // No token
    if (!token) {

        console.log("No login token found.");

        return;
    }


    try {

        console.log("Calling /api/auth/me...");


        const response = await fetch(
            `${API_URL}/api/auth/me`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        console.log(
            "GET /api/auth/me status:",
            response.status
        );


        const data = await response.json();


        console.log(
            "Current user:",
            data
        );


        if (!data.success) {

            console.log(
                "Authentication failed."
            );

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href = "login.html";

            return;
        }


        const currentUser = data.user;


        // Save latest user information

        localStorage.setItem(
            "user",
            JSON.stringify(currentUser)
        );


        // ==================================================
        // UPDATE DASHBOARD
        // ==================================================

        const welcomeUser =
            document.getElementById("welcomeUser");

        if (welcomeUser) {

            welcomeUser.textContent =
                `Welcome, ${currentUser.name}`;
        }


        const profileName =
            document.getElementById("profileName");

        if (profileName) {

            profileName.textContent =
                currentUser.name;
        }


        const profileEmail =
            document.getElementById("profileEmail");

        if (profileEmail) {

            profileEmail.textContent =
                currentUser.email;
        }


        const profileStudentId =
            document.getElementById("profileStudentId");

        if (profileStudentId) {

            profileStudentId.textContent =
                currentUser.studentId ||
                "Not available";
        }


        const profileCourse =
            document.getElementById("profileCourse");

        if (profileCourse) {

            profileCourse.textContent =
                currentUser.course ||
                "Not available";
                const editName =
    document.getElementById("editName");

const editStudentId =
    document.getElementById("editStudentId");

const editCourse =
    document.getElementById("editCourse");

if (editName)
    editName.value = currentUser.name;

if (editStudentId)
    editStudentId.value =
        currentUser.studentId || "";

if (editCourse)
    editCourse.value =
        currentUser.course || "";
        }


        console.log(
            "Dashboard updated successfully."
        );

    }

    catch (error) {

        console.error(
            "Error loading user:",
            error
        );
    }
}


// Run function

loadLoggedInUser();
// ======================================================
// LOAD EVENTS FOR ADMIN
// ======================================================

async function loadAdminEvents() {

    const eventTable =
        document.getElementById("adminEventsTable");


    // If we are not on admin.html, stop
    if (!eventTable) {

        return;

    }


    try {

        const response =
            await fetch(`${API_URL}/api/events`);


        const data =
            await response.json();


        console.log("Events received:", data);


        if (!data.success) {

            console.error(
                data.message
            );

            return;

        }


        // Clear existing table rows
        eventTable.innerHTML = "";


        // No events
        if (data.events.length === 0) {

            eventTable.innerHTML = `
                <tr>
                    <td colspan="5"
                        class="text-center">

                        No events found.

                    </td>
                </tr>
            `;

            return;

        }


        // Add every event to table
        data.events.forEach(function(event) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${event.name}
                </td>

                <td>
                    ${event.category}
                </td>

                <td>
                    ${event.date}
                </td>

                <td>
                    ${event.capacity}
                </td>

                <td>

                    <button
                        class="btn btn-warning btn-sm me-2"
                        onclick="editEvent('${event._id}')">

                        Edit

                    </button>
                    <button
                        class="btn btn-danger btn-sm"
                        onclick="deleteEvent('${event._id}')">

                        Delete

                    </button>

                </td>

            `;


            eventTable.appendChild(row);

        });


    } catch (error) {

        console.error(
            "Load events error:",
            error
        );

    }

}

async function loadAllRegistrations() {

    const table =
        document.getElementById(
            "allRegistrationsTable"
        );

    if (!table) {
        return;
    }

    const token =
        localStorage.getItem("token");

    if (!token) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/api/registrations`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

        const data =
            await response.json();

        console.log(
            "All registrations:",
            data
        );

        table.innerHTML = "";

        if (
            !data.success ||
            data.registrations.length === 0
        ) {

            table.innerHTML = `
                <tr>
                    <td colspan="4"
                        class="text-center">
                        No registrations found.
                    </td>
                </tr>
            `;

            return;
        }

        data.registrations.forEach(
            registration => {

                const row =
                    document.createElement("tr");

                row.innerHTML = `
                    <td>
                        ${registration.student?.name || "-"}
                    </td>

                    <td>
                        ${registration.student?.email || "-"}
                    </td>

                    <td>
                        ${registration.event?.name || "-"}
                    </td>

                    <td>
                        ${registration.status}
                    </td>
                `;

                table.appendChild(row);

            }
        );

    } catch (error) {

        console.error(
            "Load registrations error:",
            error
        );

    }

}



async function loadAdminStats() {

    const studentsElement =
        document.getElementById(
            "totalStudents"
        );

    const eventsElement =
        document.getElementById(
            "totalEvents"
        );

    const registrationsElement =
        document.getElementById(
            "totalRegistrations"
        );

    if (
        !studentsElement ||
        !eventsElement ||
        !registrationsElement
    ) {
        return;
    }

    try {

        // Students

        const token =
            localStorage.getItem("token");

       
        const studentData =
            await studentResponse.json();

        if (studentData.success) {

            studentsElement.textContent =
                studentData.totalStudents;

        }


        // Events

        const eventResponse =
            await fetch(
                `${API_URL}/api/events`
            );

        const eventData =
            await eventResponse.json();

        if (eventData.success) {

            eventsElement.textContent =
                eventData.count;

        }


        // Registrations

        const registrationResponse =
            await fetch(
                `${API_URL}/api/registrations/count/all`
            );

        const registrationData =
            await registrationResponse.json();

        if (registrationData.success) {

            registrationsElement.textContent =
                registrationData.totalRegistrations;

        }

    } catch (error) {

        console.error(
            "Admin stats error:",
            error
        );

    }

}

// ======================================
// LOAD EVENTS FOR STUDENT DASHBOARD
// ======================================

async function loadStudentEvents() {

    const container =
        document.getElementById(
            "studentEvents"
        );

    if (!container) return;

    try {

        const response =
            await fetch(
                `${API_URL}/api/events`
            );

        const data =
            await response.json();

        console.log(data);

        container.innerHTML = "";

        data.events.forEach(event => {

            container.innerHTML += `

                <div class="col-md-6">

                    <div class="card shadow h-100">

                        <div class="card-body">

                            <span class="badge bg-primary mb-2">

                                ${event.category}

                            </span>

                            <h4 class="fw-bold">

                                ${event.name}

                            </h4>

                            <p>

                                <strong>Date:</strong>

                                ${event.date}

                            </p>

                            <p>

                                <strong>Venue:</strong>

                                ${event.venue}

                            </p>

                            <p>
                            <strong>Remaining Seats:</strong>
                             ${event.capacity - event.registeredCount}
                            </p>

                            <p>
                                <strong>Registered:</strong>
                                ${event.registeredCount}
                            </p>

                            <p>
                                <strong>Available Seats:</strong>
                                 ${event.availableSeats}
                            </p>
                            ${
    event.availableSeats > 0

    ?

    `<button
        class="btn btn-primary"
        onclick="registerForEvent('${event._id}')">
        Register
    </button>`

    :

    `<button
        class="btn btn-secondary"
        disabled>
        Event Full
    </button>`
}
                            
                            

                            <button
                                class="btn btn-success"
                                onclick="registerForEvent('${event._id}')">

                                Register

                            </button>

                        </div>

                    </div>

                </div>

            `;

        });

    } catch(error) {

        console.error(error);

    }

}

loadStudentEvents();
// =========================
// REGISTER EVENT
// =========================

async function registerForEvent(eventId) {

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/api/registrations/${eventId}`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        console.log("Registration response:", data);

        if (data.success) {

            alert("Successfully registered for event!");

            loadMyRegistrations();

        } else {

            alert(data.message || "Registration failed.");

        }

    } catch (error) {

        console.error("Registration error:", error);

        alert("Error: " + error.message);

    }
}
// =========================
// LOAD MY REGISTRATIONS
// =========================

async function loadMyRegistrations() {

    const table =
        document.getElementById("myRegistrationsTable");

    if (!table) {
        return;
    }

    const token =
        localStorage.getItem("token");

    if (!token) {

        table.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                    Please login to view your registrations.
                </td>
            </tr>
        `;

        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/api/registrations/my`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        console.log(
            "My registrations:",
            data
        );
        const countElement =
        document.getElementById("myRegistrationsCount");

    if (countElement) {
        countElement.textContent = data.count;
}

        if (!data.success) {

            table.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">
                        ${data.message || "Failed to load registrations."}
                    </td>
                </tr>
            `;

            return;
        }

        table.innerHTML = "";

        if (data.registrations.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">
                        No registrations found.
                    </td>
                </tr>
            `;

            return;
        }

        data.registrations.forEach(function(registration) {

            const event = registration.event;

            if (!event) {
                return;
            }

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>${event.name}</td>

                <td>${event.date}</td>

                <td>${event.venue || "-"}</td>

                <td>
                    ${
                        registration.status === "Registered"
                        ?
                        `<button
                            class="btn btn-danger btn-sm"
                            onclick="cancelRegistration('${registration._id}')">
                            Cancel
                        </button>`
                        :
                        `<span class="text-muted">
                            No Action
                        </span>`
                    }
                </td>

                <td>
                    ${registration.status}
                </td>
            `;

            table.appendChild(row);

        });

    } catch (error) {

        console.error(
            "Load registrations error:",
            error
        );

        table.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-danger">
                    Failed to load registrations.
                </td>
            </tr>
        `;
    }
}


async function cancelRegistration(registrationId) {

    const token =
        localStorage.getItem("token");

    if (!token) {
        alert("Please login first.");
        return;
    }

    const confirmCancel =
        confirm("Are you sure you want to cancel this registration?");

    if (!confirmCancel) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/api/registrations/${registrationId}/cancel`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );

        const data =
            await response.json();

        console.log(
            "Cancel response:",
            data
        );

        if (data.success) {

            alert(
                "Registration cancelled successfully."
            );

            loadMyRegistrations();

        } else {

            alert(
                data.message ||
                "Failed to cancel registration."
            );

        }

    } catch (error) {

        console.error(
            "Cancel registration error:",
            error
        );

        alert("Error: " + error.message);

    }
}


async function loadAdminStats() {

    const totalEventsElement =
        document.getElementById("totalEvents");

    const totalRegistrationsElement =
        document.getElementById("totalRegistrations");

    const totalStudentsElement =
        document.getElementById("totalStudents");

    if (
        !totalEventsElement &&
        !totalRegistrationsElement &&
        !totalStudentsElement
    ) {
        return;
    }

    const token =
        localStorage.getItem("token");

    if (!token) {
        return;
    }

    try {

        // TOTAL EVENTS
        if (totalEventsElement) {

            const eventResponse =
                await fetch(
                    `${API_URL}/api/events/stats/count`
                );

            const eventData =
                await eventResponse.json();

            if (eventData.success) {

                totalEventsElement.textContent =
                    eventData.totalEvents;

            }
        }


        // TOTAL REGISTRATIONS
        if (totalRegistrationsElement) {

            const registrationResponse =
                await fetch(
                    `${API_URL}/api/registrations/stats/count`,
                    {
                        headers: {
                            "Authorization":
                                `Bearer ${token}`
                        }
                    }
                );

            const registrationData =
                await registrationResponse.json();

            if (registrationData.success) {

                totalRegistrationsElement.textContent =
                    registrationData.totalRegistrations;

            }
        }


        // TOTAL STUDENTS
        if (totalStudentsElement) {

            const studentResponse =
                await fetch(
                    `${API_URL}/api/auth/stats/count`,
                    {
                        headers: {
                            "Authorization":
                                `Bearer ${token}`
                        }
                    }
                );

            const studentData =
                await studentResponse.json();

            console.log(
                "Student statistics:",
                studentData
            );

            if (studentData.success) {

                totalStudentsElement.textContent =
                    studentData.totalStudents;

            }
        }

    } catch (error) {

        console.error(
            "Admin statistics error:",
            error
        );

    }
}

loadAdminStats();

loadMyRegistrations();
async function loadAdminRegistrations() {

    const table =
        document.getElementById(
            "adminRegistrationsTable"
        );

    if (!table) {
        return;
    }

    const token =
        localStorage.getItem("token");

    if (!token) {

        table.innerHTML = `
            <tr>
                <td colspan="5"
                    class="text-center">
                    Please login first.
                </td>
            </tr>
        `;

        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/api/registrations`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

        const data =
            await response.json();

        console.log(
            "All registrations:",
            data
        );

        if (!data.success) {

            table.innerHTML = `
                <tr>
                    <td colspan="5"
                        class="text-center">
                        ${data.message}
                    </td>
                </tr>
            `;

            return;
        }

        table.innerHTML = "";

        if (data.registrations.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="5"
                        class="text-center">
                        No registrations found.
                    </td>
                </tr>
            `;

            return;
        }

        data.registrations.forEach(
            function(registration) {

                const student =
                    registration.student;

                const event =
                    registration.event;

                if (!student || !event) {
                    return;
                }

                const row =
                    document.createElement("tr");

                const registrationDate =
                    registration.createdAt
                        ? new Date(
                            registration.createdAt
                          ).toLocaleDateString()
                        : "-";

                row.innerHTML = `
                    <td>
                        ${student.name || "-"}
                        <br>
                        <small>
                            ${student.email || ""}
                        </small>
                    </td>

                    <td>
                        ${event.name || "-"}
                    </td>

                    <td>
                        ${event.date || "-"}
                    </td>

                    <td>
                        ${registrationDate}
                    </td>

                    <td>
                        ${registration.status || "-"}
                    </td>
                `;

                table.appendChild(row);

            }
        );

    } catch (error) {

        console.error(
            "Admin registrations error:",
            error
        );

        table.innerHTML = `
            <tr>
                <td colspan="5"
                    class="text-center text-danger">
                    Failed to load registrations.
                </td>
            </tr>
        `;
    }
}
loadAdminRegistrations();
async function loadDashboardCounts() {

    try {

        // Total Events

        const eventResponse =
            await fetch(
                `${API_URL}/api/events`
            );

        const eventData =
            await eventResponse.json();

        const totalEventsElement =
            document.getElementById(
                "totalEventsCount"
            );

        if (
            totalEventsElement &&
            eventData.success
        ) {

            totalEventsElement.textContent =
                eventData.count;

        }


        // My Registrations

        const token =
            localStorage.getItem("token");

        const registrationResponse =
            await fetch(
                `${API_URL}/api/registrations/my`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

        const registrationData =
            await registrationResponse.json();

        const registrationCountElement =
            document.getElementById(
                "myRegistrationsCount"
            );

        if (
            registrationCountElement &&
            registrationData.success
        ) {

            registrationCountElement.textContent =
                registrationData.count;

        }

    } catch (error) {

        console.error(
            "Dashboard count error:",
            error
        );

    }

}
loadDashboardCounts();
loadAdminStats();
async function editEvent(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/api/events/${id}`
            );

        const data =
            await response.json();

        if (!data.success) {

            alert("Event not found");

            return;

        }

        const event = data.event;

        document.getElementById("eventName").value =
            event.name;

        document.getElementById("eventCategory").value =
            event.category;

        document.getElementById("eventDate").value =
            event.date?.split("T")[0];

        document.getElementById("eventTime").value =
            event.time;

        document.getElementById("eventSeats").value =
            event.capacity;

        document.getElementById("eventVenue").value =
            event.venue;

        document.getElementById("eventOrganizer").value =
            event.organizer;

        document.getElementById("eventDescription").value =
            event.description;

        editingEventId = id;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {

        console.error(error);

    }

}
async function loadDashboardStats() {

    const totalEventsElement =
        document.getElementById(
            "totalEventsCount"
        );

    const registrationsElement =
        document.getElementById(
            "myRegistrationsCount"
        );

    if (
        !totalEventsElement ||
        !registrationsElement
    ) {
        return;
    }

    try {

        // Total Events

        const eventsResponse =
            await fetch(
                `${API_URL}/api/events`
            );

        const eventsData =
            await eventsResponse.json();

        totalEventsElement.textContent =
            eventsData.count || 0;


        // My Registrations

        const token =
            localStorage.getItem("token");

        const registrationsResponse =
            await fetch(
                `${API_URL}/api/registrations/my`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

        const registrationsData =
            await registrationsResponse.json();

        const activeRegistrations =
            registrationsData.registrations
                .filter(
                    registration =>
                        registration.status !==
                        "Cancelled"
                );

        registrationsElement.textContent =
            activeRegistrations.length;

    } catch (error) {

        console.error(
            "Dashboard stats error:",
            error
        );

    }

}

async function loadNotifications() {

    const table =
        document.getElementById(
            "notificationTable"
        );

    if (!table) return;

    const token =
        localStorage.getItem("token");

    try {

        const response =
            await fetch(
                `${API_URL}/api/notifications`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

        const data =
            await response.json();

        table.innerHTML = "";

        if (!data.success) {

            table.innerHTML = `
                <tr>
                    <td colspan="3">
                        ${data.message}
                    </td>
                </tr>
            `;

            return;
        }

        const countElement =
            document.getElementById(
                "notificationCount"
            );

        if (countElement) {

            countElement.textContent =
                data.notifications.length;

        }

        if (
            data.notifications.length === 0
        ) {

            table.innerHTML = `
                <tr>
                    <td colspan="3">
                        No notifications found
                    </td>
                </tr>
            `;

            return;
        }

        data.notifications.forEach(
            notification => {

                table.innerHTML += `

                    <tr>

                        <td>
                            ${notification.title}
                        </td>

                        <td>
                            ${notification.message}
                        </td>

                        <td>
                            ${new Date(
                                notification.createdAt
                            ).toLocaleDateString()}
                        </td>

                    </tr>

                `;

            }
        );

    } catch (error) {

        console.error(error);

    }

}

async function loadAdminNotifications() {

    const table =
        document.getElementById(
            "adminNotificationTable"
        );

    if (!table) return;

    const token =
        localStorage.getItem("token");

    try {

        const response =
            await fetch(
                `${API_URL}/api/notifications`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

        const data =
            await response.json();

        table.innerHTML = "";

        if (
            !data.success ||
            data.notifications.length === 0
        ) {

            table.innerHTML = `
                <tr>
                    <td colspan="4">
                        No notifications found
                    </td>
                </tr>
            `;

            return;
        }

        data.notifications.forEach(
            notification => {

                table.innerHTML += `

                    <tr>

                        <td>
                            ${notification.title}
                        </td>

                        <td>
                            ${notification.message}
                        </td>

                        <td>
                            ${new Date(
                                notification.createdAt
                            ).toLocaleDateString()}
                        </td>

                        <td>

                            <button
                                class="btn btn-danger btn-sm"
                                onclick="deleteNotification('${notification._id}')">

                                Delete

                            </button>

                        </td>

                    </tr>

                `;

            }
        );

    } catch (error) {

        console.error(error);

    }

}

async function deleteNotification(id) {

    const confirmDelete =
        confirm(
            "Delete this notification?"
        );

    if (!confirmDelete) return;

    const token =
        localStorage.getItem("token");

    try {

        const response =
            await fetch(
                `${API_URL}/api/notifications/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

        const data =
            await response.json();

        alert(data.message);

        loadAdminNotifications();

    } catch (error) {

        console.error(error);

    }

}

const profileForm =
    document.getElementById("profileForm");

if (profileForm) {

    profileForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const token =
                localStorage.getItem("token");

            try {

                const response =
                    await fetch(
                        `${API_URL}/api/auth/profile`,
                        {

                            method: "PUT",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`
                            },

                            body: JSON.stringify({

                                name:
                                    document.getElementById(
                                        "editName"
                                    ).value,

                                studentId:
                                    document.getElementById(
                                        "editStudentId"
                                    ).value,

                                course:
                                    document.getElementById(
                                        "editCourse"
                                    ).value

                            })

                        }
                    );

                const data =
                    await response.json();

                if (data.success) {

                    alert(
                        "Profile updated successfully!"
                    );

                    loadLoggedInUser();

                } else {

                    alert(data.message);

                }

            } catch(error) {

                console.error(error);

            }

        }
    );

}

async function completeEvent(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/api/events/${id}/complete`,
                {
                    method: "PUT"
                }
            );

        const data =
            await response.json();

        if (data.success) {

            alert(
                "Event marked as completed"
            );

            loadAdminEvents();

        }

    } catch(error) {

        console.error(error);

    }

}

async function loadAnalytics() {

    const chartCanvas =
        document.getElementById("eventChart");

    if (!chartCanvas) return;

    try {

        const response =
            await fetch(
                `${API_URL}/api/events`
            );

        const data =
            await response.json();

        const labels =
            data.events.map(
                event => event.name
            );

        const registrations =
            data.events.map(
                event => event.registeredCount || 0
            );

        new Chart(
            chartCanvas,
            {
                type: "bar",

                data: {

                    labels,

                    datasets: [

                        {
                            label:
                                "Registrations",

                            data:
                                registrations
                        }

                    ]
                }
            }
        );

    } catch(error) {

        console.error(error);

    }

}

loadAdminEvents();
loadDashboardStats();
loadAllRegistrations();
loadNotifications();
loadAdminNotifications();
loadAnalytics();