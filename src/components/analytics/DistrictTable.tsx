'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table';

interface District {
  id: string;
  name: string;
  activeIncidents: number;
  responseTime: string;
  feedback: number;
  testingStatus: string;
  riskScore: number;
}

interface DistrictTableProps {
  selectedDistrict: string | null;
  onDistrictSelect: (district: string) => void;
}

const mockDistrictData: District[] = [
  {
    id: 'capricorn',
    name: 'Capricorn',
    activeIncidents: 12,
    responseTime: '4:32',
    feedback: 234,
    testingStatus: 'In Progress',
    riskScore: 67,
  },
  {
    id: 'sekhukhune',
    name: 'Sekhukhune',
    activeIncidents: 8,
    responseTime: '5:12',
    feedback: 189,
    testingStatus: 'Completed',
    riskScore: 52,
  },
  {
    id: 'waterberg',
    name: 'Waterberg',
    activeIncidents: 5,
    responseTime: '4:58',
    feedback: 156,
    testingStatus: 'Pending',
    riskScore: 38,
  },
  {
    id: 'mopani',
    name: 'Mopani',
    activeIncidents: 10,
    responseTime: '5:45',
    feedback: 212,
    testingStatus: 'In Progress',
    riskScore: 61,
  },
  {
    id: 'vhembe',
    name: 'Vhembe',
    activeIncidents: 6,
    responseTime: '6:15',
    feedback: 178,
    testingStatus: 'Completed',
    riskScore: 45,
  },
];

const columnHelper = createColumnHelper<District>();

const DistrictTable: React.FC<DistrictTableProps> = ({ selectedDistrict, onDistrictSelect }) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = [
    columnHelper.accessor('name', {
      header: 'District/Municipality',
      cell: info => (
        <button
          onClick={() => onDistrictSelect(info.row.original.id)}
          className="font-semibold text-blue-300 hover:text-blue-200 transition-colors"
        >
          {info.getValue()}
        </button>
      ),
    }),
    columnHelper.accessor('activeIncidents', {
      header: 'Active Incidents',
      cell: info => <span className="text-amber-300">{info.getValue()}</span>,
    }),
    columnHelper.accessor('responseTime', {
      header: 'Avg Response Time',
      cell: info => <span className="text-white">{info.getValue()}</span>,
    }),
    columnHelper.accessor('testingStatus', {
      header: 'Testing/Upgrades',
      cell: info => {
        const status = info.getValue();
        const colors: Record<string, string> = {
          'In Progress': 'bg-blue-500/20 text-blue-300',
          'Completed': 'bg-green-500/20 text-green-300',
          'Pending': 'bg-yellow-500/20 text-yellow-300',
        };
        return (
          <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[status]}`}>
            {status}
          </span>
        );
      },
    }),
    columnHelper.accessor('feedback', {
      header: 'Citizen Feedback',
      cell: info => <span className="text-slate-300">{info.getValue()}</span>,
    }),
    columnHelper.accessor('riskScore', {
      header: 'AI Risk Score',
      cell: info => {
        const score = info.getValue();
        const color = score > 60 ? 'text-red-400' : score > 40 ? 'text-orange-400' : 'text-green-400';
        return <span className={`font-bold ${color}`}>{score}%</span>;
      },
    }),
  ];

  const table = useReactTable({
    data: mockDistrictData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-4">District & Municipality Activity</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-600/50">
              {table.getHeaderGroups().map(headerGroup =>
                headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-4 py-3 text-left text-sm font-semibold text-slate-300 hover:text-slate-100 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <div className="w-4 h-4">
                        {header.column.getIsSorted() === 'asc' && <ChevronUp className="w-4 h-4" />}
                        {header.column.getIsSorted() === 'desc' && <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, idx) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors ${
                  selectedDistrict === row.original.id ? 'bg-blue-500/10 border-blue-500/50' : ''
                }`}
                onClick={() => onDistrictSelect(row.original.id)}
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-3 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs text-slate-400">
        <p>💡 Tip: Click any row to zoom to that district on the map. Sort by any column header.</p>
      </div>
    </motion.div>
  );
};

export default DistrictTable;
