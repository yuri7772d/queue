<template>
  <div class="flex justify-center">

    <div class="flex flex-col md:flex-row">
      <!-- Calendar -->
      <div class="w-[500px] p-4">
        <div class="bg-white shadow-md rounded-md p-4">
          <!-- header -->
          <div class="flex justify-between items-center">
            <button @click="changeMonth(-1)">‹</button>
            <h2 class="text-xl font-semibold">{{ showYM }}</h2>
            <button @click="changeMonth(1)">›</button>
          </div>

          <!-- days -->
          <div class="grid grid-cols-7 gap-2 mt-2">
            <p v-for="d in WeekDayNames" :key="d" class="text-center">{{ d }}</p>

            <button v-for="(day, i) in showdayInCall" :key="i" class="text-center h-8" :class="colorDay(day.status)"
              @click="selectDay(day.day, day.date, day.status)">
              {{ day.day || "" }}
            </button>
          </div>
        </div>
      </div>

      <!-- Detail -->
      <div class=" p-4 w-[500px]">
        {{ showSelectDay.getFullYear() }}/{{ showSelectDay.getMonth() }}/{{ showSelectDay.getDate() }}
        <div class="bg-white shadow-md rounded-md p-4" v-if="showDetail[0] && detailStatus == 1">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold mb-4">Details</h2>
            <div>
              <button v-if="user.id == showDetail[0].auth_id" class="bg-yellow-500 text-white px-2 py-1 rounded"
                @click="openEdit(showDetail[0])">
                Edit
              </button>
              <button v-if="user.role == 0 || user.role == 1" class="bg-red-500 text-white px-2 py-1 rounded"
                @click="onCancalQueue(showDetail[0])">
                Cancel
              </button>
            </div>
          </div>

          <p>{{ showDetail[0].title }}</p>

          <div class="border-b border-gray-300 my-4"></div>
          <pre>{{ showDetail[0].detail }} </pre>

          <div class="mt-5" v-if="filesList.length > 0"> files:</div>
          <ul class="space-y-2">
            <li v-for="f in filesList" :key="f.id"
              class="flex items-center justify-between bg-gray-50 border rounded-md px-3 py-2 hover:bg-gray-100"
              @click="dowloadFile(f.id)">
              <div class="flex items-center gap-2 truncate">
                <span class="text-blue-500">📄</span>
                <span class="truncate text-sm font-medium">
                  {{ f.original_name }}
                </span>
              </div>

              <!-- action -->
              Download
            </li>
          </ul>


        </div>

        <div class="bg-white shadow-md rounded-md p-4" v-else-if="showDetail[0] && detailStatus == 0">
          <h2 class="text-xl font-semibold mb-4">Details</h2> <button @click="detailStatus = 2"
            class="mb-3 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            ➕ booking
          </button>
          <tr v-for="detail in showDetail">
            <td>{{ detail.username }}</td>
            <td>
              <button @click="onApprove(detail.id, detail.room_id, detail.date)">
                ✅
              </button>
            </td>
          </tr>
        </div>

        <div class="bg-white shadow-md rounded-md p-4" v-else-if="detailStatus == 2">
          <h2 class="text-xl font-semibold mb-4">booking</h2>
          <div>
            title:
            <input v-model="bookingInput.title" type="text" class="w-full p-3 border mb-6 rounded-md " />
            discription:
            <textarea v-model="bookingInput.discription" type="text" class="w-full h-52 p-3 border mb-6 rounded-md " />
            file:
            <div class="p-4">


              <!-- Add file button -->
              <button @click="openFilePicker"
                class="mb-3 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                ➕ Add files
              </button>

              <!-- hidden input -->
              <input ref="fileInput" type="file" multiple class="hidden" @change="onFileChange" />

              <!-- File list -->
              <div v-if="files.length" class="space-y-2 mb-4">
                <div v-for="(file, index) in files" :key="index"
                  class="flex justify-between items-center border rounded-md px-3 py-2">
                  <div class="truncate">
                    <p class="font-medium">{{ file.name }}</p>
                    <p class="text-xs text-gray-500">
                      {{ (file.size / 1024).toFixed(1) }} KB
                    </p>
                  </div>

                  <button @click="removeFile(index)" class="text-red-500 hover:text-red-700">
                    ✖
                  </button>
                </div>
              </div>
            </div>

            <!-- input file (ซ่อน) -->
            <input ref="fileInput" type="file" class="hidden" @change="onFileChange" />
          </div>
          <div class="flex justify-end">
            <button @click="onBooking()"
              class=" px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">accep</button>
          </div>

        </div>


        <!-- Edit Modal -->
        <div v-else-if="detailStatus == 3">
          <h2 class="text-xl font-semibold mb-4">Edit Booking</h2>

          <!-- Title -->
          <label class="block mb-2 font-medium">Title</label>
          <input v-model="editInput.title" type="text" class="w-full p-3 border rounded-md mb-4" />

          <!-- Description -->
          <label class="block mb-2 font-medium">Description</label>
          <textarea v-model="editInput.discription"
            class="w-full h-40 p-3 border rounded-md mb-4 whitespace-pre-wrap" />


          <!-- Old Files -->
          <div v-if="editInput.files?.length" class="mb-4">
            <p class="font-medium mb-2">Existing files</p>
            <div class="space-y-2">
              <div v-for="(f, i) in editInput.files" :key="i"
                class="flex justify-between items-center border rounded-md px-3 py-2">
                <span class="truncate">{{ f.original_name }}</span>
                <button @click="removeOldFile(i)" class="text-red-500 hover:text-red-700">✖</button>
              </div>
            </div>
          </div>

          <!-- Add New Files -->
          <button @click="openFilePicker"
            class="mb-3 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            ➕ Add files
          </button>

          <input ref="fileInput" type="file" multiple class="hidden" @change="onFileChange" />
          <!-- New File List -->
          <div v-if="files.length" class="space-y-2 mb-4">
            <div v-for="(file, index) in files" :key="index"
              class="flex justify-between items-center border rounded-md px-3 py-2">
              <div class="truncate">
                <p class="font-medium">{{ file.name }}</p>
                <p class="text-xs text-gray-500">
                  {{ (file.size / 1024).toFixed(1) }} KB
                </p>
              </div>
              <button @click="removeFile(index)" class="text-red-500 hover:text-red-700">✖</button>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3">
            <button @click="onCancleEdit" class="px-4 py-2 border rounded-md hover:bg-gray-100">
              Cancel
            </button>

            <button @click="onUpdate" class="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: "role" });
