const admin__node = document.getElementById('admin__node');
const log__node = document.getElementById('log__node');


const checkIsLogin = async () => {
    const response = await fetch('/auth/check', {
        method: 'POST',
        headers: {}
    });
    if (response.status === 200) {
        return true;
    }
    return false;
}

const logout_request = async () => {
    const response = await fetch('/auth/logout', {
        method: 'POST',
        headers: {}
    });
}

const handleHeader = async () => {
    const isLogin = await checkIsLogin();
    if (isLogin) {
        admin__node.setAttribute('href', '/admin');
        admin__node.hidden = false;
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

