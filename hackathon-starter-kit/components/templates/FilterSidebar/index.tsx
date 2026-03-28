'use client';

import React from 'react';
import { useFilterSidebar, FilterGroupType } from './hooks/useFilterSidebar';
import { FilterGroup } from './components/FilterGroup';
import { LocationFilter } from './components/LocationFilter';

interface FilterSidebarProps {
  filters: any;
  onFilterChange: (newFilters: any) => void;
  groups?: FilterGroupType[];
  title?: string;
  showLocationFilter?: boolean;
}

export default function FilterSidebar({ 
  filters, 
  onFilterChange,
  groups = [],
  title = "Filters",
  showLocationFilter = true
}: FilterSidebarProps) {
  const {
    countries,
    localLocation,
    setLocalLocation,
    handleToggleFilter,
    handleCountryChange,
    handleLocationSubmit,
    clearFilters
  } = useFilterSidebar(filters, onFilterChange, showLocationFilter);

  return (
    <div className="sticky top-20 space-y-8 max-h-[calc(100vh-6rem)] overflow-y-auto pb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-heading text-h3">{title}</h3>
        <button onClick={clearFilters} className="text-sm text-primary hover:underline">
          Clear all
        </button>
      </div>

      {groups.map((group) => (
        <FilterGroup 
          key={group.id} 
          group={group} 
          selectedOptions={filters[group.id] || []}
          onToggle={handleToggleFilter}
        />
      ))}

      {showLocationFilter && (
        <LocationFilter 
          countries={countries}
          selectedCountryName={filters.country}
          onCountryChange={handleCountryChange}
          localLocation={localLocation}
          setLocalLocation={setLocalLocation}
          onSubmit={handleLocationSubmit}
        />
      )}
    </div>
  );
}
