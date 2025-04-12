<template>
    <div>
      <div v-for="option in options" :key="option.key" class="field-checkbox">
        <Checkbox
          :id="'role_' + option.key"
          :value="option.key"
          v-model="selectedValues"
        />
        <label :for="'role_' + option.key">{{ option.value }}</label>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from 'vue';
  import Checkbox from 'primevue/checkbox';
  
  const props = defineProps({
    modelValue: {
      type: Array, // Espera um array de IDs de roles selecionados
      default: () => []
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
  
  const selectedValues = ref([]);
  
  onMounted(() => {
    if (props.modelValue) {
      selectedValues.value = [...props.modelValue];
    }
  });
  
  watch(selectedValues, (newVal) => {
    emit('update:modelValue', newVal);
  });
  </script>