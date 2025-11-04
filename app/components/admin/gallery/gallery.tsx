"use client";

import React, { useEffect, useMemo, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { FaFileUpload, FaEdit, FaTrash } from "react-icons/fa";
import Image from "next/image";

import { EventsAPI, GalleriesAPI, AlbumsAPI } from "@/app/api/apiService";
import type { Event, Gallery, Album } from "@/app/api/apiContract";

// ---- Local form/state types (use title2 instead of description)
type GalleryForm = {
  event_id: number | null;
  title: string;
  title2: string; // subtitle field in your DB
  images: string[]; // base64 strings or URLs to append
};

type GalleryRow = Gallery & {
  event_title?: string;
  images?: string[]; // preview images from albums
};

const initialForm: GalleryForm = {
  event_id: null,
  title: "",
  title2: "",
  images: [],
};

// Narrow keys for the text inputs (removes the need for `any`)
const textFields = ["title", "title2"] as const;
type TextField = (typeof textFields)[number];

const AdminGalleryPage: React.FC = () => {
  // lists
  const [events, setEvents] = useState<Event[]>([]);
  const [galleries, setGalleries] = useState<GalleryRow[]>([]);

  // ui state
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // form state
  const [form, setForm] = useState<GalleryForm>(initialForm);

  // ---------- LOADERS ----------
  const loadEvents = async () => {
    try {
      const data = await EventsAPI.list();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load events:", err);
      setEvents([]);
    }
  };

  const loadGalleries = async () => {
    setLoading(true);
    try {
      // 1) load galleries
      const data: Gallery[] = await GalleriesAPI.list();
      const base: GalleryRow[] = (data || []).map((g) => ({
        ...g,
        event_title: events.find((ev) => ev.id === g.event_id)?.title || "",
        images: [],
      }));

      // 2) hydrate with a few album images for preview (limit 6)
      const hydrated = await Promise.all(
        base.map(async (g) => {
          try {
            const albums: Album[] = await AlbumsAPI.list({ galleryId: g.id });
            return {
              ...g,
              images: (albums || [])
                .slice(0, 6)
                .map((a) => a.image_url || "/events.jpg"),
            };
          } catch {
            return { ...g, images: [] };
          }
        })
      );

      // 3) ensure event titles (if events already loaded)
      const withTitles = hydrated.map((g) => ({
        ...g,
        event_title:
          g.event_title || events.find((ev) => ev.id === g.event_id)?.title || "",
      }));

      setGalleries(withTitles);
      setError(null);
    } catch (err) {
      console.error("Failed to load galleries:", err);
      setError("Failed to load galleries");
      setGalleries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await loadEvents();
    })();
  }, []);

  // load galleries when events are loaded (so event titles can map)
  useEffect(() => {
    (async () => {
      await loadGalleries();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events.length]);

  // ---------- DIALOG OPEN/CLOSE ----------
  const openCreate = () => {
    setEditId(null);
    setForm(initialForm);
    setDialogVisible(true);
  };

  const openEdit = (row: GalleryRow) => {
    setEditId(row.id);
    setForm({
      event_id: row.event_id,
      title: row.title || "",
      title2: row.title2 || "",
      images: [], // only append new images on edit
    });
    setDialogVisible(true);
  };

  // ---------- FORM HANDLERS ----------
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const key = name as TextField; // narrow to "title" | "title2"
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleEventSelect = (value: number | null) => {
    setForm((prev) => ({ ...prev, event_id: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const readers: Promise<string>[] = Array.from(files).map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(String(reader.result));
          reader.readAsDataURL(file);
        })
    );

    const imgs = await Promise.all(readers);
    setForm((prev) => ({ ...prev, images: imgs }));
  };

  // ---------- SUBMIT ----------
  const handleSubmit = async () => {
    if (!form.title || !form.event_id) return;
    setSaving(true);
    try {
      if (editId == null) {
        // CREATE: create gallery, then create albums for selected images
        const created: Gallery = await GalleriesAPI.create({
          event_id: form.event_id!,
          title: form.title,
          title2: form.title2,
        });

        if (created?.id && form.images.length > 0) {
          await Promise.all(
            form.images.map((img) =>
              AlbumsAPI.create({
                gallery_id: created.id,
                image_url: img,
              })
            )
          );
        }
      } else {
        // UPDATE gallery fields
        await GalleriesAPI.update(editId, {
          event_id: form.event_id!,
          title: form.title,
          title2: form.title2,
        });

        // Append any newly-selected images as new albums
        if (form.images.length > 0) {
          await Promise.all(
            form.images.map((img) =>
              AlbumsAPI.create({
                gallery_id: editId,
                image_url: img,
              })
            )
          );
        }
      }

      setDialogVisible(false);
      setForm(initialForm);
      setEditId(null);
      await loadGalleries(); // refresh table
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  // ---------- DELETE ----------
  const handleDelete = async (id: number) => {
    const ok = window.confirm("Delete this gallery?");
    if (!ok) return;
    try {
      await GalleriesAPI.remove(id);
      await loadGalleries();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // event options for dropdown
  const eventOptions = useMemo(
    () => events.map((e) => ({ label: e.title, value: e.id })),
    [events]
  );

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gallery Management</h1>
        <Button
          label="Add Gallery"
          icon="pi pi-plus"
          className="bg-blue-600 text-white hover:bg-blue-700 border-none px-4 py-2 rounded-md"
          onClick={openCreate}
        />
      </div>

      {/* Dialog */}
      <Dialog
        header={
          <h2 className="text-white text-xl font-semibold text-center py-2">
            {editId == null ? "Create Gallery" : `Edit Gallery #${editId}`}
          </h2>
        }
        visible={dialogVisible}
        style={{ width: "100%", maxWidth: "550px" }}
        onHide={() => setDialogVisible(false)}
        className="rounded-md shadow-lg bg-gradient-to-br from-gray-500 to-black text-white p-2"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex flex-col gap-6 px-4 pt-4 pb-6"
        >
          {/* Event select */}
          <div>
            <label className="block mb-2 font-semibold">Select Event</label>
            <Dropdown
              value={form.event_id}
              options={eventOptions}
              onChange={(ev) => handleEventSelect((ev.value as number) ?? null)}
              placeholder="Select an Event"
              className="w-full bg-white text-black rounded-md p-2"
              disabled={eventOptions.length === 0}
            />
            {eventOptions.length === 0 && (
              <p className="text-red-300 text-sm mt-2">
                No events available. Please create an event first.
              </p>
            )}
          </div>

          {/* Title & Subtitle (title2) */}
          {textFields.map((field) => (
            <div key={field} className="flex flex-col">
              <label htmlFor={field} className="mb-2 font-semibold">
                {field === "title2" ? "Subtitle" : "Title"}
              </label>
              <InputText
                id={field}
                name={field}
                value={(form[field] as string) ?? ""}
                onChange={handleFieldChange}
                className="border bg-white border-gray-300 text-black px-4 py-2 rounded-md shadow-sm"
                required={field === "title"}
              />
            </div>
          ))}

          {/* Images */}
          <div className="flex flex-col">
            <label htmlFor="images" className="mb-2 font-semibold">
              Gallery Images
            </label>
            <div className="flex items-center justify-between bg-white rounded-md p-4 border border-gray-300">
              <label
                htmlFor="image-upload"
                className="flex items-center gap-2 text-black cursor-pointer"
              >
                <FaFileUpload className="text-xl" />
                <span>
                  {form.images.length > 0
                    ? `${form.images.length} Images Selected`
                    : "Choose Images"}
                </span>
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                multiple
                onChange={handleImageUpload}
              />
            </div>
            {editId != null && (
              <p className="text-xs text-white/80 mt-2">
                Adding images while editing will <b>append</b> new images to this gallery.
              </p>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button
              label={
                saving
                  ? "Saving..."
                  : editId == null
                  ? "Create Gallery"
                  : "Update Gallery"
              }
              icon="pi pi-check"
              type="submit"
              disabled={saving}
              className="bg-green-600 text-white hover:bg-green-700 border-none px-6 py-2 rounded-md"
            />
          </div>
        </form>
      </Dialog>

      {/* Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <DataTable
          value={galleries}
          paginator
          rows={5}
          stripedRows
          loading={loading}
          className="p-datatable-sm border border-gray-300 p-2"
        >
          <Column field="event_title" header="Event" bodyClassName="truncate max-w-[150px] py-6 px-2" />
          <Column field="title" header="Title" bodyClassName="truncate max-w-[150px] px-2" />
          <Column field="title2" header="Subtitle" bodyClassName="truncate max-w-[150px] px-2 " />
          <Column
            header="Images"
            body={(row: GalleryRow) => (
              <div className="flex gap-2 overflow-auto max-w-[260px]">
                {(row.images || []).map((img, idx) => (
                  <Image
                    key={idx}
                    src={img || "/events.jpg"}
                    height={100}
                    width={100}
                    alt="gallery"
                    className="h-10 w-10 object-cover rounded"
                  />
                ))}
              </div>
            )}
          />
          <Column
            header="Actions"
            body={(row: GalleryRow) => (
              <div className="flex gap-2">
                <Button
                  icon={<FaEdit />}
                  className="bg-yellow-500 text-white px-2 py-1"
                  onClick={() => openEdit(row)}
                />
                <Button
                  icon={<FaTrash />}
                  className="bg-red-600 text-white px-2 py-1"
                  onClick={() => handleDelete(row.id)}
                />
              </div>
            )}
          />
        </DataTable>
      </div>

      {error && <p className="text-red-500 mt-3">{error}</p>}
    </div>
  );
};

export default AdminGalleryPage;
