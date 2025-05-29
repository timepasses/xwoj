<template>
  <a-row id="globalHeader" align="center" :wrap="false">
    <a-col flex="auto">
      <a-menu
        mode="horizontal"
        :selected-keys="selectedKeys"
        @menu-item-click="doMenuClick"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '38px' }"
          disabled
        >
          <div class="title-bar">
            <img class="logo" src="../assets/oj-logo.jpg" />
            <div class="title">XW OJ</div>
          </div>
        </a-menu-item>
        <a-menu-item v-for="item in visibleRoutes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <!--    <a-col flex="100px">
          <div @click="handleLoginClick">
            {{ store.state.user?.loginUser?.userName ?? "未登录（点此登录）" }}
          </div>
          <a-button size="small" @click="handleLogout">注销</a-button>
        </a-col>-->
    <a-col
      flex="150px"
      style="
        display: flex;
        align-items: center;
        gap: 12px;
        justify-content: flex-end;
      "
    >
      <template
        v-if="store.state.user?.loginUser?.userRole !== ACCESS_ENUM.NOT_LOGIN"
      >
        <div style="cursor: default">
          {{ store.state.user?.loginUser?.userName }}
        </div>
        <a-button size="small" @click="handleLogout">注销</a-button>
      </template>
      <template v-else>
        <div @click="handleLoginClick" style="cursor: pointer">
          未登录（点此登录）
        </div>
      </template>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { routes } from "../router/routes";
import { useRoute, useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import ACCESS_ENUM from "@/access/accessEnum";

import { UserControllerService } from "../../generated";
import message from "@arco-design/web-vue/es/message";

const handleLogout = async () => {
  const res = await UserControllerService.userLogoutUsingPost();
  if (res.code === 0) {
    message.success("注销成功");
    await store.dispatch("user/getLoginUser"); // 清空用户状态
    router.push("/user/login"); // 跳转登录页
  } else {
    message.error("注销失败：" + res.message);
  }
};

const router = useRouter();
const store = useStore();

// 未登录时跳转到登录页面
const handleLoginClick = () => {
  router.push("/user/login"); // 跳转到该页面
};

// 展示在菜单的路由数组
const visibleRoutes = computed(() => {
  return routes.filter((item, index) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    // 根据权限过滤菜单
    if (
      !checkAccess(store.state.user.loginUser, item?.meta?.access as string)
    ) {
      return false;
    }
    return true;
  });
});

// 默认主页
const selectedKeys = ref(["/"]);

// 路由跳转后，更新选中的菜单项
router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path];
});

console.log();

setTimeout(() => {
  store.dispatch("user/getLoginUser", {
    userName: "XW管理员",
    userRole: ACCESS_ENUM.ADMIN,
  });
}, 3000);

const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};
</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: #444;
  margin-left: 16px;
}

.logo {
  height: 48px;
}
</style>
