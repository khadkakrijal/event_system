const API_BASE: string =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ||
  "http://localhost:4000";
const JSON_HEADERS = {
  "Content-Type": "application/json",
};

if (process.env.NODE_ENV !== "production") {
  console.log("[api] API_BASE =", API_BASE);
}

import type {
  ApiError,
  Event,
  NewEvent,
  UpdateEvent,
  EventsQuery,
  Gallery,
  GalleriesQuery,
  Album,
  NewAlbum,
  UpdateAlbum,
  AlbumsQuery,
  Ticket,
  NewTicket,
  UpdateTicket,
  TicketsQuery,
  ID,
  ListQuery,
  GalleryCreate,
  GalleryUpdate,
} from "./apiContract";

// small helper to build query strings
function qs(params: Record<string, any> = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") search.set(k, String(v));
  });
  const s = search.toString();
  return s ? `?${s}` : "";
}

// single fetch wrapper with JSON + error handling
// in /app/api/apiService.ts
async function request<T>(
  path: string,
  init?: RequestInit & { expect?: number | number[] }
): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
      ...init,
    });

    const expect = init?.expect;
    const ok = Array.isArray(expect)
      ? expect
      : expect !== undefined
      ? [expect]
      : [200, 201];

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    if (!ok.includes(res.status)) {
      throw new Error(
        (data && (data.error || data.message)) || `HTTP ${res.status}`
      );
    }
    return data as T;
  } catch (err: any) {
    if (err?.name === "AbortError" || err?.message?.includes("aborted")) {
      return Promise.reject();
    }
    throw err;
  }
}

/* ------------------- EVENTS ------------------- */

export const EventsAPI = {
  list: (q: EventsQuery = {}) =>
    request<Event[]>(`/events${qs({ mode: q.mode })}`, { signal: q.signal }),

  get: (id: ID, q: ListQuery = {}) =>
    request<Event>(`/events/${id}`, { signal: q.signal }),

  create: (payload: NewEvent) =>
    request<Event>("/events", {
      method: "POST",
      body: JSON.stringify(payload),
      expect: 201,
    }),

  update: (id: ID, payload: UpdateEvent) =>
    request<Event>(`/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  remove: (id: ID) =>
    request<{ success: true }>(`/events/${id}`, {
      method: "DELETE",
    }),
};

/* ------------------- GALLERIES ------------------- */

export const GalleriesAPI = {
  list: async (params?: { eventId?: number }) => {
    const qs = params?.eventId ? `?eventId=${params.eventId}` : "";
    const res = await fetch(`${API_BASE}/galleries${qs}`, {
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error("Failed to load galleries");
    return (await res.json()) as Gallery[];
  },

  get: async (id: number) => {
    const res = await fetch(`${API_BASE}/galleries/${id}`, {
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error("Failed to load gallery");
    return (await res.json()) as Gallery;
  },

  create: async (body: GalleryCreate) => {
    const res = await fetch(`${API_BASE}/galleries`, {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error("Failed to create gallery");
    return (await res.json()) as Gallery;
  },

  // 🔧 allow event_id in update
  update: async (id: number, body: GalleryUpdate) => {
    const res = await fetch(`${API_BASE}/galleries/${id}`, {
      method: "PUT",
      headers: JSON_HEADERS,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error("Failed to update gallery");
    return (await res.json()) as Gallery;
  },

  remove: async (id: number) => {
    const res = await fetch(`${API_BASE}/galleries/${id}`, {
      method: "DELETE",
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error("Failed to delete gallery");
    return true;
  },
};

/* ------------------- ALBUMS (media) ------------------- */

export const AlbumsAPI = {
  list: (q: AlbumsQuery = {}) =>
    request<Album[]>(`/albums${qs({ galleryId: q.galleryId })}`, {
      signal: q.signal,
    }),

  get: (id: ID, q: ListQuery = {}) =>
    request<Album>(`/albums/${id}`, { signal: q.signal }),

  create: (payload: NewAlbum) =>
    request<Album>("/albums", {
      method: "POST",
      body: JSON.stringify(payload),
      expect: 201,
    }),

  update: (id: ID, payload: UpdateAlbum) =>
    request<Album>(`/albums/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  remove: (id: ID) =>
    request<{ success: true }>(`/albums/${id}`, {
      method: "DELETE",
    }),
};

/* ------------------- TICKETS ------------------- */

export const TicketsAPI = {
  list: (q: TicketsQuery = {}) =>
    request<Ticket[]>(`/tickets${qs({ eventId: q.eventId })}`, {
      signal: q.signal,
    }),

  get: (id: ID, q: ListQuery = {}) =>
    request<Ticket>(`/tickets/${id}`, { signal: q.signal }),

  create: (payload: NewTicket) =>
    request<{ success: true; ticket: Ticket }>("/tickets", {
      method: "POST",
      body: JSON.stringify(payload),
      expect: 201,
    }),

  update: (id: ID, payload: UpdateTicket) =>
    request<Ticket>(`/tickets/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  remove: (id: ID) =>
    request<{ success: true }>(`/tickets/${id}`, {
      method: "DELETE",
    }),
};
