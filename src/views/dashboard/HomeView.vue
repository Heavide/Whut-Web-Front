<template>
  <el-row :gutter="20">
    <!-- 用户信息卡 -->
    <el-col :span="8">
      <el-card class="info-card">
        <div class="user-header">
          <el-avatar :size="80" :src="avatarUrl" class="avatar" />
          <div class="user-text">
            <h3 class="user-name">{{ user.username }}</h3>
          </div>
        </div>
        <el-descriptions column="1" border>
          <el-descriptions-item label="邮箱">{{
            user.email
          }}</el-descriptions-item>
          <el-descriptions-item label="注册时间">{{
            user.registerDate
          }}</el-descriptions-item>
          <el-descriptions-item label="生日">{{
            user.birthday
          }}</el-descriptions-item>
        </el-descriptions>
      </el-card>
    </el-col>

    <!-- 日历卡片 -->
    <el-col :span="16">
      <el-card class="calendar-card">
        <template #header>工作日历</template>
        <el-calendar />
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { useUserStore } from "@/store/user";
import { computed } from "vue";

const userStore = useUserStore();
const user = computed(() => userStore.userInfo || {});

// 静态资源服务器地址
const baseUrl = "http://localhost:8081/uploads/avatars/";

// 头像链接处理
const avatarUrl = computed(() => {
  if (!user.value.avatar) {
    return ""; // 默认空头像
  }
  if (user.value.avatar.startsWith("http")) {
    return user.value.avatar; // 已经是完整URL
  }
  return baseUrl + user.value.avatar; // 否则补全
});
</script>

<style scoped>
/* 高度对齐 */
.info-card,
.calendar-card {
  height: 100%;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

/* 用户头像和名称横向排列 */
.user-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.user-name {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.avatar {
  border: 1px solid #ddd;
}
</style>
