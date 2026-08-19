// const API_URL = "http://localhost:5000/api";
const API_URL = "https://aig-ljxr.onrender.com/api";
// Data
const module = [
    {
        id: 1,
        icon: "fa-solid fa-play-circle",
        title: "Module 1: Introduction",
        description:
            "Introduction to the Income Generator Blueprint and the journey ahead.",
        status: "Available",
    },

    {
        id: 2,
        icon: "fa-solid fa-chart-line",
        title: "Module 2: Start and Scale Your Business",
        description:
            "Learn how to start your business and develop strategies for sustainable growth.",
        status: "Available",
    },

    {
        id: 3,
        icon: "fa-solid fa-coins",
        title: "Module 3: Wealth Information",
        description:
            "Understand wealth creation, wealth mindset and the information needed to build financial success.",
        status: "Available",
    },

    {
        id: 4,
        icon: "fa-solid fa-bullhorn",
        title: "Module 4: Information Marketing",
        description:
            "Learn how to create, package and market valuable information products.",
        status: "Available",
    },

    {
        id: 5,
        icon: "fa-solid fa-eye",
        title: "Module 5: Visibility",
        description:
            "Learn how to increase your visibility and get your business in front of the right audience.",
        status: "Available",
    },

    {
        id: 6,
        icon: "fa-solid fa-rectangle-ad",
        title: "Module 6: How to Run Meta Adverts",
        description:
            "Learn the fundamentals of running effective Meta advertising campaigns.",
        status: "Available",
    },

    {
        id: 7,
        icon: "fa-solid fa-box-open",
        title: "Module 7: Get a Digital Product to Sell",
        description:
            "Discover how to find, create and prepare digital products for sale.",
        status: "Available",
    },

    {
        id: 8,
        icon: "fa-solid fa-money-bill-trend-up",
        title: "Module 8: How to Make One Millionaire",
        description:
            "Explore strategies, systems and principles for achieving significant financial growth.",
        status: "Available",
    },

    {
        id: 9,
        icon: "fa-solid fa-flag-checkered",
        title: "Module 9: Summary and End of Training",
        description:
            "Review the key lessons and complete the Income Generator Blueprint training.",
        status: "Available",
    },
];

// Utility Functions
function showPage(pageId) {
    // Registration is only available after verified payment
    if (pageId === "register") {
        const paymentVerified =
            sessionStorage.getItem("paymentVerified");

        if (paymentVerified !== "true") {
            alert(
                "Please complete payment before creating an account."
            );

            pageId = "payment";
        }
    }

    // Hide all pages
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    // Show selected page
    const page = document.getElementById(pageId);

    if (page) {
        page.classList.add("active");
    }

    // Update navbar
    updateNavbar(pageId);

    // Scroll to top
    window.scrollTo(0, 0);
}

function updateNavbar(pageId) {
    const navRight = document.getElementById('navRight');
    if (pageId === 'dashboard') {
        navRight.innerHTML = `<span style="color: var(--text-light);">Logged in</span>`;
    } else if (pageId === 'module') {
        navRight.innerHTML = `<span style="color: var(--text-light);">Logged in</span>`;
    } else {
        navRight.innerHTML = `
                    <a href="#" onclick="showPage('landing'); return false;">Home</a>
                    <button class="btn btn-primary" style="padding: 0.7rem 1.5rem;" onclick="showPage('login'); return false;">Login</button>
                `;
    }
}


