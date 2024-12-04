<template>
  <label class="container" :class="{ checked: validated, disabled: disabled }">
    {{ fullTitle }}
    <input
      :class="{ checked: validated }"
      :disabled="disabled"
      type="checkbox"
      :value="id"
      @click="onCheck()"
    />
    <span
      :class="{ 'error-input': errors.includes(title), disabled: disabled }"
      class="checkmark"
    ></span>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// PROPS
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  validated: {
    type: Boolean,
    required: true,
  },
  disabled: {
    type: Boolean,
  },
  id: {
    type: Number,
    // required: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
  errors: {
    type: Array,
    default: () => [],
  },
})

// EMITS
const emits = defineEmits({
  click(payload: boolean) {
    return payload
  },
})

// COMPUTED
const fullTitle = computed((): string => {
  return props.required ? `* ${props.title}` : props.title
})

// METHODS
function onCheck() {
  emits('click', true)
}
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  min-height: 1rem;
  position: relative;
  padding-left: 28px;
  cursor: pointer;
  color: var(--c-grey-70);
}

.container.disabled {
  cursor: default;
}

.container input {
  display: none;
}
/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: var(--c-turquoise-20);
  border: 1px solid var(--c-turquoise-60);
  border-radius: 4px;
}

.checkmark.disabled {
  background-color: var(--c-grey-30);
  border: 1px solid var(--c-grey-30);
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: '';
  position: absolute;
  display: none;
}
/* Show the checkmark when checked */
.container .checked ~ .checkmark:after {
  display: block;
}
/* Style the checkmark/indicator */
.container .checkmark:after {
  left: 7px;
  top: 1px;
  width: 6px;
  height: 14px;
  border: solid var(--c-turquoise-80);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.container .checkmark.disabled:after {
  left: 7px;
  top: 1px;
  width: 6px;
  height: 14px;
  border: solid var(--c-white);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.error-input {
  border: 1px solid var(--c-error);
  background-color: rgba(255, 0, 0, 0.323);
}
.error-input :after {
  content: '';
  position: absolute;
  display: none;
}
.container .checked ~ .error-input:after {
  display: block;
}

.container .error-input:after {
  left: 7px;
  top: 1px;
  width: 6px;
  height: 14px;
  border: solid var(--c-error);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
</style>
