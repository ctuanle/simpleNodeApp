//get the user's token if there is one
const user__data = sessionStorage.getItem('user__data');
const admin__node = document.getElementById('admin__node');
const log__node = document.getElementById('log__node');
var token = null;
if (user__data) token = JSON.parse(user__data).token;
const logout = () => {
    sessionStorage.removeItem('user__data');
}

const handleHeader = () => {
    if (user__data) {
        admin__node.setAttribute('href', '/admin');
        admin__node.hidden = false;
        const logoutTextNode = document.createTextNode('Logout');
        log__node.appendChild(logoutTextNode);
    }
    else {
        const logoutTextNode = document.createTextNode('Login');
        log__node.appendChild(logoutTextNode);
    }
    log__node.setAttribute('href', '/auth/login');
    log__node.setAttribute('onclick', 'logout()');
    log__node.hidden = false;
}

const handleExpiredToken = async () => {
    if (user__data) {
        if (token){
            const response = await fetch('/admin/check', {
                method: 'POST',
                body: JSON.stringify({ token :  token}),
                headers: {'Content-Type': 'application/json',}
            })
            if (response.status !==200){
                logout();
            }
        }
    }
}

handleExpiredToken();
handleHeader();

