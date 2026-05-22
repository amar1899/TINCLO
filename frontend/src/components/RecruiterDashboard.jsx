import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationLanding from './NavigationLanding';

const SAMPLE_APPLICANTS = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@gmail.com', role: 'Full Stack Developer', experience: '3 years', status: 'shortlisted', appliedAt: '2025-01-15' },
  { id: 2, name: 'Priya Patel',  email: 'priya@gmail.com', role: 'Data Scientist',       experience: '4 years', status: 'reviewing',   appliedAt: '2025-01-14' },
  { id: 3, name: 'Amit Kumar',   email: 'amit@gmail.com',  role: 'DevOps Engineer',      experience: '5 years', status: 'hired',       appliedAt: '2025-01-13' },
  { id: 4, name: 'Sneha Reddy',  email: 'sneha@gmail.com', role: 'UI/UX Designer',       experience: '2 years', status: 'rejected',    appliedAt: '2025-01-12' },
  { id: 5, name: 'Vikram Singh', email: 'vikram@gmail.com',role: 'Product Manager',      experience: '6 years', status: 'reviewing',   appliedAt: '2025-01-11' },
];

const STATUS_CONFIG = {
  reviewing:   { label: 'Reviewing',   color: '#f6ad55', bg: '#fffaf0' },
  shortlisted: { label: 'Shortlisted', color: '#667eea', bg: '#ebf4ff' },
  hired:       { label: 'Hired',       color: '#48bb78', bg: '#f0fff4' },
  rejected:    { label: 'Rejected',    color: '#fc8181', bg: '#fff5f5' },
};

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState(SAMPLE_APPLICANTS);
  const [activeTab, setActiveTab] = useState('applicants');
  const [filter, setFilter] = useState('all');
  const [showPostJob, setShowPostJob] = useState(false);
  const [jobForm, setJobForm] = useState({ title: '', company: '', location: '', salary: '', description: '', experience: '', type: 'Full-time' });
  const [postedJobs, setPostedJobs] = useState([]);
  const [jobSuccess, setJobSuccess] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('tinclo_current_user') || 'null');
  if (!currentUser) { navigate('/login'); return null; }

  const updateStatus = (id, status) => setApplicants(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  const filtered = filter === 'all' ? applicants : applicants.filter(a => a.status === filter);

  const handlePostJob = (e) => {
    e.preventDefault();
    setPostedJobs(prev => [{ ...jobForm, id: Date.now(), postedAt: new Date().toISOString(), applicants: 0 }, ...prev]);
    setJobForm({ title: '', company: '', location: '', salary: '', description: '', experience: '', type: 'Full-time' });
    setShowPostJob(false);
    setJobSuccess('✅ Job posted successfully!');
    setTimeout(() => setJobSuccess(''), 3000);
  };

  const stats = { total: applicants.length, reviewing: applicants.filter(a => a.status === 'reviewing').length, shortlisted: applicants.filter(a => a.status === 'shortlisted').length, hired: applicants.filter(a => a.status === 'hired').length };

  const inputCls = "w-full px-3.5 py-[11px] border-2 border-gray-200 rounded-[10px] text-sm text-gray-700 bg-gray-50 font-[inherit] outline-none transition-all focus:border-indigo-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]";

  return (
    <>
    <NavigationLanding />
    <div className="min-h-screen pb-10 pt-16" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #faf0ff 50%, #f0fff4 100%)' }}>
      {/* Header */}
      <div className="px-8 py-6 flex justify-between items-center shadow-[0_4px_20px_rgba(102,126,234,0.4)] max-md:flex-col max-md:gap-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div>
          <h1 className="text-white text-2xl font-black m-0 mb-1">🏢 Recruiter Dashboard</h1>
          <p className="text-white/80 text-sm m-0">Welcome back, <strong>{currentUser.name}</strong></p>
        </div>
        <div className="flex gap-3">
          <button className="px-[22px] py-[11px] bg-white text-indigo-500 text-sm font-bold border-none rounded-xl cursor-pointer transition-all shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(0,0,0,0.2)]" onClick={() => setShowPostJob(true)}>+ Post a Job</button>
          <button className="px-5 py-[11px] bg-white/20 text-white text-sm font-semibold border border-white/30 rounded-xl cursor-pointer transition-all hover:bg-white/30" onClick={() => navigate('/jobs')}>← Back to App</button>
        </div>
      </div>

      {jobSuccess && <div className="bg-green-100 text-green-800 px-8 py-3.5 font-semibold text-sm text-center">{jobSuccess}</div>}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-5 px-8 pt-7 max-lg:grid-cols-2 max-sm:px-4">
        {[{ label: 'Total Applicants', value: stats.total, color: '#667eea', icon: '👥' }, { label: 'Under Review', value: stats.reviewing, color: '#f6ad55', icon: '🔍' }, { label: 'Shortlisted', value: stats.shortlisted, color: '#0077b5', icon: '⭐' }, { label: 'Hired', value: stats.hired, color: '#48bb78', icon: '🎉' }].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 text-center shadow-[0_4px_15px_rgba(0,0,0,0.06)] transition-transform hover:-translate-y-0.5" style={{ borderTop: `4px solid ${s.color}` }}>
            <span className="text-[28px] block mb-2">{s.icon}</span>
            <div className="text-[32px] font-black leading-none" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-gray-500 font-semibold mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-8 pt-6 max-sm:px-4">
        {[{ id: 'applicants', label: '👥 Applicants' }, { id: 'jobs', label: '💼 Posted Jobs' }].map(tab => (
          <button key={tab.id}
            className={`px-[22px] py-2.5 rounded-full border-2 text-sm font-semibold cursor-pointer transition-all ${activeTab === tab.id ? 'text-white border-transparent shadow-[0_4px_14px_rgba(102,126,234,0.4)]' : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-400 hover:text-indigo-500'}`}
            style={activeTab === tab.id ? { background: 'linear-gradient(135deg, #667eea, #764ba2)' } : {}}
            onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
        ))}
      </div>

      <div className="px-8 py-5 max-sm:px-4">
        {/* Applicants */}
        {activeTab === 'applicants' && (<>
          <div className="flex gap-2 flex-wrap mb-5">
            {['all', 'reviewing', 'shortlisted', 'hired', 'rejected'].map(f => (
              <button key={f}
                className={`px-4 py-1.5 rounded-full border-[1.5px] text-[13px] font-semibold cursor-pointer transition-all ${filter === f ? 'text-white border-transparent' : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-400 hover:text-indigo-500'}`}
                style={filter === f ? { background: 'linear-gradient(135deg, #667eea, #764ba2)' } : {}}
                onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)} ({f === 'all' ? applicants.length : applicants.filter(a => a.status === f).length})
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3.5">
            {filtered.map(a => { const cfg = STATUS_CONFIG[a.status]; return (
              <div key={a.id} className="bg-white rounded-2xl px-6 py-5 flex items-center gap-4 shadow-[0_4px_15px_rgba(0,0,0,0.06)] border border-gray-200 transition-all hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 max-md:flex-col max-md:items-start">
                <div className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-xl font-bold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>{a.name.charAt(0)}</div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-900 m-0 mb-1">{a.name}</h3>
                  <p className="text-[13px] text-gray-500 m-0 mb-2">{a.email}</p>
                  <div className="flex gap-4 text-xs text-gray-600 font-medium flex-wrap"><span>💼 {a.role}</span><span>🧑‍💼 {a.experience}</span><span>📅 {new Date(a.appliedAt).toLocaleDateString()}</span></div>
                </div>
                <div className="flex flex-col items-end gap-2.5 max-md:w-full max-md:flex-row max-md:justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ color: cfg.color, background: cfg.bg }}>{cfg.label}</span>
                  <div className="flex gap-1.5">
                    <button className="px-3 py-1.5 rounded-lg border-none text-xs font-semibold cursor-pointer bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors" onClick={() => updateStatus(a.id, 'shortlisted')}>⭐ Shortlist</button>
                    <button className="px-3 py-1.5 rounded-lg border-none text-xs font-semibold cursor-pointer bg-green-100 text-green-700 hover:bg-green-600 hover:text-white transition-colors" onClick={() => updateStatus(a.id, 'hired')}>✅ Hire</button>
                    <button className="px-3 py-1.5 rounded-lg border-none text-xs font-semibold cursor-pointer bg-red-100 text-red-700 hover:bg-red-500 hover:text-white transition-colors" onClick={() => updateStatus(a.id, 'rejected')}>❌ Reject</button>
                  </div>
                </div>
              </div>
            );})}
            {filtered.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No applicants in this category</div>}
          </div>
        </>)}

        {/* Posted Jobs */}
        {activeTab === 'jobs' && (
          postedJobs.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm flex flex-col items-center gap-4">
              <p>No jobs posted yet.</p>
              <button className="px-[22px] py-[11px] text-white text-sm font-bold border-none rounded-xl cursor-pointer" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }} onClick={() => setShowPostJob(true)}>+ Post Your First Job</button>
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {postedJobs.map(job => (
                <div key={job.id} className="bg-white rounded-2xl px-6 py-5 flex justify-between items-center shadow-[0_4px_15px_rgba(0,0,0,0.06)] border border-gray-200 gap-4">
                  <div><h3 className="text-base font-bold text-gray-900 m-0 mb-1">{job.title}</h3><p className="text-[13px] text-gray-500 m-0 mb-2">{job.company} · {job.location}</p><div className="flex gap-4 text-xs text-gray-600 flex-wrap"><span>💰 {job.salary}</span><span>🧑‍💼 {job.experience}</span><span>⏰ {job.type}</span></div></div>
                  <div className="text-right flex-shrink-0"><span className="block text-sm font-bold text-indigo-500">👥 {job.applicants} applicants</span><span className="text-xs text-gray-400">Posted {new Date(job.postedAt).toLocaleDateString()}</span></div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Post Job Modal */}
      {showPostJob && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] p-5 backdrop-blur-sm" onClick={() => setShowPostJob(false)}>
          <div className="bg-white rounded-3xl w-full max-w-[620px] max-h-[90vh] overflow-y-auto shadow-[0_30px_80px_rgba(0,0,0,0.3)] p-8 relative animate-slide-up" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 bg-gray-50 border-none text-2xl text-gray-500 cursor-pointer w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-gray-100 hover:rotate-90" onClick={() => setShowPostJob(false)}>×</button>
            <h2 className="text-[22px] font-extrabold text-gray-900 m-0 mb-6">📝 Post a New Job</h2>
            <form onSubmit={handlePostJob} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                <div className="flex flex-col gap-1.5"><label className="text-[13px] font-bold text-gray-700">Job Title *</label><input type="text" value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} placeholder="e.g. Senior React Developer" required className={inputCls} /></div>
                <div className="flex flex-col gap-1.5"><label className="text-[13px] font-bold text-gray-700">Company *</label><input type="text" value={jobForm.company} onChange={e => setJobForm({...jobForm, company: e.target.value})} placeholder="Company name" required className={inputCls} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                <div className="flex flex-col gap-1.5"><label className="text-[13px] font-bold text-gray-700">Location *</label><input type="text" value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} placeholder="e.g. Bengaluru, India" required className={inputCls} /></div>
                <div className="flex flex-col gap-1.5"><label className="text-[13px] font-bold text-gray-700">Salary Range</label><input type="text" value={jobForm.salary} onChange={e => setJobForm({...jobForm, salary: e.target.value})} placeholder="e.g. ₹10L - ₹20L" className={inputCls} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                <div className="flex flex-col gap-1.5"><label className="text-[13px] font-bold text-gray-700">Experience Required</label><input type="text" value={jobForm.experience} onChange={e => setJobForm({...jobForm, experience: e.target.value})} placeholder="e.g. 2-4 years" className={inputCls} /></div>
                <div className="flex flex-col gap-1.5"><label className="text-[13px] font-bold text-gray-700">Job Type</label><select value={jobForm.type} onChange={e => setJobForm({...jobForm, type: e.target.value})} className={inputCls}><option>Full-time</option><option>Part-time</option><option>Contract</option><option>Remote</option><option>Internship</option></select></div>
              </div>
              <div className="flex flex-col gap-1.5"><label className="text-[13px] font-bold text-gray-700">Job Description *</label><textarea value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})} rows={4} placeholder="Describe the role, responsibilities, and requirements..." required className={`${inputCls} resize-y min-h-[100px]`} /></div>
              <button type="submit" className="px-[22px] py-3 text-white text-sm font-bold border-none rounded-xl cursor-pointer transition-all hover:opacity-90 hover:-translate-y-px" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>🚀 Post Job</button>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default RecruiterDashboard;
