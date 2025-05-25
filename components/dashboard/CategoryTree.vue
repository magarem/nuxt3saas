<template>
    ~{{categories}}
  <Tree 
    v-model:selectionKeys="selectedKey"
    :value="categories"
    selectionMode="single"
    class="border-none w-full"
    :pt="{
      root: { class: 'py-2' },
      content: { class: 'hover:bg-gray-50 rounded-lg' },
      node: { class: 'p-1' },
      toggler: { class: 'mr-2' }
    }"
    @node-select="onNodeSelect"
  >
    <template #default="slotProps">
      <div class="flex items-center gap-2 w-full">
        <i 
          :class="[
            slotProps.node.children ? 'pi pi-folder' : 'pi pi-tag',
            slotProps.node.children ? 'text-yellow-500' : 'text-blue-500'
          ]" 
        />
        <span class="text-sm">{{ slotProps.node.label }}</span>
        <Badge 
          v-if="slotProps.node.data?.count"
          :value="slotProps.node.data.count"
          class="ml-auto"
          size="small"
        />
      </div>
    </template>
  </Tree>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Tree from 'primevue/tree';
import Badge from 'primevue/badge';

interface CategoryNode {
  key: string;
  label: string;
  data?: {
    count?: number;
    type?: string;
    // Adicione outros campos de dados conforme necessário
  };
  children?: CategoryNode[];
  icon?: string;
}

const props = defineProps<{
  categories: CategoryNode[];
}>();

const emit = defineEmits<{
  (e: 'node-select', node: CategoryNode): void;
  (e: 'update:modelValue', key: string | undefined): void;
}>();

const selectedKey = ref<string>();

const onNodeSelect = (node: CategoryNode) => {
  emit('node-select', node);
  emit('update:modelValue', node.key);
};
</script>

<style scoped>
:deep(.p-tree-container) {
  @apply space-y-1;
}
:deep(.p-treenode-content) {
  @apply px-3 py-2;
}
:deep(.p-treenode-content.p-highlight) {
  @apply bg-primary-50 text-primary-600;
}
</style>