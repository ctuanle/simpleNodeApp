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
    const data = await response.json();
    // data : {uid : number, token : string}
    sessionStorage.setItem('user__data', JSON.stringify(data));
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
    const flash__signup = document.getElementById('flash__signup');
    if (response.ok){
        if  (flash__signup){
            flash__signup.hidden = false;
        }
        setInterval(
            () => {window.location.href = '/auth/login'},
            3000
        )
        
    }
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
        const flash__sent = document.getElementById('flash__sent');
        if (flash__sent && response.ok) {
            flash__sent.hidden = false;
        }
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
        const flash__changed = document.getElementById('flash__changed');
        if (flash__changed && response.ok) {
            flash__changed.hidden = false;
        }
        setInterval(
            () => {window.location.href = '/auth/login'},
            3000
        )
    }
}