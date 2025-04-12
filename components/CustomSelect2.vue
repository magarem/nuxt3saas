<template>
    <select v-model="selectedValue" @change="emitValue">
      <option v-for="option in options" :key="option.key" :value="option.key">
        {{ option.value }}
      </option>
    </select>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const props = defineProps({
    modelValue: {
      type: [String, Number],
      default: null
    },
    options: {
      type: Array,
      default: () => []
    },
    fieldKey: {
      type: String,
      default: 'id'
    },
    fieldLabel: {
      type: String,
      default: 'name'
    }
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  const selectedValue = ref(props.modelValue);
  
  watch(() => props.modelValue, (newValue) => {
    selectedValue.value = newValue;
  });
  
  const emitValue = () => {
    emit('update:modelValue', selectedValue.value);
  };
  </script>