// User Registration
async function registerUser(event) {
    event.preventDefault();

    // --------------------------------------
    // Make sure payment was verified
    // --------------------------------------

    const paymentVerified =
        sessionStorage.getItem("paymentVerified");

    if (paymentVerified !== "true") {
        alert(
            "Please complete payment before creating an account."
        );

        showPage("payment");
        return;
    }

    // --------------------------------------
    // Get form values
    // --------------------------------------

    const fullName =
        document
            .getElementById("regFullName")
            .value
            .trim();

    const email =
        document
            .getElementById("regEmail")
            .value
            .trim();

    const phone =
        document
            .getElementById("regPhone")
            .value
            .trim();

    const username =
        document
            .getElementById("username")
            .value
            .trim();

    const password =
        document
            .getElementById("regPassword")
            .value;

    const confirmPassword =
        document
            .getElementById("confirmPassword")
            .value;

    const paymentReference =
        sessionStorage.getItem(
            "paymentReference"
        );

    // --------------------------------------
    // Validation
    // --------------------------------------

    if (
        !fullName ||
        !email ||
        !phone ||
        !username ||
        !password ||
        !confirmPassword
    ) {
        alert(
            "Please fill in all required fields."
        );

        return;
    }

    if (!paymentReference) {
        alert(
            "Payment reference is missing. Please complete payment again."
        );

        sessionStorage.clear();
        showPage("payment");

        return;
    }

    if (password !== confirmPassword) {
        alert(
            "Passwords do not match!"
        );

        return;
    }

    if (password.length < 6) {
        alert(
            "Password must be at least 6 characters."
        );

        return;
    }

    // --------------------------------------
    // Submit registration
    // --------------------------------------

    const button =
        document.querySelector(
            "#registerForm button[type='submit']"
        );

    try {
        button.disabled = true;
        button.textContent =
            "Creating Account...";

        const response =
            await fetch(
                `${API_URL}/auth/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json",
                    },

                    body: JSON.stringify({
                        fullName,
                        email,
                        phone,
                        username,
                        password,
                        paymentReference,
                    }),
                }
            );

        // Read text first so an HTML error
        // doesn't cause JSON.parse to crash
        const responseText =
            await response.text();

        let result;

        try {
            result =
                JSON.parse(responseText);
        } catch {
            console.error(
                "Backend returned non-JSON:",
                responseText
            );

            throw new Error(
                `Server returned an invalid response (${response.status}).`
            );
        }

        console.log(
            "Registration response:",
            result
        );

        // --------------------------------------
        // Backend error
        // --------------------------------------

        if (!response.ok || !result.success) {
            throw new Error(
                result.message ||
                "Unable to create account."
            );
        }

        // --------------------------------------
        // Registration successful
        // --------------------------------------

        alert(
            "Account created successfully! Please login."
        );

        // --------------------------------------
        // Clear payment information
        // --------------------------------------

        sessionStorage.removeItem(
            "paymentVerified"
        );

        sessionStorage.removeItem(
            "paymentReference"
        );

        sessionStorage.removeItem(
            "paymentFullName"
        );

        sessionStorage.removeItem(
            "paymentEmail"
        );

        sessionStorage.removeItem(
            "paymentPhone"
        );

        // --------------------------------------
        // Pre-fill login
        // --------------------------------------

        document.getElementById(
            "loginEmail"
        ).value = email;

        // --------------------------------------
        // Go to login
        // --------------------------------------

        showPage("login");

    } catch (error) {
        console.error(
            "Registration error:",
            error
        );

        alert(
            error instanceof Error
                ? error.message
                : "Unable to create account. Please try again."
        );

    } finally {
        button.disabled = false;

        button.textContent =
            "Create Account";
    }
}
// User Login
async function loginUser(event) {
    event.preventDefault();

    const usernameOrEmail =
        document
            .getElementById("loginEmail")
            .value
            .trim();

    const password =
        document.getElementById(
            "loginPassword"
        ).value;

    if (!usernameOrEmail || !password) {
        alert(
            "Please enter your username/email and password."
        );

        return;
    }

    const button =
        document.querySelector(
            ".login-form button[type='submit']"
        );

    try {
        button.disabled = true;
        button.textContent =
            "Logging in...";

        const response = await fetch(
            `${API_URL}/auth/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body: JSON.stringify({
                    usernameOrEmail,
                    password,
                }),
            }
        );

        const result =
            await response.json();

        console.log(
            "Login response:",
            result
        );

        if (
            !response.ok ||
            !result.success
        ) {
            throw new Error(
                result.message ||
                "Invalid username/email or password."
            );
        }

        // --------------------------------------
        // Save JWT
        // --------------------------------------

        const token =
            result.data?.token;

        const user =
            result.data?.user;

        if (!token || !user) {
            throw new Error(
                "Invalid login response from server."
            );
        }

        localStorage.setItem(
            "authToken",
            token
        );

        // Optional basic user cache
        localStorage.setItem(
            "currentUser",
            JSON.stringify(user)
        );

        // --------------------------------------
        // Go to dashboard
        // --------------------------------------

        showPage("dashboard");

        // We will replace this with the
        // dashboard API call next.
        await loadDashboard();

    } catch (error) {
        console.error(
            "Login error:",
            error
        );

        alert(
            error.message ||
            "Unable to login. Please try again."
        );

    } finally {
        button.disabled = false;
        button.textContent =
            "Login to Dashboard";
    }
}

