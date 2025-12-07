'use client';

import DataTable from 'react-data-table-component';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Link from 'next/link';

interface DataTableProps {
  data: any[];
  columns: string[];
  editPath?: string;
}

export default function DataTableComponent({ data, columns, editPath }: DataTableProps) {
  
  const tableColumns = [
    ...columns.map((col) => ({
      name: col.charAt(0).toUpperCase() + col.slice(1),
      selector: (row: any) => row[col],
      sortable: true,
    })),
    {
      name: 'Acciones',
      cell: (row: any) => (
        <div className="flex gap-2">
          {editPath ? (
            <Link href={`${editPath}/${row.id}`}>
              <button className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600 transition">
                <FaEdit />
              </button>
            </Link>
          ) : (
            <button className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600 transition">
              <FaEdit />
            </button>
          )}
          <button className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600 transition">
            <FaTrash />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200">
      <DataTable
        columns={tableColumns}
        data={data}
        pagination
        paginationComponentOptions={{
            rowsPerPageText: 'Filas por página:',
            rangeSeparatorText: 'de',
            selectAllRowsItem: true,
            selectAllRowsItemText: 'Todos',
        }}
        noDataComponent={<div className="p-4 text-center text-gray-500">No hay registros para mostrar</div>}
        highlightOnHover
        pointerOnHover
      />
    </div>
  );
}
