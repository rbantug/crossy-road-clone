<template>
  <TresOrthographicCamera
    :args="[
      width / -2, // left
      width / 2, // right
      height / 2, // top
      height / -2, // bottom
      100, // near
      900, // far
    ]"
    :up="[0, 0, 1]"
    :position="[300, -300, 300]"
    :look-at="[0, 0, 0]"
    :zoom="3"
  />
</template>

<script setup>
const size = 300
const viewRatio = window.innerWidth / window.innerHeight
const width = viewRatio < 1 ? size : size * viewRatio
const height = viewRatio < 1 ? size / viewRatio : size
</script>
