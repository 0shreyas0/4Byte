export interface TimelineEvent {
  id: string;
  date: string | Date;
  title: string;
  description?: string;
  type?: 'incident' | 'milestone' | 'action' | 'update';
  meta?: any;
}

/**
 * Sorts and groups events by date for a timeline view
 */
export const processTimelineEvents = (events: TimelineEvent[]) => {
  return [...events].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA - dateB;
  });
};

/**
 * Filters events within a date range
 */
export const filterEventsByRange = (events: TimelineEvent[], start: Date, end: Date) => {
  return events.filter(event => {
    const date = new Date(event.date);
    return date >= start && date <= end;
  });
};
