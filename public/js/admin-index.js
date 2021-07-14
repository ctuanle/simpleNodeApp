let us_info;

const logout_request = async () => {
    const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {},
    });
    if (res.status === 200) {
        window.location.href = "/auth/login";
    }
};

const handleFlash = (id, response, timer, url) => {
    const flash_item = document.getElementById(id);
    if (flash_item) {
        if (response.ok) {
            flash_item.setAttribute("class", "alert alert-success");
        } else {
            flash_item.setAttribute("class", "alert alert-danger");
        }
        response.json().then((data) => {
            const textnode = document.createTextNode(data.message);
            flash_item.appendChild(textnode);
            flash_item.hidden = false;
        });
        if (response.ok && timer) {
            setTimeout(() => {
                window.location.href = url ? url : "/admin/";
            }, timer);
        }
    }
};

const deleteProduct = async (id) => {
    const ok = confirm("Are you sure you want to delete this product?");
    const pid = Number(id);
    if (ok) {
        const response = await fetch("/admin/product/" + id, {
            method: "DELETE",
            body: JSON.stringify({ pid: pid }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        handleFlash("flash__deleted", response, 1500, window.location.href);
    }
};

const currentPage = window.location.href.split("/")[4];

switch (currentPage) {
    case "products":
        document
            .getElementById("sidebar_products")
            .setAttribute("class", "active");
        break;
    case "product":
        document
            .getElementById("sidebar_add_product")
            .setAttribute("class", "active");
        break;
    case "users":
        document
            .getElementById("sidebar_users")
            .setAttribute("class", "active");
        break;
    case "categories":
        document
            .getElementById("sidebar_categories")
            .setAttribute("class", "active");
        break;
    case "messages":
        document
            .getElementById("sidebar_messages")
            .setAttribute("class", "active");
        break;
    default:
        document.getElementById("sidebar_home").setAttribute("class", "active");
        break;
}

const socket = io("http://localhost:3000");

(async () => {
    const res = await fetch("/api/auth/info", {
        method: "GET",
        headers: {},
    });
    if (res.status === 200) {
        us_info = await res.json();
        socket.auth = us_info;
        socket.connect();
    } else {
        window.location.href = "/auth/login";
    }
})();
