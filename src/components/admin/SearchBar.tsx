// src/components/admin/SearchBar.jsx
import React from 'react';
import { Search, Plus } from 'lucide-react';

const SearchBar = ({
  searchTerm,
  onSearchChange,
  placeholder = "Buscar...",
  showAddButton = false,
  addButtonText = "Nuevo",
  onAddClick = undefined
}: { searchTerm: any; onSearchChange: any; placeholder?: string; showAddButton?: boolean; addButtonText?: string; onAddClick?: any }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4 flex-1">
        <div className="relative max-w-md">
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full min-w-[300px]"
          />
        </div>

        {/* Filtros adicionales se pueden agregar aquí */}
      </div>

      {showAddButton && onAddClick && (
        <button
          onClick={onAddClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 flex items-center transition-colors duration-200"
        >
          <Plus className="h-5 w-5 mr-2" />
          <span className="hidden sm:inline">{addButtonText}</span>
        </button>
      )}
    </div>
  );
};

export default SearchBar;