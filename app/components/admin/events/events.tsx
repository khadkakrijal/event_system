import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import Image from "next/image";
import { FaFileUpload, FaEdit, FaTrash } from "react-icons/fa";

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  venue: string;
  image: string;
}

const AdminEventsPage:React.FC<Event> = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState<Event>({
    id: 0,
    title: "",
    date: "",
    location: "",
    venue: "",
    image: "",
  });
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewEvent({ ...newEvent, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (editMode && editId !== null) {
      const updated = events.map((event) =>
        event.id === editId ? { ...newEvent, id: editId } : event
      );
      setEvents(updated);
    } else {
      const updatedEvents = [...events, { ...newEvent, id: events.length + 1 }];
      setEvents(updatedEvents);
    }
    setNewEvent({ id: 0, title: "", date: "", location: "", venue: "", image: "" });
    setDialogVisible(false);
    setEditMode(false);
    setEditId(null);
  };

  const handleEdit = (event: Event) => {
    setNewEvent(event);
    setEditId(event.id);
    setEditMode(true);
    setDialogVisible(true);
  };

  const handleDelete = (id: number) => {
    const filtered = events.filter((event) => event.id !== id);
    setEvents(filtered);
  };

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Event Management</h1>
        <Button
          label="Add Event"
          icon="pi pi-plus"
          className="bg-blue-600 text-white hover:bg-blue-700 border-none px-4 py-2 rounded-md"
          onClick={() => {
            setDialogVisible(true);
            setEditMode(false);
            setNewEvent({ id: 0, title: "", date: "", location: "", venue: "", image: "" });
          }}
        />
      </div>

      <Dialog
        header={
          <div className="text-center py-2">
            <h2 className="text-2xl font-bold text-white">{editMode ? "Edit Event" : "Create New Event"}</h2>
            <p className="text-sm text-white">Fill in the details below</p>
          </div>
        }
        visible={dialogVisible}
        style={{ width: "100%", maxWidth: "520px" }}
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
          {["title", "date", "location", "venue"].map((field) => (
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
                value={newEvent[field as keyof Event] as string}
                onChange={handleChange}
                className="border bg-white border-gray-300 text-black px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          ))}

          <div className="flex flex-col">
            <label htmlFor="image" className="mb-2 font-semibold text-white">Event Image</label>
            <div className="flex items-center justify-center bg-white rounded-md p-4 border border-gray-300 cursor-pointer hover:ring-2 hover:ring-blue-400">
              <label htmlFor="image-upload" className="flex items-center gap-2 text-black">
                <FaFileUpload className="text-xl" />
                <span>{newEvent.image ? "Image Selected" : "Choose Image"}</span>
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
              label={editMode ? "Update Event" : "Create Event"}
              icon="pi pi-check"
              type="submit"
              className="bg-green-600 text-white hover:bg-green-700 border-none px-6 py-2 rounded-md"
            />
          </div>
        </form>
      </Dialog>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <DataTable
          value={events}
          paginator
          rows={5}
          stripedRows
          className="p-datatable-sm border border-gray-300 p-2"
        >
          <Column
            field="title"
            header="Title"
            bodyClassName="border border-gray-200 px-2 py-1 text-center"
          ></Column>
          <Column
            field="date"
            header="Date"
            bodyClassName="border border-gray-200 px-2 py-1 text-center"
          ></Column>
          <Column
            field="location"
            header="Location"
            bodyClassName="border border-gray-200 px-2 py-1 text-center"
          ></Column>
          <Column
            field="venue"
            header="Venue"
            bodyClassName="border border-gray-200 px-2 py-1 text-center"
          ></Column>
          <Column
            field="image"
            header="Image"
            body={(rowData) => (
              <Image
              src={rowData.image}
              alt="event"
              width={100} 
              height={100} 
              className="h-12 w-16 object-cover rounded text-center "
              />
            
               
            )}
            bodyClassName="border border-gray-200 px-2 py-1 text-center"
          ></Column>
          <Column
            header="Actions"
             bodyClassName="border border-gray-200 px-2 py-1 text-center"
            body={(rowData) => (
              <div className="flex gap-4 text-red-600 text-xl items-center " >
                <button
                  onClick={() => handleEdit(rowData)}
                  className="hover:text-yellow-500"
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(rowData.id)}
                  className="hover:text-red-800"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            )}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
};

export default AdminEventsPage;
