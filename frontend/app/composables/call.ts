export function useCall() {

    const dayInCalls = useState<Record<string, Day[]>>("dayInCalls", () => ({}));
    const queue = useQueue();
    function getKey(date: Date) {
        return `${date.getMonth() + 1}/${date.getFullYear()}`;
    }
    async function getCallInMonth(date: Date) {
        const key = getKey(date);
        if (!dayInCalls.value[key]) {
            setCallInMonth(date, await render(date))
        }
        return dayInCalls.value[key];
    }

    function setCallInMonth(date: Date, calls: Day[]) {
        const key = getKey(date);
        dayInCalls.value[key] = calls;
    }

    const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();

    async function render(date: Date) {
        const y = date.getFullYear();
        const m = date.getMonth();

        let dayInCall: Day[] = [];
        const firstDay = new Date(y, m, 1).getDay();

        for (let i = 0; i < firstDay; i++) {
            dayInCall.push({ day: null, status: null, date: null });
        }

        const daysInMonth = getDaysInMonth(y, m);
        console.log(`Days in month ${m + 1}/${y}: `, daysInMonth);
        const { data } = await queue.getQueues(y, m + 1,1);
        console.log(data.value);
        
        for (let d = 1; d <= daysInMonth; d++) {
            let status = null;
            let itemDate = null;
            for (const item of data.value?.result || []) {
                const dbDate = new Date(item.date);
                if (dbDate.getDate() == d) {
                    status = item.status;
                    itemDate = item.date;
                    break;
                }
            }
            dayInCall.push({ day: d, status: status, date: new Date(y, m, d + 1) });
        }
        return dayInCall;
    }
    return { getCallInMonth, getKey }
}