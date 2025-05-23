<template>
  <div class="login-page">
    <div class="login-card">
      <h2 class="login-title">系统登录</h2>

      <el-form
        :model="form"
        :rules="rules"
        ref="loginForm"
        label-position="top"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名">
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <div class="form-footer">
          <el-checkbox v-model="remember">记住我</el-checkbox>
          <el-link type="primary" @click="handleResetPassword"
            >忘记密码?</el-link
          >
        </div>

        <el-button type="primary" class="login-btn" @click="handleLogin" block
          >登录</el-button
        >
      </el-form>

      <div class="social-login">
        <img
          src="https://img.icons8.com/color/48/qq.png"
          alt="QQ"
          @click="loginWith('QQ')"
        />
        <img
          src="https://img.icons8.com/color/48/weixing.png"
          alt="微信"
          @click="loginWith('微信')"
        />
        <img
          src="https://img.icons8.com/external-tal-revivo-color-tal-revivo/24/external-alipay-a-third-party-mobile-and-online-payment-platform-logo-color-tal-revivo.png"
          alt="支付宝"
          @click="loginWith('支付宝')"
        />
      </div>

      <div class="register-link">
        还没有账号？
        <el-link type="primary" @click="handleRegister">立即注册</el-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { User, Lock } from "@element-plus/icons-vue";
import { useUserStore } from "@/store/user";
import axios from "axios";

const router = useRouter();
const userStore = useUserStore();

const form = ref({
  username: "",
  password: "",
});
const remember = ref(false);
const loginForm = ref(null);

const rules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

const handleLogin = async () => {
  loginForm.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await axios.post("http://localhost:8080/api/auth/login", {
          username: form.value.username,
          password: form.value.password,
        });

        if (res.data.code === 200) {
          ElMessage.success("登录成功");

          // 将后端返回的用户信息存入 userStore
          userStore.setUserInfo(res.data.data.user);

          router.push("/dashboard/home");
        } else {
          ElMessage.error(res.data.message || "登录失败");
        }
      } catch (error) {
        console.error(error);
        ElMessage.error("登录请求失败");
      }
    } else {
      ElMessage.error("请填写完整信息");
    }
  });
};

const handleRegister = () => {
  router.push("/register");
};

const handleResetPassword = () => {
  router.push("/reset");
};

const loginWith = (platform) => {
  ElMessage.info(`使用${platform}登录`);
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f3f6f8;
  padding: 20px;
}

.login-card {
  background: #fff;
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 22px;
  font-weight: bold;
  color: #333;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.login-btn {
  margin-top: 10px;
}

.social-login {
  text-align: center;
  margin: 20px 0 10px;
}

.social-login img {
  width: 36px;
  height: 36px;
  margin: 0 10px;
  cursor: pointer;
  transition: transform 0.2s;
}

.social-login img:hover {
  transform: scale(1.1);
}

.register-link {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
}

.register-link span {
  margin-right: 4px;
}

@media (max-width: 800px) {
  .login-card {
    padding: 25px 15px;
  }
  .login-title {
    font-size: 18px;
  }
}
</style>
