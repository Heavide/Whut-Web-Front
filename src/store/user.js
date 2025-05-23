import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    isLoggedIn: false,
    userInfo: null,
  }),

  actions: {
    setUserInfo(user) {
      this.isLoggedIn = true;
      this.userInfo = user;
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userInfo", JSON.stringify(user));
      localStorage.setItem("dark-mode", "false");
      document.documentElement.classList.remove("dark");
    },

    logout() {
      this.isLoggedIn = false;
      this.userInfo = null;
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userInfo");
    },

    initializeFromStorage() {
      const storedLogin = localStorage.getItem("isLoggedIn");
      const storedUser = localStorage.getItem("userInfo");

      if (storedLogin === "true" && storedUser) {
        this.isLoggedIn = true;
        this.userInfo = JSON.parse(storedUser);
      }
    },
  },
});
