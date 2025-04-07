/**
 * @jest-environment jsdom
 */
const {
    formatCurrency,
    getDataFromStorage,
    checkAuth,
    updateDashboardElements,
    logout
  } = require('../dashboard');
  
  describe("Dashboard - funções utilitárias", () => {
    beforeEach(() => {
      localStorage.clear();
    });
  
    test("Formata número em moeda BRL", () => {
      expect(formatCurrency(123.45)).toBe("R$ 123,45");
    });
  
    test("getDataFromStorage retorna dados ou fallback", () => {
      expect(getDataFromStorage("inexistente", [1])).toEqual([1]);
      localStorage.setItem("teste", JSON.stringify([2]));
      expect(getDataFromStorage("teste", [])).toEqual([2]);
    });
  
    test("checkAuth redireciona se não logado", () => {
      const mockRedirect = jest.fn();
      checkAuth(mockRedirect);
      expect(mockRedirect).toHaveBeenCalledWith("index.html");
    });
  
    test("checkAuth retorna user se logado", () => {
      const user = { id: "admin", fullName: "Admin" };
      localStorage.setItem("currentUser", JSON.stringify(user));
      const result = checkAuth(() => {});
      expect(result).toEqual(user);
    });
  
    test("updateDashboardElements atualiza corretamente o DOM", () => {
      document.body.innerHTML = `
        <span id="totalProducts"></span>
        <span id="totalUsers"></span>
        <span id="todaySales"></span>
        <div id="stockAlert"></div>
      `;
  
      const dom = {
        totalProducts: document.getElementById("totalProducts"),
        totalUsers: document.getElementById("totalUsers"),
        todaySales: document.getElementById("todaySales"),
        stockAlert: document.getElementById("stockAlert")
      };
  
      const data = {
        products: [
          { name: "Café", stock: 2 },
          { name: "Capuccino", stock: 6 }
        ],
        users: [{}, {}],
        sales: [
          { date: new Date().toISOString(), total: 10 },
          { date: new Date().toISOString(), total: 20 }
        ]
      };
  
      updateDashboardElements(data, dom);
  
      expect(dom.totalProducts.textContent).toBe("2");
      expect(dom.totalUsers.textContent).toBe("2");
      expect(dom.todaySales.textContent).toBe("R$ 30,00");
      expect(dom.stockAlert.innerHTML).toContain("Alerta de Estoque Baixo");
      expect(dom.stockAlert.innerHTML).toContain("Café");
    });
  
    test("logout remove usuário e redireciona", () => {
      const mockRedirect = jest.fn();
      localStorage.setItem("currentUser", JSON.stringify({ id: "admin" }));
  
      logout(mockRedirect);
  
      expect(localStorage.getItem("currentUser")).toBe(null);
      expect(mockRedirect).toHaveBeenCalledWith("index.html");
    });
  });
  