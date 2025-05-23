<template>
  <el-container class="article-management">
    <el-card class="chart-card">
      <v-chart :option="chartOption" style="height: 300px" autoresize />
    </el-card>

    <el-card class="table-card">
      <div class="table-header">
        <h3>作者列表</h3>
        <el-input
          v-model="search"
          placeholder="搜索作者名称"
          clearable
          class="search-input"
        />
      </div>

      <el-table
        :data="pagedAuthors"
        border
        stripe
        style="width: 100%; margin-top: 10px"
        v-loading="loading"
      >
        <el-table-column label="作者名称" prop="username" width="300" />
        <el-table-column label="电子邮箱" prop="email" width="650" />
        <el-table-column label="文章数量" prop="articleCount" width="231" />
        <el-table-column label="操作" width="110">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="viewArticles(row)">
              查看文章
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :total="filteredAuthors.length"
          layout="total, prev, pager, next, jumper"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
          :page-sizes="[5, 10, 20]"
          background
        />
      </div>
    </el-card>

    <el-dialog
      v-model="articleDialogVisible"
      :title="`作者 ${selectedAuthor} 的文章`"
      width="600px"
    >
      <el-table :data="articleList" border stripe>
        <el-table-column label="标题" prop="title" />
        <el-table-column label="日期" prop="date" width="180" />
      </el-table>
    </el-dialog>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { ElMessage } from "element-plus";

const router = useRouter();

const authors = ref([]);
const search = ref("");
const loading = ref(false);

const currentPage = ref(1);
const pageSize = ref(5);

const filteredAuthors = computed(() => {
  if (!search.value) return authors.value;
  return authors.value.filter((a) =>
    a.username.toLowerCase().includes(search.value.toLowerCase())
  );
});

const pagedAuthors = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredAuthors.value.slice(start, end);
});

const chartOption = computed(() => ({
  title: {
    text: "作者文章发布数量图表统计",
    left: "center",
  },
  tooltip: {},
  xAxis: {
    type: "category",
    data: pagedAuthors.value.map((a) => a.username),
    axisLabel: { rotate: 30 },
  },
  yAxis: {
    name: "文章数",
    type: "value",
  },
  series: [
    {
      type: "bar",
      data: pagedAuthors.value.map((a) => a.articleCount || 0),
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
      },
    },
  ],
}));

const articleDialogVisible = ref(false);
const selectedAuthor = ref("");
const articleList = ref([]);

const viewArticles = (row) => {
  router.push({
    path: "/dashboard/article",
    query: { userId: row.id },
  });
};

const handlePageChange = (page) => {
  currentPage.value = page;
};
const handleSizeChange = (size) => {
  pageSize.value = size;
  currentPage.value = 1;
};

const loadAuthors = async () => {
  loading.value = true;
  try {
    const res = await axios.get("http://localhost:8080/api/users");
    if (res.data.code === 200) {
      authors.value = res.data.data.map((user) => ({
        ...user,
        articleCount: user.articleCount || 0,
      }));
    } else {
      ElMessage.error(res.data.message || "加载用户失败");
    }
  } catch (err) {
    console.error(err);
    ElMessage.error("请求用户失败");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadAuthors();
});
</script>

<style scoped>
.article-management {
  padding: 20px;
  background-color: var(--el-bg-color);
  min-height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chart-card {
  padding: 20px;
  box-sizing: border-box;
  min-height: 350px;
  width: 100%;
  background-color: var(--el-bg-color);
}

.table-card {
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
  background-color: var(--el-bg-color);
  overflow: auto;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.table-header h3 {
  margin: 0;
  font-weight: 600;
  font-size: 18px;
}

.search-input {
  max-width: 250px;
  flex: 1;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
