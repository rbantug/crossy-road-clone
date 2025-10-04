<template>
  <TresMesh :position-x="props.positionX" :position-z="6" name="Wheel">
    <TresBoxGeometry :args="[12, 33, 12]" />
    <TresMeshLambertMaterial color="#000000" flat-shading />
  </TresMesh>
</template>

<script setup lang="ts">
const props = defineProps({
  positionX: {
    type: Number,
    required: true,
  },
})
</script>
