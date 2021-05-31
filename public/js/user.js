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
    if (response.ok){
      window.location.href = '/auth/login';
    }
  }   
}