// Load Dashboard
async function loadDashboard() {
    const user = await fetchCurrentUser();

    if (!user) {
        return;
    }

    // Welcome message
    document.getElementById(
        "usernameDash"
    ).textContent = user.fullName || user.username;

    // Render modules
    renderModules();
}

// Render Modules
function renderModules() {
    const container =
        document.getElementById(
            "modulesContainer"
        );

    if (module.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1;">
                <div class="empty-state">
                    <div class="empty-state-icon">
                        📦
                    </div>

                    <h3>
                        No Modules Available
                    </h3>

                    <p>
                        Your learning modules will
                        appear here soon.
                    </p>
                </div>
            </div>
        `;

        return;
    }

    container.innerHTML =
        module.map(module => `
            <div
                class="module-card"
                onclick="openModule(${module.id})"
                style="cursor: pointer;"
            >

                <div class="module-icon">
                    <i class="${module.icon}"></i>
                </div>

                <h3>
                    ${module.title}
                </h3>

                <p>
                    ${module.description}
                </p>

                <div
                    class="
                        module-status
                        ${module.status
                .toLowerCase()
                .replaceAll(" ", "-")}
                    "
                >
                    ${module.status}
                </div>

            </div>
        `).join("");
}

function openModule(moduleId) {

    const token =
        localStorage.getItem("authToken");

    if (!token) {
        alert("Please login to access this module.");
        showPage("login");
        return;
    }

    sessionStorage.setItem(
        "selectedModuleId",
        moduleId.toString()
    );

    // Remember module page
    sessionStorage.setItem(
        "currentPage",
        "module"
    );

    // Show module
    showPage("module");

    // Load module
    loadModule();
}
// Logout
function logout() {

    if (!confirm("Are you sure you want to logout?")) {
        return;
    }

    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");

    sessionStorage.removeItem("currentPage");
    sessionStorage.removeItem("selectedModuleId");

    showPage("landing");
}



async function processPayment(event) {
    event.preventDefault();

    const fullName =
        document.getElementById("fullName").value.trim();

    const email =
        document.getElementById("emailPayment").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    if (!fullName || !email || !phone) {
        alert("Please fill in all required fields.");
        return;
    }

    const button =
        document.querySelector(
            "#paymentForm button[type='submit']"
        );

    try {
        button.disabled = true;
        button.textContent =
            "Initializing Payment...";

        const response = await fetch(
            `${API_URL}/payment/initialize`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    fullName,
                    email,
                    phone,
                }),
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message ||
                "Unable to initialize payment"
            );
        }

        // Store information temporarily
        sessionStorage.setItem(
            "paymentEmail",
            email
        );

        sessionStorage.setItem(
            "paymentFullName",
            fullName
        );

        sessionStorage.setItem(
            "paymentPhone",
            phone
        );

        sessionStorage.setItem(
            "paymentReference",
            result.data.reference
        );

        // Redirect to Paystack
        window.location.href =
            result.data.authorizationUrl;

    } catch (error) {
        console.error(
            "Payment initialization error:",
            error
        );

        alert(
            error.message ||
            "Unable to start payment. Please try again."
        );

        button.disabled = false;
        button.textContent =
            "Complete Payment";
    }
}

async function handlePaymentCallback() {
    const params = new URLSearchParams(window.location.search);

    const reference =
        params.get("reference") ||
        params.get("trxref");

    // Not returning from Paystack
    if (!reference) {
        return false;
    }

    try {
        console.log("Verifying payment:", reference);

        const response = await fetch(
            `${API_URL}/payment/verify/${encodeURIComponent(reference)}`
        );

        const result = await response.json();

        console.log("Payment verification response:", result);

        if (
            !response.ok ||
            !result.success ||
            result.data?.status !== "success"
        ) {
            throw new Error(
                result.message ||
                "Payment could not be verified."
            );
        }

        console.log("Payment verified successfully.");

        // Save payment status
        sessionStorage.setItem(
            "paymentVerified",
            "true"
        );

        // Keep the payment information
        const fullName =
            sessionStorage.getItem("paymentFullName");

        const email =
            sessionStorage.getItem("paymentEmail");

        const phone =
            sessionStorage.getItem("paymentPhone");

        console.log("Payment customer:", {
            fullName,
            email,
            phone
        });

        // IMPORTANT:
        // Do NOT try to access registration inputs here.
        // The registration section may not be active yet.

        // Clean Paystack URL
        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        );

        // Go directly to registration
        console.log("Moving to registration...");

        showPage("register");

        // Now registration page is active.
        // Fill the fields AFTER showPage().
        const regFullName =
            document.getElementById("regFullName");

        const regEmail =
            document.getElementById("regEmail");

        const regPhone =
            document.getElementById("regPhone");

        if (regFullName && fullName) {
            regFullName.value = fullName;
        }

        if (regEmail && email) {
            regEmail.value = email;
        }

        if (regPhone && phone) {
            regPhone.value = phone;
        }

        console.log("Registration page opened successfully.");

        return true;

    } catch (error) {

        console.error(
            "Payment verification error:",
            error
        );

        alert(
            error.message ||
            "Unable to verify payment."
        );

        return false;
    }
}

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        // Handle Paystack callback first
        const paymentHandled =
            await handlePaymentCallback();

        if (paymentHandled) {
            console.log(
                "Payment callback handled. Staying on registration."
            );

            return;
        }

        const token =
            localStorage.getItem("authToken");

        const currentPage =
            sessionStorage.getItem("currentPage");

        // If logged in and a page was previously selected
        if (token && currentPage) {

            showPage(currentPage);

            if (currentPage === "dashboard") {
                await loadDashboard();
            }

            return;
        }

        // If logged in but no page was saved
        if (token) {

            showPage("dashboard");

            await loadDashboard();

            return;
        }

        // No login
        showPage("landing");
    }
);


async function fetchCurrentUser() {
    const token = localStorage.getItem("authToken");

    if (!token) {
        showPage("login");
        return null;
    }

    try {
        const response = await fetch(
            `${API_URL}/dashboard/me`,
            {
                method: "GET",

                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const result = await response.json();

        console.log(
            "Current user response:",
            result
        );

        if (!response.ok || !result.success) {
            // JWT may be expired/invalid
            if (
                response.status === 401 ||
                response.status === 403
            ) {
                localStorage.removeItem("authToken");
                localStorage.removeItem("currentUser");

                alert(
                    "Your session has expired. Please login again."
                );

                showPage("login");

                return null;
            }

            throw new Error(
                result.message ||
                "Unable to load your account."
            );
        }

        return result.data;

    } catch (error) {
        console.error(
            "Dashboard user error:",
            error
        );

        alert(
            error.message ||
            "Unable to load dashboard."
        );

        return null;
    }
}


const modules = [

    {
        id: 1,
        icon: "fa-solid fa-play-circle",
        title: "Module 1: Introduction",
        description:
            "Introduction to the Income Generator Blueprint.",
        videos: [
            {
                id: 1,
                title: "Introduction",
                description:
                    "Welcome to the Income Generator Blueprint.",
                videoUrl:
                    "https://youtu.be/y3Lv0FADcyY"
            }
        ]
    },

    {
        id: 2,
        icon: "fa-solid fa-chart-line",
        title:
            "Module 2: Start and Scale Your Business",
        description:
            "Learn how to start and scale your business.",
        videos: [
            {
                id: 1,
                title:
                    "Start and Scale Your Business",
                description:
                    "Learn the fundamentals of starting and scaling your business.",
                videoUrl:
                    "https://youtu.be/RI8kDIq9vfU"
            }
        ]
    },

    {
        id: 3,
        icon: "fa-solid fa-coins",
        title:
            "Module 3: Wealth Information",
        description:
            "Understand wealth and financial growth.",
        videos: [
            {
                id: 1,
                title:
                    "Wealth",
                description:
                    "Understanding wealth.",
                videoUrl:
                    "https://youtu.be/LaWQuc4fCOA"
            },
            {
                id: 2,
                title:
                    "Wealth Information",
                description:
                    "Understanding wealth information.",
                videoUrl:
                    "https://youtu.be/BR8m1Y8GFSY"
            }
        ]
    },

    {
        id: 4,
        icon: "fa-solid fa-bullhorn",
        title:
            "Module 4: Information Marketing",
        description:
            "Learn information marketing.",
        videos: [
            {
                id: 1,
                title:
                    "Information Marketing Part 1",
                description:
                    "Information Marketing Part 1.",
                videoUrl:
                    "https://youtu.be/-Xx28i8Z2lU"
            },

            {
                id: 2,
                title:
                    "Information Marketing Part 2",
                description:
                    "Information Marketing Part 2.",
                videoUrl:
                    "https://youtu.be/v-uR1ygNnSE?si=c82subfTRWMvYLp6"
            },

            {
                id: 3,
                title:
                    "Information Marketing Part 3",
                description:
                    "Information Marketing Part 3.",
                videoUrl:
                    "https://youtu.be/xJ-e0g7VS5Q"
            },

            {
                id: 4,
                title:
                    "Information Marketing Part 4",
                description:
                    "Information Marketing Part 4.",
                videoUrl:
                    "https://youtu.be/n-oxqXoChCM"
            }
        ]
    },

    {
        id: 5,
        icon: "fa-solid fa-eye",
        title:
            "Module 5: Visibility",
        description:
            "Learn how to increase your visibility.",
        videos: [
            {
                id: 1,
                title:
                    "Visibility Part 1",
                description:
                    "Visibility Part 1.",
                videoUrl:
                    "https://youtu.be/c-dppZxRW8c"
            },

            {
                id: 2,
                title:
                    "Visibility Part 2",
                description:
                    "Visibility Part 2.",
                videoUrl:
                    "https://youtu.be/W0TDeQXKsxM"
            }
        ]
    },

    {
        id: 6,
        icon: "fa-solid fa-rectangle-ad",
        title:
            "Module 6: How to Run Meta Adverts",
        description:
            "Learn how to run Meta adverts.",
        videos: [
            {
                id: 1,
                title:
                    "How to Run Meta Adverts",
                description:
                    "Learn how to run Meta advertising campaigns.",
                videoUrl:
                    ""
            }
        ]
    },

    {
        id: 7,
        icon: "fa-solid fa-box-open",
        title:
            "Module 7: Get a Digital Product to Sell",
        description:
            "Learn how to get and list your digital product to sell.",
        videos: [
            {
                id: 1,
                title:
                    "Get a Digital Product to Sell",
                description:
                    "Finding and preparing a digital product for sale.",
                videoUrl:
                    "https://youtu.be/_XSOvHet9nk"
            }
        ]
    },

    {
        id: 8,
        icon:
            "fa-solid fa-money-bill-trend-up",
        title:
            "Module 8: How to Make One Millionaire",
        description:
            "Learn the strategies discussed in this module.",
        videos: [
            {
                id: 1,
                title:
                    "How to Make One Millionaire",
                description:
                    "Module 8 lesson.",
                videoUrl:
                    ""
            }
        ]
    },

    {
        id: 9,
        icon:
            "fa-solid fa-flag-checkered",
        title:
            "Module 9: Summary and End of Training",
        description:
            "Summary and completion of the training.",
        videos: [
            {
                id: 1,
                title:
                    "Summary and End of Training",
                description:
                    "Final summary of the Income Generator Blueprint.",
                videoUrl:
                    ""
            }
        ]
    }

];

function getModuleId() {
    // First check sessionStorage
    const storedModuleId =
        sessionStorage.getItem("selectedModuleId");

    if (storedModuleId) {
        return Number(storedModuleId);
    }

    // Fallback to URL
    const params =
        new URLSearchParams(window.location.search);

    return Number(params.get("id"));
}


function loadModule() {

    const moduleId =
        getModuleId();

    const module =
        modules.find(
            item =>
                item.id === moduleId
        );

    if (!module) {

        document.getElementById(
            "moduleTitle"
        ).textContent =
            "Module Not Found";

        document.getElementById(
            "moduleDescription"
        ).textContent =
            "The requested module does not exist.";

        return;
    }

    // --------------------------------
    // Header
    // --------------------------------

    document.getElementById(
        "moduleIcon"
    ).innerHTML = `
        <i class="${module.icon}"></i>
    `;

    document.getElementById(
        "moduleTitle"
    ).textContent =
        module.title;

    document.getElementById(
        "moduleDescription"
    ).textContent =
        module.description;


    // --------------------------------
    // Videos
    // --------------------------------

    renderVideos(
        module.videos
    );
}

function goBackToDashboard() {
    window.location.href =
        "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const modulePage = document.getElementById("module");

    // If this page does not contain the module section,
    // do nothing.
    if (!modulePage) {
        return;
    }

    const token = localStorage.getItem("authToken");

    // Only check authentication when module page
    // is actually active.
    if (!modulePage.classList.contains("active")) {
        return;
    }

    if (!token) {
        alert("Please login to access the course.");
        showPage("login");
        return;
    }

    loadModule();
});

function renderVideos(videos) {
    const container = document.getElementById("videosContainer");

    container.innerHTML = videos.map((video, index) => {

        const rawUrl = video.videoUrl?.trim();

        // No video yet
        if (!rawUrl) {
            return `
                <article class="video-card">

                    <div class="video-number">
                        ${index + 1}
                    </div>

                    <div class="video-content">

                        <h3>${video.title}</h3>

                        <p>
                            ${video.description || ""}
                        </p>

                        <div class="video-coming-soon">

                            <div class="coming-soon-icon">
                                <i class="fa-solid fa-clock"></i>
                            </div>

                            <h4>
                                Coming Soon
                            </h4>

                            <p>
                                This video is currently being prepared
                                and will be available soon.
                            </p>

                        </div>

                    </div>

                </article>
            `;
        }

        // Convert normal YouTube URL to embed URL
        let embedUrl = rawUrl;

        try {
            const url = new URL(rawUrl);

            if (
                url.hostname.includes("youtube.com") &&
                url.pathname === "/watch"
            ) {
                const videoId = url.searchParams.get("v");

                if (videoId) {
                    embedUrl =
                        `https://www.youtube.com/embed/${videoId}`;
                }
            }

            // Handle youtu.be links
            if (url.hostname === "youtu.be") {
                const videoId =
                    url.pathname.substring(1);

                if (videoId) {
                    embedUrl =
                        `https://www.youtube.com/embed/${videoId}`;
                }
            }

        } catch (error) {
            console.error(
                "Invalid video URL:",
                rawUrl
            );
        }

        return `
            <article class="video-card">

                <div class="video-number">
                    ${index + 1}
                </div>

                <div class="video-content">

                    <h3>
                        ${video.title}
                    </h3>

                    <p>
                        ${video.description || ""}
                    </p>

                    <div class="youtube-wrapper">

                        <iframe
                            src="${embedUrl}"
                            title="${video.title}"
                            frameborder="0"
                            allow="
                                accelerometer;
                                autoplay;
                                clipboard-write;
                                encrypted-media;
                                gyroscope;
                                picture-in-picture;
                                web-share
                            "
                            allowfullscreen>
                        </iframe>

                    </div>

                </div>

            </article>
        `;
    }).join("");
}

async function goToDashboard(event) {
    if (event) {
        event.preventDefault();
    }

    const token = localStorage.getItem("authToken");

    if (!token) {
        alert("Please login to access your dashboard.");
        showPage("login");
        return;
    }

    // Clear selected module
    sessionStorage.removeItem("selectedModuleId");

    // Remember that the user is on the dashboard
    sessionStorage.setItem("currentPage", "dashboard");

    // Show dashboard
    showPage("dashboard");

    // Load dashboard data
    await loadDashboard();
}

document.addEventListener("DOMContentLoaded", () => {
    const backButton = document.getElementById(
        "backToDashboardBtn"
    );

    if (backButton) {
        backButton.addEventListener("click", async (event) => {
            event.preventDefault();
            event.stopPropagation();

            const token = localStorage.getItem("authToken");

            if (!token) {
                alert("Please login to access your dashboard.");
                showPage("login");
                return;
            }

            // Remove selected module
            sessionStorage.removeItem("selectedModuleId");

            // Remember dashboard
            sessionStorage.setItem(
                "currentPage",
                "dashboard"
            );

            // Switch to dashboard WITHOUT reload
            showPage("dashboard");

            // Load dashboard
            await loadDashboard();
        });
    }
});