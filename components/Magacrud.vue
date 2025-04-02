<script setup>
// import { FilterMatchMode } from 'primevue/api';
// import DataItemService from '@/service/UserService';
import { useToast } from 'primevue/usetoast';
import '@/assets/styles.scss';
const toast = useToast();


const dataItemDialog = ref(false);
const deleteDataItemDialog = ref(false);
const deleteDataItemsDialog = ref(false);

const selectedDataItems = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);

const dataItem = ref({});

const dataItems = ref(null);
const dataTitle = ref(null)
const dataDesc = ref(null)
const dataGridColumns = ref([])

const dataItems2 = ref([]);
const dataTitle2 = ref(null)
const dataDesc2 = ref(null)
const dataGridColumns2 = ref([])

const route = useRoute()
// const source = route.query.source
// const dataItemService = new DataItemService();

const props = defineProps(['schema', 'data', 'source2', 'reorder'])
const emit = defineEmits(['insertdata', 'updatedata', 'deletedata', 'updateorder'])
const schema = props.schema
const data = ref()
const source2 = props.source2
const files = ref();
const submitBtn = ref(null)

const onRowReorder = (event) => {
    data.value = event.value;
    emit('updateorder', data.value)
    toast.add({severity:'success', summary: 'Rows Reordered', life: 3000});
};

onBeforeMount(() => {
    initFilters();
});

onMounted(async () => {
            dataTitle.value = schema.title
            dataDesc.value = schema.desc
            data.value = props.data
            Object.entries(props.schema.schema).map(x=>{
                dataGridColumns.value.push({
                    id: x[0],
                    label: x[1].label,
                    type: x[1].type,
                    null: x[1].null,
                    hide: x[1].hide||false,
                    options: x[1].options,
                    placeholder: x[1].placeholder
                })
            })
        if (source2){
            dataTitle2.value = source2.title
            dataDesc2.value = source2.desc
            dataItems2.value = source2.data
            dataGridColumns2.value = source2.schema 
            console.log('dataItems2.value:', dataItems2.value);
        }
});

const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const openNew = () => {
    dataItem.value = {};
    submitted.value = false;
    dataItemDialog.value = true;
};

const hideDialog = () => {
    dataItemDialog.value = false;
    submitted.value = false;
};

const saveData = async () => {
    // submitted.value = true;
    
    // if (dataItem.value.name && dataItem.value.name.trim() && dataItem.value.price) {
        if (dataItem.value.id) {
            data.value[findIndexById(dataItem.value.id)] = dataItem.value;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'DataItem Updated', life: 3000 });
            emit('updatedata', data.value[findIndexById(dataItem.value.id)])
            dataItem.value = {};
        } else {
            dataItem.value.id = createId();
            data.value.push(dataItem.value);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'DataItem Created', life: 3000 });
            emit('insertdata', dataItem.value)
            dataItem.value = {};
        }
        dataItemDialog.value = false;
};

const editDataItem = (editDataItem) => {
    dataItem.value = { ...editDataItem };
    // console.log(dataItem);
    dataItemDialog.value = true;
};

const confirmDeleteDataItem = (editDataItem) => {
    dataItem.value = editDataItem;
    deleteDataItemDialog.value = true;
};

const deleteData = async () => {
    data.value = data.value.filter((val) => val.id !== dataItem.value.id);
    deleteDataItemDialog.value = false;
    emit('deletedata', dataItem.value)
    dataItem.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'DataItem Deleted', life: 3000 });
};

