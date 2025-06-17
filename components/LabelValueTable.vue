<template>
  
      <div class="table-container">
        <table class="label-value-table">
          <tbody>
            <tr
              v-for="(item, index) in data.items"
              :key="index"
              class="table-row"
            >
              <td class="label-cell">{{ item.label }}</td>
              <td class="value-cell">{{ item.value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
   
</template>

<script setup>
defineProps({
  data: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.table-container {
  background-color: rgb(44, 43, 43);

  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
}

.label-value-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.table-row {
  border-bottom: 1px solid #e5e7eb; /* light gray */
}

.table-row:last-child {
  border-bottom: none;
}

.label-cell {
  font-weight: 600;
  padding: 8px 16px 8px 0;
  size: 15px;
  width: 60%;
  color: #f5f5f5; /* gray-700 */
  text-align: right; /* ✅ align label to the right */
}

.value-cell {
  padding: 8px 0;
  color: #b1b1b1; /* gray-900 */
}
</style>
