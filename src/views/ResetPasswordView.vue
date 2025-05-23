<template>
  <div class="reset-page">
    <div class="reset-card">
      <h2 class="reset-title">找回密码</h2>

      <el-form
        :model="form"
        :rules="rules"
        ref="resetForm"
        label-position="top"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名">
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入注册邮箱">
            <template #prefix>
              <el-icon><Message /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="新密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入新密码"
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-button type="primary" size="large" block @click="submitForm"
          >确认修改</el-button
        >
        <el-button
          type="default"
          size="large"
          block
          style="margin-top: 0"
          @click="goToLogin"
          >返回登录</el-button
        >
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { User, Lock, Message } from "@element-plus/icons-vue";
import axios from "axios";

const router = useRouter();

const resetForm = ref(null);
const form = ref({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const rules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "邮箱格式不正确", trigger: "blur" },
  ],
  password: [{ required: true, message: "请输入新密码", trigger: "blur" }],
  confirmPassword: [
    { required: true, message: "请确认密码", trigger: "blur" },
    {
      validator: (_, value, callback) => {
        if (value !== form.value.password) {
          callback(new Error("两次密码输入不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};

const submitForm = () => {
  resetForm.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.error("请填写完整信息");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/api/users/reset-password",
        {
          username: form.value.username,
          email: form.value.email,
          newPassword: form.value.password,
        }
      );

      if (res.data.code === 200) {
        ElMessage.success("密码重置成功");
        router.push("/login");
      } else {
        ElMessage.error(res.data.message || "密码重置失败");
      }
    } catch (error) {
      ElMessage.error("请求失败：" + error.message);
    }
  });
};

const goToLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
.reset-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f3f6f8;
  padding: 20px;
}

.reset-card {
  background: #fff;
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
}

.reset-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 22px;
  font-weight: bold;
  color: #333;
}

@media (max-width: 800px) {
  .reset-card {
    padding: 30px 20px;
  }
}
</style>
