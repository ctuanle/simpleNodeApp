let ad_info;
const form = document.getElementById('form_msg');
const input = document.getElementById('form_msg_input');
const messages = document.getElementById('msg_list');
const scrollElem = document.getElementById('scrollThing');
const arrowTop = document.getElementById('arrowTop_msg');

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
        item.setAttribute('class', 'msg_right');
        item.textContent = input.value;
        messages.appendChild(item);
        scrollElem.scrollIntoView();
        input.value = '';
    }
});

socket.on('admin:receive_msg', (data) => {
    if (data.sid === window.location.href.split('/').pop()){
        const item = document.createElement('li');
        item.setAttribute('class', 'msg_left');
        item.textContent = data.msg;
        messages.appendChild(item);
        scrollElem.scrollIntoView();
    }
});
