//#Daniel Xavier
//Comentado em 31/03/2025 às 09:18
//Define o ambiente do Jest como jsdom, permitindo testes que envolvem manipulação do DOM como se fosse em um navegador.
/**
 * @jest-environment jsdom
 */

//#Daniel Xavier
//Importa funções do módulo dashboard.js para serem testadas.
const {
    formatCurrency,
    getDataFromStorage,
    checkAuth,
    updateDashboardElements,
    logout
  } = require('../dashboard');

//#Daniel Xavier
//Agrupa todos os testes relacionados às funções utilitárias do dashboard.
//Comentado em 31/03/2025 às 09:18
  describe("Dashboard - funções utilitárias", () => {
      //#Daniel Xavier
      //Limpa o localStorage antes de cada teste, garantindo que os testes não se influenciem entre si.
      //Comentado em 31/03/2025 às 09:18
    beforeEach(() => {
      localStorage.clear();
    });

      //#Daniel Xavier
      //Verifica se a função formata um número como moeda brasileira corretamente.
      //Comentado em 31/03/2025 às 09:18
    test("Formata número em moeda BRL", () => {
      expect(formatCurrency(123.45)).toBe("R$ 123,45");
    });

      //#Daniel Xavier
      //Comentado em 03/04/2025 às 13:15
     //Testa se a função:
      //-Retorna um valor padrão (fallback) se a chave não existir.
    test("getDataFromStorage retorna dados ou fallback", () => {
      expect(getDataFromStorage("inexistente", [1])).toEqual([1]);

        //#Daniel Xavier
        //Comentado em 01/04/2025 às 14:20
        //-Retorna os dados salvos no localStorage se existirem.
      localStorage.setItem("teste", JSON.stringify([2]));
      expect(getDataFromStorage("teste", [])).toEqual([2]);
    });

      //#Daniel Xavier
      //Comentado em 01/04/2025 às 15:05
      //Verifica se a função redireciona para "index.html" se não houver usuário logado.
    test("checkAuth redireciona se não logado", () => {
      const mockRedirect = jest.fn();
      checkAuth(mockRedirect);
      expect(mockRedirect).toHaveBeenCalledWith("index.html");
    });

      //#Daniel Xavier
      //Comentado em 01/04/2025 às 15:30
      //Verifica se a função retorna o usuário logado corretamente quando presente no localStorage.
    test("checkAuth retorna user se logado", () => {
      const user = { id: "admin", fullName: "Admin" };
      localStorage.setItem("currentUser", JSON.stringify(user));
      const result = checkAuth(() => {});
      expect(result).toEqual(user);
    });

      //#Daniel Xavier
       //Comentado em 02/04/2025 às 14:15
      //Garante que a função:
      //Atualiza os elementos do DOM com os dados de produtos, usuários e vendas.
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

        //#Daniel Xavier
        //Comentado em 02/04/2025 às 14:48
        //Soma corretamente as vendas do dia.
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

        //#Daniel Xavier
        //Comentado em 02/04/2025 às 15:10
        //Exibe alerta de estoque baixo para produtos com quantidade inferior a um limite (ex: < 5).
      updateDashboardElements(data, dom);
  
      expect(dom.totalProducts.textContent).toBe("2");
      expect(dom.totalUsers.textContent).toBe("2");
      expect(dom.todaySales.textContent).toBe("R$ 30,00");
      expect(dom.stockAlert.innerHTML).toContain("Alerta de Estoque Baixo");
      expect(dom.stockAlert.innerHTML).toContain("Café");
    });

      //#Daniel Xavier
      //Testa se a função:
      //Remove o usuário atual do localStorage.
       //Comentado em 02/04/2025 às 17:30
    test("logout remove usuário e redireciona", () => {
      const mockRedirect = jest.fn();
      localStorage.setItem("currentUser", JSON.stringify({ id: "admin" }));
  
      logout(mockRedirect);

        //#Daniel Xavier
         //Comentado em 02/04/2025 às 17:55
        //Redireciona para "index.html".
      expect(localStorage.getItem("currentUser")).toBe(null);
      expect(mockRedirect).toHaveBeenCalledWith("index.html");
    });
  });
  
