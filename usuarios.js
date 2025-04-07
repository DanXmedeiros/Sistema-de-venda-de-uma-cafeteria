document.getElementById("addUserBtn").addEventListener("click", function () {
    const fullName = document.getElementById("newFullName").value;
    const id = document.getElementById("newUserId").value;
    const email = document.getElementById("newEmail").value;
    const phone = document.getElementById("newPhone").value;
    const password = document.getElementById("newUserPassword").value;
    const isAdmin = document.getElementById("isAdmin").value === "true";

    if (!fullName || !id || !email || !phone || !password) {
        showMessage("userMessage", "Preencha todos os campos.", true);
        return;
    }

    if (users.some(user => user.id === id)) {
        showMessage("userMessage", "ID de usuário já existe.", true);
        return;
    }

    users.push({ fullName, id, email, phone, password, isAdmin });

    document.getElementById("newFullName").value = "";
    document.getElementById("newUserId").value = "";
    document.getElementById("newEmail").value = "";
    document.getElementById("newPhone").value = "";
    document.getElementById("newUserPassword").value = "";
    document.getElementById("isAdmin").value = "false";

    renderUsers();
    showMessage("userMessage", "Usuário adicionado com sucesso!");
});

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
            <td><button class="remove-user" data-id="${user.id}">Remover</button></td>
        `;
        tbody.appendChild(tr);
    });

    document.querySelectorAll(".remove-user").forEach(button => {
        button.addEventListener("click", function () {
            const userId = this.getAttribute("data-id");

            if (userId === currentUser.id) {
                showMessage("userMessage", "Não é possível remover o próprio usuário.", true);
                return;
            }

            users = users.filter(user => user.id !== userId);
            renderUsers();
            updateDashboard();
            showMessage("userMessage", "Usuário removido com sucesso!");
        });
    });

    document.getElementById("totalUsers").textContent = users.length;
}
