<template>
    <div class="flex justify-center items-center min-h-screen bg-gray-100">
        <div class="bg-white p-8 rounded-lg shadow-lg w-96">
            <div>
                <h1 class="text-center mb-6">Login</h1>
                <input type="text" placeholder="ชื่อผู้ใช้" v-model="input.username"
                    class="w-full p-3 border mb-4 rounded-md focus:ring-2 focus:ring-blue-500">
                <input type="password" placeholder="รหัสผ่าน" v-model="input.password"
                    class="w-full p-3 border mb-6 rounded-md focus:ring-2 focus:ring-blue-500">
                <button @click="onlogin()"
                    class="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500">
                    ตกลง
                </button>
            </div>
        </div>
    </div>
</template>


<script setup>
definePageMeta({ layout: false })
const {login,user} = useAuth()
const input = ref({username:'',password:''});
async function onlogin(){
   await login(input.value)
   console.log(user.value);
   
}



</script>