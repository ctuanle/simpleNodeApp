const deleteProduct = async (id) => {
    const ok = confirm('Are you sure you want to delete this product?');
    const pid = Number(id);
    if (ok && token) {
        fetch('/admin/delete', {
            method: 'DELETE',
            body: JSON.stringify({ productId: pid}),
            headers: {
                'Content-Type': 'application/json',
                'authorization' : 'Bearer ' + token
            }
        }, (response) => {
            if (response.ok) ;
        });
        window.location.reload()
    }
    
}


const addForm = document.querySelector('#add-product-form');
if (addForm) {
    addForm.addEventListener('submit', addProduct);
}

function addProduct (e) {
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
    if (name && price && category && token){
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('files', files.files[0]);
        fetch('/admin/add', {
            method: 'POST',
            body: formData,
            headers: {
                'authorization': 'Bearer ' + token
            },
        }, (response) => {
            if (response.ok){
            window.location.href = '/admin/';
        }
        });
        
    } 
}

const updateForm = document.querySelector('#update-product-form');
if (updateForm){
    updateForm.addEventListener('submit', updateProduct);
}

function updateProduct (e) {
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
    if (name && price && category && token){
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('files', files.files[0]);
        fetch('/admin/edit/'+pid, {
            method: 'PUT',
            body: formData,
            headers: {
                'authorization': 'Bearer ' + token
            },
        });
        
    }
} 