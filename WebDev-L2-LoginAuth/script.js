const loginView = document.getElementById("loginView");
const registerView = document.getElementById("registerView");
const dashboardView = document.getElementById("dashboardView");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginError = document.getElementById("loginError");
const registerError = document.getElementById("registerError");

const dashboardName = document.getElementById("dashboardName");
const dashboardEmail = document.getElementById("dashboardEmail");
const logoutButton = document.getElementById("logoutButton");

function getUsers() {
    return JSON.parse(localStorage.getItem("rajaAuthUsers")) || [];
}

function saveUsers(users) {
    localStorage.setItem("rajaAuthUsers", JSON.stringify(users));
}

function showView(view) {
    loginView.classList.add("hidden");
    registerView.classList.add("hidden");
    dashboardView.classList.add("hidden");

    view.classList.remove("hidden");
}

showRegister.addEventListener("click", () => {
    registerError.textContent = "";
    showView(registerView);
});

showLogin.addEventListener("click", () => {
    loginError.textContent = "";
    showView(loginView);
});

registerForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim().toLowerCase();
    const password = document.getElementById("registerPassword").value;

    registerError.textContent = "";

    const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordPattern.test(password)) {
        registerError.textContent =
            "Password must have 8+ characters, uppercase, lowercase and a number.";
        return;
    }

    const users = getUsers();

    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
        registerError.textContent =
            "An account with this email already exists.";
        return;
    }

    users.push({
        id: Date.now(),
        name,
        email,
        passwordHash: simpleHash(password)
    });

    saveUsers(users);

    registerForm.reset();

    alert("Account created successfully!");

    showView(loginView);
});

loginForm.addEventListener("submit", event => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    loginError.textContent = "";

    const users = getUsers();

    const user = users.find(
        storedUser =>
            storedUser.email === email &&
            storedUser.passwordHash === simpleHash(password)
    );

    if (!user) {
        loginError.textContent =
            "Invalid email or password.";
        return;
    }

    sessionStorage.setItem(
        "rajaLoggedInUser",
        JSON.stringify({
            name: user.name,
            email: user.email
        })
    );

    loginForm.reset();

    loadDashboard();
});

function loadDashboard() {
    const loggedInUser =
        JSON.parse(sessionStorage.getItem("rajaLoggedInUser"));

    if (!loggedInUser) {
        showView(loginView);
        return;
    }

    dashboardName.textContent = loggedInUser.name;
    dashboardEmail.textContent = loggedInUser.email;

    showView(dashboardView);
}

logoutButton.addEventListener("click", () => {
    sessionStorage.removeItem("rajaLoggedInUser");
    showView(loginView);
});

function simpleHash(text) {
    let hash = 0;

    for (let i = 0; i < text.length; i++) {
        hash = (hash << 5) - hash + text.charCodeAt(i);
        hash |= 0;
    }

    return String(hash);
}

loadDashboard();