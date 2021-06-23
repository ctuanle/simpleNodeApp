const socket = io("http://localhost:3000", {autoConnect : false});

let ad_info;
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

(async () => {
    const res = await fetch('/admin/info', {
        method: 'GET',
        headers: {}
    });
    if (res.status === 200) {
        ad_info = await res.json();
        socket.auth = ad_info;
        socket.connect();
        input.disabled = false;
    }
    else {
        window.location.href = '/admin/login';
    }
})();


form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (input.value && ad_info) {

        const msg = input.value;
        const senderid = ad_info.aid;
        const receiverid = window.location.href.split('/').pop();

        socket.emit('admin:send_msg', {
            msg: msg,
            sid: senderid,
            rid: receiverid
        });

        const item = document.createElement('li');
        item.textContent = '[You]: '+input.value;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
        input.value = '';
    }
});

socket.on('admin:receive_msg', (data) => {
    if (data.sid === window.location.href.split('/').pop()){
        const item = document.createElement('li');
        item.textContent = '[User '+data.sid+']: '+data.msg;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    }
});


