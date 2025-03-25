<script lang="ts" setup>
import { ref, h, onMounted } from 'vue';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
  FlexRender,
  getFilteredRowModel,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type ExpandedState,
  getExpandedRowModel,
} from '@tanstack/vue-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationEllipsis,
  PaginationNext,
  PaginationFirst,
  PaginationLast,
  PaginationPrev,
  PaginationList,
  PaginationListItem,
} from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { valueUpdater } from '~/lib/utils';
import Checkbox from '../ui/checkbox/Checkbox.vue';
import { routerKey } from 'vue-router';
import AddToMega from './AddToMega.vue';
const router = useRouter();

// Fetch filters from API
const { data: data, refresh: refreshFilters } = await useFetch('/api/filters', {
  default: () => {
    return [];
  },
});
const name = ref('');
const newFilter = async (name: string) => {
  console.log(name);
  const res = await $fetch('/api/filters', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });

  await refreshFilters();
};

type NotNull<T> = T extends null | undefined ? never : T;
const columnHelper = createColumnHelper<NotNull<typeof data.value>[0]>();

const columns = [
  columnHelper.display({
    id: 'select',
    header: ({ table }) =>
      h(Checkbox, {
        modelValue:
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate'),
        'onUpdate:modelValue': (value) =>
          table.toggleAllPageRowsSelected(!!value),
        ariaLabel: 'Select all',
      }),
    cell: ({ row }) => {
      return h(Checkbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value) => row.toggleSelected(!!value),
        ariaLabel: 'Select row',
      });
    },
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor('description', {
    header: 'Description',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'Values',
    header: 'Values',
    cell: (info) => {
      return h('div', { class: 'flex space-x-2' }, info.row.original.values.map((value) => h('div', {
        class: 'flex flex-col border rounded-md p-2 align-center text-center',
      }, [
        h('span',
          { class: 'font-bold' },
          value.attributeType.name),
        h('span', { class: 'text-sm' }, value.displayName),
      ])));
    },
  }),

  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: (info) =>
      h('div', { class: 'flex space-x-2' }, [
        h(
          Button,
          {
            size: 'sm',
            variant: 'outline',
            onClick: () => handleEdit(info.row.original),
          },
          { default: () => 'Edit' },
        ),
        h(
          Button,
          {
            size: 'sm',
            variant: 'destructive',
            onClick: () => handleDelete(info.row.original.id),
          },
          { default: () => 'Delete' },
        ),
        // h(
        //   Button,
        //   {
        //     size: 'sm',
        //     variant: 'outline',
        //     onClick: () => addToMegamenu(info.row.original.id),
        //   },
        //   { default: () => 'Add to MegaMenu' },
        // )
        h(
          Dialog,
          {},
          [
            h(
              DialogTrigger,
              {
                as: 'button',
                size: 'sm',
                variant: 'outline',
              },
              { default: () => 'Add to MegaMenu' },
            ),
            h(
              DialogContent,
              {},
              [
                h('div', { class: 'flex flex-col space-y-4' }, [
                  h(AddToMega, { route: `/men/ctfr/${info.row.original.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}/cat?filterId=${info.row.original.id}`, name: info.row.original.name }),
                ]),
              ],
            ),
          ],
        )
      ]),
  }),
];
const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({});
const rowSelection = ref({});
const expanded = ref<ExpandedState>({});
const closedFloatingMenu = ref(false); // manually close floating menu, will reopen on selection change
watch(
  () => rowSelection.value,
  () => {
    closedFloatingMenu.value = false;
  },
);

// Table instance
const table = useVueTable({
  data: data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, rowSelection),
  onExpandedChange: (updaterOrValue) => valueUpdater(updaterOrValue, expanded),
  state: {
    get sorting() {
      return sorting.value;
    },
    get columnFilters() {
      return columnFilters.value;
    },
    get columnVisibility() {
      return columnVisibility.value;
    },
    get rowSelection() {
      return rowSelection.value;
    },
    get expanded() {
      return expanded.value;
    },
    columnPinning: {
      left: ['status'],
    },
  },
});

const deleteRow = async (id: number, refreshOnSuccess = true) => {
  console.log('Delete row:', id);

  const res = await $fetch(`/api/filters/${id}`, {
    method: 'DELETE',
  });

  if (refreshOnSuccess) {
    await refreshFilters();
  }
};
const deleteSelectedRows = async () => {
  const selectedIds = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original.id);
  console.log('Delete selected:', selectedIds);

  await Promise.all(selectedIds.map((id) => deleteRow(id, false)));
  await refreshFilters();
};

// Edit and delete handlers
const handleEdit = (row: any) => {
  router.push(`/filter/${row.id}/edit`);
};

const handleDelete = async (id: number) => {
  await deleteRow(id);
};

const addToMegamenu = async (id: number) => {
  console.log('Add to MegaMenu:', id);
};

// Load data from filters

// Initialize data on component mount
</script>

<template>
  <div class="space-y-4 px-4">
    <!-- Header with search and create button -->
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">Filters</h2>
      <div class="flex space-x-2">
        <Popover>
          <PopoverTrigger as-child>
            <Button>Create Filter</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div class="flex flex-col space-y-4">
              <Input v-model="name" placeholder="Filter name" />
              <Button @click="newFilter(name)">Create</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>

    <!-- Table -->
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id" :data-pinned="header.column.getIsPinned()"
              :class="cn(
                { 'sticky bg-background/95': header.column.getIsPinned() },
                header.column.getIsPinned() === 'left' ? 'left-0' : 'right-0',
              )
                ">
              <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                :props="header.getContext()" />
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <template v-if="table.getRowModel().rows.length">
            <TableRow v-for="row in table.getRowModel().rows" :key="row.id"
              :data-state="row.getIsSelected() ? 'selected' : null">
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableRow>
              <TableCell :colspan="columns.length" class="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-end space-x-2 py-4">
      <div class="flex-1 text-sm text-muted-foreground">
        {{ table.getFilteredSelectedRowModel().rows.length }} of
        {{ table.getFilteredRowModel().rows.length }} row(s) selected.
      </div>
      <div class="space-x-2">
        <Button variant="outline" size="sm" :disabled="!table.getCanPreviousPage()" @click="table.previousPage()">
          Previous
        </Button>
        <Button variant="outline" size="sm" :disabled="!table.getCanNextPage()" @click="table.nextPage()">
          Next
        </Button>
      </div>
    </div>
    <div class="overflow-hidden">

      <Transition name="pop-in">
        <div v-if="table.getSelectedRowModel().rows.length > 0 && !closedFloatingMenu"
          class="absolute bottom-12 right-1/2 transform translate-x-1/2 bg-background/95 rounded-md p-4">
          <div class="flex items-center space-x-2">
            <Button class="pi pi-trash" variant="outline" size="sm" @click="deleteSelectedRows" />
            <Button variant="outline" size="sm" @click="closedFloatingMenu = true">
              Close
            </Button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.pop-in-enter-active,
.pop-in-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.pop-in-enter-from {
  transform: translateX(150px);
  opacity: 0;
}

.pop-in-leave-to {
  transform: translateX(-50px);
  opacity: 0;
}
</style>