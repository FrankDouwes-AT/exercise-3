<template>
  <div class="container">
    <p class="result" v-if="avrotrosStore.$state.values">{{avrotrosStore.$state.values}}</p>
  </div>
</template>

<script setup lang="ts">

import {useAvroTrosStore} from "~/store/avrotros";

const avrotrosStore = useAvroTrosStore()

</script>

<style lang="scss" scoped>

.container {

  display: flex;
  justify-content: center;

  margin-bottom: 20px;
}

.result {

  @include label;

  font-size: 24px;
  color: hsl(var(--color-purple));
}
</style>