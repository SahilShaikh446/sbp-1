import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  type Column,
  type ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  ArrowRightToLine,
  // ArrowLeftToLineIcon,
  // ArrowRightToLine,
  ChevronDown,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  EllipsisIcon,
  // EllipsisIcon,
  Info,
  LoaderCircle,
  // LoaderCircle,
  PinOff,
  Search,
} from "lucide-react";
import { type CSSProperties, Fragment, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { MixerVerticalIcon } from "@radix-ui/react-icons";
import { FaSpinner } from "react-icons/fa6";
import TableSkeleton from "./TableSkeleton";

const getPinningStyles = (column: any): CSSProperties => {
  const isPinned = column.getIsPinned();
  return {
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    position: isPinned ? "sticky" : "relative",
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  };
};

type ComponentProps = {
  data: any[];
  columns: any[];
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  api?: boolean;
  totalelement?: number;
  title: string;
  desc: string;
  children?: React.ReactNode;
  hideGlobalSearch?: boolean;
  loading: boolean;
  error: boolean;
};

type ColumnMetaType = {
  filterVariant?: "range" | "select" | "search";
};

const ShadcnTable: React.FC<ComponentProps> = ({
  data,
  columns,
  currentPage = 0,
  totalPages = 0,
  api,
  totalelement,
  title,
  desc,
  children,
  loading,
  error,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<any>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [isChildOpen, setIsChildOpen] = useState(false);
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();
  const paramSort = useLocation().search;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const table = useReactTable({
    data,
    columns,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getRowCanExpand: (row) => Boolean(row.original.note),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
      columnFilters,
      columnVisibility,
    },
    getExpandedRowModel: getExpandedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    enableSortingRemoval: false,
    initialState: {
      pagination: {
        pageSize:
          api && Number(params.get("size")) ? Number(params.get("size")) : 10,
      },
    },
  });

  useEffect(() => {
    if (globalFilter) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
    setIsLoading(false);
  }, [globalFilter]);

  useEffect(() => {
    setLoader(true);
    const timer = setTimeout(() => {
      setLoader(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loader || loading) {
    return <TableSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold flex-col justify-center items-center">
              <span>{title || "Heading"}</span>
            </h1>
            <span>Here is List of {desc || "Description"}</span>
          </div>
          {children}
          <div className=" flex item-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline">
                  <MixerVerticalIcon
                    className=" opacity-60 rotate-90"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className=" font-semibold">
                    Toggle columns
                    <Separator />
                  </div>
                </DropdownMenuLabel>

                <ScrollArea className="max-h-[150px] w-[150px]">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .filter((column) => column.id != "expander")
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize space-y-2"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                          onSelect={(event) => event.preventDefault()}
                        >
                          {(column?.columnDef?.header?.length ?? 0) > 0
                            ? column?.columnDef?.header
                            : (column?.columnDef as any)?.accessorKey}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="relative">
              <Input
                id={globalFilter}
                className="peer pe-9 ps-9"
                placeholder="Search..."
                type="search"
                onChange={(e) => {
                  if (api) {
                    params.set("query", e.target.value);
                    navigate(`?${params.toString()}`);
                  } else {
                    table.setGlobalFilter(String(e.target.value));
                  }
                }}
              />
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                {isLoading ? (
                  <LoaderCircle
                    className="animate-spin"
                    size={16}
                    strokeWidth={2}
                    role="status"
                    aria-label="Loading..."
                  />
                ) : (
                  <Search size={16} strokeWidth={2} aria-hidden="true" />
                )}
              </div>
              <button
                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Submit search"
                type="submit"
              ></button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            {table?.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup?.headers?.map((header) => {
                  const { column } = header;
                  const isPinned = column.getIsPinned();
                  const isLastLeftPinned =
                    isPinned === "left" && column.getIsLastColumn("left");
                  const isFirstRightPinned =
                    isPinned === "right" && column.getIsFirstColumn("right");
                  let sortDirection: "asc" | "desc" | undefined;
                  if (api) {
                    const sortBy = searchParams.get("sortBy");
                    if (sortBy) {
                      const decodedSortBy = decodeURIComponent(sortBy);
                      const [sortColumn, direction] = decodedSortBy.split(",");
                      if (
                        sortColumn === header.column.id &&
                        (direction === "asc" || direction === "desc")
                      ) {
                        sortDirection = direction;
                      }
                    }
                  }
                  return (
                    <TableHead
                      key={header.id}
                      className={`relative h-10 truncate  [&:not([data-pinned]):has(+[data-pinned])_div.cursor-col-resize:last-child]:opacity-0 [&[data-last-col=left]_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right]:last-child_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=right][data-last-col=right]]:border-l [&[data-pinned][data-last-col]]:border-border [&[data-pinned]]:bg-muted/90 [&[data-pinned]:backdrop-blur-sm group text-black `}
                      colSpan={header.colSpan}
                      style={{ ...getPinningStyles(column) }}
                      data-pinned={isPinned || undefined}
                      data-last-col={
                        isLastLeftPinned
                          ? "left"
                          : isFirstRightPinned
                          ? "right"
                          : undefined
                      }
                      aria-sort={
                        header.column.getIsSorted() === "asc"
                          ? "ascending"
                          : header.column.getIsSorted() === "desc"
                          ? "descending"
                          : "none"
                      }
                    >
                      <div
                        className={cn(
                          "flex items-center justify-between gap-2",
                          header.column.getCanSort() &&
                            "cursor-pointer select-none"
                        )}
                        onClick={(e) => {
                          if (api) {
                            const currentSort = paramSort.split(",")[1];
                            let newSort;
                            if (currentSort === "asc") {
                              newSort = "desc";
                            } else if (currentSort === "desc") {
                              newSort = undefined; // Descending → No Sort
                            } else {
                              newSort = "asc"; // No Sort → Ascending
                            }
                            if (newSort) {
                              params.set(
                                "sortBy",
                                `${header.column.id},${newSort}`
                              );
                            } else {
                              params.delete("sortBy"); // Remove if no sort is applied
                            }

                            // Convert params to string and replace `%2C` with `,`
                            const queryString = params
                              .toString()
                              .replace(/%2C/g, ",");

                            navigate(`?${queryString}`);
                          } else {
                            // header.column.getToggleSortingHandler()?.(e);
                            if (header.column.getIsSorted() === "desc") {
                              header.column.toggleSorting(false); // Asc → Desc
                            } else if (header.column.getIsSorted() === "asc") {
                              header.column.clearSorting(); // Desc → No Sort
                            } else {
                              header.column.toggleSorting(true); // No Sort → Asc
                            }
                          }
                        }}

                        // tabIndex={header.column.getCanSort() ? 0 : undefined}
                      >
                        <span className="truncate">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </span>
                        <div className="flex items-center gap-2">
                          {api ? (
                            sortDirection ? (
                              sortDirection === "asc" ? (
                                <ChevronUp
                                  className="shrink-0 opacity-60"
                                  size={16}
                                  strokeWidth={2}
                                  aria-hidden="true"
                                />
                              ) : (
                                <ChevronDown
                                  className="shrink-0 opacity-60"
                                  size={16}
                                  strokeWidth={2}
                                  aria-hidden="true"
                                />
                              )
                            ) : null
                          ) : (
                            {
                              asc: (
                                <ChevronUp
                                  className="shrink-0 opacity-60"
                                  size={16}
                                  strokeWidth={2}
                                  aria-hidden="true"
                                />
                              ),
                              desc: (
                                <ChevronDown
                                  className="shrink-0 opacity-60"
                                  size={16}
                                  strokeWidth={2}
                                  aria-hidden="true"
                                />
                              ),
                            }[header.column.getIsSorted() as string] ?? null
                          )}

                          {/* Pin/Unpin column controls with enhanced accessibility */}
                          {!header.isPlaceholder &&
                            header.column.getCanPin() &&
                            (header.column.getIsPinned() ? (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="-mr-1 size-7 shadow-none"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  header.column.pin(false);
                                }}
                                aria-label={`Unpin ${
                                  header.column.columnDef.header as string
                                } column`}
                                title={`Unpin ${
                                  header.column.columnDef.header as string
                                } column`}
                              >
                                <PinOff
                                  className="opacity-60"
                                  size={16}
                                  strokeWidth={2}
                                  aria-hidden="true"
                                />
                              </Button>
                            ) : (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="-mr-1 size-7 shadow-none"
                                    onClick={(e) => e.stopPropagation()}
                                    aria-label={`Pin options for ${
                                      header.column.columnDef.header as string
                                    } column`}
                                    title={`Pin options for ${
                                      header.column.columnDef.header as string
                                    } column`}
                                  >
                                    <EllipsisIcon
                                      className="opacity-60"
                                      size={16}
                                      strokeWidth={2}
                                      aria-hidden="true"
                                    />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => header.column.pin("left")}
                                  >
                                    {/* <ArrowLeftToLineIcon
                                      size={16}
                                      strokeWidth={2}
                                      className="opacity-60"
                                      aria-hidden="true"
                                    /> */}
                                    Stick to left
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => header.column.pin("right")}
                                  >
                                    <ArrowRightToLine
                                      size={16}
                                      strokeWidth={2}
                                      className="opacity-60"
                                      aria-hidden="true"
                                    />
                                    Stick to right
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            ))}
                        </div>
                      </div>
                      {header.column.getCanResize() && (
                        <div
                          {...{
                            onDoubleClick: () => header.column.resetSize(),
                            onMouseDown: header.getResizeHandler(),
                            onTouchStart: header.getResizeHandler(),
                            className:
                              "absolute top-0 h-full w-4 cursor-col-resize user-select-none touch-none -right-2 z-10 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity before:absolute before:w-px before:inset-y-0 before:bg-border before:-translate-x-px",
                          }}
                        />
                      )}

                      {isChildOpen &&
                        (header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} />
                          </div>
                        ) : null)}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="h-[20]">
            {table.getRowModel().rows != undefined &&
            table.getRowModel().rows?.length > 0 ? (
              table.getRowModel().rows?.map((row) => (
                <Fragment key={row.id}>
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="h-[55px]"
                  >
                    {row.getVisibleCells().map((cell) => {
                      const { column } = cell;
                      const isPinned = column.getIsPinned();
                      const isLastLeftPinned =
                        isPinned === "left" && column.getIsLastColumn("left");
                      const isFirstRightPinned =
                        isPinned === "right" &&
                        column.getIsFirstColumn("right");

                      return (
                        <TableCell
                          key={cell.id}
                          className="truncate [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right][data-last-col=right]]:border-l [&[data-pinned][data-last-col]]:border-border [&[data-pinned]]:bg-background/90 [&[data-pinned]]:backdrop-blur-sm "
                          style={{ ...getPinningStyles(column) }}
                          data-pinned={isPinned || undefined}
                          data-last-col={
                            isLastLeftPinned
                              ? "left"
                              : isFirstRightPinned
                              ? "right"
                              : undefined
                          }
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  {row.getIsExpanded() && (
                    <TableRow>
                      <TableCell
                        colSpan={
                          row.getVisibleCells() && row.getVisibleCells().length
                        }
                      >
                        {columns
                          .find((col) => col.id === "expander")
                          ?.expandedContent?.(row)}
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="mt-4 flex items-center justify-between px-2">
          <div className="flex-1 text-sm text-muted-foreground">
            Showing{" "}
            {api
              ? currentPage
              : table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                1}{" "}
            to{" "}
            {api
              ? totalPages || 0 - 1
              : Math.min(
                  (table.getState().pagination.pageIndex + 1) *
                    table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )}{" "}
            of {api ? totalelement : table.getFilteredRowModel().rows.length}{" "}
            entries
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8 flex-nowrap">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium whitespace-nowrap">
                Rows per page
              </p>
              <select
                className="h-8 w-[70px] rounded-md border border-input bg-transparent px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&_option]:bg-background"
                value={
                  api
                    ? searchParams.get("size") || "10"
                    : table.getState().pagination.pageSize
                }
                onChange={(e) => {
                  if (api) {
                    params.set("size", e.target.value);
                    const queryString = params.toString().replace(/%2C/g, ",");

                    navigate(`?${queryString}`);
                  } else {
                    table.setPageSize(Number(e.target.value));
                  }
                }}
              >
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>
            <Pagination>
              <PaginationContent>
                {/* First page button */}
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    className="disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => {
                      if (api) {
                        params.set("page", "0"); // Navigate to the
                        navigate(`?${params.toString()}`);
                      } else {
                        table.setPageIndex(0);
                      }
                    }}
                    disabled={
                      api ? currentPage === 0 : !table.getCanPreviousPage()
                    }
                    aria-label="Go to first page"
                  >
                    <ChevronFirst
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </Button>
                </PaginationItem>
                {/* Previous page button */}
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    className="disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => {
                      if (api && currentPage) {
                        params.set("page", String(currentPage - 1)); // Update the page parameter
                        navigate(`?${params.toString()}`);
                      } else {
                        table.previousPage();
                      }
                    }}
                    disabled={
                      api ? currentPage === 0 : !table.getCanPreviousPage()
                    }
                    aria-label="Go to previous page"
                  >
                    <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
                  </Button>
                </PaginationItem>
                {/* Next page button */}
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    className="disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => {
                      if (api) {
                        params.set("page", String(currentPage + 1)); // Increment page number
                        navigate(`?${params.toString()}`);
                      } else {
                        table.nextPage();
                      }
                    }}
                    disabled={
                      api
                        ? currentPage === totalPages - 1
                        : !table.getCanNextPage()
                    }
                    aria-label="Go to next page"
                  >
                    <ChevronRight
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </Button>
                </PaginationItem>
                {/* Last page button */}
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    className="disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => {
                      if (api && totalPages) {
                        params.set("page", String(totalPages - 1)); // Navigate to the last page
                        navigate(`?${params.toString()}`);
                      } else {
                        table.setPageIndex(table.getPageCount() - 1);
                      }
                    }}
                    disabled={
                      api && totalPages
                        ? currentPage === totalPages - 1
                        : !table.getCanNextPage()
                    }
                    aria-label="Go to last page"
                  >
                    <ChevronLast size={16} strokeWidth={2} aria-hidden="true" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

function Filter({ column }: { column: Column<any> }) {
  const columnFilterValue = column.getFilterValue();
  const filterVariant = (column.columnDef.meta as ColumnMetaType)
    ?.filterVariant;

  return filterVariant === "range" ? (
    <div>
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder="Min"
          className="w-24 border shadow rounded"
        />
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder="Max"
          className="w-24 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : filterVariant === "select" ? (
    <select
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString() ?? ""}
    >
      <option value="">All</option>
      <option value="complicated">Complicated</option>
      <option value="relationship">Relationship</option>
      <option value="single">Single</option>
    </select>
  ) : (
    <DebouncedInput
      className="w-36 border shadow rounded"
      onChange={(value) => column.setFilterValue(value)}
      placeholder="Search..."
      type="text"
      value={(columnFilterValue as string) ?? ""}
    />
  );
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);
  return (
    <div className="relative">
      <Input
        placeholder="Search..."
        type="search"
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center  text-muted-foreground/80 peer-disabled:opacity-50"></div>
    </div>
  );
}

export default ShadcnTable;
