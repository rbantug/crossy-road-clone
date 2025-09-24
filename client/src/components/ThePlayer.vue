<script setup>
</script>

<template>
  <TresGroup>
    <!-- player body -->
    <TresMesh :position="[0, 0, 10]" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[15, 15, 20]" />
      <TresMeshLambertMaterial color="white" flat-shading />
    </TresMesh>

    <!-- player cap -->
    <TresMesh :position="[0, 0, 21]" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[2, 4, 2]" />
      <TresMeshLambertMaterial color="red" flat-shading />
    </TresMesh>
  </TresGroup>
</template>
