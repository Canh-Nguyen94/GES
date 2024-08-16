<script setup>
import {
  FlexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable
} from '@tanstack/vue-table'
import { ref, h, computed, watch, toRefs } from 'vue'

import Text from '@components/text/Text.vue'
import EmptyData from '@components/EmptyData.vue'
import { valueUpdater } from '@utils/ui-shadcn.util'
import { DEFAULT_PER_PAGE } from '@constants/api.constant'
import DataTablePagination from './DataTablePagination.vue'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@common/ui/table'
import { useLayoutStore } from '@store/layout.store'

const props = defineProps({
  isLoading: { type: Boolean, required: false },
  headerHeight: { type: Number, required: false },
  type: { type: String, required: false },
  columns: { type: Array, required: true },
  data: { type: Array, required: false },
  dataStatus: { type: String, required: false },
  enableRowSelection: { type: Boolean, required: false, default: false },
  enableHoverOnRow: { type: Boolean, required: false, default: false },
  rowIdKey: { type: String, required: false, default: 'id' },
  activeRowId: { type: String, required: false },
  defaultRowsPerPage: { type: Number, required: false, default: DEFAULT_PER_PAGE },
  enableRowsPerPageSelection: { type: Boolean, required: false, default: false },
  tableHeight: { type: String, required: false, default: '100vh - 225px' },
  showPagination: { type: Boolean, required: false, default: true },
  pagination: { type: Object, default: () => ({}) },
  searching: {
    type: Boolean,
    default: false
  },
  itemName: {
    type: String,
    default: ''
  },
  tableClass: { type: String, default: '' },
  showIndex: { type: Boolean, default: false },
  handleRowClick: { type: Function, default: () => {} }
})

const { isLoading } = toRefs(props)
const { toggleLoading } = useLayoutStore()

watch(
  isLoading,
  () => {
    toggleLoading(isLoading.value)
  },
  { immediate: true }
)

const handleRowClick = (id, original = null) => {
  props.handleRowClick(id, original)
}

const theadHeight = 39
const sorting = defineModel('sort', { type: Array, default: () => [] })
const page = defineModel('page', { type: [Number, String], default: 1 })
const perPage = defineModel('perPage', {
  type: [Number, String],
  default: DEFAULT_PER_PAGE
})

const tableColumns = computed(() => (props.enableRowSelection ? [...props.columns] : props.columns))

const columnFilters = ref([])
const columnVisibility = ref({})
const rowSelection = ref({})
const tableData = ref([])

const emptyRowWidth = computed(() =>
  props.showIndex ? tableColumns.value.length + 1 : tableColumns.value.length
)

const table = useVueTable({
  get data() {
    if (props.dataStatus === 'success') tableData.value = props.data
    return tableData.value || []
  },
  get columns() {
    return tableColumns.value
  },
  state: {
    get sorting() {
      return sorting.value
    },
    get columnFilters() {
      return columnFilters.value
    },
    get columnVisibility() {
      return columnVisibility.value
    },
    get rowSelection() {
      return rowSelection.value
    }
  },
  initialState: {
    pagination: {
      pageSize: props.defaultRowsPerPage
    }
  },
  manualSorting: true,
  manualPagination: true,
  enableRowSelection: props.enableRowSelection,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFacetedRowModel: getFacetedRowModel(),
  getFacetedUniqueValues: getFacetedUniqueValues(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowSelection),
  getRowId: (row) => row[props.rowIdKey]
})

const getRowNo = (index) => {
  if (props.pagination) {
    return props.pagination.perPage * (page.value - 1) + (index + 1)
  }
  return null
}
</script>

<template>
  <div class="w-full">
    <div
      class="flex items-center justify-center h-[350px] w-full bg-[white] bg-opacity-60"
      v-if="false"
    >
      <div>
        <svg
          aria-hidden="true"
          class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-red-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </div>
    </div>
    <div
      class="w-full pb-2 overflow-auto"
      :class="[dataStatus === 'success' && data.length ? '' : 'border-b-0']"
      :style="{
        maxHeight: `calc(${tableHeight}` || 'auto'
      }"
    >
      <div
        :class="[dataStatus === 'success' && data.length ? 'overflow-y-auto' : 'overflow-y-hidden']"
        :style="{
          height: 'auto'
        }"
        class="relative border border-border rounded-[8px] bg-background"
      >
        <Table :class="[tableClass]">
          <TableHeader
            :class="props.type === 'primary' ? 'bg-grey-50' : 'bg-white'"
            class="sticky top-0 z-10"
          >
            <slot name="thead"></slot>

            <TableRow
              v-for="headerGroup in table.getHeaderGroups()"
              :key="headerGroup.id"
              :class="props.type === 'primary' ? '' : 'border-b border-b-grey-400 '"
            >
              <TableHead v-if="showIndex" width="60px">
                <Text type="primary" font="semi"> No </Text>
              </TableHead>
              <TableHead
                v-for="header in headerGroup.headers"
                :key="header.id"
                :class="headerHeight ? `h-[${headerHeight}px]` : ''"
                :align="header.column.columnDef.align || header.column.columnDef.headerAlign"
                :width="header.column.columnDef.width"
              >
                <FlexRender
                  v-if="!header.isPlaceholder"
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody class="relative">
            <template v-if="table.getRowModel().rows?.length">
              <TableRow
                v-for="(row, index) in table.getRowModel().rows"
                :key="row.id"
                class="border-b border-b-grey-100 truncate max-w-[200px] cursor-pointer"
                :class="{
                  'hover:bg-grey-50 cursor-pointer': enableHoverOnRow,
                  'bg-grey-50': activeRowId && activeRowId === row.original[rowIdKey]
                }"
                :data-state="row.getIsSelected() && 'selected'"
                @click="handleRowClick(row.original.id, row.original)"
              >
                <TableCell v-if="showIndex">
                  <Text type="primary">
                    {{ getRowNo(index) }}
                  </Text>
                </TableCell>

                <TableCell
                  v-for="cell in row.getVisibleCells()"
                  :key="cell.id"
                  :class="cell.column.columnDef.cellClass"
                  :align="cell.column.columnDef.align"
                >
                  <slot :name="cell.column.columnDef.accessorKey">
                    <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                  </slot>
                </TableCell>
              </TableRow>
            </template>
            <TableRow v-else-if="dataStatus == 'success' && !table.getRowModel().rows?.length">
              <TableCell class="p-0 mt-0 text-center" :colspan="emptyRowWidth">
                <div class="w-full flex flex-col items-center justify-center gap-y-[20px]">
                  <EmptyData class="h-full" :searching="searching" :item-name="itemName" />
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>

    <DataTablePagination
      v-if="showPagination"
      v-model:page="page"
      v-model:perPage="perPage"
      :table="table"
      :pagination="pagination"
      :number-of-selected-row="Object.keys(rowSelection).length"
      :enable-row-selection="enableRowSelection"
      :enable-rows-per-page-selection="enableRowsPerPageSelection"
    />
  </div>
</template>
<style scoped>
.section {
  height: calc(100vh - 280px);
}
</style>
