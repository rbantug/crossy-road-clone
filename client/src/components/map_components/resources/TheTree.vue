<template>
  <TresGroup cast-shadow :position-x="props.tileIndex * tileSize" name="tree">
    <!-- trunk -->
    <TresMesh :position-z="10" cast-shadow>
      <TresBoxGeometry :args="[15, 15, 20]" />
      <TresMeshLambertMaterial color="#ffeecc" flat-shading />
    </TresMesh>

    <!-- leaves -->
    <TresMesh :position-z="props.height / 2 + 20" cast-shadow>
      <TresBoxGeometry :args="[30, 30, props.height]" />
      <TresMeshLambertMaterial color="#009900" flat-shading />
    </TresMesh>
  </TresGroup>
</template>

<script setup>
import { tileSize } from '@/components/utils/constants'

const props = defineProps({
  tileIndex: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
})
</script>
