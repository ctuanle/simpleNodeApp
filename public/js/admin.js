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
            setInterval(() => {
                window.location.href = '/admin/';
            }, timer);
        } 
    }
}

const deleteProduct = async (id) => {
    const ok = confirm('Are you sure you want to delete this product?');
    const pid = Number(id);
    if (ok) {
        const response = await fetch('/admin/delete', {
            method: 'DELETE',
            body: JSON.stringify({ productId: pid}),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        handleFlash('flash__deleted', response, 1500);
    }
    
}


const addForm = document.querySelector('#add-product-form');
if (addForm) {
    addForm.addEventListener('submit', addProduct);
}

async function addProduct (e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const radios = document.getElementsByName('category');
    const files = document.getElementById('files');
    var category;
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked){
            category = radios[i].value;
        }
    }
    if (name && price && category){
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('files', files.files[0]);
        const response = await fetch('/admin/add', {
            method: 'POST',
            body: formData,
            headers: {},
        });
        handleFlash('flash__added', response, 2000);
    } 
}

const updateForm = document.querySelector('#update-product-form');
if (updateForm){
    updateForm.addEventListener('submit', updateProduct);
}

async function updateProduct (e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const radios = document.getElementsByName('category');
    const files = document.getElementById('files');
    const pid = document.getElementById('pid').value;
    var category;
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked){
            category = radios[i].value;
        }
    }
    if (name && price && category){
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('files', files.files[0]);
        const response = await fetch('/admin/edit/'+pid, {
            method: 'PUT',
            body: formData,
            headers: {},
        });
        handleFlash('flash__edited', response, 2000);
    }
} 