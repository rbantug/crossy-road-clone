<script setup>
import 'iconify-icon'
import ThreeScene from './ThreeScene.vue';

import { onMounted } from 'vue';
import { queueMove } from '@/THREE/main_components/Player';

function onPress(e) {
  if (e.key === 'a') {
    queueMove('left')
  }
  if (e.key === 's') {
    queueMove('backward')
  }
  if (e.key === 'd') {
    queueMove('right')
  }
  if (e.key === 'w') {
    queueMove('forward')
  }
}

onMounted(() => {
  window.addEventListener('keydown', (e) => onPress(e))
})
</script>

<template>
  <ThreeScene />
  <div class="absolute bottom-5 min-w-full flex items-end justify-center">
    <div class="grid grid-cols-3 gap-2.5">
      <button
        class="w-full h-10 bg-white border-2 border-solid border-gray-200 shadow cursor-pointer outline-0 col-span-full"
        @click="queueMove('forward')"
      >
        <iconify-icon icon="material-symbols:arrow-drop-up" width="24" height="24" />
      </button>
      <button
        class="w-full h-10 bg-white border-2 border-solid border-gray-200 shadow cursor-pointer outline-0"
        @click="queueMove('left')"
      >
        <iconify-icon icon="material-symbols:arrow-left-rounded" width="24" height="24" />
      </button>
      <button
        class="w-full h-10 bg-white border-2 border-solid border-gray-200 shadow cursor-pointer outline-0"
        @click="queueMove('backward')"
      >
        <iconify-icon icon="material-symbols:arrow-drop-down-rounded" width="24" height="24" />
      </button>
      <button
        class="w-full h-10 bg-white border-2 border-solid border-gray-200 shadow cursor-pointer outline-0"
        @click="queueMove('right')"
      >
        <iconify-icon icon="material-symbols:arrow-right" width="24" height="24" />
      </button>
    </div>
  </div>
</template>
