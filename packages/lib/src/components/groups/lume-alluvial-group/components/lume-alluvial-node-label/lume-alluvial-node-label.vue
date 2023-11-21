<template>
  <text
    v-if="!maxWidth"
    class="lume-alluvial-group__node-label"
    :dy="bottom ? '.2em' : '-.2em'"
    :dominant-baseline="bottom ? 'hanging' : 'auto'"
  >
    <slot />
  </text>
  <foreignObject
    v-else
    class="lume-alluvial-group__node-foreign"
    :y="bottom ? '0.1em' : -foreignObjectHeight + 1"
    :x="left ? -foreignObjectWidth : 0"
    :width="foreignObjectWidth"
    :height="foreignObjectHeight"
  >
    <div class="lume-alluvial-group__label-wrapper">
      <span
        ref="text"
        class="lume-alluvial-group__node-label"
      >
        <slot />
      </span>
    </div>
  </foreignObject>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue';
import { NODE_LABEL_SAFETY_MARGIN } from '../../constants';

const props = defineProps({
  bottom: { type: Boolean, default: false },
  left: { type: Boolean, default: false },
  maxWidth: { type: Number, default: null },
});

const emit = defineEmits<{
  (e: 'lume__internal--node-resize');
}>();

const text = ref<HTMLDivElement>(null);

const foreignObjectWidth = ref(props.maxWidth);
const foreignObjectHeight = ref(1);

watch(
  [text, () => props.maxWidth],
  async ([textRef, maxWidth]) => {
    if (textRef && maxWidth) {
      // Set max width to allow for child <span> to render text within the boundaries
      foreignObjectWidth.value = maxWidth;

      // Wait for DOM flush
      await nextTick();

      // Set foreignObject width/height to match the content
      const { width: textWidth, height: textHeight } =
        textRef.getBoundingClientRect();

      foreignObjectWidth.value =
        textWidth + NODE_LABEL_SAFETY_MARGIN > maxWidth
          ? maxWidth
          : textWidth + NODE_LABEL_SAFETY_MARGIN;
      foreignObjectHeight.value = Math.ceil(textHeight);
    }
  },
  { immediate: true }
);

// Trigger a new extents calculation in the parent alluvial group
watch(foreignObjectWidth, async (value) => {
  if (value !== props.maxWidth) {
    await nextTick();
    emit('lume__internal--node-resize');
  }
});
</script>

<style lang="scss" scoped>
@use '../../styles';
</style>
