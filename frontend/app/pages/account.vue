<template>
  <div class="border rounded-md">

    <!-- 🔹 FORM (ไม่เลื่อน) -->
    <div class="p-4 border-b bg-white">
      <div class="flex gap-2">
        <input v-model="input.username" placeholder="ชื่อผู้ใช้" class="p-3 border rounded-md" />
        <input v-model="input.password" placeholder="รหัสผ่าน" class="p-3 border rounded-md" />
        <input v-model="input.role" type="number" placeholder="role" class="p-3 border rounded-md w-24" />
        <button @click="onAdd" class="bg-blue-500 text-white px-4 py-2 rounded">
          เพิ่ม
        </button>
      </div>
    </div>
 
    <!-- 🔹 TABLE -->
    <table class="w-full border-collapse">
      <thead class="sticky top-0 bg-gray-100 z-10">
        <tr class="border-b">
          <th class="p-3 text-left">username</th>
          <th class="p-3 text-left">password</th>
          <th class="p-3 text-left">role</th>
          <th class="p-3 text-right">action</th>
        </tr>
      </thead>
    </table>

    <!-- 🔹 BODY SCROLL -->
    <div ref="scrollBox" @scroll="onScroll" class="h-[350px] overflow-y-auto">

      <table class="w-full border-collapse">
        <tbody>
          <tr v-for="user in users" :key="user.id" class="border-b hover:bg-gray-50">
            <td class="p-3">{{ user.username }}</td>
            <td class="p-3">{{ user.password }}</td>
            <td class="p-3">{{ user.role }}</td>
            <td class="p-3 text-right flex gap-2 justify-end">
              <button class="bg-yellow-500 text-white px-2 py-1 rounded" @click="openEdit(user)">
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- status -->
      <div v-if="loading" class="text-center py-4">
        กำลังโหลด...
      </div>
      <div v-if="!hasMore" class="text-center py-4 text-gray-500">
        ไม่มีข้อมูลแล้ว
      </div>
    </div>
    <!-- Edit Modal -->
    <div v-if="showEdit" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white w-[400px] rounded-lg p-6">
        <h2 class="text-lg font-semibold mb-4">แก้ไขผู้ใช้</h2>

        <input v-model="editForm.username" type="text" class="w-full p-2 border rounded mb-3 bg-gray-100" />

        <input v-model="editForm.password" type="password" placeholder="รหัสผ่านใหม่ (ไม่กรอก = ไม่เปลี่ยน)"
          class="w-full p-2 border rounded mb-3" />

        <input v-model="editForm.role" type="number" class="w-full p-2 border rounded mb-4" />

        <div class="flex justify-end gap-2">
          <button @click="closeEdit" class="px-4 py-2 bg-gray-400 text-white rounded">
            ยกเลิก
          </button>

          <button @click="onUpdate" class="px-4 py-2 bg-blue-500 text-white rounded">
            บันทึก
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'role' })
const { user } = useAuth()
if (!user.value || user.value.role !== 0) {
  navigateTo('/')
}

const input = ref({ username: '', password: '', role: null })
const config = useRuntimeConfig()
const fetch = useRequestFetch()

const users = ref([])
const page = ref(1)
const perPage = 10
const loading = ref(false)
const hasMore = ref(true)

const showEdit = ref(false)

const editForm = ref({
  id: null,
  username: '',
  password: '',
  role: null,
})


const scrollBox = ref(null)

async function load() {
  if (loading.value || !hasMore.value) return

  loading.value = true

  try {
    const data = await fetch(
      `${config.public.api}/auth/listing?page=${page.value}&per_page=${perPage}`,
      { credentials: 'include' }
    )

    if (data.length < perPage) {
      hasMore.value = false
    }

    users.value.push(...data)
    page.value++
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}

function onScroll() {
  const el = scrollBox.value
  if (!el) return

  const nearBottom =
    el.scrollTop + el.clientHeight >= el.scrollHeight - 50

  if (nearBottom) {
    load()
  }
}

onMounted(() => {
  load()
})

async function onAdd() {
  await fetch(`${config.public.api}/auth`, {
    method: 'POST',
    body: {
      username: input.value.username,
      password: input.value.password,
      role: input.value.role,
    },
    credentials: 'include',
  })

  users.value = []
  page.value = 1
  hasMore.value = true
  await load()
}

function openEdit(user) {
  editForm.value = {
    id: user.id,
    username: user.username,
    password: user.password,
    role: user.role,
  }
  showEdit.value = true
}

function closeEdit() {
  showEdit.value = false
}

async function onUpdate() {
  try {
    await fetch(`${config.public.api}/auth`, {
      method: 'PATCH',
      body: {
        auth_id: editForm.value.id,
        username: editForm.value.username,
        password: editForm.value.password || undefined,
        role: editForm.value.role,
      },
      credentials: 'include',
    })

    closeEdit()

    // โหลดใหม่ให้ตรงกับ infinite scroll
    users.value = []
    page.value = 1
    hasMore.value = true
    await load()
  } catch (err) {
    console.log('onUpdate', err?.data)

    alert(err?.data?.msg || 'update failed')
  }
}

</script>
