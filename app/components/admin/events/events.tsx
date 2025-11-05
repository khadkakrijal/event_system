"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import Image from "next/image";
import { FaFileUpload, FaEdit, FaTrash } from "react-icons/fa";
import { EventsAPI } from "@/app/api/apiService";
import type { Event } from "@/app/api/apiContract";

// helper: Next <input type="date" /> gives "YYYY-MM-DD".
// backend expects ISO -> normalize to midnight UTC.
const toISODate = (d: string) => (d.includes("T") ? d : `${d}T00:00:00Z`);
const fromISODateOnly = (iso?: string) =>
  iso ? new Date(iso).toISOString().slice(0, 10) : "";

type FormEvent = Partial<
  Pick<
    Event,
    | "title"
    | "date"
    | "location"
    | "venue"
    | "featured_image"
    | "description"
    | "ticket_available"
  >
>;

const initialForm: FormEvent = {
  title: "",
  date: "",
  location: "",
  venue: "",
  featured_image: "",
  description: "",
  ticket_available: true,
};

// Typed list of text fields used in the form
const textFields = ["title", "date", "location", "venue"] as const;
type TextField = (typeof textFields)[number];

const AdminEventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [form, setForm] = useState<FormEvent>(initialForm);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await EventsAPI.list(); // GET /events
      setEvents(data || []);
    } catch (e: unknown) {
      // eslint-disable-next-line no-console
      console.error("Failed to load events:", e);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const openCreate = () => {
    setEditId(null);
    setForm(initialForm);
    setDialogVisible(true);
  };

  const openEdit = (row: Event) => {
    setEditId(row.id);
    setForm({
      title: row.title,
      date: fromISODateOnly(row.date),
      location: row.location || "",
      venue: row.venue || "",
      featured_image: row.featured_image || "",
      description: row.description || "",
      ticket_available: !!row.ticket_available,
    });
    setDialogVisible(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "description") {
      setForm((prev) => ({ ...prev, description: value }));
      return;
    }
    const key = name as TextField;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, featured_image: String(reader.result) }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.date) return;

    try {
      setSaving(true);

      const payload = {
        title: form.title!,
        date: toISODate(form.date!),
        location: form.location || "",
        venue: form.venue || "",
        featured_image: form.featured_image || "/events.jpg",
        description: form.description || "",
        ticket_available: form.ticket_available ?? true,
      };

      if (editId == null) {
        await EventsAPI.create(payload);
      } else {
        await EventsAPI.update(editId, payload);
      }

      setDialogVisible(false);
      setForm(initialForm);
      setEditId(null);
      await loadEvents();
    } catch (e: unknown) {
      // eslint-disable-next-line no-console
      console.error("Save failed:", e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const ok = window.confirm("Delete this event?");
      if (!ok) return;
      await EventsAPI.remove(id);
      await loadEvents();
    } catch (e: unknown) {
      // eslint-disable-next-line no-console
      console.error("Delete failed:", e);
    }
  };

  // Small helper to render truncated description safely
  const renderDescription = (row: Event) => {
    const text = row.description || "";
    const short = text.length > 120 ? text.slice(0, 120) + "…" : text;
    return <span title={text}>{short}</span>;
  };

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Event Management</h1>
        <Button
          label="Add Event"
          icon="pi pi-plus"
          className="bg-blue-600 text-white hover:bg-blue-700 border-none px-4 py-2 rounded-md"
          onClick={openCreate}
        />
      </div>

      {/* Create / Edit dialog */}
      <Dialog
        header={
          <div className="text-center py-2">
            <h2 className="text-2xl font-bold text-white">
              {editId == null ? "Create New Event" : `Edit Event #${editId}`}
            </h2>
            <p className="text-sm text-white">Fill in the details below</p>
          </div>
        }
        visible={dialogVisible}
        style={{ width: "100%", maxWidth: "620px" }}
        onHide={() => setDialogVisible(false)}
        className="rounded-md shadow-lg bg-gradient-to-br from-gray-500 to-black text-white p-2"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex flex-col gap-6 px-4 pt-4 pb-6 text-white"
        >
          {textFields.map((field) => (
            <div key={field} className="flex flex-col">
              <label
                htmlFor={field}
                className="mb-2 font-semibold text-white capitalize"
              >
                {field === "date"
                  ? "Event Date"
                  : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <InputText
                id={field}
                name={field}
                type={field === "date" ? "date" : "text"}
                value={(form[field] as string) ?? ""}
                onChange={handleChange}
                className="border bg-white border-gray-300 text-black px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          ))}

          {/* Description (textarea) */}
          <div className="flex flex-col">
            <label htmlFor="description" className="mb-2 font-semibold text-white">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description ?? ""}
              onChange={handleChange}
              rows={4}
              placeholder="Short summary about the event…"
              className="border bg-white border-gray-300 text-black px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Event Image */}
          <div className="flex flex-col">
            <label htmlFor="image-upload" className="mb-2 font-semibold text-white">
              Event Image
            </label>
            <div className="flex items-center justify-between bg-white rounded-md p-3 border border-gray-300">
              <label
                htmlFor="image-upload"
                className="flex items-center gap-2 text-black cursor-pointer"
              >
                <FaFileUpload className="text-xl" />
                <span>
                  {form.featured_image ? "Image Selected" : "Choose Image"}
                </span>
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              label={
                saving
                  ? "Saving..."
                  : editId == null
                  ? "Create Event"
                  : "Update Event"
              }
              icon="pi pi-check"
              type="submit"
              disabled={saving}
              className="bg-green-600 text-white hover:bg-green-700 border-none px-6 py-2 rounded-md"
            />
          </div>
        </form>
      </Dialog>

      {/* Events Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <DataTable
          value={events}
          paginator
          rows={5}
          stripedRows
          loading={loading}
          className="p-datatable-sm border border-gray-300 p-2 "
        >
          <Column field="title" header="Title" bodyClassName="py-6 px-2" />
          <Column
            field="date"
            header="Date"
            body={(r: Event) => new Date(r.date).toLocaleString()}
          />
          <Column
            field="location"
            header="Location"
            bodyClassName="max-w-[150px] truncate px-2 "
          />
          <Column
            field="venue"
            header="Venue"
            bodyClassName="max-w-[150px] truncate  px-2"
          />
          {/* NEW: Description column (truncated) */}
          <Column
            field="description"
            header="Description"
            body={renderDescription}
            bodyClassName="max-w-[150px]  truncate px-2"
          />
          <Column
            field="featured_image"
            header="Image"
            body={(row: Event) => (
              <Image
                src={row.featured_image || "/events.jpg"}
                alt="event"
                width={100}
                height={100}
                className="h-12 w-16 object-cover rounded"
              />
            )}
          />
          <Column
            header="Actions"
            body={(row: Event) => (
              <div className="flex gap-4 text-xl items-center px-2">
                <button
                  onClick={() => openEdit(row)}
                  className="text-yellow-600 hover:text-yellow-700"
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(row.id)}
                  className="text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            )}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default AdminEventsPage;
