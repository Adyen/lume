import {ComputedRef, nextTick, onBeforeMount, onMounted, ref} from "@vue/composition-api";

export function useAnimation(
    groupedData: ComputedRef<Array<number[]>>
) {
    // Public reactive variables

    const animate = ref(false);
    const suspendedData = ref([]);

    // Hooks

    onBeforeMount(() => {
        suspendedData.value = new Array(groupedData.value.length);
        groupedData.value.forEach((record, index) => suspendedData.value[index] = new Array(record.length).fill(0));
    });

    onMounted( async () => {
        await nextTick();
        // NOTE: The render still seems to jump into action too quickly when we await for nextTick() alone,
        // so added a zero timeout await to make sure we are in sync. Hopefully redundant when Vue 2.7+ hits.
        await new Promise(resolve => setTimeout(resolve, 0));
        animate.value = true;
        suspendedData.value = groupedData.value;
    });

    return {
        animate,
        suspendedData
    };
}