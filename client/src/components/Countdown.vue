<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { useMapStore } from '@/stores/useMap'
import { useResetStore } from '@/stores/useReset'

const props = defineProps({
  duration: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  }
})

const emits = defineEmits(['kickoutPlayer'])

function handleKickoutPlayer() {
  emits('kickoutPlayer')
}

const map = useMapStore()
const reset = useResetStore()

const minutes = ref<string | number>(`0${props.duration}`)
const seconds = ref<string | number>('00')
const last60Sec = ref<boolean>(false)

let cdInterval: ReturnType<typeof setInterval>

function countDown(endTime) {
  const secondsLeftms = endTime - Date.now()
  if (secondsLeftms <= 60000) last60Sec.value = true
  const secondsLeft = Math.round(secondsLeftms / 1000)

  minutes.value = Math.floor(secondsLeft / 60)
  seconds.value = secondsLeft % 60

  if (minutes.value < 10) {
    minutes.value = `0${minutes.value}`
  }
  if (seconds.value < 10) {
    seconds.value = `0${seconds.value}`
  }

  if (secondsLeftms < 0) {
    if (props.location === 'TheGame') {
      reset.playerOutOfTime()
    }

    if (props.location === 'ResultWindow') {
      handleKickoutPlayer()
    }
    
    clearInterval(cdInterval)
    minutes.value = '00'
    seconds.value = '00'

  }
}

onMounted(() => {
  const durationMS = props.duration * 60000
  const endTime = durationMS + Date.now()

  cdInterval = setInterval(() => {
    countDown(endTime)
    if (reset.getActivePlayerCount === 0 && props.location === 'TheGame') clearInterval(cdInterval)
  }, 1000)
})
</script>

<template>
  <div>
    <div v-if="props.location === 'TheGame'" :class="{ 'text-red-600': last60Sec, 'text-gray-200': !last60Sec }">{{ minutes }}:{{ seconds }}</div>
    <div v-if="props.location === 'ResultWindow'">{{ minutes }}:{{ seconds }}</div>
  </div>
</template>
