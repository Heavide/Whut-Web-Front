<template>
  <router-view />
</template>

<script setup>
import { ref, watch } from "vue";

const darkMode = ref(localStorage.getItem("dark-mode") === "true");

watch(darkMode, (val) => {
  const root = document.documentElement;
  if (val) {
    root.classList.add("dark");
    localStorage.setItem("dark-mode", "true");
  } else {
    root.classList.remove("dark");
    localStorage.setItem("dark-mode", "false");
  }
});
</script>

<style>
html.dark {
  --el-bg-color: #2c2c2c;
  --el-bg-color-overlay: #3c3c3c;
  --el-card-bg-color: #2f2f2f;
  --el-text-color-primary: #eeeeee;
  --el-border-color: #444;
}

body.dark {
  background-color: #121212;
}
html.dark .sidebar {
  background-color: #1e1e1e;
}

html.dark .header {
  background-color: #2c2c2c;
}

html.dark .el-card {
  background-color: #1e1e1e;
  color: #ddd;
}

html.dark .el-menu {
  background-color: #1e1e1e;
  color: #ccc;
}
</style>
