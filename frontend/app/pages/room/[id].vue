<template>
  <div class="flex">
    <!-- Calendar -->
    <div class="w-1/2 p-4">
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

          <button
            v-for="(day, i) in showdayInCall"
            :key="i"
            class="text-center h-8"
            :class="colorDay(day.status)"
            @click="selectDay(day.day,day.date, day.status)"
          >
            {{ day.day || "" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Detail -->
    <div class="w-1/2 p-4">
      {{ showSelectDay.getFullYear() }}/{{ showSelectDay.getMonth() }}/{{ showSelectDay.getDate() }}
      <div
        class="bg-white shadow-md rounded-md p-4"
        v-if="showDetail[0] && detailStatus == 1"
      >
        <h2 class="text-xl font-semibold mb-4">Details</h2>
        <p>{{ showDetail[0].title }}</p>
        <div class="border-b border-gray-300 my-4"></div>
        <p>{{ showDetail[0].detail }}</p>
      </div>

      <div
        class="bg-white shadow-md rounded-md p-4"
        v-else-if="showDetail[0] && detailStatus == 0"
      >
        <h2 class="text-xl font-semibold mb-4">Details</h2>
        <tr v-for="detail in showDetail">
          <td>{{ detail.username }}</td>
          <td>
            <button @click="onApprove(detail.id, detail.room_id, detail.date)">
              ✅
            </button>
          </td>
        </tr>
      </div>

      <div class="bg-white shadow-md rounded-md p-4" v-else-if="isShowBooking && user.role != 0">
        <h2 class="text-xl font-semibold mb-4">booking</h2>
        <div>
          title:
          <input
            v-model="bookingInput.title"
            type="text"
            class="w-full p-3 border mb-6 rounded-md "
          />
          discription:
          <textarea
            v-model="bookingInput.discription"
            type="text"
            class="w-full p-3 border mb-6 rounded-md "/>
          <button @click="onBooking()" class="bg-blue-500 text-white py-3 rounded-md hover:bg-green-600">accep</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: "role" });

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
    const url = `${config.public.api}/queue/listing?year=${year}&month=${
      month + 1
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

async function fectchDayDetail(date) {
  try {
    console.log(roomID);
    const url = `${config.public.api}/queue/by_date?room_id=${roomID}&date=${date}`;
    return (await fetcher(url, { credentials: "include" })) || [];
  } catch {
    return [];
  }
}
const {user} = useAuth()
const showDetail = ref([]);
const detailStatus = ref(null);
const isShowBooking = ref(false);
const bookingInput = ref({title:'',discription:''})
const showSelectDay = ref(currentDate)


async function selectDay(d,date, status) {

  if (!d) return ;
    showSelectDay.value = new Date(currentDate.value.getFullYear(),currentDate.value.getMonth(),d)
  
  
  if ( !date) {
    isShowBooking.value = true;
    showDetail.value = [];
    detailStatus.value = -1;
    return;
  }
  isShowBooking.value = false;

  console.log(status);
  detailStatus.value = status;
  showDetail.value = await fectchDayDetail(date);
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
  } catch {}
}


async function onBooking(){
    const url = `${config.public.api}/queue/booking`;
    await fetcher(url, {
      method: "POST",
      body: {
        title: bookingInput.value.title,
        detail: bookingInput.value.discription,
        room_id: roomID,
        date: showSelectDay.value.toISOString(),
      },

      credentials: "include",
    });
    showDetail.value = [];
    detailStatus.value = -1;
    isShowBooking.value = false
    await render();
}
</script>
