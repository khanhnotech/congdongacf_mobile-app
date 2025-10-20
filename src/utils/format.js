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
  return `${value.substring(0, limit)}...`;
};

export const formatName = (user) => {
  if (!user) return '';
  const firstName =
    user.firstName ??
    user.first_name ??
    '';
  const lastName =
    user.lastName ??
    user.last_name ??
    '';
  const combined = `${firstName} ${lastName}`.trim();
  if (combined) return combined;
  if (user.fullName ?? user.full_name) return user.fullName ?? user.full_name;
  if (user.displayName ?? user.display_name) return user.displayName ?? user.display_name;
  if (user.name) return user.name;
  if (user.username) return user.username;
  if (user.email) return user.email;
  return '';
};

export const formatDateTime = (value) => {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const dayPart = date.toLocaleDateString(undefined, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const timePart = date
    .toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    .replace(/\s/g, '');

  return `${dayPart} ${timePart}`;
};
