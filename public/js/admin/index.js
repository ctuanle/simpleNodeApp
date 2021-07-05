const user__node = document.getElementById('user__node');
const log__out__node = document.getElementById('log__out__node');
var user_data;

const getInfoAdmin = async () => {
    const response = await fetch('/admin/info', {
        method: 'GET',
        headers: {}
    });
    if (response.status === 200) {
        const data = await response.json();
        user_data = data;
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
        //TODO : find something to do
    }
    else {
        window.location.href = '/admin/login';
    }
}


const handleFlash = (id, response, timer, url) => {
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
                window.location.href = url? url : '/admin/';
            }, timer);
        } 
    }
}


const deleteProduct = async (id) => {
    const ok = confirm('Are you sure you want to delete this product?');
    const pid = Number(id);
    if (ok) {
        const response = await fetch('/admin/product/'+id, {
            method: 'DELETE',
            body: JSON.stringify({ pid: pid}),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        handleFlash('flash__deleted', response, 1500);
    }
    
}

const currentPage = window.location.href.split('/')[4];

switch(currentPage) {
    case 'products' : 
        document.getElementById('sidebar_products').setAttribute('class', 'active');
        break;
    case 'product' :
        document.getElementById('sidebar_add_product').setAttribute('class', 'active');
        break;
    case 'users' :
        document.getElementById('sidebar_users').setAttribute('class', 'active');
        break;
    case 'categories' :
        document.getElementById('sidebar_categories').setAttribute('class', 'active');
        break;
    case 'messages' :
        document.getElementById('sidebar_messages').setAttribute('class', 'active');
        break;
    default :
        document.getElementById('sidebar_home').setAttribute('class', 'active');
        break;
}

const socket = io("http://localhost:3000");
setInterval(handleHeader, 15000);

(async () => {
    const res = await fetch('/admin/info', {
        method: 'GET',
        headers: {}
    });
    if (res.status === 200) {
        ad_info = await res.json();
        socket.auth = ad_info;
        socket.connect();
    }
    else {
        window.location.href = '/admin/login';
    }
})();