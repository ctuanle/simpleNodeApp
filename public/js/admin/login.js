const login_form = document.getElementById('ad_login_form');

if(login_form) {
    login_form.addEventListener('submit', handleLogin);
}


async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('ad_lg_form_username').value;
    const password = document.getElementById('ad_lg_form_password').value;
    if (username && password) {
        const loginRes = await fetch('/admin/login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username:username, password:password})
        })
        if (loginRes.status === 200) {
            window.location.href = '/admin';
        }
    }
    
}