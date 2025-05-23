<template>
  <el-container class="layout-container">
    <transition name="slide">
      <AppSidebar v-if="!isMobile || sidebarVisible" class="sidebar" />
    </transition>

    <el-container direction="vertical" class="main-area">
      <AppHeader @toggleSidebar="toggleSidebar" />

      <el-main class="layout-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import AppSidebar from "./AppSidebar.vue";
import AppHeader from "./AppHeader.vue";

const isMobile = ref(window.innerWidth < 1000);
const sidebarVisible = ref(true);

const handleResize = () => {
  isMobile.value = window.innerWidth < 1000;
  if (isMobile.value) {
    sidebarVisible.value = false;
  } else {
    sidebarVisible.value = true;
  }
};

const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value;
};

onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.layout-container {
  height: 100vh;
  overflow: hidden;
}

.main-area {
  flex: 1;
}

.layout-main {
  padding: 20px;
  background-color: var(--el-bg-color);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
