import React from 'react';
import { FilterGroupType } from '../hooks/useFilterSidebar';

interface FilterGroupProps {
  group: FilterGroupType;
  selectedOptions: string[];
  onToggle: (groupId: string, optionId: string) => void;
}

export const FilterGroup: React.FC<FilterGroupProps> = ({ group, selectedOptions, onToggle }) => {
  return (
    <div className="space-y-3">
      <h4 className="font-heading text-sm">{group.title}</h4>
      <div className="space-y-2">
        {group.options.map((opt) => (
          <label key={opt.id} className="flex items-center space-x-2 cursor-pointer group">
            <input 
              type="checkbox" 
              className="rounded border-input text-primary focus:ring-ring"
              checked={selectedOptions.includes(opt.id)}
              onChange={() => onToggle(group.id, opt.id)}
            />
            <span className="text-sm text-muted-foreground group-hover:text-primary">
              {opt.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};
