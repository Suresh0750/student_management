"use client";

type Primitive = string | number | boolean | null | undefined;
import { Pencil, Trash, Trash2, Loader2 } from "lucide-react";



type DataTableColumn<T> = {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};

type DataTableProps<T> = {
  title?: string;
  columns: Array<DataTableColumn<T>>;
  isLoading?: boolean;
  rows: T[];
  rowKey: keyof T;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  emptyMessage?: string;
};

export default function DataTable<T extends Record<string, Primitive>>({
  title,
  columns,
  isLoading,
  rows,
  rowKey,
  onEdit,
  onDelete,
  emptyMessage = "No data available.",
}: DataTableProps<T>) {

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 size="md" />
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
      {title ? (
        <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </h3>
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-zinc-50 dark:bg-zinc-900">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="border-b border-zinc-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:border-zinc-800 dark:text-zinc-300"
                >
                  {column.header}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="border-b border-zinc-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
                  Action
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {rows?.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  className="px-4 py-6 text-center text-sm text-zinc-500 dark:text-zinc-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows?.map((row: T) => (
                <tr
                  key={String(row[rowKey])}
                  className="border-b border-zinc-200 last:border-b-0 dark:border-zinc-800"
                >
                  {columns.map((column) => {
                    const value = row[column.key];
                    return (
                      <td
                        key={String(column.key)}
                        className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-200"
                      >
                        {column.render ? column.render(value, row) : String(value ?? "-")}
                      </td>
                    );
                  })}

                  {(onEdit || onDelete) && (
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        {onEdit ? (
                          <button
                            type="button"
                            onClick={() => onEdit(row)}
                            className="rounded-md border border-zinc-300 px-3 py-1 text-zinc-800 cursor-pointer transition-colors duration-200 hover:bg-zinc-900 hover:text-white dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        ) : null}
                        {onDelete ? (
                          <button
                            type="button"
                            onClick={() => onDelete(row)}
                            className="rounded-md border cursor-pointer border-red-300 px-3 py-1 text-red-700 transition-colors hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-950/40"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : null}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
