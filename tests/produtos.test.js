const {
    validateProductFields,
    createProduct,
    translateType,
    formatCurrency
  } = require("../produtos.js");
  
  describe("Product Manager", () => {
  
    test("validateProductFields - válido", () => {
      const product = { name: "Café", price: 10.5, stock: 3 };
      expect(validateProductFields(product)).toBe(true);
    });
  
    test("validateProductFields - inválido", () => {
      const product = { name: "", price: NaN, stock: NaN };
      expect(validateProductFields(product)).toBe(false);
    });
  
    test("createProduct - gera ID e mantém dados", () => {
      const data = { name: "Bolo", type: "comida", price: 8.0, stock: 5 };
      const product = createProduct(data);
  
      expect(product).toMatchObject(data);
      expect(product).toHaveProperty("id");
    });
  
    test("translateType - retorna nome traduzido", () => {
      expect(translateType("bebida")).toBe("Bebida");
      expect(translateType("comida")).toBe("Comida");
      expect(translateType("sobremesa")).toBe("Sobremesa");
      expect(translateType("outro")).toBe("outro");
    });
  
    test("formatCurrency - formata valor em R$", () => {
      const formatted = formatCurrency(12.5);
      expect(formatted).toBe("R$ 12,50");
    });
  
  });
  