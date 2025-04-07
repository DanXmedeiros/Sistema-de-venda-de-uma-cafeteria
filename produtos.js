document.getElementById("addProductBtn").addEventListener("click", function () {
    const name = document.getElementById("productName").value;
    const type = document.getElementById("productType").value;
    const price = parseFloat(document.getElementById("productPrice").value);
    const stock = parseInt(document.getElementById("productStock").value);

    if (!name || isNaN(price) || isNaN(stock)) {
        showMessage("productMessage", "Preencha todos os campos corretamente.", true);
        return;
    }

    const id = Date.now().toString();

    products.push({ id, name, type, price, stock });

    document.getElementById("productName").value = "";
    document.getElementById("productType").value = "bebida";
    document.getElementById("productPrice").value = "";
    document.getElementById("productStock").value = "";

    renderProducts();
    updateSaleProductOptions();
    showMessage("productMessage", "Produto adicionado com sucesso!");
});

function renderProducts() {
    const tbody = document.querySelector("#productsTable tbody");
    tbody.innerHTML = "";

    products.forEach(product => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${product.name}</td>
            <td>${translateType(product.type)}</td>
            <td>${formatCurrency(product.price)}</td>
            <td>${product.stock}</td>
            <td><button class="remove-product" data-id="${product.id}">Remover</button></td>
        `;
        tbody.appendChild(tr);
    });

    document.querySelectorAll(".remove-product").forEach(button => {
        button.addEventListener("click", function () {
            const productId = this.getAttribute("data-id");
            products = products.filter(product => product.id !== productId);
            renderProducts();
            updateSaleProductOptions();
            updateDashboard();
            showMessage("productMessage", "Produto removido com sucesso!");
        });
    });

    document.getElementById("totalProducts").textContent = products.length;
    checkLowStock();
}

function translateType(type) {
    const types = {
        'bebida': 'Bebida',
        'comida': 'Comida',
        'sobremesa': 'Sobremesa'
    };
    return types[type] || type;
}
