import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/theme-chalk/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import zhCn from "element-plus/es/locale/lang/zh-cn";

import VChart from "vue-echarts";

import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
} from "echarts/components";

use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
]);

const app = createApp(App)
  .use(router)
  .use(ElementPlus, { locale: zhCn })
  .use(createPinia());

import { useUserStore } from "@/store/user";
const userStore = useUserStore();
userStore.initializeFromStorage();

app.component("v-chart", VChart);
app.mount("#app");
