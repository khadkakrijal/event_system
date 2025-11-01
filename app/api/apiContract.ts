// Shared types that mirror your Supabase tables (numeric IDs)

export type ID = number;

export type Event = {
  id: ID;
  title: string;
  venue: string | null;
  location: string | null;
  date: string;                 // ISO string
  description: string | null;
  featured_image: string | null;
  ticket_available: boolean;
};

export type NewEvent = Omit<Event, "id">;
export type UpdateEvent = Partial<Omit<Event, "id">>;

// --- Galleries ---
export type Gallery = {
  id: number;
  event_id: number;
  title: string;
  title2?: string;
  created_at?: string;
  updated_at?: string;
};

export type GalleryCreate = {
  event_id: number;
  title: string;
  title2?: string;
};

export type GalleryUpdate = Partial<{
  event_id: number;  
  title: string;
  title2: string;
}>;


export type Album = {
  id: ID;
  gallery_id: ID;
  image_url: string;
};
export type NewAlbum = Omit<Album, "id">;
export type UpdateAlbum = Partial<Omit<Album, "id" | "gallery_id">>;

export type Ticket = {
  id: ID;
  event_id: ID;
  username: string;
  email: string;
  quantity: number;
  ticket_type: string;
  purchased_date: string;       // ISO
};
export type NewTicket = Omit<Ticket, "id" | "purchased_date">;
export type UpdateTicket = Partial<Omit<Ticket, "id" | "event_id">>;

// optional helpers
export type ListQuery = { signal?: AbortSignal };
export type EventsQuery = ListQuery & { mode?: "past" | "upcoming" };
export type GalleriesQuery = ListQuery & { eventId?: ID };
export type AlbumsQuery = ListQuery & { galleryId?: ID };
export type TicketsQuery = ListQuery & { eventId?: ID };

export type ConnectEntry = {
  id: number;
  full_name: string;
  email: string;
  contact: string;
  country: string | null;
  city: string | null;
  comment: string | null;
  created_at: string; // ISO
};
export type NewConnectEntry = Omit<ConnectEntry, "id" | "created_at">;

export type ReportCounters = {
  totalEvents: number;
  ticketsSold: number;
  uniqueBuyers: number;
};

export type ReportEventRow = {
  event_id: number;
  event_title: string;
  event_date: string;     // ISO
  tickets_sold: number;
  unique_buyers: number;
  last_purchase_at: string | null;
};

export type ReportDailyRow = {
  day: string;           // YYYY-MM-DD
  tickets_sold: number;
};

export type ReportSummary = {
  counters: ReportCounters;
  perEvent: ReportEventRow[];
  daily: ReportDailyRow[];
};



export type ApiError = {
  status: number;
  message: string;
  details?: unknown;
};
