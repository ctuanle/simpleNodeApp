const socket = io("http://localhost:3000", {autoConnect: false});
        
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

let us_info;

(async () => {
    const response = await fetch('/auth/check', {
        method: 'POST',
        headers: {}
    });
    if (response.status === 200) {
        us_info = await response.json();
        socket.auth = us_info;
        socket.connect();
        input.disabled = false;
    }
    else {
        window.location.href = '/products/page/1';
    }
})();

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value && us_info) {

        const msg = input.value;
        const senderid = us_info.uid;

        socket.emit('user:send_msg', {
            msg: msg,
            sid: senderid 
        });

        const item = document.createElement('li');
        item.textContent = '[You]: '+input.value;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
        input.value = '';
    }
});

socket.on('user:receive_msg', (data) => {
    const item = document.createElement('li');
    item.textContent = '[Admin]: '+data.msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});


setInterval(async () => {
    const response = await fetch('/auth/check', {
        method: 'POST',
        headers: {}
    });
    if (response.status !== 200) {
        window.location.href = '/';
    }
}, 15000);