import dayjs from 'dayjs';

export const formatDate = (dateStr?: string | Date, withTime?: boolean) =>
  dayjs(dateStr).format(`MMM DD${withTime ? ', hh:mm a' : ''}`);

export const getRandomInt = (max: number = 10000) => Math.floor(Math.random() * max);

export const getUpdatedImageName = (fileName?: string | null) => {
  if (!fileName) return;
  const oldName = fileName?.split('/').pop();
  if (oldName) {
    const [name, extension] = oldName.split('.');
    const version = name.indexOf('__') > -1 ? name.split('__').pop() || 0 : 0;
    return `${name}__${+version + 1}.${extension}`;
  }
  return;
};
