// Lista simulada de usuários (pode adaptar ou buscar de um backend futuramente)
const users = [
    { id: "admin", password: "1234", fullName: "Administrador" },
    { id: "joao", password: "abcd", fullName: "João Silva" },
  ];
  
  // LOGIN
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", function () {
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
  
      const user = users.find(u => u.id === username && u.password === password);
  
      if (user) {
        // Salva o usuário logado no localStorage
        localStorage.setItem("currentUser", JSON.stringify(user));
  
        // Redireciona para o dashboard
        window.location.href = "dashboard.html";
      } else {
        showMessage("loginError", "Usuário ou senha incorretos.", true);
      }
    });
  }
  

  