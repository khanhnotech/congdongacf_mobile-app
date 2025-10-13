export const formatDate = (value) => {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString(undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
};

export const truncate = (value, limit = 120) => {
  if (!value) return '';
  if (value.length <= limit) return value;
  return `${value.substring(0, limit)}…`;
};

export const formatName = (user) => {
  if (!user) return '';
  const { firstName = '', lastName = '' } = user;
  return `${firstName} ${lastName}`.trim();
};
