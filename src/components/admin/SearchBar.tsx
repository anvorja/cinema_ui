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
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-board-mute" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 bg-board-panel2 border border-board-line2 rounded-lg text-board-ink placeholder-board-mute focus:outline-none focus:ring-2 focus:ring-board-amber focus:border-transparent w-full min-w-[300px]"
          />
        </div>

        {/* Filtros adicionales se pueden agregar aquí */}
      </div>

      {showAddButton && onAddClick && (
        <button
          onClick={onAddClick}
          className="bg-board-amber text-board-onamber px-4 py-2 rounded-lg hover:bg-board-amberpress focus:outline-none focus:ring-2 focus:ring-board-amber focus:ring-offset-2 focus:ring-offset-gray-800 flex items-center transition-colors duration-200"
        >
          <Plus className="h-5 w-5 mr-2" />
          <span className="hidden sm:inline">{addButtonText}</span>
        </button>
      )}
    </div>
  );
};

export default SearchBar;