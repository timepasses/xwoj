<template>
  <a-form ref="formRef" layout="horizontal" :model="form" :rules="rules">
    <a-form-item field="username" validate-trigger="blur" hide-label>
      <a-input
        v-model="form.username"
        style="height: 40px"
        autocomplete="username"
        placeholder="请输入用户名"
      >
        <template #prefix>
          <icon-user />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item field="password" validate-trigger="blur" hide-label>
      <a-input-password
        v-model="form.password"
        style="height: 40px"
        autocomplete="current-password"
        placeholder="请输入密码"
        allow-clear
      >
        <template #prefix>
          <icon-lock />
        </template>
      </a-input-password>
    </a-form-item>
    <a-form-item field="checkPassword" validate-trigger="blur" hide-label>
      <a-input-password
        v-model="form.checkPassword"
        style="height: 40px"
        autocomplete="current-password"
        placeholder="请确认密码"
        allow-clear
      >
        <template #prefix>
          <icon-lock />
        </template>
      </a-input-password>
    </a-form-item>
    <a-form-item field="mobile" validate-trigger="blur" hide-label>
      <a-input-number
        v-model="form.mobile"
        style="height: 40px"
        placeholder="请输入手机号"
        allow-clear
        hide-button
      >
        <template #prefix>
          <icon-phone />
        </template>
      </a-input-number>
    </a-form-item>
    <a-form-item field="captcha" validate-trigger="blur" hide-label>
      <a-space size="large">
        <a-input
          v-model="form.captcha"
          style="height: 40px"
          placeholder="请输入验证码"
          allow-clear
        >
          <template #prefix>
            <icon-bold />
          </template>
        </a-input>
        <a-tooltip content="点击获取">
          <a-image
            style="cursor: pointer"
            alt="验证码"
            :src="captchaUrl"
            :preview="false"
            show-loader
            @click="getCaptcha"
          />
        </a-tooltip>
      </a-space>
    </a-form-item>
    <a-button
      type="primary"
      style="margin: 0 0 6px"
      long
      :loading="loading"
      @click="handleSubmit"
    >
      注册
    </a-button>
  </a-form>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { useStorage } from "@vueuse/core";
import { useUserStore } from "@/store";
import useLoading from "@/hooks/useLoading.ts";
import { nanoid } from "nanoid";
import { RegisterRequest } from "@/api/sys-oj";
import { Message } from "@arco-design/web-vue";

const userStore = useUserStore();
const formRef = ref();
const { loading, setLoading } = useLoading();

const loginConfig = useStorage("login-config", {
  username: "",
  password: "",
  checkPassword: "",
});
const form = reactive({
  username: loginConfig.value.username,
  password: loginConfig.value.password,
  checkPassword: loginConfig.value.checkPassword,
  mobile: "",
  captcha: "",
  uuid: "",
});

const rules = {
  username: [{ required: true, message: "请输入账号/邮箱" }],
  captcha: [{ required: true, message: "请输入验证码" }],
  password: [
    { required: true, message: "请输入密码" },
    {
      // 密码格式：6-32位，包含大小写字母、数字、特殊字符(除空格)两种以上
      match:
        /^(?![\d]+$)(?![a-z]+$)(?![A-Z]+$)(?![~!@#$%^&*.]+$)[\da-zA-z~!@#$%^&*.]{6,32}$/,
      message: "密码格式不正确",
    },
  ],
  checkPassword: [
    { required: true, message: "请确认密码" },
    {
      validator: (value: string, cb: any) => {
        if (value !== form.password) {
          cb("两次输入的密码不一致");
        } else {
          cb();
        }
      },
    },
  ],
  mobile: [{ required: true, message: "请输入手机号" }],
};

const handleSubmit = () => {
  if (loading.value) return;

  formRef.value
    .validateField(["username", "password", "checkPassword"])
    .then(async (res) => {
      if (res) return;
      setLoading(true);
      try {
        await userStore.register(form as RegisterRequest).then(() => {
          Message.success("注册成功");
        });
      } catch (error) {
        await getCaptcha();
      } finally {
        setLoading(false);
      }
    });
};

const captchaUrl = ref("");

// 获取验证码
const getCaptcha = () => {
  form.uuid = nanoid();
  captchaUrl.value = `/api/security/captcha?uuid=${form.uuid}`;
};

onMounted(() => {
  getCaptcha();
});
</script>

<style lang="less" scoped>
.register-form {
  &-more {
    justify-content: center;

    .arco-icon {
      font-size: 20px;
      cursor: pointer;
      transition: transform 0.2s ease;

      &:hover {
        transform: scale(1.3);
      }
    }
  }
}
</style>
