function product__click(event) {
    event = event || window.event;
    const src = event.currentTarget;
    const prodId = src.getAttribute('prodId');
    window.location.href = "/products/"+prodId;
}

const current_page = window.location.href.split('/').slice(-1)[0];
const numpage = document.querySelector('#numpage').value;

if (Number(current_page) < 1 || Number(current_page) > Number(numpage)) {
    window.location.href = '/products/page/1';
}

const prev_link = document.querySelector('#prev_link');
if (prev_link){
    prev_link.addEventListener('click', () => {
        if (Number(current_page) > 1) {
            const prev_page = (Number(current_page) - 1).toString();
            window.location.href = '/products/page/' + prev_page;
        }
    })
}

const next_link = document.querySelector('#next_link');
if (next_link){
    next_link.addEventListener('click', () => {
        if (Number(current_page) < Number(numpage)){
            const next_page = (Number(current_page) + 1).toString();
            window.location.href = '/products/page/' + next_page;
        }
    })
}