<template>
  <div>
    <div>
      <input
        type="text"
        placeholder="ชื่อผู้ใช้"
        v-model="input.username"
        class="p-3 border mb-4 rounded-md focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder="รหัสผ่าน"
        v-model="input.password"
        class="p-3 border mb-6 rounded-md focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="number"
        placeholder="role"
        v-model="input.role"
        class="p-3 border mb-6 rounded-md focus:ring-2 focus:ring-blue-500"
      />
      <button
        @click="onAdd()"
        class="bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
      >
        ตกลง
      </button>
    </div>
    <div>
      <ul>
        <div>
          <tr>
            <th>username</th>
            <th>password</th>
            <th>role</th>
            
          </tr>
         <tr v-for="user in users">
          <td>
            {{ user.username }}
          </td>
          <td>
{{ user.password }}
          </td>
        <td>
{{ user.role }}
        </td> 
      <td>
<button class="bg-red-500 text-white py-3 rounded-md hover:bg-red-600 " @click="onDelete(user.id)">delete</button>
      </td>  
      </tr>
        </div>
      </ul>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware:'role' })

const input = ref({ username:'', password:'', role:null })
const config = useRuntimeConfig()
const fetch = useRequestFetch()
const users = ref([])


async function load() {
  try {
    users.value = await fetch(`${config.public.api}/auth/listing`, {
      credentials: "include",
    })
  } catch (err) {
    console.log(err)
  }
}

onMounted(() => {
  load()
})

async function onDelete(id) {
    try {
    await fetch(`${config.public.api}/auth`, {
      method: 'DELETE',
      body: {
        auth_id: id
      },
      credentials: "include",
    })
    await load()
  } catch (err) {
    console.log(err)
    alert("add failed: ",err?.data?.msg)
  }
}

async function onAdd(){
  try {
    await fetch(`${config.public.api}/auth`, {
      method: "POST",
      body: {
        username: input.value.username,
        password: input.value.password,
        role: input.value.role
      },
      credentials: "include",
    })
    await load()
  } catch (err) {
    console.log(err)
    alert("add failed: ",err?.data?.msg)
  }
}
</script>

