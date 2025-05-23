<template>
  <div class="register-page">
    <div class="register-card">
      <h2 class="register-title">用户注册</h2>

      <el-form
        :model="form"
        :rules="rules"
        ref="registerForm"
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

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱">
            <template #prefix>
              <el-icon><Message /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="出生日期" prop="dob">
          <el-date-picker
            v-model="form.dob"
            type="date"
            placeholder="选择出生日期"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="上传头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleAvatarChange"
          >
            <img v-if="avatarUrl" :src="avatarUrl" class="avatar-preview" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-button type="primary" block @click="submitForm">注册用户</el-button>
        <el-button type="default" block @click="goToLogin" style="margin-top: 0"
          >返回登录</el-button
        >
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { dayjs, ElMessage } from "element-plus";
import { User, Lock, Message, Plus } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

const registerForm = ref(null);
const form = ref({
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
  dob: "",
  avatar: null,
});
const avatarUrl = ref("");

const rules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
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
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "邮箱格式不正确", trigger: "blur" },
  ],
  dob: [{ required: true, message: "请选择出生日期", trigger: "change" }],
};

const handleAvatarChange = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    avatarUrl.value = e.target.result;
  };
  reader.readAsDataURL(file.raw);
  form.value.avatar = file.raw;
};

const submitForm = () => {
  registerForm.value.validate(async (valid) => {
    if (valid) {
      try {
        const formData = new FormData();
        formData.append("username", form.value.username);
        formData.append("password", form.value.password);
        formData.append("email", form.value.email);
        formData.append("birthday", dayjs(form.value.dob).toISOString());
        if (form.value.avatar) {
          formData.append("avatar", form.value.avatar);
        }

        const res = await axios.post(
          "http://localhost:8080/api/auth/register",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (res.data.code === 200) {
          ElMessage.success("注册成功，请登录");
          router.push("/login");
        } else {
          ElMessage.error(res.data.msg || "注册失败");
        }
      } catch (err) {
        console.error(err);
        ElMessage.error("注册请求失败");
      }
    } else {
      ElMessage.error("请填写完整信息");
    }
  });
};

const goToLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f3f6f8;
  padding: 20px;
}

.register-card {
  background: #fff;
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
}

.register-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 22px;
  font-weight: bold;
  color: #333;
}

.avatar-uploader {
  display: inline-block;
  width: 100%;
  text-align: center;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  display: block;
  margin: 0 auto;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-uploader-icon {
  font-size: 32px;
  color: #999;
  margin-top: 8px;
}

.el-button + .el-button {
  margin-top: 10px;
}

@media (max-width: 800px) {
  .register-card {
    padding: 30px 20px;
  }
}
</style>
