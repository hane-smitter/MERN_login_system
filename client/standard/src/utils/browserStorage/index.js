const storage = sessionStorage;

const browserStorage = {
  get authTkn() {
    const token = JSON.parse(storage.getItem("u:Id") ?? null);
    return token;
  },

  set setAuthTkn(token) {
    storage.setItem("u:Id", JSON.stringify(token));
  },
};

export { browserStorage };
