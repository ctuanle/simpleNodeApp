const handleFlash = (id, response, timer) => {
    const flash_item = document.getElementById(id);
    if (flash_item){
        if (response.ok){
            flash_item.setAttribute('class', 'alert alert-success');
        }
        else {
            flash_item.setAttribute('class', 'alert alert-danger');
        }
        response.json().then(data => {
            const textnode = document.createTextNode(data.message);
            flash_item.appendChild(textnode);
            flash_item.hidden = false;
        });
        if (response.ok && timer) {
            setTimeout(() => {
                window.location.href = '/auth/login';
            }, timer);
        }   
    }
}

const function__login = async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        const response = await fetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username : username, password : password}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            window.location.href = '/';
        }
        handleFlash('flash__login', response, 3000);
    }   
}

const function__signup = async () => {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        const response = await fetch('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ username : username, password : password, email : email}),
            headers: {
                'Content-Type': 'application/json'
            }

        });
        handleFlash('flash__signup', response, 3000);
  }   
}


const function__forgot__password = async () => {
    const email = document.getElementById('email').value;
    if (email){
        const response = await fetch('/auth/forgot', {
            method: 'POST',
            body: JSON.stringify({ email : email}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        handleFlash('flash__sent', response);
    }
}

const function__reset__password = async () => {
    const uid = document.getElementById('uid').value;
    const token = document.getElementById('token').value;
    const password = document.getElementById('password').value;
    if (uid && token && password){
        const response = await fetch('/auth/reset', {
            method: 'POST',
            body: JSON.stringify({uid: uid, token: token, password: password}),
            headers: {'Content-Type': 'application/json'}
        });
        handleFlash('flash__changed', response, 3000);
    }
}