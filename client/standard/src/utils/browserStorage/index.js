const storage = sessionStorage;

const browserStorage = {
  get authTkn() {
    let token = storage.getItem("u:Id");

    if (token) {
      token = JSON.parse(token);
    }

    return token;
  },
  set setAuthTkn(token) {
    storage.setItem("u:Id", JSON.stringify(token));
  },
  deleteAuthTkn() {
    storage.clear();
  },
};

export { browserStorage };
