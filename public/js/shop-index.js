const logout_request = async () => {
    const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {},
    });
    if (res.status === 200) {
        window.location.href = "/";
    }
};

const currentPage = window.location.href.split("/")[3];

switch (currentPage) {
    case "product":
        document.getElementById("sidebar_product").setAttribute("class", "active");
        break;
    case "category":
        document.getElementById("sidebar_category").setAttribute("class", "active");
        break;
    case "message":
        document.getElementById("sidebar_messages").setAttribute("class", "active");
        break;
    default:
        document.getElementById("sidebar_home").setAttribute("class", "active");
        break;
}
