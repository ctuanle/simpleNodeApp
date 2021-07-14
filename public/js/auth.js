const login_form = document.querySelector("#auth_login_form");
const signup_form = document.querySelector("#auth_signup_form");
const forgot_pwd_form = document.querySelector("#auth_forgot_form");
const reset_pwd_form = document.querySelector("#auth_reset_form");

if (login_form) {
    login_form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const username = document.querySelector("#auth_username").value;
        const password = document.querySelector("#auth_password").value;

        if (username && password) {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
                headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
                const data = await res.json();
                window.location.href = data.newURL;
            }
        }
    });
}

if (signup_form) {
    signup_form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const username = document.querySelector("#auth_username").value;
        const password = document.querySelector("#auth_password").value;
        const email = document.querySelector("#auth_email").value;

        if (username && password) {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                body: JSON.stringify({
                    username: username,
                    password: password,
                    email: email,
                }),
                headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
                // handle flash message here
                setTimeout(() => {
                    window.location.href = "/auth/login";
                });
            }
        }
    });
}

if (forgot_pwd_form) {
    forgot_pwd_form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const email = document.querySelector("#email").value;
        const res = await fetch("/api/auth/forgot", {
            method: "POST",
            body: JSON.stringify({ email: email }),
            headers: { "Content-Type": "application/json" },
        });
        // Handle flash message here.
    });
}

if (reset_pwd_form) {
    reset_pwd_form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const uid = document.querySelector("#uid").value;
        const token = document.querySelector("#token").value;
        const password = document.querySelector("#password").value;

        if (uid && token && password) {
            const res = await fetch("/api/auth/reset", {
                method: "POST",
                body: JSON.stringify({
                    uid: uid,
                    token: token,
                    password: password,
                }),
                headers: { "Content-Type": "application/json" },
            });
            // Handle flash message here
        }
    });
}
