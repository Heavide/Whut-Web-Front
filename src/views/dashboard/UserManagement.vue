<template>
  <el-container class="user-management-container">
    <el-card class="page-card">
      <div class="page-header">
        <h2 class="page-title">联系人管理</h2>
        <el-input
          v-model="searchQuery"
          placeholder="搜索联系人姓名"
          class="search-input"
          clearable
        />
      </div>

      <el-table
        :data="pagedUsers"
        border
        stripe
        style="width: 100%; margin-top: 20px"
        v-loading="loading"
      >
        <el-table-column label="姓名" prop="name" width="150" />
        <el-table-column label="省份" prop="province" width="156" />
        <el-table-column label="城市" prop="city" width="170" />
        <el-table-column label="地址" prop="address" width="350" />
        <el-table-column label="邮政编码" prop="zipcode" width="150" />
        <el-table-column label="联系日期" prop="contactDate" width="150" />
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button size="small" @click="editUser(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteUser(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-empty
        v-if="!loading && filteredUsers.length === 0"
        description="暂无联系人"
      />

      <div class="pagination">
        <el-pagination
          :page-size="pageSize"
          :current-page="currentPage"
          :total="filteredUsers.length"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, ->, jumper"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <el-footer class="footer-action">
      <el-button type="primary" @click="openAddDialog">添加联系人</el-button>
    </el-footer>

    <el-dialog
      v-model="dialogVisible"
      :title="currentUser.id ? '编辑联系人' : '添加联系人'"
      width="500px"
      @close="resetForm"
      destroy-on-close
    >
      <el-form :model="currentUser" ref="formRef" label-width="80px">
        <el-form-item
          label="姓名"
          prop="name"
          :rules="[{ required: true, message: '请输入姓名', trigger: 'blur' }]"
        >
          <el-input v-model="currentUser.name" />
        </el-form-item>

        <el-form-item
          label="省份"
          prop="province"
          :rules="[
            { required: true, message: '请选择省份', trigger: 'change' },
          ]"
        >
          <el-select
            v-model="currentUser.province"
            placeholder="选择省份"
            @change="handleProvinceChange"
          >
            <el-option
              v-for="province in provinceList"
              :key="province.value"
              :label="province.label"
              :value="province.label"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="城市"
          prop="city"
          :rules="[
            { required: true, message: '请选择城市', trigger: 'change' },
          ]"
        >
          <el-select v-model="currentUser.city" placeholder="选择城市">
            <el-option
              v-for="city in cityList"
              :key="city.value"
              :label="city.label"
              :value="city.label"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="地址" prop="address">
          <el-input v-model="currentUser.address" />
        </el-form-item>

        <el-form-item label="邮政编码" prop="zipcode">
          <el-input v-model="currentUser.zipcode" />
        </el-form-item>

        <el-form-item
          label="联系日期"
          prop="contactDate"
          :rules="[
            { required: true, message: '请选择日期', trigger: 'change' },
          ]"
        >
          <el-date-picker
            v-model="currentUser.contactDate"
            type="date"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveUser">保存</el-button>
      </template>
    </el-dialog>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import { regionData } from "element-china-area-data";

const provinceList = ref(regionData);
const cityList = ref([]);

const searchQuery = ref("");
const allUsers = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const dialogVisible = ref(false);
const currentUser = ref({});
const formRef = ref(null);
const loading = ref(false);

const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
const userId = userInfo.id;

const filteredUsers = computed(() => {
  if (!searchQuery.value) return allUsers.value;
  return allUsers.value.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const pagedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredUsers.value.slice(start, start + pageSize.value);
});

const handlePageChange = (page) => {
  currentPage.value = page;
};

const handleSizeChange = (size) => {
  pageSize.value = size;
  currentPage.value = 1;
};

const loadContacts = async () => {
  loading.value = true;
  try {
    const res = await axios.get("http://localhost:8080/api/contacts", {
      params: { userId },
    });
    if (res.data.code === 200) {
      allUsers.value = res.data.data;
    } else {
      ElMessage.error(res.data.message || "加载联系人失败");
    }
  } catch (error) {
    console.error(error);
    ElMessage.error("请求联系人失败");
  } finally {
    loading.value = false;
  }
};

onMounted(loadContacts);

const handleProvinceChange = (provinceLabel) => {
  const province = regionData.find((item) => item.label === provinceLabel);
  cityList.value = province?.children || [];
};

const editUser = (user) => {
  currentUser.value = { ...user };
  handleProvinceChange(user.province);
  dialogVisible.value = true;
};

const deleteUser = async (user) => {
  try {
    await axios.delete(`http://localhost:8080/api/contacts/${user.id}`, {
      params: { userId },
    });
    ElMessage.success("删除成功");
    loadContacts();
  } catch (error) {
    console.error(error);
    ElMessage.error("删除失败");
  }
};

const openAddDialog = () => {
  currentUser.value = {
    name: "",
    province: "",
    city: "",
    address: "",
    zipcode: "",
    contactDate: "",
  };
  cityList.value = [];
  dialogVisible.value = true;
};

const saveUser = async () => {
  await formRef.value.validate(async (valid) => {
    if (!valid) return;

    try {
      if (currentUser.value.id) {
        await axios.put(
          `http://localhost:8080/api/contacts/${currentUser.value.id}?userId=${userId}`,
          { ...currentUser.value }
        );
        ElMessage.success("更新成功");
      } else {
        await axios.post("http://localhost:8080/api/contacts", {
          ...currentUser.value,
          userId,
        });
        ElMessage.success("添加成功");
      }
      dialogVisible.value = false;
      loadContacts();
    } catch (error) {
      console.error(error);
      ElMessage.error("保存失败");
    }
  });
};

const resetForm = () => {
  formRef.value?.resetFields();
};
</script>

<style scoped>
.user-management-container {
  padding: 20px;
}
.page-card {
  padding: 20px;
  background-color: var(--el-bg-color);
  color: var(--el-text-color-primary);
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}
.page-title {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}
.search-input {
  width: 300px;
}
.footer-action {
  padding: 20px;
  text-align: right;
  background-color: var(--el-bg-color);
  border-top: 1px solid var(--el-border-color);
}
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
