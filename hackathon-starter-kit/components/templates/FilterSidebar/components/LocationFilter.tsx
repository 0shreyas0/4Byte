import React from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface LocationFilterProps {
  countries: any[];
  selectedCountryName: string;
  onCountryChange: (isoCode: string) => void;
  localLocation: string;
  setLocalLocation: (value: string) => void;
  onSubmit: () => void;
}

export const LocationFilter: React.FC<LocationFilterProps> = ({
  countries,
  selectedCountryName,
  onCountryChange,
  localLocation,
  setLocalLocation,
  onSubmit
}) => {
  return (
    <div className="space-y-6 border-t pt-6 border-border">
      <div className="space-y-3">
        <h4 className="font-heading text-sm">Location</h4>
        
        {/* Country */}
        <select 
          className="w-full rounded-md border border-input bg-background text-sm p-2"
          value={countries.find(c => c.name === selectedCountryName)?.isoCode || ''}
          onChange={(e) => onCountryChange(e.target.value)}
        >
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
          ))}
        </select>

        {/* Specific Address Fallback */}
        <div className="flex gap-2">
          <Input 
            placeholder="Specific address..." 
            value={localLocation}
            onChange={(e) => setLocalLocation(e.target.value)}
            className="h-9 text-sm"
          />
          <Button size="sm" variant="outline" onClick={onSubmit}>
            Go
          </Button>
        </div>
      </div>
    </div>
  );
};
