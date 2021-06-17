const ad_product_form = document.querySelector('#add-product-form');
if (ad_product_form) {
    ad_product_form.addEventListener('submit', addProduct);
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
        const response = await fetch('/admin/product/add', {
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
        const response = await fetch('/admin/product/'+pid, {
            method: 'PUT',
            body: formData,
            headers: {},
        });
        handleFlash('flash__edited', response, 2000);
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