const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < data.value.length; i++) {
        if (data.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};

const createId = () => {
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
};

const exportCSV = () => {
    dt.value.exportCSV();
};

const confirmDeleteSelected = () => {
    deleteDataItemsDialog.value = true;
};

const deleteSelectedDataItems = () => {
    data.value = data.value.filter((val) => !selectedDataItems.value.includes(val));
    deleteDataItemsDialog.value = false;
    console.log(selectedDataItems.value);
    emit('deletedata', selectedDataItems.value)
    selectedDataItems.value = null;
    
    
    toast.add({ severity: 'success', summary: 'Successful', detail: 'DataItems Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

function handleFile(e) {
    files.value = e.target.files;
    const file = e.target.files[0];
}

async function handleImageUpload(x) {
    try {
        const fd = new FormData();
        Array.from(files.value).map(async (file, index) => {
            fd.append("photo", file);
            console.log('file---->', file.name);

            const { data, pending, error, refresh } = await useAsyncData(
            'data',
                () => $fetch('/api/upload?dir=reports', {
                    method: 'POST',
                    body: fd,
                }
            ))

            console.log('data from backend is ', data.value);
            dataItem.value[x] = data.value
            
        });
    } catch (error) {
        console.log(error);
    }
}

</script>

<template>
    <div class="grid" v-if="data">
        <div class="col-12">
            <div class="card" >
                <Toast />   
                <DataTable
                    ref="dt"
                    :value="data"
                    v-model:selection="selectedDataItems"
                    @rowReorder="onRowReorder" 
                    dataKey="id"
                    :paginator="true"
                    :rows="4"
                    :filters="filters"
                    class="p-0"
                    stripedRows
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} itens"
                    responsiveLayout="scroll"
                >
                    <template #header>
                        
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <!-- <h5 class="m-0">Items</h5> -->
                            <div class="grid grid-cols-3 gap-6">
                                <div>
                                    <h4 style="margin-bottom: -10px;">{{ dataTitle }}</h4>
                                    <h6>{{ dataDesc }}</h6>
                                </div>
                                <div>
                                    <div class="mt-3">
                                        <Button label="Novo" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                                        <Button label="Excluir" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedDataItems || !selectedDataItems.length" />
                                    </div>
                                </div>
                            
                                <div>
                                    <span class="block mt-3 md:mt-3 p-input-icon-left">
                                        <i class="pi pi-search mr-2" />
                                        <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </template>
                    <Column v-if="reorder" rowReorder headerStyle="width: 3rem" :reorderableColumn="false" />
                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                   
                    <Column v-for="item in dataGridColumns"  :key="item.id" :field="item.id" :header="item.label" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                       
                        <template #body="slotProps" >
                            
                            <div v-if="item.type.toLowerCase()=='upload'">
                                <a :href="'/upload/'+slotProps.data[item.id]">{{ slotProps.data[item.id] }}</a>
                            </div>
                            <div  v-if="['string','integer'].includes(item.type.toLowerCase())">
                                {{ slotProps.data[item.id] }}
                            </div> 
                            <div  v-if="['select'].includes(item.type.toLowerCase())">
                                {{ item.options.find(x=>x.code==slotProps.data[item.id]).name }}
                            </div>
                            <div v-if="['multiselect'].includes(item.type.toLowerCase())">
                                {{ slotProps.data[item.id].map(t=>
                                    item.options.find(x=>x.code==t)?item.options.find(x=>x.code==t).name:"-"
                                ).join(', ') }}
                            </div>
                            <div v-if="Object.values(item)[0].type=='upload'">
                                <a :href="'/file/'+slotProps.data[item[0]]" target="_blank">{{ slotProps.data[item[0]] }}</a>
                            </div>
                        </template>
                    </Column>

                   
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editDataItem(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteDataItem(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="dataItemDialog" :style="{ width: '450px'}" :header="dataTitle" :modal="true" class="p-fluid">
                   
                        <div v-for="item in dataGridColumns" :key="item.id" class="field">
                           
                            <div v-show="item.id.toLowerCase()!=='id'">
                                <label for="name">{{item.label}}</label>
                                <InputText v-if="['string','integer'].includes(item.type.toLowerCase())" id="name" v-model.trim="dataItem[item.id]" autofocus  />
                                <Textarea v-if="item.type.toLowerCase()=='textarea'" v-model.trim="dataItem[item.id]" rows="5" cols="30" />
                               
                                <Dropdown v-if="item.type.toLowerCase()=='select'" v-model="dataItem[item.id]" :options="item.options" optionValue="code" optionLabel="name" :placeholder="item.placeholder" class="w-full md:w-14rem" />
  
                                <MultiSelect v-if="item.type.toLowerCase()=='multiselect'" display="chip" v-model="dataItem[item.id]" :options="item.options" optionValue="code" filter optionLabel="name" :placeholder="item.placeholder" maxSelectedLabels="100" class="w-full md:w-20rem" />
                            </div>
                            <form ref="formUploadFile" v-if="item.type.toLowerCase()=='upload'" _style="display: none;" @submit.prevent="handleImageUpload(item.id)">
                                <InputText id="name" v-model.trim="dataItem[item.id]" autofocus  />
                                <input type="file" class="form-control invisible"  id="inputGroupFile" @change="handleFile($event)">
                                <input type="submit" ref="submitBtn" class="btn btn-primary invisible" />   
                            </form>
                            <small class="p-invalid" v-if="submitted && !dataItem.name">Preencha {{item[1]}}</small>
                        </div>
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveData" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteDataItemDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="dataItem"
                            >Confirma exclusão <b>{{ dataItem.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteDataItemDialog = false" />
                        <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="deleteData" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteDataItemsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="dataItem">Confirma exclusão de itens selecionados?</span>
                    </div>
                    <template #footer>
                        <Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteDataItemsDialog = false" />
                        <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="deleteSelectedDataItems" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
