<template>
  <component v-for="(component, index) in COMPONENTS" :is="component.component" :key="`component_${index}`" />
</template>

<script setup lang="ts">
    /* you could totally add IntersectionObserver logic here to load / show components when needed */
    import {COMPONENTS} from "~/components/DynamicComponents/constants";
</script>
