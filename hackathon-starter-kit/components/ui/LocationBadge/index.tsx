import { MapPin } from 'lucide-react';

interface LocationBadgeProps {
  location: string;
  className?: string;
}

export const LocationBadge = ({ location, className = '' }: LocationBadgeProps) => {
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-action bg-success/10 text-success border border-success/20 ${className}`}>
      <MapPin className="w-3.5 h-3.5 shrink-0" />
      <span className="truncate max-w-[150px]">{location || 'Unknown Location'}</span>
    </div>
  );
};