const { user } = useAuth();
const route = useRoute();
const roomID = route.params.id;
const config = useRuntimeConfig();
const fetcher = useRequestFetch();

const WeekDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const showdayInCall = ref([]);
const currentDate = ref(new Date());
const showYM = ref("");

const colorDay = (status) => ({
  "bg-blue-500 text-white": status == 1,
  "bg-yellow-100": status == 0,
});

const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();

async function fetchDate(year, month) {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
console.log(tz);
// เช่น "Asia/Bangkok"

    const url = `${config.public.api}/queue/listing?tz=${tz}&year=${year}&month=${month + 1
      }&room_id=${roomID}`;
    return (await fetcher(url, { credentials: "include" }))?.result || [];
  } catch {
    return [];
  }
}

async function render() {
  console.log("on reder");

  const date = currentDate.value;
  const y = date.getFullYear();
  const m = date.getMonth();

  showYM.value = `${m + 1}/${y}`;

  let dayInCall = [];
  const dateData = await fetchDate(y, m);
  console.log(dateData);
  const firstDay = new Date(y, m, 1).getDay();

  for (let i = 0; i < firstDay; i++) {
    dayInCall.push({ day: null, status: -1, date: null });
  }

  const daysInMonth = getDaysInMonth(y, m);

  for (let d = 1; d <= daysInMonth; d++) {
    let status = -1;
    let itemDate = null;
    for (const item of dateData) {
      const dbDate = new Date(item.date);
      if (dbDate.getDate() == d) {
        status = item.status;
        itemDate = item.date;
        break;
      }
    }
    dayInCall.push({ day: d, status: status, date: itemDate });
  }
  showdayInCall.value = dayInCall;
}

async function changeMonth(step) {
  const date = currentDate.value;
  currentDate.value = new Date(date.getFullYear(), date.getMonth() + step, 1);
  await render();
}

await render();

async function fectchfileList(queue_id) {
  try {
    console.log(queue_id);
    const url = `${config.public.api}/file/listing?queue_id=${queue_id}`;
    return (await fetcher(url, { credentials: "include" })) || [];
  } catch (error) {
    console.log(error?.data || error);
    return [];
  }

}
const filesList = ref([]);

async function fectchDayDetail(date) {
  try {
    console.log(roomID);
    const url = `${config.public.api}/queue/by_date?room_id=${roomID}&date=${date}`;
    return (await fetcher(url, { credentials: "include" })) || [];
  } catch {
    return [];
  }

}
const showDetail = ref([]);
const detailStatus = ref(null);
const isShowBooking = ref(false);
const bookingInput = ref({ title: '', discription: '' })
const showSelectDay = ref(currentDate)


async function selectDay(d, date, status) {

  if (!d) return;
  showSelectDay.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), d)


  if (!date) {

    showDetail.value = [];
    detailStatus.value = 2;
    return;
  }
  isShowBooking.value = false;

  console.log(status);
  detailStatus.value = status;
  showDetail.value = await fectchDayDetail(date);
  if (status == 1) {
    // ผู้จองคนเดียวเท่านั้นถึงโหลดไฟล์
    filesList.value = await fectchfileList(showDetail.value[0].id);
  } else {
    filesList.value = [];
  }

}

