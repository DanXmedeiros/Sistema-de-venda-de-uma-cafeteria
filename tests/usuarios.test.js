const {
    validateUserFields,
    isUserDuplicate,
    createUser,
    translateAdmin
  } = require("../usuarios.js");
  
  describe("User Manager", () => {
  
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
  
    test("validateUserFields - inválido", () => {
      const user = { fullName: "", id: "", email: "", phone: "", password: "" };
      expect(validateUserFields(user)).toBe(false);
    });
  
    test("isUserDuplicate - retorna verdadeiro se ID existe", () => {
      const users = [{ id: "joao" }, { id: "ana" }];
      expect(isUserDuplicate(users, "joao")).toBe(true);
    });
  
    test("isUserDuplicate - retorna falso se ID não existe", () => {
      const users = [{ id: "joao" }, { id: "ana" }];
      expect(isUserDuplicate(users, "maria")).toBe(false);
    });
  
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
  
    test("translateAdmin - converte boolean para texto", () => {
      expect(translateAdmin(true)).toBe("Sim");
      expect(translateAdmin(false)).toBe("Não");
    });
  
  });
  