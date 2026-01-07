<template>
  <div class="flex flex-col md:flex-row">
    <!-- Calendar -->
    <div class="w-[500px] p-4">
      <div class="bg-white shadow-md rounded-md p-4">
        <!-- header -->
        <div class="flex justify-between items-center">
          <button class="text-5xl" @click="changeMonth(-1)">‹</button>
          <h2 class="text-xl font-semibold">{{ showYM }}</h2>
          <button class="text-5xl" @click="changeMonth(1)">›</button>
        </div>

        <!-- days -->
        <div class="grid grid-cols-7 gap-2 mt-2">
          <p v-for="d in WeekDayNames" :key="d" class="text-center">{{ d }}</p>

          <button v-for="(day, i) in showdayInCall" :key="i" class="text-center h-8" :class="colorDay(day)"
            @click="selectDay(day)" >
            {{ day.day || "" }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">



const { getCallInMonth, getKey } = useCall();
const WeekDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const showdayInCall = ref<Day[] | undefined>([]);
const currentDate = ref(new Date());
const showYM = ref("");
const selectDayOn = ref(-1);

const colorDay = (day :Day) => ({
  "bg-blue-500 text-white": day.status == 1,
  "bg-yellow-100": day.status == 0,
  "border-2 border-slate-500": selectDayOn.value == day.day,
});

async function changeMonth(step:number) {
  const date = currentDate.value;
  currentDate.value = new Date(date.getFullYear(), date.getMonth() + step, 1);
}

watch(currentDate, async (d) => {
  showdayInCall.value = await getCallInMonth(d) 
  showYM.value = getKey(d)
}, { immediate: true })


const emit = defineEmits(['selectDay']);
function selectDay(day: Day) {
 // console.log(day.date?.toISOString());
  selectDayOn.value = day.day || -1;
  if (day.date) {
    emit('selectDay', day);
  }
}

</script>