async function onApprove(queue_id, room_id, date) {
  try {
    console.log(roomID);
    const url = `${config.public.api}/queue/approve`;
    await fetcher(url, {
      method: "PUT",
      body: {
        queue_id: queue_id,
        room_id: room_id,
        date: date,
      },

      credentials: "include",
    });
    showDetail.value = [];
    detailStatus.value = -1;
    await render();
  } catch { }
}



const fileInput = ref(null);
const files = ref([]);

function openFilePicker() {
  fileInput.value.click();
}

function onFileChange(e) {
  const selected = Array.from(e.target.files);

  // กันไฟล์ซ้ำ
  for (const f of selected) {
    if (!files.value.some(x => x.name === f.name && x.size === f.size)) {
      files.value.push(f);
    }
  }
  e.target.value = ""; // reset
}

function removeFile(index) {
  files.value.splice(index, 1);
}

async function uploadFile(queue_id, f) {
  try {
    const fd = new FormData();
    fd.append("queue_id", queue_id);
    fd.append("file", f)
    await fetcher(`${config.public.api}/file/upload`, {
      method: "POST",
      body: fd,
      credentials: "include",
    });
  } catch (err) {
    console.log(err?.data);
  }
}
async function onBooking() {
  const url = `${config.public.api}/queue/booking`;
  try {
    showSelectDay.value.setHours(0, 0, 0, 0);
    const result = await fetcher(url, {
      method: "POST",
      body: {
        title: bookingInput.value.title,
        detail: bookingInput.value.discription,
        room_id: roomID,
        date: showSelectDay.value.toISOString(),
      },

      credentials: "include",
    });
  
    if (files.value.length > 0) {
      for (const f of files.value) {
        await uploadFile(result.id, f);
      }
    }
    files.value = [];
    bookingInput.value = { title: '', discription: '' }
    showDetail.value = [];
    detailStatus.value = -1;
    isShowBooking.value = false
    await render();
  } catch (error) {
    alert(`ไม่สามารถจองคิวได้ : ${error.data.msg || มีบางอย่างผิดพลาด}`);
    console.log("upload file error:", error?.data || error);
  }

}
async function dowloadFile(file_id) {
  try {
    const url = `${config.public.api}/file/download?file_id=${file_id}`;
    const res = await fetcher(url, {
      method: "GET",
      credentials: "include",
    });
    const blob = new Blob([res], { type: res.type });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filesList.value.find(f => f.id === file_id)?.original_name || 'downloaded_file';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.log("download file error:", error?.data || error);
  }
}


const editInput = ref({
  id: null,
  title: '',
  discription: '',
  files: [] // ไฟล์เดิมจาก backend
})
let removelist = [];

const removeOldFile = (index) => {
  removelist.push(editInput.value.files[index].id);
  editInput.value.files.splice(index, 1)
}

async function openEdit(queue) {
  removelist = [];
  filesList.value = await fectchfileList(queue.id);
  editInput.value = {
    id: queue.id,
    title: queue.title,
    discription: queue.detail,
    files: filesList.value.slice() // คัดลอกไฟล์เดิม
  };
  detailStatus.value = 3;
}

function onCancleEdit() {
  editInput.value = {
    id: null,
    title: '',
    discription: '',
    files: []
  };
  files.value = [];
  filesList.value = [];
  showDetail.value = [];
  detailStatus.value = -1;
  removelist = [];
}




const onUpdate = async () => {
  try {
    const url = `${config.public.api}/queue/title_detail`;
    await fetcher(url, {
      method: "PATCH",
      body: {
        queue_id: showDetail.value[0].id,
        title: showDetail.value[0].title,
        detail: showDetail.value[0].detail,
      },
      credentials: "include",
    });

    // อัพโหลดไฟล์ใหม่
    if (files.value.length > 0) {
      for (const f of files.value) {
        await uploadFile(showDetail.value[0].id, f);
      }
    }
    if (removelist.length > 0) {
      // ลบไฟล์ที่เลือก
      for (const file_id of removelist) {
        await fetcher(`${config.public.api}/file/delete`, {
          method: "DELETE",
          body: { file_id: file_id },
          credentials: "include",
        });
      }
    }

    files.value = [];
    filesList.value = [];
    showDetail.value = [];
    detailStatus.value = -1;
    removelist = [];
    await render();
  } catch (error) {
    console.log("onUpdate error:", error?.data || error);
  }
}

async function onCancalQueue(queue) {
  try {
    const url = `${config.public.api}/queue/cancal`;
    await fetcher(url, {
      method: 'put',
      body: {
        queue_id: queue.id,
        room_id: queue.room_id,
        date: queue.date,
      },

      credentials: "include",
    });
    showDetail.value = [];
    detailStatus.value = -1;
    await render();
  } catch { }
}
</script>
