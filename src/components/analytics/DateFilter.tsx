'use client';
import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

interface DateFilterProps {
  selectedMonth: number;
  selectedYear: number;
  selectedQuarter?: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onQuarterChange?: (quarter: number) => void;
  showQuarter?: boolean;
}

export default function DateFilter({ 
  selectedMonth, 
  selectedYear, 
  selectedQuarter,
  onMonthChange, 
  onYearChange, 
  onQuarterChange,
  showQuarter = false 
}: DateFilterProps) {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const quarters = [
    { value: 1, label: 'Q1 (Jan-Mar)' },
    { value: 2, label: 'Q2 (Apr-Jun)' },
    { value: 3, label: 'Q3 (Jul-Sep)' },
    { value: 4, label: 'Q4 (Oct-Dec)' }
  ];

  const years = [2022, 2023, 2024, 2025];

  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="flex items-center text-gray-800">
        <Calendar className="w-5 h-5 mr-2" />
        <span className="font-medium">Filter Period:</span>
      </div>
      
      <div className="flex space-x-3">
        {/* Month Selector */}
        <div className="relative">
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(parseInt(e.target.value))}
            className= "text-gray-800 appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {months.map((month, index) => (
              <option key={index + 1} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Year Selector */}
        <div className="relative">
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(parseInt(e.target.value))}
            className="text-gray-800 appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Quarter Selector */}
        {showQuarter && onQuarterChange && (
          <div className="relative">
            <select
              value={selectedQuarter || 1}
              onChange={(e) => onQuarterChange(parseInt(e.target.value))}
              className="text-gray-800 appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {quarters.map((quarter) => (
                <option key={quarter.value} value={quarter.value}>
                  {quarter.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        )}
      </div>
    </div>
  );
}