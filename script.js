// Dados iniciais
let users = [
    { 
        fullName: "Administrador", 
        id: "admin", 
        email: "admin@cafeteria.com", 
        phone: "(00) 00000-0000", 
        password: "admin123", 
        isAdmin: true 
    }
];

let products = [];
let sales = [];
let currentUser = null;

// Funções auxiliares
function formatCurrency(value) {
    return parseFloat(value).toFixed(2);
}

function showMessage(elementId, message, isError = false) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = isError ? "error" : "success";
    
    // Limpar a mensagem após 3 segundos
    setTimeout(() => {
        element.textContent = "";
    }, 3000);
}

function renderUsers() {
    const tbody = document.querySelector("#usersTable tbody");
    tbody.innerHTML = "";
    
    users.forEach(user => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${user.fullName}</td>
            <td>${user.id}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.isAdmin ? "Sim" : "Não"}</td>
            <td>
                <button class="remove-user" data-id="${user.id}">Remover</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    // Adicionar evento aos botões de remoção
    document.querySelectorAll(".remove-user").forEach(button => {
        button.addEventListener("click", function() {
            const userId = this.getAttribute("data-id");
            
            // Não permite remover o próprio usuário
            if (userId === currentUser.id) {
                showMessage("userMessage", "Não é possível remover o próprio usuário.", true);
                return;
            }
            
            // Remover usuário
            users = users.filter(user => user.id !== userId);
            renderUsers();
            updateDashboard();
            showMessage("userMessage", "Usuário removido com sucesso!");
        });
    });
    
    // Atualizar dashboard
    document.getElementById("totalUsers").textContent = users.length;
}

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
            <td>
                <button class="remove-product" data-id="${product.id}">Remover</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    // Adicionar evento aos botões de remoção
    document.querySelectorAll(".remove-product").forEach(button => {
        button.addEventListener("click", function() {
            const productId = this.getAttribute("data-id");
            
            // Remover produto
            products = products.filter(product => product.id !== productId);
            renderProducts();
            updateSaleProductOptions();
            updateDashboard();
            showMessage("productMessage", "Produto removido com sucesso!");
        });
    });
    
    // Atualizar dashboard
    document.getElementById("totalProducts").textContent = products.length;
    
    // Verificar estoque baixo
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
    
    // Atualizar preço unitário quando selecionado
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

function renderSales() {
    const tbody = document.querySelector("#salesTable tbody");
    tbody.innerHTML = "";
    
    // Ordenar vendas da mais recente para a mais antiga
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
    
    // Atualizar dashboard
    updateTodaySales();
}

function updateTodaySales() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaySales = sales
        .filter(sale => new Date(sale.date) >= today)
        .reduce((sum, sale) => sum + sale.total, 0);
    
    document.getElementById("todaySales").textContent = formatCurrency(todaySales);
}

function checkLowStock() {
    const lowStockAlert = document.getElementById("stockAlert");
    lowStockAlert.innerHTML = "";
    
    const lowStockProducts = products.filter(product => product.stock < 5);
    
    if (lowStockProducts.length > 0) {
        const alert = document.createElement("div");
        alert.className = "error";
        alert.innerHTML = "<h3>Alerta de Estoque Baixo</h3><ul>";
        
        lowStockProducts.forEach(product => {
            alert.innerHTML += `<li>${product.name}: ${product.stock} unidades</li>`;
        });
        
        alert.innerHTML += "</ul>";
        lowStockAlert.appendChild(alert);
    }
}

function updateDashboard() {
    document.getElementById("totalProducts").textContent = products.length;
    document.getElementById("totalUsers").textContent = users.length;
    updateTodaySales();
    checkLowStock();
}

// Navegação entre seções
document.querySelectorAll(".nav-btn").forEach(button => {
    button.addEventListener("click", function() {
        const sectionId = this.getAttribute("data-section");
        
        // Desativar todos os botões e seções
        document.querySelectorAll(".nav-btn").forEach(btn => {
            btn.classList.remove("active");
        });
        document.querySelectorAll(".section").forEach(section => {
            section.classList.remove("active");
        });
        
        // Ativar o botão e a seção selecionados
        this.classList.add("active");
        document.getElementById(sectionId).classList.add("active");
    });
});

