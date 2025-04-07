// login.js

const users = [
  { id: "admin", password: "1234", fullName: "Administrador" },
  { id: "joao", password: "abcd", fullName: "João Silva" },
];

function authenticate(username, password) {
  return users.find(u => u.id === username && u.password === password) || null;
}

function handleLogin(usernameInput, passwordInput, showMessage, redirect) {
  const username = usernameInput.value;
  const password = passwordInput.value;

  const user = authenticate(username, password);
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    redirect("dashboard.html");
  } else {
    showMessage("loginError", "Usuário ou senha incorretos.", true);
  }
}

// Evento real de DOM
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", function () {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    handleLogin(
      usernameInput,
      passwordInput,
      (id, msg, err) => showMessage(id, msg, err), // função externa do HTML
      (url) => window.location.href = url
    );
  });
}

module.exports = { authenticate, handleLogin };
