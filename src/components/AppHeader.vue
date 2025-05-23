<template>
  <header class="app-header">
    <div class="right-section">
      <el-button
        class="sidebar-toggle"
        :icon="Menu"
        text
        @click="$emit('toggleSidebar')"
        v-if="isMobile"
      />

      <el-switch
        v-model="darkMode"
        inline-prompt
        active-text="🌙"
        inactive-text="☀️"
        class="theme-switch"
      />
      <span class="welcome-text">欢迎！{{ user?.username }}</span>

      <div class="dropdown-wrapper" ref="dropdownRef">
        <el-button text @click="toggleDropdown">
          <el-icon>
            <component :is="dropdownVisible ? ArrowUp : ArrowDown" />
          </el-icon>
        </el-button>
        <div v-if="dropdownVisible" class="dropdown-menu">
          <el-menu class="menu">
            <el-menu-item @click="logout">退出登录</el-menu-item>
          </el-menu>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user";
import { ArrowDown, ArrowUp, Menu } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

const userStore = useUserStore();
const user = computed(() => userStore.userInfo);

const dropdownVisible = ref(false);
const dropdownRef = ref(null);
const router = useRouter();
const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value;
};
const handleClickOutside = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    dropdownVisible.value = false;
  }
};
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const isMobile = ref(window.innerWidth < 1000);
const updateWidth = () => {
  isMobile.value = window.innerWidth < 1000;
};
onMounted(() => {
  updateWidth();
  window.addEventListener("resize", updateWidth);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateWidth);
});

const darkMode = ref(localStorage.getItem("dark-mode") === "true");
watch(darkMode, (val) => {
  document.documentElement.classList.toggle("dark", val);
  localStorage.setItem("dark-mode", val);
});

const logout = () => {
  userStore.logout();
  ElMessage.success("已退出登录");
  router.push("/login");
};
</script>

<style scoped>
.app-header {
  height: 60px;
  width: 100%;
  background-color: var(--el-bg-color);
  color: var(--el-text-color-primary);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid var(--el-border-color);
  box-sizing: border-box;
  position: relative;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
}

.sidebar-toggle {
  display: inline-flex;
}

.theme-switch {
  --el-switch-on-color: #222;
  --el-switch-off-color: #eee;
}

.welcome-text {
  font-weight: bold;
  font-size: 16px;
  color: var(--el-text-color-primary);
}

.dropdown-wrapper {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 8px;
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  z-index: 999;
  width: 140px;
  color: var(--el-text-color-primary);
}

.menu {
  border: none;
  background-color: transparent;
}
</style>
