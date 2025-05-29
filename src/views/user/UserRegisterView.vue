<!--
<template>
  <div id="userRegisterView">
    <h2 style="margin-bottom: 16px">用户注册</h2>
    <a-form
      style="max-width: 480px; margin: 0 auto"
      label-align="left"
      auto-label-width
      :model="form"
      @submit="handleSubmit"
    >
      <a-form-item field="userAccount" label="账号">
        <a-input v-model="form.userAccount" placeholder="请输入账号" />
      </a-form-item>
      <a-form-item field="userPassword" tooltip="密码不少于 8 位" label="密码">
        <a-input-password
          v-model="form.userPassword"
          placeholder="请输入密码"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 120px">
          注册
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { UserControllerService, UserRegisterRequest } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

/**
 * 表单信息
 */
const form = reactive({
  userAccount: "",
  userPassword: "",
} as UserRegisterRequest);

const router = useRouter();
const store = useStore();

/**
 * 提交表单
 * @param data
 */
const handleSubmit = async () => {
  const res = await UserControllerService.userRegisterUsingPost(form);
  // 注册成功，跳转到主页
  if (res.code === 0) {
    message.success("注册成功！");
    await store.dispatch("user/getLoginUser");
    router.push({
      path: "/",
      replace: true,
    });
  } else {
    message.error("注册失败，" + res.message);
  }
};
</script>
-->
<template>
  <div id="userRegisterView">
    <h2 style="margin-bottom: 16px">用户注册</h2>
    <a-form
      style="max-width: 480px; margin: 0 auto"
      label-align="left"
      auto-label-width
      :model="form"
      @submit="handleSubmit"
    >
      <a-form-item field="userAccount" label="账号">
        <a-input v-model="form.userAccount" placeholder="请输入账号" />
      </a-form-item>
      <a-form-item field="userPassword" label="密码">
        <a-input-password
          v-model="form.userPassword"
          placeholder="请输入密码"
        />
      </a-form-item>
      <a-form-item field="checkPassword" label="确认密码">
        <a-input-password
          v-model="form.checkPassword"
          placeholder="请再次输入密码"
        />
      </a-form-item>
      <a-form-item field="userName" label="昵称">
        <a-input v-model="form.userName" placeholder="请输入昵称" />
      </a-form-item>
      <a-form-item>
        <div style="display: flex; gap: 16px">
          <a-button type="primary" html-type="submit" style="flex: 1">
            注册
          </a-button>
          <a-button type="default" @click="goToLogin" style="flex: 1">
            返回登录
          </a-button>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { UserControllerService, UserRegisterRequest } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import store from "@/store";

const router = useRouter();

/**
 * 注册表单数据
 */
const form = reactive({
  userAccount: "",
  userPassword: "",
  checkPassword: "",
} as UserRegisterRequest);

/**
 * 表单提交
 */
// const handleSubmit = async () => {
//   if (form.userPassword !== form.checkPassword) {
//     message.warning("两次密码不一致！");
//     return;
//   }
//   const res = await UserControllerService.userRegisterUsingPost(form);
//   if (res.code === 0) {
//     message.success("注册成功！");
//     router.push("/login");
//   } else {
//     message.error("注册失败，" + res.message);
//   }
// };

const handleSubmit = async () => {
  const res = await UserControllerService.userRegisterUsingPost(form);

  if (res.code === 0) {
    // 注册成功后自动登录
    const loginRes = await UserControllerService.userLoginUsingPost({
      userAccount: form.userAccount,
      userPassword: form.userPassword,
    });

    if (loginRes.code === 0) {
      await store.dispatch("user/getLoginUser");
      message.success("注册并登录成功！");
      router.push({ path: "/", replace: true });
    } else {
      message.error("注册成功，但登录失败：" + loginRes.message);
    }
  } else {
    message.error("注册失败：" + res.message);
  }
};

/**
 * 返回登录页
 */
const goToLogin = () => {
  router.push("/login");
};
</script>
