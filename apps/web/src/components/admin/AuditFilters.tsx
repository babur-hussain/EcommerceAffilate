"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export function AuditFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [entityType, setEntityType] = useState(params.get('entityType') || '');
  const [action, setAction] = useState(params.get('action') || '');
  const [startDate, setStartDate] = useState(params.get('startDate') || '');
  const [endDate, setEndDate] = useState(params.get('endDate') || '');

  useEffect(() => {
    setEntityType(params.get('entityType') || '');
    setAction(params.get('action') || '');
    setStartDate(params.get('startDate') || '');
    setEndDate(params.get('endDate') || '');
  }, [params]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (entityType) query.set('entityType', entityType);
    if (action) query.set('action', action);
    if (startDate) query.set('startDate', startDate);
    if (endDate) query.set('endDate', endDate);
    router.push(`/admin/audit-logs?${query.toString()}`);
  };

  return (
    <form onSubmit={submit} className="flex flex-wrap items-end gap-2">
      <div className="flex flex-col">
        <label className="text-xs text-gray-600">Entity Type</label>
        <input className="border rounded px-3 py-2 text-sm" value={entityType} onChange={(e) => setEntityType(e.target.value)} placeholder="e.g. SPONSORSHIP" />
      </div>
      <div className="flex flex-col">
        <label className="text-xs text-gray-600">Action</label>
        <input className="border rounded px-3 py-2 text-sm" value={action} onChange={(e) => setAction(e.target.value)} placeholder="e.g. APPROVE" />
      </div>
      <div className="flex flex-col">
        <label className="text-xs text-gray-600">Start Date</label>
        <input type="date" className="border rounded px-3 py-2 text-sm" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </div>
      <div className="flex flex-col">
        <label className="text-xs text-gray-600">End Date</label>
        <input type="date" className="border rounded px-3 py-2 text-sm" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>
      <button type="submit" className="px-3 py-2 text-sm rounded bg-gray-900 text-white">Apply</button>
    </form>
  );
}
