<template>
  <TresDirectionalLight
    :position="[-100, -100, 200]"
    :up="[0, 0, 1]"
    cast-shadow
    :shadow-mapSize-width="2048"
    :shadow-mapSize-height="2048"
    :shadow-camera-up="[0, 0, 1]"
    :shadow-camera-left="-400"
    :shadow-camera-right="400"
    :shadow-camera-top="400"
    :shadow-camera-bottom="-400"
    :shadow-camera-near="50"
    :shadow-camera-far="400"
    :target="props.target"
  />
</template>

<script setup>
const props = defineProps({
  target: {
    type: Object,
    required: true,
  },
})
</script>
