const ad_product_form = document.querySelector("#add-product-form");
if (ad_product_form) {
    ad_product_form.addEventListener("submit", addProduct);
}

async function addProduct(e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const radios = document.getElementsByName("category");
    const files = document.getElementById("files");
    var category;
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            category = radios[i].value;
        }
    }
    if (name && price && category) {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("category", category);
        formData.append("files", files.files[0]);
        const response = await fetch("/admin/product/add", {
            method: "POST",
            body: formData,
            headers: {},
        });
        handleFlash("flash__added", response, 1500, "/admin/product/add");
    }
}

const updateForm = document.querySelector("#update-product-form");
if (updateForm) {
    updateForm.addEventListener("submit", updateProduct);
}

async function updateProduct(e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const radios = document.getElementsByName("category");
    const files = document.getElementById("files");
    const pid = document.getElementById("pid").value;
    var category;
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            category = radios[i].value;
        }
    }
    if (name && price && category) {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("category", category);
        formData.append("files", files.files[0]);
        const response = await fetch("/admin/product/" + pid, {
            method: "PUT",
            body: formData,
            headers: {},
        });
        handleFlash("flash__edited", response);
    }
}
