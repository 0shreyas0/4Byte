import React from 'react';
import { Item } from './hooks/useSearchBar';

interface ResultItemProps {
  item: Item;
  onClick: (item: Item) => void;
}

export const ResultItem: React.FC<ResultItemProps> = ({ item, onClick }) => {
  return (
    <button
      onClick={() => onClick(item)}
      className="text-left hover:bg-accent rounded-lg transition-colors p-2 border border-border"
    >
      <div className="flex gap-3">
        {/* Thumbnail */}
        <div className="shrink-0 w-16 h-16 rounded-md overflow-hidden bg-secondary">
          {item.images && item.images.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
              No Image
            </div>
          )}
        </div>

        {/* Item Details */}
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-heading tracking-heading text-foreground line-clamp-2">
            {item.title}
          </h4>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
            {item.location?.address}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`text-xs font-action tracking-action px-2 py-0.5 rounded-full ${
                item.type === 'lost'
                  ? 'bg-destructive/10 text-destructive'
                  : 'bg-success/10 text-success'
              }`}
            >
              {item.type}
            </span>
            <span className="text-xs font-body text-muted-foreground">
              {item.category}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};
