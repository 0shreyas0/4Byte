import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "../ui/Card";

interface ItemCardProps {
  header?: ReactNode;
  media?: ReactNode;
  title?: string | ReactNode;
  subtitle?: string | ReactNode;
  footer?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function ItemCard({
  header,
  media,
  title,
  subtitle,
  footer,
  onClick,
  className = "",
}: ItemCardProps) {
  return (
    <div className={`h-full ${className}`}>
      <motion.div
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         whileHover={{ y: -5 }}
         transition={{ duration: 0.2 }}
         className="h-full"
      >
      <Card 
        className={`h-full overflow-hidden transition-all hover:shadow-md hover:border-primary/50 cursor-pointer group flex flex-col`}
        onClick={onClick}
      >
        {/* Slot: Header */}
        {header && (
          <div className="p-3 border-b border-border">
            {header}
          </div>
        )}

        {/* Slot: Media */}
        <div className="aspect-square w-full bg-secondary relative overflow-hidden">
          {media || (
            <div className="flex h-full w-full items-center justify-center bg-secondary text-muted-foreground">
              No Media
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-2 flex-1 flex flex-col justify-center">
          {typeof title === 'string' ? (
            <h3 className="text-h3 font-heading tracking-heading line-clamp-1">{title}</h3>
          ) : (
            title
          )}
          {typeof subtitle === 'string' ? (
            <div className="text-base font-body tracking-body leading-body text-muted-foreground line-clamp-1">{subtitle}</div>
          ) : (
            subtitle
          )}
        </CardContent>

        {/* Slot: Footer */}
        {footer && (
          <CardFooter className="p-4 pt-0">
            {footer}
          </CardFooter>
        )}
      </Card>
      </motion.div>
    </div>
  );
}
