import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SummaryCard from '../../components/admin/SummaryCard';
import DataTable from '../../components/admin/DataTable';
import { useToast, ToastContainer } from '../../components/common/Toast';
import { supabase } from '../../lib/supabaseClient';
import { exportToExcel } from '../../lib/exportExcel';
import { AGE_GROUPS } from '../../lib/constants';

const PAGE_SIZE = 20;
const STATUSES = ['Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected'];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { toasts, toast, removeToast } = useToast();

  const [athletes, setAthletes] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [ageGroupFilter, setAgeGroupFilter] = useState('');

  const [counts, setCounts] = useState({ total: null, submitted: null, underReview: null, draft: null });

  // Fetch summary counts
  const fetchCounts = useCallback(async () => {
    const [total, submitted, underReview, draft] = await Promise.all([
      supabase.from('athletes').select('*', { count: 'exact', head: true }),
      supabase.from('athletes').select('*', { count: 'exact', head: true }).eq('registration_status', 'Submitted'),
      supabase.from('athletes').select('*', { count: 'exact', head: true }).eq('registration_status', 'Under Review'),
      supabase.from('athletes').select('*', { count: 'exact', head: true }).eq('registration_status', 'Draft'),
    ]);
    setCounts({
      total: total.count,
      submitted: submitted.count,
      underReview: underReview.count,
      draft: draft.count,
    });
  }, []);

  // Fetch paginated athletes
  const fetchAthletes = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('athletes')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,mobile_number.ilike.%${search}%,email.ilike.%${search}%`);
    }
    if (statusFilter) {
      query = query.eq('registration_status', statusFilter);
    }
    if (ageGroupFilter) {
      query = query.eq('age_group', ageGroupFilter);
    }

    const { data, count, error } = await query;
    if (error) {
      toast.error('Failed to load athletes: ' + error.message);
    } else {
      setAthletes(data || []);
      setTotalCount(count || 0);
    }
    setLoading(false);
  }, [page, search, statusFilter, ageGroupFilter]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  useEffect(() => {
    setPage(0); // reset page on filter change
  }, [search, statusFilter, ageGroupFilter]);

  useEffect(() => {
    fetchAthletes();
  }, [fetchAthletes]);

  // Auto-refresh counts every 60s
  useEffect(() => {
    const interval = setInterval(fetchCounts, 60000);
    return () => clearInterval(interval);
  }, [fetchCounts]);

  const handleExport = async () => {
    setExporting(true);
    try {
      let query = supabase.from('athletes').select('*').order('created_at');
      if (search) query = query.or(`full_name.ilike.%${search}%,mobile_number.ilike.%${search}%,email.ilike.%${search}%`);
      if (statusFilter) query = query.eq('registration_status', statusFilter);
      if (ageGroupFilter) query = query.eq('age_group', ageGroupFilter);

      const { data, error } = await query;
      if (error) throw error;
      exportToExcel(data);
      toast.success(`Exported ${data.length} athletes to Excel.`);
    } catch (err) {
      toast.error('Export failed: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="sc-page">
      {/* Header */}
      <header className="sc-header">
        <div className="flex items-center gap-3">
          <Link to="/" className="sc-header-logo">
            <div className="sc-header-icon">SC</div>
            <span className="sc-header-text">Super<span>Club</span></span>
          </Link>
          <span className="sc-header-badge">Admin</span>
        </div>
        <button onClick={handleLogout} className="btn-secondary py-1.5 text-xs">
          Logout
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sc-fade-in">
          <SummaryCard title="Total Athletes" value={counts.total} icon="👥" color="gold" loading={counts.total === null} />
          <SummaryCard title="Submitted" value={counts.submitted} icon="📋" color="green" loading={counts.submitted === null} />
          <SummaryCard title="Under Review" value={counts.underReview} icon="🔍" color="amber" loading={counts.underReview === null} />
          <SummaryCard title="Draft / Pending" value={counts.draft} icon="⏳" color="muted" loading={counts.draft === null} />
        </div>

        {/* Filters + Export */}
        <div className="card p-4 mb-4 sc-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--text-muted)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, mobile, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input pl-9 text-sm"
              />
            </div>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-input sm:w-40 text-sm"
            >
              <option value="">All Statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>

            {/* Age group filter */}
            <select
              value={ageGroupFilter}
              onChange={(e) => setAgeGroupFilter(e.target.value)}
              className="form-input sm:w-36 text-sm"
            >
              <option value="">All Age Groups</option>
              {AGE_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>

            {/* Export */}
            <button
              onClick={handleExport}
              disabled={exporting}
              className="btn-primary py-2 px-4 text-sm whitespace-nowrap"
            >
              {exporting ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              ) : '📊'}
              {exporting ? 'Exporting...' : 'Export Excel'}
            </button>
          </div>
        </div>

        {/* Data table */}
        <div className="sc-fade-in" style={{ animationDelay: '0.2s' }}>
          <DataTable
            athletes={athletes}
            loading={loading}
            totalCount={totalCount}
            page={page}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </div>
      </main>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
