function filterProducts() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim().toLowerCase();
    const productList = document.getElementById('product-list');
    const noProductMsg = document.getElementById('no-product');

    if (query === "") {
        renderProducts(products);
        noProductMsg.style.display = 'none';
        return;
    }

    const searchTerms = query.split(/\s+/); 
    const filtered = products.filter(product => {
        const name = product.name.toLowerCase();
        const desc = product.desc.toLowerCase();
        const cat = product.category.toLowerCase();
        return searchTerms.some(term => name.includes(term) || desc.includes(term) || cat.includes(term));
    });

    if (filtered.length === 0) {
        productList.innerHTML = '';
        noProductMsg.style.display = 'block';
    } else {
        noProductMsg.style.display = 'none';
        renderProducts(filtered);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', filterProducts);
});