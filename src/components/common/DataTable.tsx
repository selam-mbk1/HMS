import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Download, Filter, Inbox } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchFilter?: (item: T, query: string) => boolean;
  filterOptions?: {
    label: string;
    key: keyof T | string;
    options: { label: string; value: string }[];
    filterFn: (item: T, selectedValue: string) => boolean;
  };
  pageSize?: number;
  exportFileName?: string;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
}

export function DataTable<T extends { id?: string | number }>({
  data,
  columns,
  searchPlaceholder = 'Search records...',
  searchFilter,
  filterOptions,
  pageSize = 8,
  exportFileName,
  onRowClick,
  isLoading = false
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered data calculation
  const filteredData = useMemo(() => {
    let result = [...data];

    if (searchQuery.trim() && searchFilter) {
      result = result.filter((item) => searchFilter(item, searchQuery.toLowerCase().trim()));
    }

    if (filterOptions && selectedFilter !== 'ALL') {
      result = result.filter((item) => filterOptions.filterFn(item, selectedFilter));
    }

    return result;
  }, [data, searchQuery, searchFilter, filterOptions, selectedFilter]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const handleExportCSV = () => {
    if (filteredData.length === 0) return;
    const headers = columns.map((c) => c.header).join(',');
    const rows = filteredData.map((item) =>
      columns
        .map((c) => {
          if (c.accessorKey) {
            const val = item[c.accessorKey];
            return `"${String(val ?? '').replace(/"/g, '""')}"`;
          }
          return '""';
        })
        .join(',')
    );

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${exportFileName || 'hospital_export'}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#FFFFFF] rounded-2xl border border-slate-200/80 shadow-card-subtle hover:shadow-card-elevated transition-shadow duration-300 overflow-hidden">
      {/* Control bar: search, filter dropdown, export */}
      <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#F8FAFC]">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full pl-9.5 pr-4 py-2 bg-[#FFFFFF] text-xs text-[#0F172A] border border-[#E2E8F0] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition"
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {filterOptions && (
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#64748B]" />
              <select
                value={selectedFilter}
                onChange={(e) => {
                  setSelectedFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-[#FFFFFF] text-xs font-medium text-[#0F172A] border border-[#E2E8F0] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2563EB]/20"
              >
                <option value="ALL">All {filterOptions.label}</option>
                {filterOptions.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {exportFileName && (
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#FFFFFF] hover:bg-[#F8FAFC] text-xs font-medium text-[#0F172A] border border-[#E2E8F0] rounded-xl transition shadow-2xs interactive-btn"
              title="Export filtered records to CSV"
            >
              <Download className="w-3.5 h-3.5 text-[#64748B]" />
              <span className="hidden sm:inline">Export</span>
            </button>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[#0F172A]">
          <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider font-semibold">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={`px-4 sm:px-5 py-3.5 whitespace-nowrap ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, cIdx) => (
                    <td key={cIdx} className="px-5 py-4">
                      <div className="h-4 bg-slate-200/70 rounded-md w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-slate-400">
                  <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-medium text-slate-600">No matching hospital records found</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Try altering the search query or active filter criteria.</p>
                </td>
              </tr>
            ) : (
              paginatedData.map((item, rowIdx) => (
                <tr
                  key={item.id || rowIdx}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={`hover:bg-blue-50/40 transition-all duration-150 group ${
                    onRowClick ? 'cursor-pointer hover:translate-x-0.5' : ''
                  }`}
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={`px-4 sm:px-5 py-3.5 align-middle ${col.className || ''}`}>
                      {col.cell
                        ? col.cell(item)
                        : col.accessorKey
                        ? String(item[col.accessorKey] ?? '—')
                        : '—'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B] bg-[#F8FAFC]">
        <div>
          Showing <span className="font-semibold text-[#0F172A]">{filteredData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</span> to{' '}
          <span className="font-semibold text-[#0F172A]">{Math.min(currentPage * pageSize, filteredData.length)}</span> of{' '}
          <span className="font-semibold text-[#0F172A]">{filteredData.length}</span> entries
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] text-[#0F172A] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F8FAFC] transition interactive-btn"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 font-semibold text-[#0F172A] font-mono text-[11px]">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] text-[#0F172A] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F8FAFC] transition interactive-btn"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
