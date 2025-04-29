import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { FaFileUpload, FaEdit, FaTrash } from "react-icons/fa";
import Image from "next/image";

interface Event {
  id: number;
  title: string;
}

interface GalleryItem {
  id: number;
  eventId: number;
  title: string;
  description: string;
  images: string[];
}

const AdminGalleryPage = () => {
  const [events] = useState<Event[]>([ 
    { id: 1, title: "AI Symposium" },
    { id: 2, title: "Cultural Fest" }
  ]);

  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [newGallery, setNewGallery] = useState<GalleryItem>({
    id: 0,
    eventId: 0,
    title: "",
    description: "",
    images: []
  });
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewGallery({ ...newGallery, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const readers: Promise<string>[] = Array.from(files).map(file => {
        return new Promise(resolve => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then(images => {
        setNewGallery({ ...newGallery, images });
      });
    }
  };

  const handleSubmit = () => {
    if (editMode && editId !== null) {
      const updated = galleries.map((g) =>
        g.id === editId ? { ...newGallery, id: editId } : g
      );
      setGalleries(updated);
    } else {
      setGalleries([
        ...galleries,
        { ...newGallery, id: galleries.length + 1 }
      ]);
    }
    setNewGallery({ id: 0, eventId: 0, title: "", description: "", images: [] });
    setDialogVisible(false);
    setEditMode(false);
    setEditId(null);
  };

  const handleEdit = (gallery: GalleryItem) => {
    setNewGallery(gallery);
    setEditMode(true);
    setEditId(gallery.id);
    setDialogVisible(true);
  };

  const handleDelete = (id: number) => {
    setGalleries(galleries.filter((g) => g.id !== id));
  };

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gallery Management</h1>
        <Button
          label="Add Gallery"
          icon="pi pi-plus"
          className="bg-blue-600 text-white hover:bg-blue-700 border-none px-4 py-2 rounded-md"
          onClick={() => {
            setDialogVisible(true);
            setEditMode(false);
            setNewGallery({ id: 0, eventId: 0, title: "", description: "", images: [] });
          }}
        />
      </div>

      <Dialog
        header={<h2 className="text-white text-xl font-semibold text-center py-2">{editMode ? "Edit Gallery" : "Create Gallery"}</h2>}
        visible={dialogVisible}
        style={{ width: "100%", maxWidth: "550px" }}
        onHide={() => setDialogVisible(false)}
        className="rounded-md shadow-lg bg-gradient-to-br from-gray-500 to-black text-white p-2"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex flex-col gap-6 px-4 pt-4 pb-6">
          <div>
            <label className="block mb-2 font-semibold">Select Event</label>
            <Dropdown
              value={newGallery.eventId}
              options={events.map(e => ({ label: e.title, value: e.id }))}
              onChange={(e) => setNewGallery({ ...newGallery, eventId: e.value })}
              placeholder="Select an Event"
              className="w-full bg-white text-black rounded-md p-2 "
              disabled={events.length === 0}
            />
            {events.length === 0 && (
              <p className="text-red-300 text-sm mt-2">No events available. Please create an event first.</p>
            )}
          </div>

          {["title", "description"].map((field) => (
            <div key={field} className="flex flex-col">
              <label htmlFor={field} className="mb-2 font-semibold capitalize">
                {field}
              </label>
              <InputText
                id={field}
                name={field}
                value={newGallery [field as keyof GalleryItem] as string}
                onChange={handleChange}
                className="border bg-white border-gray-300 text-black px-4 py-2 rounded-md shadow-sm"
                required
              />
            </div>
          ))}

          <div className="flex flex-col">
            <label htmlFor="images" className="mb-2 font-semibold">Gallery Images</label>
            <div className="flex items-center justify-center bg-white rounded-md p-4 border border-gray-300 cursor-pointer hover:ring-2 hover:ring-blue-400">
              <label htmlFor="image-upload" className="flex items-center gap-2 text-black">
                <FaFileUpload className="text-xl" />
                <span>{newGallery.images.length > 0 ? `${newGallery.images.length} Images Selected` : "Choose Images"}</span>
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
          </div>

          <div className="flex justify-end pt-2">
            <Button
              label={editMode ? "Update Gallery" : "Create Gallery"}
              icon="pi pi-check"
              type="submit"
              className="bg-green-600 text-white hover:bg-green-700 border-none px-6 py-2 rounded-md"
            />
          </div>
        </form>
      </Dialog>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <DataTable value={galleries} paginator rows={5} stripedRows className="p-datatable-sm border border-gray-300 p-2">
          <Column field="title" header="Title" bodyClassName="border border-gray-200 px-2 py-1" />
          <Column field="description" header="Description" bodyClassName="border border-gray-200 px-2 py-1" />
          <Column
            header="Images"
            body={(rowData) => (
              <div className="flex gap-2 overflow-auto max-w-[250px]">
                {rowData.images.map((img: string, idx: number) => (
                  <Image key={idx} src={img} height={100} width={100} alt="gallery" className="h-10 w-10 object-cover rounded" />
                ))}
              </div>
            )}
          />
          <Column
            header="Actions"
            body={(rowData) => (
              <div className="flex gap-2">
                <Button icon={<FaEdit />} className="bg-yellow-500 text-white px-2 py-1" onClick={() => handleEdit(rowData)} />
                <Button icon={<FaTrash />} className="bg-red-600 text-white px-2 py-1" onClick={() => handleDelete(rowData.id)} />
              </div>
            )}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default AdminGalleryPage;