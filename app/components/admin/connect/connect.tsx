"use client";

import React, { useEffect, useMemo, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConnectAPI } from "@/app/api/apiService";
import type { ConnectEntry } from "@/app/api/apiContract";
import { Button } from "primereact/button";

const AdminConnectPage = () => {
  const [rows, setRows] = useState<ConnectEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await ConnectAPI.list();
      setRows(data || []);
      setErr(null);
    } catch (e: any) {
      setErr(e?.message || "Failed to load contact submissions");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const dateBody = (row: ConnectEntry) =>
    new Date(row.created_at).toLocaleString();

  const nameBody = (row: ConnectEntry) => row.full_name;

  const actionsBody = (row: ConnectEntry) => (
    <div className="flex gap-2">
      <Button
        label="Delete"
        className="bg-red-600 text-white px-3 py-1 border-none"
        onClick={async () => {
          const ok = window.confirm("Delete this submission?");
          if (!ok) return;
          try {
            await ConnectAPI.remove(row.id);
            await load();
          } catch (e) {
            alert("Delete failed.");
          }
        }}
      />
    </div>
  );

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Contact Submissions</h1>
        <Button label="Refresh" onClick={load} className="bg-slate-700 text-white border-none px-3 py-2" />
      </div>

      {err && <div className="mb-3 bg-red-100 text-red-700 px-4 py-2 rounded">{err}</div>}

      <div className="bg-white shadow-md rounded-lg overflow-hidden p-2">
        <DataTable
          value={rows}
          paginator
          rows={10}
          stripedRows
          loading={loading}
          className="p-datatable-sm "
          emptyMessage="No submissions yet."
        >
          <Column field="full_name" header="Name" body={nameBody} bodyClassName="border px-2 py-1 max-w-[220px] truncate" />
          <Column field="email" header="Email" bodyClassName="border px-2 py-1 max-w-[220px] truncate" />
          <Column field="contact" header="Contact" bodyClassName="border px-2 py-1" />
          <Column field="country" header="Country" bodyClassName="border px-2 py-1" />
          <Column field="city" header="City" bodyClassName="border px-2 py-1" />
          <Column field="comment" header="Comments" bodyClassName="border px-2 py-1 max-w-[280px] whitespace-nowrap overflow-hidden text-ellipsis" />
          <Column header="Submitted" body={dateBody} bodyClassName="border px-2 py-1" />
          <Column header="Actions" body={actionsBody} bodyClassName="border px-2 py-1" />
        </DataTable>
      </div>
    </div>
  );
};

export default AdminConnectPage;
