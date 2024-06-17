import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { routes } from "@/router/routes"; /*引入路由*/

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
