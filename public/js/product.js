function product__click(event) {
    event = event || window.event;
    const src = event.currentTarget;
    const prodId = src.getAttribute('prodId');
    window.location.href = "/products/"+prodId;
}