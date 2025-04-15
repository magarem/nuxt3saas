<template>
    <div>
      <GenericDatagrid :tableConfig="usersTableConfig" username="magaweb" />
    </div>
  </template>
  
  <script setup>
  // import GenericDatagrid from './GenericDatagrid.vue';
  import InputText from 'primevue/inputtext';
  import CustomCheckbox from '~/components/CustomCheckbox.vue';
  
  const usersTableConfig = {
    tableName: 'users',
    displayName: 'Usuários',
    primaryKey: 'id',
    columns: [
      { field: 'id', header: 'ID', sortable: true, hidden: true },
      { field: 'nome', header: 'Nome', sortable: true, editTemplate: InputText },
      { field: 'email', header: 'Email', sortable: true, editTemplate: InputText },
      // ... outros campos
      {
        field: 'roles',
        header: 'Roles',
        bodyTemplate: (slotProps) => slotProps.data.roles_names,
        editTemplate: CustomCheckbox,
        options: [],
        isManyToMany: true,
        relationTable: 'user_roles',
        relationKey1: 'user_id',
        relationKey2: 'role_id',
        displayField: 'roles_names',
        optionsTable: 'roles',
        optionsKey: 'id',
        optionsLabel: 'name'
      }
    ]
  };
  </script>