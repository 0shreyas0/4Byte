import { useState, useEffect, useCallback } from 'react';

export interface FilterOption {
  id: string;
  label: string;
}

export interface FilterGroupType {
  id: string;
  title: string;
  type: 'checkbox' | 'select' | 'radio';
  options: FilterOption[];
}

export const useFilterSidebar = (filters: any, onFilterChange: (newFilters: any) => void, showLocationFilter: boolean) => {
  /* eslint-disable @typescript-eslint/no-var-requires */
  const { Country, State } = require('country-state-city');

  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [localLocation, setLocalLocation] = useState(filters.location || '');

  useEffect(() => {
    if (showLocationFilter) {
      setCountries(Country.getAllCountries());
    }
  }, [showLocationFilter, Country]);

  const handleToggleFilter = useCallback((groupId: string, optionId: string) => {
    const current = filters[groupId] || [];
    const updated = current.includes(optionId)
      ? current.filter((id: string) => id !== optionId)
      : [...current, optionId];
    
    onFilterChange({ ...filters, [groupId]: updated });
  }, [filters, onFilterChange]);

  const handleCountryChange = useCallback((isoCode: string) => {
    const country = countries.find(c => c.isoCode === isoCode);
    setStates(country ? State.getStatesOfCountry(country.isoCode) : []);
    onFilterChange({ ...filters, country: country?.name || '', state: '', city: '' });
  }, [countries, filters, onFilterChange, State]);

  const handleLocationSubmit = useCallback(() => {
    onFilterChange({ ...filters, location: localLocation });
  }, [filters, localLocation, onFilterChange]);

  const clearFilters = useCallback(() => {
    onFilterChange({});
  }, [onFilterChange]);

  return {
    countries,
    states,
    localLocation,
    setLocalLocation,
    handleToggleFilter,
    handleCountryChange,
    handleLocationSubmit,
    clearFilters
  };
};