// Login
document.getElementById("loginBtn").addEventListener("click", function() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    const user = users.find(u => u.id === username && u.password === password);
    
    if (user) {
        // Login bem-sucedido
        currentUser = user;
        document.getElementById("currentUser").textContent = user.fullName;
        
        // Mostrar o sistema principal
        document.getElementById("login").style.display = "none";
        document.getElementById("main").style.display = "block";
        
        // Ativar a seção Dashboard por padrão
        document.querySelector(".nav-btn[data-section='dashboard']").click();
        
        // Renderizar os dados iniciais
        renderUsers();
        renderProducts();
        updateSaleProductOptions();
        renderSales();
        updateDashboard();
    } else {
        // Login falhou
        showMessage("loginError", "Usuário ou senha incorretos.", true);
    }
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", function() {
    currentUser = null;
    document.getElementById("login").style.display = "block";
    document.getElementById("main").style.display = "none";
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
});

// Adicionar usuário
document.getElementById("addUserBtn").addEventListener("click", function() {
    const fullName = document.getElementById("newFullName").value;
    const id = document.getElementById("newUserId").value;
    const email = document.getElementById("newEmail").value;
    const phone = document.getElementById("newPhone").value;
    const password = document.getElementById("newUserPassword").value;
    const isAdmin = document.getElementById("isAdmin").value === "true";
    
    // Validação básica
    if (!fullName || !id || !email || !phone || !password) {
        showMessage("userMessage", "Preencha todos os campos.", true);
        return;
    }
    
    // Verificar se o ID já existe
    if (users.some(user => user.id === id)) {
        showMessage("userMessage", "ID de usuário já existe.", true);
        return;
    }
    
    // Adicionar usuário
    users.push({ fullName, id, email, phone, password, isAdmin });
    
    // Limpar formulário
    document.getElementById("newFullName").value = "";
    document.getElementById("newUserId").value = "";
    document.getElementById("newEmail").value = "";
    document.getElementById("newPhone").value = "";
    document.getElementById("newUserPassword").value = "";
    document.getElementById("isAdmin").value = "false";
    
    // Atualizar tabela
    renderUsers();
    showMessage("userMessage", "Usuário adicionado com sucesso!");
});

// Adicionar produto
document.getElementById("addProductBtn").addEventListener("click", function() {
    const name = document.getElementById("productName").value;
    const type = document.getElementById("productType").value;
    const price = parseFloat(document.getElementById("productPrice").value);
    const stock = parseInt(document.getElementById("productStock").value);
    
    // Validação básica
    if (!name || isNaN(price) || isNaN(stock)) {
        showMessage("productMessage", "Preencha todos os campos corretamente.", true);
        return;
    }
    
    // Gerar ID único
    const id = Date.now().toString();
    
    // Adicionar produto
    products.push({ id, name, type, price, stock });
    
    // Limpar formulário
    document.getElementById("productName").value = "";
    document.getElementById("productType").value = "bebida";
    document.getElementById("productPrice").value = "";
    document.getElementById("productStock").value = "";
    
    // Atualizar tabela
    renderProducts();
    updateSaleProductOptions();
    showMessage("productMessage", "Produto adicionado com sucesso!");
});

// Registrar venda
document.getElementById("makeSaleBtn").addEventListener("click", function() {
    const productId = document.getElementById("saleProduct").value;
    const quantity = parseInt(document.getElementById("saleQuantity").value) || 0;
    
    // Validação básica
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
    
    // Verificar estoque
    if (product.stock < quantity) {
        showMessage("saleMessage", `Estoque insuficiente. Disponível: ${product.stock}`, true);
        return;
    }
    
    // Calcular valores
    const unitPrice = product.price;
    const total = unitPrice * quantity;
    
    // Registrar venda
    sales.push({
        date: new Date(),
        productId,
        productName: product.name,
        quantity,
        unitPrice,
        total,
        seller: currentUser.fullName
    });
    
    // Atualizar estoque
    products[productIndex].stock -= quantity;
    
    // Limpar formulário
    document.getElementById("saleQuantity").value = "1";
    
    // Atualizar tabelas
    renderProducts();
    updateSaleProductOptions();
    renderSales();
    showMessage("saleMessage", "Venda registrada com sucesso!");
});

// Atualizar preço unitário quando selecionado
document.getElementById("saleProduct").addEventListener("change", updateUnitPrice);

// Atualizar preço total quando a quantidade muda
document.getElementById("saleQuantity").addEventListener("input", updateTotalPrice);

// Inicialização
document.addEventListener("DOMContentLoaded", function() {
    // Por padrão, mostrar a tela de login
    document.getElementById("login").style.display = "block";
    document.getElementById("main").style.display = "none";
});