// Evento ao clicar no botão de realizar venda
document.getElementById("makeSaleBtn").addEventListener("click", function () {
    // Pega o ID do produto selecionado e a quantidade informada
    const productId = document.getElementById("saleProduct").value;
    const quantity = parseInt(document.getElementById("saleQuantity").value) || 0;

    // Valida se o produto foi selecionado e se a quantidade é válida (> 0)
    if (!productId || quantity <= 0) {
        showMessage("saleMessage", "Selecione um produto e uma quantidade válida.", true);
        return;
    }

    // Procura o índice do produto no array de produtos
    const productIndex = products.findIndex(p => p.id === productId);

    // Verifica se o produto foi encontrado
    if (productIndex === -1) {
        showMessage("saleMessage", "Produto não encontrado.", true);
        return;
    }

    const product = products[productIndex];

    // Verifica se há estoque suficiente para a venda
    if (product.stock < quantity) {
        showMessage("saleMessage", `Estoque insuficiente. Disponível: ${product.stock}`, true);
        return;
    }

    // Calcula o valor total da venda
    const unitPrice = product.price;
    const total = unitPrice * quantity;

    // Adiciona a venda ao array de vendas
    sales.push({
        date: new Date(),
        productId,
        productName: product.name,
        quantity,
        unitPrice,
        total,
        seller: currentUser.fullName
    });

    // Subtrai a quantidade vendida do estoque
    products[productIndex].stock -= quantity;

    // Redefine o campo de quantidade para "1"
    document.getElementById("saleQuantity").value = "1";

    // Atualiza a interface: produtos, opções de venda, tabela de vendas e exibe mensagem
    renderProducts();
    updateSaleProductOptions();
    renderSales();
    showMessage("saleMessage", "Venda registrada com sucesso!");
});

// Função para renderizar a tabela de vendas
function renderSales() {
    const tbody = document.querySelector("#salesTable tbody");
    tbody.innerHTML = ""; // Limpa a tabela

    // Ordena as vendas pela data, da mais recente para a mais antiga
    const sortedSales = [...sales].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Cria uma linha para cada venda
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

    // Atualiza o resumo de vendas de hoje (caso tenha)
    updateTodaySales();
}

// Função para atualizar as opções do campo de seleção de produtos
function updateSaleProductOptions() {
    const select = document.getElementById("saleProduct");
    select.innerHTML = ""; // Limpa o select

    // Caso não haja produtos disponíveis
    if (products.length === 0) {
        select.innerHTML = "<option value=''>Nenhum produto disponível</option>";
        return;
    }

    // Adiciona uma opção para cada produto disponível
    products.forEach(product => {
        const option = document.createElement("option");
        option.value = product.id;
        option.textContent = `${product.name} - R$ ${formatCurrency(product.price)} (${product.stock} em estoque)`;
        select.appendChild(option);
    });

    // Atualiza o preço unitário exibido
    updateUnitPrice();
}

// Função para atualizar o valor do preço unitário na tela
function updateUnitPrice() {
    const productId = document.getElementById("saleProduct").value;
    const product = products.find(p => p.id === productId);

    if (product) {
        document.getElementById("unitPrice").textContent = formatCurrency(product.price);
        updateTotalPrice(); // Também atualiza o total
    } else {
        // Caso nenhum produto esteja selecionado
        document.getElementById("unitPrice").textContent = "0.00";
        document.getElementById("totalPrice").textContent = "0.00";
    }
}

// Função para atualizar o valor total da venda (preço x quantidade)
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

// Eventos para atualizar preços ao mudar o produto ou a quantidade
document.getElementById("saleProduct").addEventListener("change", updateUnitPrice);
document.getElementById("saleQuantity").addEventListener("input", updateTotalPrice);
