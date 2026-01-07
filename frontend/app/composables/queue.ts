export function useQueue() {
    const config = useRuntimeConfig();
  function getQueues(year: number, month: number, room_id: number) {
     const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return useAsyncData(`queue-${year}-${month}-${room_id}`, () => $fetch<{result: Queue[]}>(
        `${config.public.api}/queue/listing?tz=${tz}&year=${year}&month=${month}&room_id=${room_id}`,
        {
          credentials: "include",
          headers: useRequestHeaders(['cookie']),
        }
      ));
  }
    return { getQueues };
}