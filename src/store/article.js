import { defineStore } from "pinia";

export const useArticleStore = defineStore("article", {
  state: () => ({
    authors: [
      { name: "renfang", email: "tianlei@example.org", count: 25 },
      { name: "qmo", email: "chaotang@example.net", count: 15 },
      { name: "xiagong", email: "fangxu@example.com", count: 39 },
      { name: "pengjuan", email: "oliao@example.com", count: 100 },
      { name: "chaoqiao", email: "rliao@example.net", count: 66 },
      { name: "ping60", email: "zengna@example.com", count: 74 },
      { name: "fgu", email: "fgu@example.com", count: 2 },
      { name: "xiagu", email: "xiagu@example.com", count: 100 },
      { name: "zhuchao", email: "zhuchao@example.com", count: 68 },
      { name: "shengyuling", email: "sheng@example.com", count: 51 },
    ],
  }),
});
