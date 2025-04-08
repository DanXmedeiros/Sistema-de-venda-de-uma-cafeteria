/*
Autor: Isaías Peres
Data: 01/04/2025
Descrição: Testes unitários para funções do módulo de produtos. 
Inclui testes de validação de campos, criação de produto com ID, tradução de tipos de produto 
e formatação de valores monetários.
*/


const {
  validateProductFields,
  createProduct,
  translateType,
  formatCurrency
} = require("../produtos.js");

describe("Product Manager", () => {
  
  // Testa se a função retorna true quando os campos do produto são válidos
  test("validateProductFields - válido", () => {
    const product = { name: "Café", price: 10.5, stock: 3 };
    expect(validateProductFields(product)).toBe(true);
  });

  // Testa se a função retorna false quando os campos do produto são inválidos
  test("validateProductFields - inválido", () => {
    const product = { name: "", price: NaN, stock: NaN };
    expect(validateProductFields(product)).toBe(false);
  });

  // Verifica se a função createProduct gera corretamente um ID
  // e mantém os dados fornecidos no novo produto criado
  test("createProduct - gera ID e mantém dados", () => {
    const data = { name: "Bolo", type: "comida", price: 8.0, stock: 5 };
    const product = createProduct(data);

    expect(product).toMatchObject(data); // Verifica se os dados permanecem
    expect(product).toHaveProperty("id"); // Verifica se o ID foi gerado
  });

  // Testa se a função translateType retorna corretamente os nomes traduzidos
  test("translateType - retorna nome traduzido", () => {
    expect(translateType("bebida")).toBe("Bebida");
    expect(translateType("comida")).toBe("Comida");
    expect(translateType("sobremesa")).toBe("Sobremesa");
    expect(translateType("outro")).toBe("outro"); 
  });

  // Testa a formatação correta do valor monetário no padrão
  test("formatCurrency - formata valor em R$", () => {
    const formatted = formatCurrency(12.5);
    expect(formatted).toBe("R$ 12,50");
  });

});


