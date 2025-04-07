document.getElementById("makeSaleBtn").addEventListener("click", function () {
    const productId = document.getElementById("saleProduct").value;
    const quantity = parseInt(document.getElementById("saleQuantity").value) || 0;

    if (!productId || quantity <= 0) {
        showMessage("saleMessage", "Selecione um produto e uma quantidade válida.", true);
        return;
    }

    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
        showMessage("saleMessage", "Produto não encontrado.", true);
        return;
    }

    const product = products[productIndex];

    if (product.stock < quantity) {
        showMessage("saleMessage", `Estoque insuficiente. Disponível: ${product.stock}`, true);
        return;
    }

    const unitPrice = product.price;
    const total = unitPrice * quantity;

    sales.push({
        date: new Date(),
        productId,
        productName: product.name,
        quantity,
        unitPrice,
        total,
        seller: currentUser.fullName
    });

    products[productIndex].stock -= quantity;
    document.getElementById("saleQuantity").value = "1";

    renderProducts();
    updateSaleProductOptions();
    renderSales();
    showMessage("saleMessage", "Venda registrada com sucesso!");
});

function renderSales() {
    const tbody = document.querySelector("#salesTable tbody");
    tbody.innerHTML = "";

    const sortedSales = [...sales].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedSales.forEach(sale => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${new Date(sale.date).toLocaleString()}</td>
            <td>${sale.productName}</td>
            <td>${sale.quantity}</td>
            <td>${formatCurrency(sale.unitPrice)}</td>
            <td>${formatCurrency(sale.total)}</td>
            <td>${sale.seller}</td>
        `;
        tbody.appendChild(tr);
    });

    updateTodaySales();
}

function updateSaleProductOptions() {
    const select = document.getElementById("saleProduct");
    select.innerHTML = "";

    if (products.length === 0) {
        select.innerHTML = "<option value=''>Nenhum produto disponível</option>";
        return;
    }

    products.forEach(product => {
        const option = document.createElement("option");
        option.value = product.id;
        option.textContent = `${product.name} - R$ ${formatCurrency(product.price)} (${product.stock} em estoque)`;
        select.appendChild(option);
    });

    updateUnitPrice();
}

function updateUnitPrice() {
    const productId = document.getElementById("saleProduct").value;
    const product = products.find(p => p.id === productId);

    if (product) {
        document.getElementById("unitPrice").textContent = formatCurrency(product.price);
        updateTotalPrice();
    } else {
        document.getElementById("unitPrice").textContent = "0.00";
        document.getElementById("totalPrice").textContent = "0.00";
    }
}

function updateTotalPrice() {
    const productId = document.getElementById("saleProduct").value;
    const quantity = parseInt(document.getElementById("saleQuantity").value) || 0;
    const product = products.find(p => p.id === productId);

    if (product && quantity > 0) {
        const total = product.price * quantity;
        document.getElementById("totalPrice").textContent = formatCurrency(total);
    } else {
        document.getElementById("totalPrice").textContent = "0.00";
    }
}

document.getElementById("saleProduct").addEventListener("change", updateUnitPrice);
document.getElementById("saleQuantity").addEventListener("input", updateTotalPrice);
