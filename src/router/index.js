import { createRouter, createWebHashHistory } from "vue-router";
import { useUserStore } from "@/store/user";

import Login from "@/views/LoginView.vue";
import Register from "@/views/RegisterView.vue";
import ResetPassword from "@/views/ResetPasswordView.vue";
import AppLayout from "@/components/AppLayout.vue";
import HomeView from "@/views/dashboard/HomeView.vue";
import UserManagement from "@/views/dashboard/UserManagement.vue";
import ArticleManagement from "@/views/dashboard/ArticleManagement.vue";
import ArticleView from "@/views/dashboard/ArticleView.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", name: "Login", component: Login },
  { path: "/register", name: "Register", component: Register },
  { path: "/reset", name: "ResetPassword", component: ResetPassword },

  {
    path: "/dashboard",
    component: AppLayout,
    children: [
      { path: "home", component: HomeView },
      {
        path: "contacts",
        component: UserManagement,
        beforeEnter: (to, from, next) => {
          const userStore = useUserStore();
          if (userStore.isLoggedIn) next();
          else next({ name: "Login" });
        },
      },
      {
        path: "articles",
        component: ArticleManagement,
        beforeEnter: (to, from, next) => {
          const userStore = useUserStore();
          if (userStore.isLoggedIn) next();
          else next({ name: "Login" });
        },
      },
      {
        path: "article",
        component: ArticleView,
        beforeEnter: (to, from, next) => {
          const userStore = useUserStore();
          if (userStore.isLoggedIn) next();
          else next({ name: "Login" });
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
