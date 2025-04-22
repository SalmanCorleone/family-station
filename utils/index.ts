import dayjs from 'dayjs';

export const formatDate = (dateStr?: string, withTime?: boolean) =>
  dayjs(dateStr).format(`MMM DD${withTime ? ', hh:mm a' : ''}`);
