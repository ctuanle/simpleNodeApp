const user__node = document.getElementById('user__node');
const log__node = document.getElementById('log__node');


const checkIsLogin = async () => {
    const response = await fetch('/auth/check', {
        method: 'POST',
        headers: {}
    });
    if (response.status === 200) {
        const data = await response.json();
        return data;
    }
    return null;
}

const logout_request = async () => {
    const response = await fetch('/auth/logout', {
        method: 'POST',
        headers: {}
    });
    if (response.status === 200) {
        window.location.href = '/auth/login';
    }
}

const handleHeader = async () => {
    const login_data = await checkIsLogin();
    if (login_data) {
        user__node.setAttribute('href', '/user/'+login_data.uid);
        user__node.innerHTML = login_data.username;
        user__node.hidden = false;

        log__node.innerHTML = 'Logout';
        log__node.setAttribute('onclick', 'logout_request()');
    }
    else {
        log__node.innerHTML = 'Login';
        
    }
    // log__node.setAttribute('href', '/auth/login');
    log__node.hidden = false;
}
handleHeader();
setInterval(handleHeader, 15000);

