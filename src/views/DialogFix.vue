<template>
  <div style="padding: 40px">
    <el-button @click="visible = true">点击弹窗</el-button>

    <el-dialog
      v-model:visible="visible"
      title="测试弹窗"
      width="400px"
      :append-to-body="false"
    >
      <p>你好，这是一段测试内容。</p>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
const visible = ref(false);
</script>

<style>
.el-overlay,
.el-dialog__wrapper,
.el-dialog {
  display: block !important;
  opacity: 1 !important;
  z-index: 9999 !important;
  visibility: visible !important;
}
</style>
