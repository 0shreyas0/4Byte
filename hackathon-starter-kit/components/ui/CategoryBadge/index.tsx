import { Tag, Smartphone, Briefcase, Shirt, HelpCircle, Watch } from 'lucide-react';

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

export const CategoryBadge = ({ category, className = '' }: CategoryBadgeProps) => {
  const getCategoryStyles = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'electronics':
        return {
          bg: 'bg-category-electronics/10',
          text: 'text-category-electronics',
          icon: Smartphone
        };
      case 'clothing':
        return {
          bg: 'bg-category-clothing/10',
          text: 'text-category-clothing',
          icon: Shirt
        };
      case 'documents':
        return {
          bg: 'bg-category-documents/10',
          text: 'text-category-documents',
          icon: Briefcase
        };
      case 'accessories':
        return {
          bg: 'bg-category-accessories/10',
          text: 'text-category-accessories',
          icon: Watch
        };
      default:
        return {
          bg: 'bg-muted',
          text: 'text-muted-foreground',
          icon: Tag
        };
    }
  };

  const { bg, text, icon: Icon } = getCategoryStyles(category);

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-action ${bg} ${text} ${className}`}>
      <Icon className="w-3.5 h-3.5" />
      {category}
    </div>
  );
};
