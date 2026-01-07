<template>
         <div class=" p-4 w-[500px]">
        {{ showSelectDay.getFullYear() }}/{{ showSelectDay.getMonth() }}/{{ showSelectDay.getDate() }}
        <div class="bg-white shadow-md rounded-md p-4" v-if="showDetail[0] && detailStatus == 1">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold mb-4">Details</h2>
            <div>
              <button v-if="user?.id == showDetail[0].auth_id" class="bg-yellow-500 text-white px-2 py-1 rounded"
                @click="openEdit(showDetail[0])">
                Edit
              </button>
              <button v-if="user?.role == 0 || user?.role == 1" class="bg-red-500 text-white px-2 py-1 rounded"
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
        </div>
</template>
<script lang="ts" setup>

    const props = defineProps<{
        showDetail: Queue[],
        detailStatus: number,
        showSelectDay: Date,
    }>();

    const filesList = ref<FileMeta[]>([]);
    
    const {user} = useAuth();
    function dowloadFile(fileId:number) {
       // const url = useRuntimeConfig().public.apiBase + '/files/download/' + fileId;
    }
    function onCancalQueue(queue:Queue) {
        // implement cancel queue logic here
    }
    function openEdit(queue:Queue) {
        // implement open edit modal logic here
    }
</script>