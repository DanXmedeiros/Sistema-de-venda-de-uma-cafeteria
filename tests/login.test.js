/**
 * @jest-environment jsdom
 */
const { handleLogin, authenticate } = require('../login');

describe("Autenticação e login DOM", () => {
  let usernameInput, passwordInput;
  let mockShowMessage, mockRedirect;

  beforeEach(() => {
    usernameInput = { value: "" };
    passwordInput = { value: "" };
    mockShowMessage = jest.fn();
    mockRedirect = jest.fn();

    // Mock localStorage
    const localStorageMock = (() => {
      let store = {};
      return {
        getItem: key => store[key] || null,
        setItem: (key, value) => { store[key] = value; },
        clear: () => { store = {}; }
      };
    })();

    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock,
      configurable: true
    });
  });

  test("Usuário válido redireciona e salva localStorage", () => {
    usernameInput.value = "admin";
    passwordInput.value = "1234";

    handleLogin(usernameInput, passwordInput, mockShowMessage, mockRedirect);

    expect(mockRedirect).toHaveBeenCalledWith("dashboard.html");
    expect(localStorage.getItem("currentUser")).toContain("Administrador");
    expect(mockShowMessage).not.toHaveBeenCalled();
  });

  test("Usuário inválido exibe erro", () => {
    usernameInput.value = "admin";
    passwordInput.value = "errado";

    handleLogin(usernameInput, passwordInput, mockShowMessage, mockRedirect);

    expect(mockShowMessage).toHaveBeenCalledWith("loginError", "Usuário ou senha incorretos.", true);
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  test("Usuário inexistente também exibe erro", () => {
    usernameInput.value = "naoexiste";
    passwordInput.value = "1234";

    handleLogin(usernameInput, passwordInput, mockShowMessage, mockRedirect);

    expect(mockShowMessage).toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});
