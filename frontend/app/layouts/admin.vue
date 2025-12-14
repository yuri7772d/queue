<template>
  <div>
    <nav class="bg-blue-600 p-4 flex justify-between">
      <ul class="flex space-x-4 ">
         <h1><nuxt-link to="/" class="text-white ">admin     | </nuxt-link></h1>   
        <li><nuxt-link to="/room" class="text-white ">room</nuxt-link></li>
        <li><nuxt-link to="/account" class="text-white ">account</nuxt-link></li>
      </ul>
      <button @click="onLogout()" class="bg-white">Logout</button>
    </nav>
    <slot></slot>
  </div>
</template>
<script setup>
const {logout} = useAuth()
function onLogout() {
    logout()
}

</script>