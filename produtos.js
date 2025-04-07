function validateProductFields({ name, price, stock }) {
    return name && !isNaN(price) && !isNaN(stock);
  }
  
  function createProduct({ name, type, price, stock }) {
    return {
      id: Date.now().toString(),
      name,
      type,
      price,
      stock
    };
  }
  
  function translateType(type) {
    const types = {
      bebida: "Bebida",
      comida: "Comida",
      sobremesa: "Sobremesa"
    };
    return types[type] || type;
  }
  
  function formatCurrency(value) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }
  
  function renderProducts(products, dom, callbacks) {
    const { tbody, totalProducts, showMessage } = dom;
    const { onRemove, checkLowStock, updateDashboard, updateSaleProductOptions } = callbacks;
  
    tbody.innerHTML = "";
  
    products.forEach(product => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${product.name}</td>
        <td>${translateType(product.type)}</td>
        <td>${formatCurrency(product.price)}</td>
        <td>${product.stock}</td>
        <td><button class="remove-product" data-id="${product.id}">Remover</button></td>
      `;
      tbody.appendChild(tr);
    });
  
    document.querySelectorAll(".remove-product").forEach(button => {
      button.addEventListener("click", function () {
        const productId = this.getAttribute("data-id");
        const index = products.findIndex(p => p.id === productId);
        if (index !== -1) {
          products.splice(index, 1);
          renderProducts(products, dom, callbacks);
          updateSaleProductOptions();
          updateDashboard();
          showMessage("productMessage", "Produto removido com sucesso!");
          onRemove?.(productId);
        }
      });
    });
  
    totalProducts.textContent = products.length;
    checkLowStock();
  }
  
  module.exports = {
    validateProductFields,
    createProduct,
    renderProducts,
    translateType,
    formatCurrency
  };
  