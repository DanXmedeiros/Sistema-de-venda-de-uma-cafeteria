describe("Registro de venda (makeSaleBtn)", () => {
    let makeSaleBtn, saleProduct, saleQuantity, saleMessage;
  
    beforeEach(() => {
      document.body.innerHTML = `
        <select id="saleProduct">
          <option value="p1">Produto</option>
        </select>
        <input id="saleQuantity" value="1" />
        <div id="saleMessage"></div>
      `;
  
      makeSaleBtn = document.createElement("button");
      makeSaleBtn.id = "makeSaleBtn";
      document.body.appendChild(makeSaleBtn);
  
      saleProduct = document.getElementById("saleProduct");
      saleQuantity = document.getElementById("saleQuantity");
      saleMessage = document.getElementById("saleMessage");
  
      products = [{ id: "p1", name: "Café", price: 10, stock: 5 }];
      sales = [];
      currentUser = { fullName: "Admin" };
  
      showMessage = jest.fn((id, msg) => {
        document.getElementById(id).textContent = msg;
      });
  
      renderProducts = jest.fn();
      updateSaleProductOptions = jest.fn();
      renderSales = jest.fn();
  
      require("../vendas.js"); 
    });
  
    it("registra a venda com sucesso", () => {
      makeSaleBtn.click();
  
      expect(sales.length).toBe(1);
      expect(sales[0].productName).toBe("Café");
      expect(sales[0].quantity).toBe(1);
      expect(sales[0].total).toBe(10);
      expect(products[0].stock).toBe(4);
      expect(showMessage).toHaveBeenCalledWith("saleMessage", "Venda registrada com sucesso!");
    });
  
    it("mostra erro se produto não for selecionado", () => {
      saleProduct.value = "";
      makeSaleBtn.click();
      expect(showMessage).toHaveBeenCalledWith("saleMessage", "Selecione um produto e uma quantidade válida.", true);
    });
  
    it("mostra erro se quantidade inválida", () => {
      saleQuantity.value = "0";
      makeSaleBtn.click();
      expect(showMessage).toHaveBeenCalledWith("saleMessage", "Selecione um produto e uma quantidade válida.", true);
    });
  
    it("mostra erro se produto não existir", () => {
      saleProduct.value = "p2";
      makeSaleBtn.click();
      expect(showMessage).toHaveBeenCalledWith("saleMessage", "Produto não encontrado.", true);
    });
  
    it("mostra erro se estoque for insuficiente", () => {
      saleProduct.value = "p1";
      saleQuantity.value = "10";
      makeSaleBtn.click();
      expect(showMessage).toHaveBeenCalledWith("saleMessage", "Estoque insuficiente. Disponível: 5", true);
    });
  });
  