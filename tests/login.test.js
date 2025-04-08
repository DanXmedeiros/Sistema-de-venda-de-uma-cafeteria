/**
 * @jest-environment jsdom
 */
//Autor: Sarah Silva Lima
// Data: 02/04/2025
//Descrição: Testes unitários para a função de login, entrada de usuários ao sistema
const { handleLogin, authenticate } = require('../login');
//criando uma sessão de teste, e dando um nome a ela
describe("Autenticação e login DOM", () => {
  let usernameInput, passwordInput;
  let mockShowMessage, mockRedirect;
  //prepara o ambiente dos testes
  beforeEach(() => {
    usernameInput = { value: "" };
    passwordInput = { value: "" };
    mockShowMessage = jest.fn();
    mockRedirect = jest.fn();
  //cria funções mock, que são falsas apenas para o teste
   
  //cria um mock do localstorage apenas para o teste, para não precisar do navegador 
    const localStorageMock = (() => {
      let store = {};
      return {
        getItem: key => store[key] || null,
        setItem: (key, value) => { store[key] = value; },
        clear: () => { store = {}; }
      };
    })();
    //o mock é setado no ambiente global garantindo que a função de login possa utiliza-lo
    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock,
      configurable: true
    });
  });
 //testa se o usuário válido está logando
  test("Usuário válido redireciona e salva localStorage", () => {
    usernameInput.value = "admin";
    passwordInput.value = "1234";

    handleLogin(usernameInput, passwordInput, mockShowMessage, mockRedirect);
//espera o redirecionamento da tela de login para dashboard
    expect(mockRedirect).toHaveBeenCalledWith("dashboard.html");
    expect(localStorage.getItem("currentUser")).toContain("Administrador");//espera que o usuário seja salvo no localStorage
    expect(mockShowMessage).not.toHaveBeenCalled();// não exibe mensagem de erro
  });
// testa se um usuário inválido ou inexistente exibe erro
  test("Usuário inválido exibe erro", () => {
    usernameInput.value = "admin";
    passwordInput.value = "errado";

    handleLogin(usernameInput, passwordInput, mockShowMessage, mockRedirect);

    expect(mockShowMessage).toHaveBeenCalledWith("loginError", "Usuário ou senha incorretos.", true);// espera que a mensagem de erro seja chamada
    expect(mockRedirect).not.toHaveBeenCalled();//espera que não redirecione
  });
//testa se um usuário inexistente exibe erro
  test("Usuário inexistente também exibe erro", () => {
    usernameInput.value = "naoexiste";
    passwordInput.value = "1234";

    handleLogin(usernameInput, passwordInput, mockShowMessage, mockRedirect);

    expect(mockShowMessage).toHaveBeenCalled();//espera que a mensagem de erro seja chamada
    expect(mockRedirect).not.toHaveBeenCalled();//espera que não redirecione
  });
});
