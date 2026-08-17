"use client"

import React, { useState, useMemo, useCallback } from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  FilterFn,
} from "@tanstack/react-table"
import {
  Box,
  Button,
  Checkbox,
  Flex,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuGroup,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Badge,
  Select,
} from "@chakra-ui/react"
import { BiDotsHorizontal, BiDownArrow } from "react-icons/bi"
import { BsCaretDown } from "react-icons/bs"
import { useRouter } from 'next/navigation'
import { useQuery } from "@tanstack/react-query"
import { GetAllOrders } from "../lib/api-client"

// Types
export type Orders = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
  name: string
  items: number
  date: string
}

type OrderProduct = {
  id: string
  productName: string
  quantity: number
  createdAt: string
}

// Sample data
const data: Orders[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    name: "Shakur",
    items: 5,
    email: "ken99@yahoo.com",
    date: "2024-09-25"
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    name: "Shafiq",
    items: 3,
    email: "Abe45@gmail.com",
    date: "2024-09-26"
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    name: "Hamza",
    items: 2,
    email: "Monserrat44@gmail.com",
    date: "2024-09-27"
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    name: "Limann",
    items: 1,
    email: "Silas22@gmail.com",
    date: "2024-09-28"
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    name: "Loop",
    items: 4,
    email: "carmella@hotmail.com",
    date: "2024-09-29"
  },
]

// Custom date filter function
const dateFilterFn: FilterFn<Orders> = (row, columnId, filterValue) => {
  if (!filterValue) return true;
  const rowValue = row.getValue(columnId) as string;
  const filterDate = new Date(filterValue);
  const rowDate = new Date(rowValue);
  return rowDate.toDateString() === filterDate.toDateString();
};

const ActionCell = React.memo(({ order }: { order: Orders }) => {
  const router = useRouter()
  return (
    <Menu>
      <MenuButton as={IconButton} icon={<BiDotsHorizontal />} variant="ghost" aria-label="Options" />
      <MenuList>
        <MenuGroup title="Actions">
          <MenuItem onClick={() => navigator.clipboard.writeText(order.id)}>
            Copy Order ID
          </MenuItem>
          <MenuItem onClick={() => router.push(`/orders/${order.id}`)}>
            View Order Details
          </MenuItem>
          <MenuItem onClick={() => alert(`Sending invoice to ${order.email}`)}>
            Send Invoice
          </MenuItem>
          <MenuItem onClick={() => alert(`Refund initiated for Order ${order.id}`)}>
            Initiate Refund
          </MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  )
})

function formatString(name: string): string {
  return name.replace(
    /\w\S*/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).replace(/_/g, ' ');
}

ActionCell.displayName = 'ActionCell'

const columns: ColumnDef<any>[] = [
  {
    accessorKey: "fulfilmentStatus",
    header: "Fulfilment Status",
    cell: ({ row }) => {
      const status = row.getValue("fulfilmentStatus") as string
      return (
        <Badge
          colorScheme={
            status === "success" ? "green" :
            status === "pending" ? "yellow" :
            status === "failed" ? "red" : "gray"
          }
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "customerEmail",
    header: "Customer Email",
    cell: ({ row }) => (
      <Text>{row.getValue("customerEmail")}</Text>
    ),
  },
  {
    accessorKey: "products",
    header: "Date",
    cell: ({ row }) => (
      <Text>{JSON.stringify(row.getValue<OrderProduct[]>("products")[0]?.createdAt)}</Text>
    ),
    filterFn: dateFilterFn,
  },
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => (
      row.getValue<OrderProduct[]>("products").map((prod) => (
        <Text key={prod.id}>
          {formatString(prod.productName)}, x {prod.quantity}
        </Text>
      ))
    ),
  },
  {
    accessorKey: "totalCost",
    header: "Amount",
    cell: ({ row }) => (
      <Text>GHS {row.getValue("totalCost")}</Text>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionCell order={row.original} />,
  },
]


export function OrderTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")


const { data: orders, isPending, isRefetching } = useQuery({
  queryKey: ['GetAllOrders'], 
  queryFn: () => GetAllOrders()
})

  const table = useReactTable({
    data: orders ?? [],
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    filterFns: {
      dateFilter: dateFilterFn,
    },
  })

  const memoizedRows = useMemo(() => orders && table.getRowModel().rows, [orders, table])

  const handleGlobalFilter = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilter(e.target.value)
  }, [])

  const handleStatusFilter = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    table.getColumn("status")?.setFilterValue(e.target.value)
  }, [table])

  const handleDateFilter = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    table.getColumn("date")?.setFilterValue(e.target.value)
  }, [table])

  const handlePageSizeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    table.setPageSize(Number(e.target.value))
  }, [table])

  return (
    <Box width="full" borderWidth="1px" borderColor="gray.200" borderRadius="md" overflow="hidden">
      <Flex direction="column" p={4} bg="gray.50">
        <Flex alignItems="center" mb={4} flexWrap="wrap" gap={2}>
          <Input
            placeholder="Search all columns..."
            value={globalFilter ?? ""}
            onChange={handleGlobalFilter}
            maxWidth="sm"
            borderRadius="md"
          />
          <Select
            placeholder="Filter by status"
            maxWidth="xs"
            onChange={handleStatusFilter}
            borderRadius="md"
          >
            <option value="success">Success</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </Select>
          <Input
            type="date"
            placeholder="Filter by date"
            maxWidth="xs"
            onChange={handleDateFilter}
            borderRadius="md"
          />
          <Menu>
            <MenuButton as={Button} variant="outline" rightIcon={<BsCaretDown />} borderRadius="md">
              Columns
            </MenuButton>
            <MenuList>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <MenuItem
                    key={column.id}
                    closeOnSelect={false}
                    icon={
                      <Checkbox
                        isChecked={column.getIsVisible()}
                        onChange={(e) => column.toggleVisibility(!!e.target.checked)}
                      />
                    }
                  >
                    {column.id}
                  </MenuItem>
                ))}
            </MenuList>
          </Menu>
          <Button onClick={() => alert("Exporting data...")} borderRadius="md">Export</Button>
        </Flex>
      </Flex>
      <Table variant="simple">
        <Thead bg="gray.100">
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th key={header.id} py={4} px={6} borderBottomWidth="2px">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {memoizedRows?.length ? (
            memoizedRows.map((row: any) => (
              <Tr
                key={row.id}
                bg={row.getIsSelected() ? "blue.50" : undefined}
                _hover={{ bg: "gray.100" }}
              >
                {row.getVisibleCells().map((cell: any) => (
                  <Td key={cell.id} py={4} px={6} borderBottomWidth="1px">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </Td>
                ))}
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={columns.length} textAlign="center" py={8}>
                No results.
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
      <Flex alignItems="center" justifyContent="space-between" p={4} bg="gray.50">
        <Flex alignItems="center" gap={2}>
          <Select
            value={table.getState().pagination.pageSize}
            onChange={handlePageSizeChange}
            borderRadius="md"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
          {/* <Text fontSize="sm" color="gray.600">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </Text> */}
        </Flex>
        <Flex alignItems="center" gap={2}>
          <Button
            variant="outline"
            size="sm"
            borderRadius="md"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            borderRadius="md"
          >
            Next
          </Button>
        </Flex>
      </Flex>
    </Box>
  )
}

export default OrderTable