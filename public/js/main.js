//get the user's token if there is one
const user__data = sessionStorage.getItem('user__data');
const admin__node = document.getElementById('admin__node');
const log__node = document.getElementById('log__node');

const logout = () => {
    sessionStorage.removeItem('user__data');
}

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