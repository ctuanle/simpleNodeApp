function product__click(event) {
    event = event || window.event;
    const src = event.currentTarget;
    const prodId = src.getAttribute('prodId');
    window.location.href = "/products/"+prodId;
}

const current_page = window.location.href.split('/').slice(-1)[0];
const numpage_item = document.querySelector('#numpage');
const prev_link = document.querySelector('#prev_link');
const next_link = document.querySelector('#next_link');
var numpage = null;
if (numpage_item){
    numpage = numpage_item.value;
}

if (Number(current_page) < 1 || Number(current_page) > Number(numpage)) {
    window.location.href = '/products/page/1';
}

if (Number(current_page) ===1) {
    prev_link.hidden = true;

}
if (Number(current_page) === Number(numpage)) {
    next_link.hidden = true;
}


if (prev_link){
    prev_link.addEventListener('click', () => {
        if (Number(current_page) > 1) {
            const prev_page = (Number(current_page) - 1).toString();
            window.location.href = '/products/page/' + prev_page;
        }
    })
}


if (next_link){
    next_link.addEventListener('click', () => {
        if (Number(current_page) < Number(numpage)){
            const next_page = (Number(current_page) + 1).toString();
            window.location.href = '/products/page/' + next_page;
        }
    })
}