import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

const SORTABLE_COLS = ['full_name', 'age_group', 'created_at', 'registration_status'];

export default function DataTable({ athletes, loading, totalCount, page, pageSize, onPageChange }) {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');

  const handleSort = (key) => {
    if (!SORTABLE_COLS.includes(key)) return;
    if (sortKey === key) {
      setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = [...(athletes || [])].sort((a, b) => {
    const valA = a[sortKey] ?? '';
    const valB = b[sortKey] ?? '';
    const cmp = String(valA).localeCompare(String(valB));
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const SortIcon = ({ col }) => {
    if (!SORTABLE_COLS.includes(col)) return null;
    return (
      <svg
        className={`w-3 h-3 ml-1 inline-block transition-transform ${sortKey === col && sortDir === 'desc' ? 'rotate-180' : ''} ${sortKey !== col ? 'opacity-30' : ''}`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    );
  };

  const COLS = [
    { key: '#', label: '#', width: 'w-10' },
    { key: 'full_name', label: 'Full Name', width: 'min-w-[140px]' },
    { key: 'mobile_number', label: 'Mobile', width: 'w-32' },
    { key: 'email', label: 'Email', width: 'min-w-[180px]' },
    { key: 'age_group', label: 'Age Group', width: 'w-24' },
    { key: 'events_applied', label: 'Events', width: 'min-w-[160px]' },
    { key: 'created_at', label: 'Reg. Date', width: 'w-28' },
    { key: 'registration_status', label: 'Status', width: 'w-28' },
    { key: 'actions', label: '', width: 'w-20' },
  ];

  return (
    <div>
      <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border-dim)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border-dim)' }}>
              {COLS.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${col.width} ${SORTABLE_COLS.includes(col.key) ? 'cursor-pointer select-none' : ''}`}
                  style={{ color: 'var(--text-muted)', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '2px' }}
                  onClick={() => handleSort(col.key)}
                >
                  {col.label}
                  <SortIcon col={col.key} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-dim)' }}>
                  {COLS.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <div className="h-4 rounded animate-pulse" style={{ background: 'var(--steel)' }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={COLS.length} className="px-4 py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                  No athletes found.
                </td>
              </tr>
            ) : (
              sorted.map((athlete, idx) => (
                <tr
                  key={athlete.id}
                  className="transition-colors cursor-pointer"
                  style={{ borderBottom: '1px solid var(--border-dim)' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(232,184,75,0.03)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  onClick={() => navigate(`/admin/athletes/${athlete.id}`)}
                >
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>{page * pageSize + idx + 1}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>{athlete.full_name}</td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>{athlete.mobile_number}</td>
                  <td className="px-4 py-3 truncate max-w-[200px]" style={{ color: 'var(--text-secondary)' }}>{athlete.email}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{athlete.age_group || '—'}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{(athlete.events_applied || []).join(', ') || '—'}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>{formatDate(athlete.created_at)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={athlete.registration_status} />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/admin/athletes/${athlete.id}`); }}
                      className="text-xs font-medium flex items-center gap-1"
                      style={{ color: 'var(--gold)' }}
                    >
                      View
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 px-1">
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {totalCount > 0 ? `${page * pageSize + 1}–${Math.min((page + 1) * pageSize, totalCount)} of ${totalCount} athletes` : '0 athletes'}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 0}
            className="btn-secondary py-1.5 px-3 text-xs disabled:opacity-40"
          >
            ← Prev
          </button>
          <span className="flex items-center text-xs px-2" style={{ color: 'var(--text-muted)' }}>
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages - 1}
            className="btn-secondary py-1.5 px-3 text-xs disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
