import React from 'react';
import '../css/SearchBar.css';
export default function SearchAndFilter({ searchTerm, onSearchChange, filterOptions = [], selectedFilter, onFilterChange }) {
  return (
    <div className="search-filter-bar">
      <input
        className="search-input"
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      {filterOptions.length > 0 && (
        <select
          value={selectedFilter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="filter-select"
        >
          <option value="">All</option>
          {filterOptions.map((option, idx) => (
            <option key={idx} value={option}>{option}</option>
          ))}
        </select>
      )}
    </div>
  );
}
