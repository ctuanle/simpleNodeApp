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
}

const handleHeader = async () => {
    const login_data = await checkIsLogin();
    if (login_data) {
        if (login_data.isAdmin) {
            user__node.setAttribute('href', '/admin');
        }
        else {
            user__node.setAttribute('href', '/user/'+login_data.uid);
        }
        const username_node = document.createTextNode(login_data.username);
        user__node.appendChild(username_node);
        user__node.hidden = false;

        const logoutTextNode = document.createTextNode('Logout');
        log__node.appendChild(logoutTextNode);
        log__node.setAttribute('onclick', 'logout_request()');
    }
    else {
        const logoutTextNode = document.createTextNode('Login');
        log__node.appendChild(logoutTextNode);
        
    }
    log__node.setAttribute('href', '/auth/login');
    log__node.hidden = false;
}

handleHeader();

