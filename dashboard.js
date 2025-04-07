import {
    checkAuth,
    getDataFromStorage,
    updateDashboardElements,
    logout
  } from "./dashboard.js";
  
  // Verifica autenticação e atualiza o nome do usuário logado
  const currentUser = checkAuth((url) => {
    window.location.href = url;
  });
  
  if (currentUser) {
    document.getElementById("currentUser").textContent = currentUser.fullName;
  }
  
  // Recupera os dados do localStorage ou usa mock
  const products = getDataFromStorage("products", [
    { name: "Café Expresso", stock: 3 },
    { name: "Cappuccino", stock: 7 },
    { name: "Bolo de Cenoura", stock: 2 }
  ]);
  
  const users = getDataFromStorage("users", [
    { id: "admin", password: "123", fullName: "Administrador" },
    { id: "joao", password: "321", fullName: "João Silva" }
  ]);
  
  const sales = getDataFromStorage("sales", [
    { date: new Date().toISOString(), total: 25.50 },
    { date: new Date().toISOString(), total: 40.00 }
  ]);
  
  // Elementos DOM usados na dashboard
  const dom = {
    totalProducts: document.getElementById("totalProducts"),
    totalUsers: document.getElementById("totalUsers"),
    todaySales: document.getElementById("todaySales"),
    stockAlert: document.getElementById("stockAlert")
  };
  
  // Atualiza os elementos da dashboard
  updateDashboardElements({ products, users, sales }, dom);
  
  // Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => logout((url) => {
      window.location.href = url;
    }));
  }
  