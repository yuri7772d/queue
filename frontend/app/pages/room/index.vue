<template>
  <ul>
    <li><nuxt-link to="/room/1">room1</nuxt-link></li>
    <li><nuxt-link to="/room/2">room2</nuxt-link></li>
    <li><nuxt-link to="/room/3">room3</nuxt-link></li>
  </ul>
</template>
<script>
    definePageMeta({
      middleware:'role'
    })
</script>