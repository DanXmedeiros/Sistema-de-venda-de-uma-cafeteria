document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const cadastroUsuario = document.getElementById('cadastroUsuario');
    const cadastroProduto = document.getElementById('cadastroProduto');
  
    // LOGIN
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(loginForm));
        const res = await fetch('/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) window.location.href = '/dashboard';
        else alert('Login inválido');
      });
    }
  
    // CADASTRO USUÁRIO
    if (cadastroUsuario) {
      cadastroUsuario.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(cadastroUsuario));
        await fetch('/api/usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        location.reload();
      });
  
      fetch('/api/usuarios').then(res => res.json()).then(users => {
        const container = document.getElementById('usuarios');
        users.forEach(u => {
          const div = document.createElement('div');
          div.textContent = `${u.nome} (${u.email})`;
          const btn = document.createElement('button');
          btn.textContent = 'Remover';
          btn.onclick = () => {
            fetch(`/api/usuarios/${u.id}`, { method: 'DELETE' }).then(() => location.reload());
          };
          div.appendChild(btn);
          container.appendChild(div);
        });
      });
    }
  
    // CADASTRO PRODUTO
    if (cadastroProduto) {
      cadastroProduto.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(cadastroProduto));
        await fetch('/api/produtos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        location.reload();
      });
  
      fetch('/api/produtos').then(res => res.json()).then(produtos => {
        const container = document.getElementById('produtos');
        produtos.forEach(p => {
          const div = document.createElement('div');
          div.textContent = `${p.nome} - R$${p.preco}`;
          const btn = document.createElement('button');
          btn.textContent = 'Remover';
          btn.onclick = () => {
            fetch(`/api/produtos/${p.nome}`, { method: 'DELETE' }).then(() => location.reload());
          };
          div.appendChild(btn);
          container.appendChild(div);
        });
      });
    }
  
    // LOJA
    const loja = document.getElementById('listaProdutos');
    if (loja) {
      fetch('/api/produtos').then(res => res.json()).then(produtos => {
        produtos.forEach(p => {
          const div = document.createElement('div');
          div.innerHTML = `<strong>${p.nome}</strong> - R$${p.preco} <button>Comprar</button>`;
          div.querySelector('button').onclick = () => {
            fetch('/api/comprar', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(p)
            }).then(res => res.json()).then(alerta => alert(alerta.mensagem));
          };
          loja.appendChild(div);
        });
      });
    }
  });
  