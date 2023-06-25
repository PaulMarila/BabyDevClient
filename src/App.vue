<script setup>
import { RouterView } from "vue-router";
</script>

<template>
  <div class="wrapper">
    <suspense>
      <RouterView />
    </suspense>
  </div>
</template>

<style>
.wrapper {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 16px;
  font-weight: 400;
  background-image: url('@/assets/linen-grey.jpg');
}
</style>