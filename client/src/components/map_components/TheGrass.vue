<template>
  <TresGroup :position-y="props.rowIndex * tileSize" name="grass">
    <TresMesh :position-z="1.5" receive-shadow cast-shadow>
      <TresBoxGeometry :args="[tilePerRow * tileSize, tileSize, 3]" />
      <TresMeshLambertMaterial color="#66ff33" />
    </TresMesh>
    <template v-if="props.haveTrees">
      <TheTree
        v-for="tree in props.treeData"
        :key="tree.id"
        :tile-index="tree.tileIndex"
        :height="tree.height"
      />
    </template>
  </TresGroup>
</template>

<script setup>
import { tilePerRow, tileSize } from '@/components/utils/constants'
import TheTree from './resources/TheTree.vue'

const props = defineProps({
  rowIndex: {
    type: Number,
    required: true,
  },
  treeData: {
    type: Array,
    required: false,
  },
  haveTrees: {
    type: Boolean,
    required: false,
    default: false,
  },
})
</script>
