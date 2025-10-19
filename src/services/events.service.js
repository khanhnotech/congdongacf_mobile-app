import { apiClient } from './api';

const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
};

const mapEvent = (row = {}) => {
  const id =
    toNumber(row.id) ??
    toNumber(row.event_id) ??
    toNumber(row.eventId) ??
    undefined;

  return {
    id: id ?? row.slug ?? `event-${Date.now()}`,
    eventId: id,
    title:
      row.title ??
      row.name ??
      row.event_name ??
      'S\u1EF1 ki\u1EC7n',
    summary: row.summary ?? row.description ?? '',
    description: row.description ?? '',
    location: row.location ?? row.address ?? '',
    startAt:
      row.start_at ??
      row.startAt ??
      row.start_date ??
      row.startDate ??
      null,
    endAt:
      row.end_at ??
      row.endAt ??
      row.end_date ??
      row.endDate ??
      null,
    stockTicker: row.stock_ticker ?? row.stockTicker ?? null,
    raw: row,
  };
};

const extractPayload = (response) => {
  if (!response) {
    return { rows: [], pagination: undefined };
  }
  if (Array.isArray(response)) {
    return { rows: response, pagination: undefined };
  }
  const data = response.data ?? response.items ?? response.rows ?? [];
  const pagination =
    response.pagination ??
    response.meta ??
    response.data?.pagination ??
    undefined;
  return { rows: data, pagination };
};

export const eventsService = {
  async listEvents(params) {
    const response = await apiClient.get('event', { params });
    const { rows, pagination } = extractPayload(response);
    return {
      items: rows.map(mapEvent),
      meta: pagination,
    };
  },
  async getEvent(id) {
    if (!id) return null;
    const response = await apiClient.get(`event/${id}`);
    const row = response?.data ?? response;
    if (!row) return null;
    return mapEvent(row);
  },
};
