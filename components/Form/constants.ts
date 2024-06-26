import type {TSelectOption} from "~/components/Form/types";

// Some basic presets, loosely based on the AvroTros style introduction video I watched a year ago.
export const PRESETS: Array<TSelectOption> = [
    {
        label: "default",
        value: "43211234"
    },
    {
        label: "reverse",
        value: "12344321"
    },
    {
        label: "AVROtros",
        value: "55552222"
    },
    {
        label: "avroTROS",
        value: "22225555"
    },
    {
        label: "avrotros",
        value: "11111111"
    },
    {
        label: "AVROTROS",
        value: "77777777"
    },
    {
        label: "custom",
        // not setting a value, and using component logic to show an input
    }
]