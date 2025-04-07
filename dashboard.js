const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
  // Redireciona para login se não estiver logado
  window.location.href = "index.html";
} else {
  document.getElementById("currentUser").textContent = currentUser.fullName;
}

// Simulação temporária (substitua pelos dados reais ou recupere do localStorage/database)
const products = JSON.parse(localStorage.getItem("products")) || [
    { name: "Café Expresso", stock: 3 },
    { name: "Cappuccino", stock: 7 },
    { name: "Bolo de Cenoura", stock: 2 }
  ];
  
  const users = JSON.parse(localStorage.getItem("users")) || [
    { id: "admin", password: "123", fullName: "Administrador" },
    { id: "joao", password: "321", fullName: "João Silva" }
  ];
  
  const sales = JSON.parse(localStorage.getItem("sales")) || [
    { date: new Date().toISOString(), total: 25.50 },
    { date: new Date().toISOString(), total: 40.00 }
  ];
  
  // Utilidade: formata como R$
  function formatCurrency(value) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }
  
  // Atualiza dados da dashboard
  function updateDashboard() {
    document.getElementById("totalProducts").textContent = products.length;
    document.getElementById("totalUsers").textContent = users.length;
    updateTodaySales();
    checkLowStock();
  }
  
  // Total de vendas de hoje
  function updateTodaySales() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const todaySales = sales
      .filter(sale => new Date(sale.date) >= today)
      .reduce((sum, sale) => sum + sale.total, 0);
  
    document.getElementById("todaySales").textContent = formatCurrency(todaySales);
  }
  
  // Checa estoque baixo
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

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("currentUser");
      window.location.href = "index.html";
    });
  }
  
  
  // Chamada principal
  updateDashboard();
  