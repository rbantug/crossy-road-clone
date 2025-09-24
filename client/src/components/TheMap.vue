<template>
  <TheGrass v-for="n in startingGrass" :rowIndex="n" :key="n" />
  <TresGroup ref="mapGroup" name="map">
    <template v-for="row in game.getMetadata" :key="row.id">
      <TheRoad
        v-if="row.type === 'car' || row.type === 'truck'"
        :rowIndex="row.id"
        :vehicle="row.type"
        :vehicleData="row.vehicles"
        :direction="row.direction"
        :speed="row.speed"
      />
      <TheGrass
        v-if="row.type === 'forest'"
        :rowIndex="row.id"
        :treeData="row.trees"
        :haveTrees="true"
      />
    </template>
  </TresGroup>
</template>

<script setup>
import { useGameStore } from '@/stores/useGame.js'
import { arrayRange } from './utils/arrayRange'

import { onMounted } from 'vue'
import TheGrass from './map_components/TheGrass.vue'
import TheRoad from './map_components/TheRoad.vue'

const startingGrass = arrayRange(-4, 0, 1)

const game = useGameStore()

onMounted(() => {
  game.addRow()
})
</script>
