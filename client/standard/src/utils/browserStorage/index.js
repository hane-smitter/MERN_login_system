const storage = sessionStorage;

const browserStorage = {
  get authTkn() {
    let token = storage.getItem("u:Id");
    console.log("Token found:  ", typeof token)

    if (token) {
      console.log("Kwani ckuizi undefined ni true tena!!")
      token = JSON.parse(token);
    }

    return token;
  },

  set setAuthTkn(token) {
    storage.setItem("u:Id", JSON.stringify(token));
  },
};

export { browserStorage };
