const socket = io("http://localhost:3000", {autoConnect: false});
        
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const roomIdElem= document.getElementById('roomId');

let us_info;

(async () => {
    const response = await fetch('/auth/info', {
        method: 'GET',
        headers: {}
    });
    if (response.status === 200) {
        us_info = await response.json();
        socket.auth = us_info;
        socket.connect();
        input.disabled = false;
    }
    else {
        window.location.href = '/';
    }
})();

if (form && input && messages) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (input.value && us_info) {
    
            const msg = input.value;
            const senderid = us_info.uid;
            const roomId = Number(roomIdElem.innerText);
            if (msg && senderid && roomId) {
                socket.emit('user:send_msg', {
                    msg: msg,
                    sid: senderid,
                    roomId: roomId
                });
        
                const item = document.createElement('li');
                item.textContent = '[You]: '+input.value;
                messages.appendChild(item);
                window.scrollTo(0, document.body.scrollHeight);
                input.value = '';
            }
        }
    });
    
    socket.on('user:receive_msg', (data) => {
        const item = document.createElement('li');
        item.textContent = '[Admin]: '+data.msg;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });

}


