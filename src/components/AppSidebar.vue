<template>
  <el-aside width="200px" class="sidebar">
    <div class="logo">后台管理系统</div>
    <el-menu :default-active="activePath" class="menu" router>
      <el-menu-item index="/dashboard/home">
        <el-icon><House /></el-icon>
        <span>主页</span>
      </el-menu-item>
      <el-menu-item index="/dashboard/contacts">
        <el-icon><User /></el-icon>
        <span>用户管理</span>
      </el-menu-item>
      <el-menu-item index="/dashboard/articles">
        <el-icon><Document /></el-icon>
        <span>文章管理</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { House, User, Document } from "@element-plus/icons-vue";

const route = useRoute();
const activePath = computed(() => route.path);
</script>

<style scoped>
.sidebar {
  background: #9bc8f3;
  color: white;
  height: 100vh;
}
.logo {
  height: 60px;
  line-height: 60px;
  font-size: 18px;
  text-align: center;
  font-weight: bold;
  color: #fff;
  background-color: #409eff;
  box-sizing: border-box;
}
</style>
