// Importações necessárias (supondo que o código principal esteja em um arquivo chamado cafeteria.js)
// Nota: Para executar estes testes, você precisará configurar Jest e possivelmente adaptar o código 
// para suportar testes (como exportar as funções e variáveis)

const {
    users,
    products,
    sales,
    formatCurrency,
    showMessage,
    renderUsers,
    renderProducts,
    translateType,
    updateSaleProductOptions,
    updateUnitPrice,
    updateTotalPrice,
    renderSales,
    updateTodaySales,
    checkLowStock,
    updateDashboard
  } = require('./cafeteria.js');
  
  // Mock do DOM para testes
  document.body.innerHTML = `
    <div id="login"></div>
    <div id="main"></div>
    <div id="userMessage"></div>
    <div id="productMessage"></div>
    <div id="saleMessage"></div>
    <div id="loginError"></div>
    <div id="totalUsers"></div>
    <div id="totalProducts"></div>
    <div id="todaySales"></div>
    <div id="stockAlert"></div>
    <div id="unitPrice"></div>
    <div id="totalPrice"></div>
    <table id="usersTable"><tbody></tbody></table>
    <table id="productsTable"><tbody></tbody></table>
    <table id="salesTable"><tbody></tbody></table>
    <select id="saleProduct"></select>
    <input id="saleQuantity" value="1">
  `;
  
  // Testes para autenticação
  describe('Testes de Autenticação', () => {
    beforeEach(() => {
      // Resetar estado
      currentUser = null;
      // Configurar elementos do DOM para login
      document.body.innerHTML += `
        <input id="username" value="">
        <input id="password" value="">
        <button id="loginBtn"></button>
      `;
    });
  
    test('Login com credenciais válidas', () => {
      // Configurar
      document.getElementById('username').value = 'admin';
      document.getElementById('password').value = 'admin123';
      
      // Executar
      document.getElementById('loginBtn').click();
      
      // Verificar
      expect(currentUser).not.toBeNull();
      expect(currentUser.id).toBe('admin');
      expect(document.getElementById('login').style.display).toBe('none');
      expect(document.getElementById('main').style.display).toBe('block');
    });
  
    test('Login com credenciais inválidas', () => {
      // Configurar
      document.getElementById('username').value = 'admin';
      document.getElementById('password').value = 'senha_errada';
      
      // Executar
      document.getElementById('loginBtn').click();
      
      // Verificar
      expect(currentUser).toBeNull();
      expect(document.getElementById('loginError').textContent).toBe('Usuário ou senha incorretos.');
    });
  
    test('Logout', () => {
      // Configurar - primeiro fazer login
      currentUser = { id: 'admin', fullName: 'Administrador' };
      document.getElementById('login').style.display = 'none';
      document.getElementById('main').style.display = 'block';
      
      // Executar
      document.getElementById('logoutBtn').click();
      
      // Verificar
      expect(currentUser).toBeNull();
      expect(document.getElementById('login').style.display).toBe('block');
      expect(document.getElementById('main').style.display).toBe('none');
    });
  });
  
  // Testes para gerenciamento de usuários
  describe('Testes de Gerenciamento de Usuários', () => {
    beforeEach(() => {
      // Resetar usuários para estado inicial
      users.length = 0;
      users.push({ 
        fullName: "Administrador", 
        id: "admin", 
        email: "admin@cafeteria.com", 
        phone: "(00) 00000-0000", 
        password: "admin123", 
        isAdmin: true 
      });
      
      // Configurar elementos do DOM
      document.body.innerHTML += `
        <input id="newFullName" value="">
        <input id="newUserId" value="">
        <input id="newEmail" value="">
        <input id="newPhone" value="">
        <input id="newUserPassword" value="">
        <select id="isAdmin"><option value="false">Não</option><option value="true">Sim</option></select>
        <button id="addUserBtn"></button>
      `;
      
      // Configurar usuário atual
      currentUser = { id: 'admin', fullName: 'Administrador' };
    });
  
    test('Adicionar usuário com dados válidos', () => {
      // Configurar
      document.getElementById('newFullName').value = 'João Silva';
      document.getElementById('newUserId').value = 'joao';
      document.getElementById('newEmail').value = 'joao@example.com';
      document.getElementById('newPhone').value = '(11) 12345-6789';
      document.getElementById('newUserPassword').value = 'senha123';
      document.getElementById('isAdmin').value = 'false';
      
      // Executar
      document.getElementById('addUserBtn').click();
      
      // Verificar
      expect(users.length).toBe(2);
      expect(users[1].fullName).toBe('João Silva');
      expect(users[1].id).toBe('joao');
      expect(document.getElementById('userMessage').textContent).toBe('Usuário adicionado com sucesso!');
    });
  
    test('Adicionar usuário com ID duplicado', () => {
      // Configurar
      document.getElementById('newFullName').value = 'Outro Admin';
      document.getElementById('newUserId').value = 'admin'; // ID duplicado
      document.getElementById('newEmail').value = 'outro@example.com';
      document.getElementById('newPhone').value = '(22) 12345-6789';
      document.getElementById('newUserPassword').value = 'outrasenha';
      
      // Executar
      document.getElementById('addUserBtn').click();
      
      // Verificar
      expect(users.length).toBe(1); // Não deve adicionar
      expect(document.getElementById('userMessage').textContent).toBe('ID de usuário já existe.');
    });
  
    test('Remover usuário', () => {
      // Configurar - adicionar um usuário para então remover
      users.push({ 
        fullName: "João Silva", 
        id: "joao", 
        email: "joao@example.com", 
        phone: "(11) 12345-6789", 
        password: "senha123", 
        isAdmin: false 
      });
      
      // Simular renderização e botão de remoção
      renderUsers();
      
      // Executar - simular clique no botão de remoção
      document.querySelector(".remove-user[data-id='joao']").click();
      
      // Verificar
      expect(users.length).toBe(1);
      expect(users[0].id).toBe('admin');
      expect(document.getElementById('userMessage').textContent).toBe('Usuário removido com sucesso!');
    });
  
    test('Não deve permitir remover o próprio usuário', () => {
      // Simular renderização e botão de remoção
      renderUsers();
      
      // Executar - tentar remover o próprio usuário (admin)
      document.querySelector(".remove-user[data-id='admin']").click();
      
      // Verificar
      expect(users.length).toBe(1); // Usuário não deve ser removido
      expect(document.getElementById('userMessage').textContent).toBe('Não é possível remover o próprio usuário.');
    });
  });
  
  // Testes para gerenciamento de produtos
  describe('Testes de Gerenciamento de Produtos', () => {
    beforeEach(() => {
      // Resetar produtos
      products.length = 0;
      
      // Configurar elementos do DOM
      document.body.innerHTML += `
        <input id="productName" value="">
        <select id="productType">
          <option value="bebida">Bebida</option>
          <option value="comida">Comida</option>
          <option value="sobremesa">Sobremesa</option>
        </select>
        <input id="productPrice" value="">
        <input id="productStock" value="">
        <button id="addProductBtn"></button>
      `;
    });
  
    test('Adicionar produto', () => {
      // Configurar
      document.getElementById('productName').value = 'Café Expresso';
      document.getElementById('productType').value = 'bebida';
      document.getElementById('productPrice').value = '5.50';
      document.getElementById('productStock').value = '100';
      
      // Mock para Date.now()
      const originalDateNow = Date.now;
      Date.now = jest.fn(() => 1234567890);
      
      // Executar
      document.getElementById('addProductBtn').click();
      
      // Restaurar Date.now
      Date.now = originalDateNow;
      
      // Verificar
      expect(products.length).toBe(1);
      expect(products[0].name).toBe('Café Expresso');
      expect(products[0].price).toBe(5.5);
      expect(products[0].stock).toBe(100);
      expect(document.getElementById('productMessage').textContent).toBe('Produto adicionado com sucesso!');
    });
  
    test('Remover produto', () => {
      // Configurar - adicionar produto para então remover
      products.push({ 
        id: '1234567890', 
        name: 'Café Expresso', 
        type: 'bebida', 
        price: 5.5, 
        stock: 100 
      });
      
      // Simular renderização
      renderProducts();
      
      // Executar - simular clique no botão de remoção
      document.querySelector(".remove-product[data-id='1234567890']").click();
      
      // Verificar
      expect(products.length).toBe(0);
      expect(document.getElementById('productMessage').textContent).toBe('Produto removido com sucesso!');
    });
  
    test('Função translateType', () => {
      expect(translateType('bebida')).toBe('Bebida');
      expect(translateType('comida')).toBe('Comida');
      expect(translateType('sobremesa')).toBe('Sobremesa');
      expect(translateType('outro')).toBe('outro'); // Caso não mapeado
    });
  
    test('Função formatCurrency', () => {
      expect(formatCurrency(10)).toBe('10.00');
      expect(formatCurrency(10.5)).toBe('10.50');
      expect(formatCurrency(10.55)).toBe('10.55');
      expect(formatCurrency(10.555)).toBe('10.56'); // Arredondamento
      expect(formatCurrency('10.5')).toBe('10.50'); // String numérica
    });
  });
  
  // Testes para vendas
  describe('Testes de Vendas', () => {
    beforeEach(() => {
      // Resetar produtos e vendas
      products.length = 0;
      sales.length = 0;
      
      // Adicionar produto para testes
      products.push({ 
        id: 'cafe', 
        name: 'Café Expresso', 
        type: 'bebida', 
        price: 5.5, 
        stock: 10 
      });
      
      // Configurar usuário atual
      currentUser = { id: 'admin', fullName: 'Administrador' };
      
      // Configurar elementos do DOM
      document.getElementById('saleProduct').innerHTML = `<option value="cafe">Café Expresso - R$ 5.50 (10 em estoque)</option>`;
      document.getElementById('saleQuantity').value = '2';
      document.getElementById('unitPrice').textContent = '5.50';
      document.getElementById('totalPrice').textContent = '11.00';
    });
  
    test('Registrar venda com quantidade válida', () => {
      // Executar
      document.getElementById('makeSaleBtn').click();
      
      // Verificar
      expect(sales.length).toBe(1);
      expect(sales[0].productName).toBe('Café Expresso');
      expect(sales[0].quantity).toBe(2);
      expect(sales[0].total).toBe(11);
      expect(products[0].stock).toBe(8); // Estoque atualizado
      expect(document.getElementById('saleMessage').textContent).toBe('Venda registrada com sucesso!');
    });
  
    test('Tentar venda com estoque insuficiente', () => {
      // Configurar - quantidade maior que o estoque
      document.getElementById('saleQuantity').value = '15';
      
      // Executar
      document.getElementById('makeSaleBtn').click();
      
      // Verificar
      expect(sales.length).toBe(0); // Não deve registrar venda
      expect(products[0].stock).toBe(10); // Estoque mantido
      expect(document.getElementById('saleMessage').textContent).toBe('Estoque insuficiente. Disponível: 10');
    });
  
    test('Cálculo de preço total', () => {
      // Simular eventos de entrada
      document.getElementById('saleQuantity').value = '3';
      
      // Executar
      updateTotalPrice();
      
      // Verificar
      expect(document.getElementById('totalPrice').textContent).toBe('16.50');
    });
  
    test('Atualização de estoque após venda', () => {
      // Executar venda
      document.getElementById('makeSaleBtn').click();
      
      // Verificar estoque
      expect(products[0].stock).toBe(8);
      
      // Executar outra venda
      document.getElementById('makeSaleBtn').click();
      
      // Verificar estoque novamente
      expect(products[0].stock).toBe(6);
    });
  });
  
  // Testes para dashboard e relatórios
  describe('Testes de Dashboard e Relatórios', () => {
    beforeEach(() => {
      // Resetar produtos e vendas
      products.length = 0;
      sales.length = 0;
      
      // Adicionar produtos
      products.push({ 
        id: 'cafe', 
        name: 'Café Expresso', 
        type: 'bebida', 
        price: 5.5, 
        stock: 10 
      });
      
      products.push({ 
        id: 'pao', 
        name: 'Pão de Queijo', 
        type: 'comida', 
        price: 4.0, 
        stock: 3 // Estoque baixo
      });
    });
  
    test('Verificação de produtos com estoque baixo', () => {
      // Executar
      checkLowStock();
      
      // Verificar - deve detectar o produto com estoque < 5
      const alert = document.getElementById('stockAlert').querySelector('.error');
      expect(alert).not.toBeNull();
      expect(alert.innerHTML).toContain('Pão de Queijo: 3 unidades');
    });
  
    test('Cálculo de vendas do dia', () => {
      // Configurar - adicionar vendas de hoje
      const today = new Date();
      
      sales.push({
        date: today,
        productId: 'cafe',
        productName: 'Café Expresso',
        quantity: 2,
        unitPrice: 5.5,
        total: 11,
        seller: 'Administrador'
      });
      
      sales.push({
        date: today,
        productId: 'pao',
        productName: 'Pão de Queijo',
        quantity: 3,
        unitPrice: 4,
        total: 12,
        seller: 'Administrador'
      });
      
      // Adicionar venda de ontem (não deve contar)
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      sales.push({
        date: yesterday,
        productId: 'cafe',
        productName: 'Café Expresso',
        quantity: 1,
        unitPrice: 5.5,
        total: 5.5,
        seller: 'Administrador'
      });
      
      // Executar
      updateTodaySales();
      
      // Verificar - soma deve ser 11 + 12 = 23
      expect(document.getElementById('todaySales').textContent).toBe('23.00');
    });
  
    test('Atualização completa do dashboard', () => {
      // Configurar - adicionar venda
      sales.push({
        date: new Date(),
        productId: 'cafe',
        productName: 'Café Expresso',
        quantity: 2,
        unitPrice: 5.5,
        total: 11,
        seller: 'Administrador'
      });
      
      // Executar
      updateDashboard();
      
      // Verificar
      expect(document.getElementById('totalProducts').textContent).toBe('2');
      expect(document.getElementById('todaySales').textContent).toBe('11.00');
      
      // Verificar alerta de estoque
      const alert = document.getElementById('stockAlert').querySelector('.error');
      expect(alert).not.toBeNull();
      expect(alert.innerHTML).toContain('Pão de Queijo: 3 unidades');
    });
  });