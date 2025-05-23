<template>
  <el-container class="author-articles">
    <el-card class="user-info-card">
      <div class="user-info">
        <img :src="user.avatar" class="avatar" />
        <div class="info">
          <p><strong>用户名：</strong>{{ user.username }}</p>
          <p><strong>邮箱：</strong>{{ user.email }}</p>
          <p><strong>生日：</strong>{{ user.birthday }}</p>
          <p><strong>注册时间：</strong>{{ user.registerDate }}</p>
        </div>
      </div>
    </el-card>

    <el-card class="article-card">
      <div class="article-header">
        <el-input
          v-model="search"
          placeholder="搜索文章标题"
          clearable
          class="search-input"
        />
        <el-button type="primary" @click="addArticle">添加文章</el-button>
      </div>

      <el-table :data="filteredArticles" border stripe style="margin-top: 15px">
        <el-table-column label="标题" prop="title" width="600" />
        <el-table-column label="发布日期" prop="date" width="240" />
        <el-table-column label="更新时间" prop="updateTime" width="240" />
        <el-table-column label="操作" width="226">
          <template #default="{ row }">
            <el-button size="small" @click="preview(row)">预览</el-button>
            <el-button size="small" type="primary" @click="openEdit(row)"
              >修改</el-button
            >
            <el-button size="small" type="danger" @click="remove(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="previewVisible"
      :title="previewData.title"
      width="600px"
    >
      <p><strong>作者：</strong>{{ previewData.author }}</p>
      <p><strong>发布日期：</strong>{{ previewData.date }}</p>
      <p><strong>最后更新：</strong>{{ previewData.updateTime }}</p>
      <p style="margin-top: 20px">{{ previewData.content }}</p>
      <template #footer>
        <el-button @click="previewVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="addDialogVisible" title="添加文章" width="500px">
      <el-form :model="newArticle" label-width="80px">
        <el-form-item label="标题" required>
          <el-input v-model="newArticle.title" />
        </el-form-item>
        <el-form-item label="内容" required>
          <el-input type="textarea" v-model="newArticle.content" rows="5" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitArticle">提交</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="editDialogVisible" title="修改文章" width="500px">
      <el-form :model="editingArticle" label-width="80px" v-if="editingArticle">
        <el-form-item label="标题" required>
          <el-input v-model="editingArticle.title" />
        </el-form-item>
        <el-form-item label="内容" required>
          <el-input type="textarea" v-model="editingArticle.content" rows="5" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEdit">保存</el-button>
      </template>
    </el-dialog>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import axios from "axios";

const route = useRoute();
const userId = ref(route.query.userId);

const user = ref({
  username: "",
  avatar: "",
  email: "",
  birthday: "",
  registerDate: "",
});

const articles = ref([]);
const search = ref("");
const loading = ref(false);

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}/${mm}/${dd}`;
};

const filteredArticles = computed(() => {
  if (!search.value) return articles.value;
  return articles.value.filter((a) =>
    a.title.toLowerCase().includes(search.value.toLowerCase())
  );
});

const loadUserInfo = async () => {
  try {
    const res = await axios.get(
      `http://localhost:8080/api/users/${userId.value}`
    );
    if (res.data.code === 200) {
      const u = res.data.data;
      user.value = {
        username: u.username,
        avatar: u.avatar
          ? `http://localhost:8080/uploads/avatars/${u.avatar}`
          : "https://randomuser.me/api/portraits/men/1.jpg",
        email: u.email,
        birthday: formatDate(u.birthday),
        registerDate: formatDate(u.createTime),
      };
    } else {
      ElMessage.error(res.data.message || "加载作者失败");
    }
  } catch (err) {
    console.error(err);
    ElMessage.error("请求作者失败");
  }
};

const loadArticles = async () => {
  loading.value = true;
  try {
    const res = await axios.get("http://localhost:8080/api/articles", {
      params: { userId: userId.value },
    });
    if (res.data.code === 200) {
      articles.value = res.data.data.map((article) => ({
        ...article,
        date: formatDate(article.createTime),
        updateTime: formatDate(article.updateTime),
      }));
    }
  } catch (err) {
    console.error(err);
    ElMessage.error("加载文章失败");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadUserInfo();
  loadArticles();
});

const previewVisible = ref(false);
const previewData = ref({});
const addDialogVisible = ref(false);
const editDialogVisible = ref(false);
const newArticle = ref({ title: "", content: "" });
const editingArticle = ref(null);

const preview = (row) => {
  previewData.value = { ...row, author: user.value.username };
  previewVisible.value = true;
};

const addArticle = () => {
  addDialogVisible.value = true;
};

function formatDateTime(date) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

const submitArticle = async () => {
  try {
    await axios.post("http://localhost:8080/api/articles", {
      title: newArticle.value.title,
      content: newArticle.value.content,
      userId: userId.value,
      createTime: formatDateTime(new Date()),
      updateTime: formatDateTime(new Date()),
    });
    ElMessage.success("添加成功");
    addDialogVisible.value = false;
    newArticle.value = { title: "", content: "" };
    await loadArticles();
  } catch (err) {
    console.error(err);
    ElMessage.error("添加失败");
  }
};

const openEdit = (row) => {
  editingArticle.value = { ...row };
  editDialogVisible.value = true;
};

const submitEdit = async () => {
  try {
    await axios.put(
      `http://localhost:8080/api/articles/${editingArticle.value.id}?userId=${userId.value}`,
      {
        id: editingArticle.value.id,
        title: editingArticle.value.title,
        content: editingArticle.value.content,
        userId: userId.value,
        updateTime: formatDateTime(new Date()),
      }
    );
    ElMessage.success("更新成功");
    editDialogVisible.value = false;
    editingArticle.value = null;
    await loadArticles();
  } catch (err) {
    console.error(err);
    ElMessage.error("更新失败");
  }
};

const remove = async (row) => {
  try {
    await axios.delete(`http://localhost:8080/api/articles/${row.id}`, {
      params: { userId: userId.value },
    });
    ElMessage.success("删除成功");
    await loadArticles();
  } catch (err) {
    console.error(err);
    ElMessage.error("删除失败");
  }
};
</script>

<style scoped>
.author-articles {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: var(--el-bg-color);
  min-height: 100%;
  box-sizing: border-box;
}

.user-info-card {
  padding: 20px;
}

.user-info {
  display: flex;
  gap: 20px;
  align-items: center;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.info p {
  margin: 6px 0;
  color: var(--el-text-color-primary);
}

.article-card {
  padding: 20px;
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.search-input {
  max-width: 300px;
  flex: 1;
}
</style>
