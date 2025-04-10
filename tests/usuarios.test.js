//#Daniel Xavier
//Testes criados entre 20/03/2025 e 25/03/2025
//Importa funções relacionadas à gestão de usuários para serem testadas.

 * @jest-environment jsdom

//Comentado em 20/03/2025 às 13:47
const {
    validateUserFields,  // Valida se todos os campos obrigatórios de um usuário estão preenchidos
    isUserDuplicate,  // Verifica se um ID de usuário já está em uso
    createUser, // Cria um objeto de usuário a partir dos dados fornecidos
    translateAdmin  // Converte valor booleano para texto "Sim"/"Não"
  } = require("../usuarios.js");
  
  describe("User Manager", () => {

      //Comentado em 20/03/2025 às 15:03
      //Verifica se a função validateUserFields retorna true quando todos os campos do usuário estão preenchidos corretamente.
      //garante que usuários válidos passem na validação.
    test("validateUserFields - válido", () => {
      const user = {
        fullName: "Maria",
        id: "maria01",
        email: "maria@email.com",
        phone: "12345",
        password: "abc"
      };
      expect(validateUserFields(user)).toBe(true);
    });

       //Comentado em 20/03/2025 às 16:30
      //Testa se a função retorna false quando os campos do usuário estão vazios.
      //confirma que usuários incompletos são rejeitados.
    test("validateUserFields - inválido", () => {
      const user = { fullName: "", id: "", email: "", phone: "", password: "" };
      expect(validateUserFields(user)).toBe(false);
    });

      //Comentado em 21/03/2025 às 14:47
      //Verifica se a função retorna false quando o ID não está presente na lista de usuários.
      //permite cadastros de novos usuários com IDs únicos.
    test("isUserDuplicate - retorna verdadeiro se ID existe", () => {
      const users = [{ id: "joao" }, { id: "ana" }];
      expect(isUserDuplicate(users, "joao")).toBe(true);
    });

      //Comentado em 21/03/2025 às 15:56
      //Testa se a função detecta um ID de usuário duplicado na lista.
      //evita cadastros com IDs já existentes.
    test("isUserDuplicate - retorna falso se ID não existe", () => {
      const users = [{ id: "joao" }, { id: "ana" }];
      expect(isUserDuplicate(users, "maria")).toBe(false);
    });

      //Comentado em 25/03/2025 às 17:10
      //Testa se a função createUser retorna um objeto com os dados esperados.
      //garantir que a criação de usuário funcione corretamente e retorne os dados certos.
    test("createUser - retorna objeto de usuário", () => {
      const data = {
        fullName: "Carlos",
        id: "carlos",
        email: "carlos@mail.com",
        phone: "9999",
        password: "123",
        isAdmin: true
      };
      expect(createUser(data)).toMatchObject(data);
    });

      //Comentado em 25/03/2025 às 18:20
      //Verifica se translateAdmin(true) retorna "Sim" e translateAdmin(false) retorna "Não".
      //exibe claramente o status de administrador em texto para o usuário.
    test("translateAdmin - converte boolean para texto", () => {
      expect(translateAdmin(true)).toBe("Sim");
      expect(translateAdmin(false)).toBe("Não");
    });
  
  });
  
