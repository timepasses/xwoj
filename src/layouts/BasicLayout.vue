<template>
  <div id="basiclayout">
    <a-layout style="height: 400px">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">学习基</a-layout-footer>
    </a-layout>
  </div>
</template>
<style>
#basiclayout {
}

#basiclayout .header {
  background: aqua;
  color: #42b983;
  margin-bottom: 16px;
}

#basiclayout .content {
  background: linear-gradient(to right, #eee, #0000ff);
  margin-bottom: 16px;
}

#basiclayout .footer {
  background: antiquewhite;
  padding: 16px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
</style>
<script setup lang="ts">
import GlobalHeader from "@/components/GlobalHeader.vue";
</script>
