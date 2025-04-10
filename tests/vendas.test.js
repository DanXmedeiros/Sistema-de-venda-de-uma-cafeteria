//Autor: João Victor Rocha Carvalho
// Data: 31/03/2025
//Descrição: 
// Testes automatizados para validar o comportamento do botão de registro de venda (makeSaleBtn).
// Os testes verificam:
// 1. Registro correto de uma venda com atualização de estoque.
// 2. Exibição de erro ao não selecionar um produto.
// 3. Exibição de erro ao informar uma quantidade inválida (zero ou negativa).
// 4. Exibição de erro se o produto selecionado não existir na lista de produtos.
// 5. Exibição de erro se a quantidade solicitada exceder o estoque disponível.

// Descreve o grupo de testes para o botão de registro de venda
describe("Registro de venda (makeSaleBtn)", () => {
    let makeSaleBtn, saleProduct, saleQuantity, saleMessage;

    // Antes de cada teste, configura o ambiente de teste
    beforeEach(() => {
        // Cria o HTML básico necessário para o teste
        document.body.innerHTML = `
            <select id="saleProduct">
                <option value="p1">Produto</option>
            </select>
            <input id="saleQuantity" value="1" />
            <div id="saleMessage"></div>
        `;

        // Cria e adiciona o botão de venda
        makeSaleBtn = document.createElement("button");
        makeSaleBtn.id = "makeSaleBtn";
        document.body.appendChild(makeSaleBtn);

        // Referencia os elementos do DOM criados
        saleProduct = document.getElementById("saleProduct");
        saleQuantity = document.getElementById("saleQuantity");
        saleMessage = document.getElementById("saleMessage");

        // Inicializa os dados do produto e usuário
        products = [{ id: "p1", name: "Café", price: 10, stock: 5 }];
        sales = [];
        currentUser = { fullName: "Admin" };

        // Simula a função showMessage para capturar mensagens
        showMessage = jest.fn((id, msg) => {
            document.getElementById(id).textContent = msg;
        });

        // Simula as funções auxiliares chamadas após a venda
        renderProducts = jest.fn();
        updateSaleProductOptions = jest.fn();
        renderSales = jest.fn();

        // Importa o código real onde o botão é tratado
        require("../vendas.js");
    });

    // Teste para verificar se a venda é registrada corretamente
    it("registra a venda com sucesso", () => {
        makeSaleBtn.click(); // Simula o clique no botão

        // Verifica se a venda foi adicionada corretamente
        expect(sales.length).toBe(1);
        expect(sales[0].productName).toBe("Café");
        expect(sales[0].quantity).toBe(1);
        expect(sales[0].total).toBe(10);
        expect(products[0].stock).toBe(4); // Verifica se o estoque foi atualizado

        // Verifica se a mensagem de sucesso foi mostrada
        expect(showMessage).toHaveBeenCalledWith("saleMessage", "Venda registrada com sucesso!");
    });

    // Teste quando nenhum produto é selecionado
    it("mostra erro se produto não for selecionado", () => {
        saleProduct.value = ""; // Simula nenhum valor selecionado
        makeSaleBtn.click();

        // Verifica se a mensagem de erro foi mostrada
        expect(showMessage).toHaveBeenCalledWith("saleMessage", "Selecione um produto e uma quantidade válida.", true);
    });

    // Teste quando a quantidade é inválida (zero ou negativa)
    it("mostra erro se quantidade inválida", () => {
        saleQuantity.value = "0"; // Simula valor inválido
        makeSaleBtn.click();

        expect(showMessage).toHaveBeenCalledWith("saleMessage", "Selecione um produto e uma quantidade válida.", true);
    });

    // Teste quando o produto não é encontrado no array `products`
    it("mostra erro se produto não existir", () => {
        saleProduct.value = "p2"; // ID que não existe
        makeSaleBtn.click();

        expect(showMessage).toHaveBeenCalledWith("saleMessage", "Produto não encontrado.", true);
    });

    // Teste quando a quantidade solicitada excede o estoque
    it("mostra erro se estoque for insuficiente", () => {
        saleProduct.value = "p1";
        saleQuantity.value = "10"; // Mais do que o estoque disponível (5)

        makeSaleBtn.click();

        expect(showMessage).toHaveBeenCalledWith("saleMessage", "Estoque insuficiente. Disponível: 5", true);
    });
});
