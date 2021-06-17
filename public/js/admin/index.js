const user__node = document.getElementById('user__node');
const log__out__node = document.getElementById('log__out__node');

const getInfoAdmin = async () => {
    const response = await fetch('/admin/info', {
        method: 'GET',
        headers: {}
    });
    if (response.status === 200) {
        const data = await response.json();
        return data;
    }
    return null;
}

const logout_request = async () => {
    const res = await fetch('/admin/logout', {
        method: 'POST',
        headers: {}
    });
    if (res.status === 200) {
        window.location.href = '/admin/login';
    }
}

const handleHeader = async () => {
    const ad_data = await getInfoAdmin();
    if (ad_data) {

    }
    else {
        window.location.href = '/admin/login';
    }
}


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
        })
        if (response.ok && timer) {
            setTimeout(() => {
                window.location.href = '/admin/';
            }, timer);
        } 
    }
}

setInterval(handleHeader, 15000);