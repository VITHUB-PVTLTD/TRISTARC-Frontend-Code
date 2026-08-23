import React, { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Trash2, RefreshCw, Edit2, Save, X, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, ClipboardList, GraduationCap, FlaskConical, Filter, ListPlus, Calendar } from 'lucide-react';
import { adminService } from '@/services/adminService';
import type { Course, CourseRegistration, PaginatedResponse } from '@/types';

const fmt = (d?: string | null) => d ? new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '-';
const REG_STATUS = ['PENDING','CONFIRMED','REJECTED','CANCELLED'];
const REG_COLORS: Record<string, string> = { PENDING:'bg-yellow-100 text-yellow-700', CONFIRMED:'bg-green-100 text-green-700', REJECTED:'bg-red-100 text-red-700', CANCELLED:'bg-gray-100 text-gray-500' };

const emptyForm = (initialCategory = 'academic-skills'): Partial<Course> => ({
  title: '', category: initialCategory as any, shortDescription: '', description: '', duration: '',
  mode: 'ONLINE', level: 'BEGINNER', isPublished: false,
  status: 'DRAFT', eligibility: '', learningOutcomes: '',
  whoShouldAttend: '', thumbnailUrl: '', sortOrder: 0,
});

const CoursesAdminPage: React.FC = () => {
  const [tab, setTab] = useState<'courses'|'registrations'>('courses');
  const [categoryFilter, setCategoryFilter] = useState<'all'|'academic-skills'|'research'>('all');
  const [courses, setCourses] = useState<PaginatedResponse<Course>|null>(null);
  const [regs, setRegs] = useState<PaginatedResponse<CourseRegistration>|null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Course|null>(null);
  const [form, setForm] = useState<Partial<Course>>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string|null>(null);

  const [moduleTarget, setModuleTarget] = useState<Course|null>(null);
  const [modTitle, setModTitle] = useState('');
  const [modDesc, setModDesc] = useState('');
  const [addingMod, setAddingMod] = useState(false);

  const [batchTarget, setBatchTarget] = useState<Course|null>(null);
  const [batchMode, setBatchMode] = useState<'ONLINE'|'OFFLINE'|'HYBRID'>('ONLINE');
  const [batchStart, setBatchStart] = useState('');
  const [batchSeats, setBatchSeats] = useState(30);
  const [addingBatch, setAddingBatch] = useState(false);

  const handleAddModule = async () => {
    if (!moduleTarget || !modTitle.trim()) return;
    setAddingMod(true);
    try {
      await adminService.createModule(moduleTarget.id, { title: modTitle, description: modDesc });
      setModTitle(''); setModDesc('');
      setSuccess('Module added successfully');
      await loadCourses(page);
    } catch (e: any) { setError(e?.response?.data?.message ?? 'Failed to add module'); }
    finally { setAddingMod(false); }
  };

  const handleDeleteModule = async (modId: string) => {
    if (!confirm('Delete this module?')) return;
    try {
      await adminService.deleteModule(modId);
      setSuccess('Module deleted successfully');
      await loadCourses(page);
    } catch (e: any) { setError(e?.response?.data?.message ?? 'Failed to delete module'); }
  };

  const handleAddBatch = async () => {
    if (!batchTarget || !batchStart) return;
    setAddingBatch(true);
    try {
      await adminService.createBatch(batchTarget.id, { mode: batchMode, startDate: batchStart, capacity: Number(batchSeats) });
      setBatchStart('');
      setSuccess('Batch created successfully');
      await loadCourses(page);
    } catch (e: any) { setError(e?.response?.data?.message ?? 'Failed to create batch'); }
    finally { setAddingBatch(false); }
  };

  const handleDeleteBatch = async (bId: string) => {
    if (!confirm('Delete this batch?')) return;
    try {
      await adminService.deleteBatch(bId);
      setSuccess('Batch deleted successfully');
      await loadCourses(page);
    } catch (e: any) { setError(e?.response?.data?.message ?? 'Failed to delete batch'); }
  };

  const loadCourses = useCallback(async (p=page) => {
    setLoading(true); setError('');
    try { setCourses(await adminService.getCourses(p, 50)); }
    catch (e:any) { setError(e?.response?.data?.message ?? 'Failed to load'); }
    finally { setLoading(false); }
  },[page]);

  const loadRegs = useCallback(async (p=page) => {
    setLoading(true); setError('');
    try { setRegs(await adminService.getRegistrations(p,15)); }
    catch (e:any) { setError(e?.response?.data?.message ?? 'Failed to load'); }
    finally { setLoading(false); }
  },[page]);

  useEffect(() => { tab==='courses' ? loadCourses(page) : loadRegs(page); }, [tab,page]);

  const openCreate = (preselectedCat = 'academic-skills') => {
    setEditTarget(null);
    setForm(emptyForm(preselectedCat));
    setShowForm(true);
  };

  const openEdit = (c:Course) => {
    setEditTarget(c);
    const catVal = c.category && typeof c.category === 'object'
      ? ((c.category as any).slug?.includes('research') ? 'research' : 'academic-skills')
      : (c.category || 'academic-skills');
    setForm({
      title: c.title,
      category: catVal as any,
      shortDescription: c.shortDescription ?? '',
      description: c.description ?? '',
      duration: c.duration ?? '',
      mode: c.mode,
      level: c.level,
      isPublished: c.isPublished,
      status: c.status ?? 'DRAFT',
      eligibility: c.eligibility ?? '',
      learningOutcomes: c.learningOutcomes ?? '',
      whoShouldAttend: c.whoShouldAttend ?? '',
      thumbnailUrl: c.thumbnailUrl ?? '',
      sortOrder: c.sortOrder ?? 0,
    });
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditTarget(null); };

  const handleSave = async () => {
    if (!form.title?.trim()) { setError('Title is required'); return; }
    if (!form.category) { setError('Course Classification (Category) is required'); return; }
    setSaving(true); setError('');
    try {
      if (editTarget) { await adminService.updateCourse(editTarget.id, form); setSuccess('Course updated successfully'); }
      else { await adminService.createCourse(form); setSuccess('Course created successfully'); }
      closeForm(); await loadCourses(page);
    } catch (e:any) { setError(e?.response?.data?.message ?? 'Failed to save'); }
    finally { setSaving(false); setTimeout(()=>setSuccess(''),3000); }
  };

  const handleDelete = async (id:string) => {
    if (!confirm('Delete this course?')) return;
    setDeletingId(id);
    try { await adminService.deleteCourse(id); await loadCourses(page); }
    catch (e:any) { setError(e?.response?.data?.message ?? 'Failed to delete'); }
    finally { setDeletingId(null); }
  };

  const handleRegStatus = async (id:string, status:string) => {
    try { await adminService.updateRegistrationStatus(id,status); await loadRegs(page); }
    catch (e:any) { setError(e?.response?.data?.message ?? 'Failed to update'); }
  };

  const filteredCourses = (courses?.data ?? []).filter(c => {
    if (categoryFilter === 'all') return true;
    const isResearch = c.category === 'research' || (c.category as any)?.slug?.includes('research');
    return categoryFilter === 'research' ? isResearch : !isResearch;
  });

  const totalPages = tab==='courses' ? (courses?.pagination?.totalPages??1) : (regs?.pagination?.totalPages??1);

  return (
    <>
      <Helmet><title>Courses | Admin | TRISTARC</title></Helmet>
      <motion.div initial={{opacity:0}} animate={{opacity:1}}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-tristarc-text-primary flex items-center gap-2">
              <BookOpen size={22} className="text-primary" /> Courses &amp; Registrations Management
            </h1>
            <p className="text-sm text-tristarc-text-muted mt-0.5">
              Organize &amp; publish courses classified under Academic Skills Courses or Research Courses
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={()=>tab==='courses'?loadCourses(page):loadRegs(page)} className="btn-secondary btn-sm" title="Refresh">
              <RefreshCw size={14} className={loading?'animate-spin':''}/>
            </button>
            {tab==='courses' && (
              <div className="flex items-center gap-2">
                <button onClick={() => openCreate('academic-skills')} className="btn-secondary btn-sm flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                  <GraduationCap size={14}/> + Academic Skills
                </button>
                <button onClick={() => openCreate('research')} className="btn-secondary btn-sm flex items-center gap-1.5 bg-amber-50 text-amber-800 hover:bg-amber-100 border-amber-200">
                  <FlaskConical size={14}/> + Research Course
                </button>
              </div>
            )}
          </div>
        </div>

        {error && <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm"><AlertTriangle size={14}/>{error}</div>}
        {success && <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 text-sm"><CheckCircle size={14}/>{success}</div>}

        {/* Primary Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
          <div className="flex gap-1 bg-tristarc-bg rounded-xl p-1 w-fit">
            {(['courses','registrations'] as const).map(t=>(
              <button key={t} onClick={()=>{setTab(t);setPage(1);}}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${tab===t?'bg-white shadow-sm text-primary':'text-tristarc-text-muted hover:text-tristarc-text-primary'}`}>
                {t==='courses' ? <span className="flex items-center gap-1.5"><BookOpen size={14}/>Course Catalog</span> : <span className="flex items-center gap-1.5"><ClipboardList size={14}/>Registrations</span>}
              </button>
            ))}
          </div>

          {/* Secondary Course Type Filter (for Courses tab) */}
          {tab==='courses' && (
            <div className="flex items-center gap-1 bg-white border border-tristarc-border rounded-xl p-1 shadow-sm">
              <span className="text-xs font-semibold text-tristarc-text-muted px-2.5 flex items-center gap-1">
                <Filter size={12}/> Type:
              </span>
              {[
                { id: 'all', label: 'All Courses' },
                { id: 'academic-skills', label: 'Academic Skills' },
                { id: 'research', label: 'Research Courses' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    categoryFilter === cat.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-tristarc-text-secondary hover:text-primary hover:bg-tristarc-bg'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Create/Edit Form Modal/Card */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-16}}
              className="bg-white rounded-2xl border-2 border-primary/40 shadow-xl p-6 mb-6">
              
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-tristarc-border">
                <div>
                  <h2 className="text-lg font-bold text-tristarc-text-primary flex items-center gap-2">
                    {editTarget ? <Edit2 size={18} className="text-primary"/> : <Plus size={18} className="text-primary"/>}
                    {editTarget ? 'Edit Course' : 'Add New Course'}
                  </h2>
                  <p className="text-xs text-tristarc-text-muted mt-0.5">Select course category type first, then fill in details</p>
                </div>
                <button onClick={closeForm} className="p-1 rounded-lg hover:bg-tristarc-bg text-tristarc-text-muted"><X size={20}/></button>
              </div>

              {/* Step 1: Course Classification Selection Banner */}
              <div className="mb-6 bg-gradient-to-r from-blue-50/70 via-tristarc-bg to-amber-50/70 p-4 rounded-xl border border-primary/20">
                <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2.5">
                  1. Select Course Classification Type *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Academic Skills option */}
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, category: 'academic-skills' as any }))}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
                      (form.category as any) === 'academic-skills' || !(form.category as any)?.includes?.('research')
                        ? 'bg-white border-primary shadow-md ring-2 ring-primary/20'
                        : 'bg-white/60 border-tristarc-border hover:border-primary/50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <GraduationCap size={20}/>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-tristarc-text-primary">Academic Skills Courses</p>
                      <p className="text-xs text-tristarc-text-secondary mt-0.5">Research methodology, writing, statistics &amp; student programs</p>
                    </div>
                  </button>

                  {/* Research Courses option */}
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, category: 'research' as any }))}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
                      (form.category as any) === 'research' || (form.category as any)?.includes?.('research')
                        ? 'bg-white border-amber-500 shadow-md ring-2 ring-amber-500/20'
                        : 'bg-white/60 border-tristarc-border hover:border-amber-400/50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <FlaskConical size={20}/>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-tristarc-text-primary">Research Courses</p>
                      <p className="text-xs text-tristarc-text-secondary mt-0.5">Advanced statistical modeling, qualitative methods &amp; survey design</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Step 2: Course Details Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="form-label">Course Title *</label>
                  <input type="text" className="form-input font-medium" placeholder="e.g. Fundamentals of Research Methodology" value={form.title??''} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/>
                </div>
                {/* Category Dropdown (secondary confirmation) */}
                <div>
                  <label className="form-label">Classification Category Confirmation *</label>
                  <select className="form-input font-semibold text-primary" value={(form.category as any)?.includes?.('research') ? 'research' : 'academic-skills'} onChange={e=>setForm(f=>({...f,category:e.target.value as any}))}>
                    <option value="academic-skills">Academic Skills Courses</option>
                    <option value="research">Research Courses</option>
                  </select>
                </div>
                {/* Mode */}
                <div>
                  <label className="form-label">Delivery Mode</label>
                  <select className="form-input" value={form.mode??'ONLINE'} onChange={e=>setForm(f=>({...f,mode:e.target.value as any}))}>
                    {['ONLINE','OFFLINE','HYBRID'].map(m=><option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                {/* Level */}
                <div>
                  <label className="form-label">Difficulty Level</label>
                  <select className="form-input" value={form.level??'BEGINNER'} onChange={e=>setForm(f=>({...f,level:e.target.value as any}))}>
                    {['BEGINNER','INTERMEDIATE','ADVANCED'].map(l=><option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                {/* Duration */}
                <div>
                  <label className="form-label">Duration</label>
                  <input type="text" className="form-input" placeholder="e.g. 8 Weeks" value={form.duration??''} onChange={e=>setForm(f=>({...f,duration:e.target.value}))}/>
                </div>
                {/* Status */}
                <div>
                  <label className="form-label">Publishing Status</label>
                  <select className="form-input" value={form.status??'DRAFT'} onChange={e=>setForm(f=>({...f,status:e.target.value as any}))}>
                    {['DRAFT','PUBLISHED','ARCHIVED'].map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                {/* Thumbnail URL */}
                <div>
                  <label className="form-label">Thumbnail Image URL</label>
                  <input type="url" className="form-input" placeholder="https://..." value={form.thumbnailUrl??''} onChange={e=>setForm(f=>({...f,thumbnailUrl:e.target.value}))}/>
                </div>
                {/* Sort Order */}
                <div>
                  <label className="form-label">Sort Priority Order</label>
                  <input type="number" className="form-input" min={0} value={form.sortOrder??0} onChange={e=>setForm(f=>({...f,sortOrder:parseInt(e.target.value)||0}))}/>
                </div>
                {/* Short Description */}
                <div className="sm:col-span-2">
                  <label className="form-label">Short Description</label>
                  <input type="text" className="form-input" placeholder="One-line summary shown in course listings" value={form.shortDescription??''} onChange={e=>setForm(f=>({...f,shortDescription:e.target.value}))}/>
                </div>
                {/* Full Description */}
                <div className="sm:col-span-2">
                  <label className="form-label">Full Overview &amp; Description</label>
                  <textarea rows={4} className="form-input resize-y" placeholder="Detailed course description..." value={form.description??''} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/>
                </div>
                {/* Eligibility */}
                <div className="sm:col-span-2">
                  <label className="form-label">Eligibility / Prerequisites</label>
                  <textarea rows={2} className="form-input resize-y" placeholder="Target background or prerequisites..." value={form.eligibility??''} onChange={e=>setForm(f=>({...f,eligibility:e.target.value}))}/>
                </div>
                {/* Learning Outcomes */}
                <div className="sm:col-span-2">
                  <label className="form-label">Learning Outcomes</label>
                  <textarea rows={3} className="form-input resize-y" placeholder="Key skills participants will gain..." value={form.learningOutcomes??''} onChange={e=>setForm(f=>({...f,learningOutcomes:e.target.value}))}/>
                </div>
                {/* Who Should Attend */}
                <div className="sm:col-span-2">
                  <label className="form-label">Who Should Attend</label>
                  <textarea rows={2} className="form-input resize-y" placeholder="Intended audience (scholars, analysts, students...)" value={form.whoShouldAttend??''} onChange={e=>setForm(f=>({...f,whoShouldAttend:e.target.value}))}/>
                </div>
                {/* Published toggle */}
                <div className="flex items-center gap-2 sm:col-span-2 pt-2">
                  <input type="checkbox" id="pub" checked={!!form.isPublished} onChange={e=>setForm(f=>({...f,isPublished:e.target.checked}))} className="w-4 h-4 text-primary rounded"/>
                  <label htmlFor="pub" className="text-sm font-semibold text-tristarc-text-primary">Published (make publicly visible on website)</label>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-tristarc-border">
                <button onClick={handleSave} disabled={saving} className="btn-primary btn-md flex items-center gap-2">
                  {saving?<RefreshCw size={16} className="animate-spin"/>:<Save size={16}/>} {editTarget?'Save Course Changes':'Create &amp; Save Course'}
                </button>
                <button onClick={closeForm} className="btn-ghost btn-md">Cancel</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Courses Table */}
        {tab==='courses' && (
          <div className="bg-white rounded-2xl border border-tristarc-border shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-tristarc-bg border-b border-tristarc-border">
                  <tr>{['Course Title','Classification Type','Mode','Level','Duration','Status','Actions'].map(h=><th key={h} className="text-left px-4 py-3.5 text-xs font-bold text-tristarc-text-muted uppercase tracking-wider">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-tristarc-border">
                  {loading ? Array.from({length:5}).map((_,i)=><tr key={i}><td colSpan={7} className="px-4 py-3"><div className="h-8 bg-tristarc-bg rounded animate-pulse"/></td></tr>) :
                  filteredCourses.length===0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-tristarc-text-muted">
                        No courses found under {categoryFilter === 'all' ? 'the catalog' : categoryFilter}.
                        <div className="mt-2 flex justify-center gap-2">
                          <button onClick={() => openCreate('academic-skills')} className="text-primary font-semibold hover:underline text-xs">+ Add Academic Skills Course</button>
                          <span>&middot;</span>
                          <button onClick={() => openCreate('research')} className="text-amber-700 font-semibold hover:underline text-xs">+ Add Research Course</button>
                        </div>
                      </td>
                    </tr>
                  ) :
                  filteredCourses.map(c=>{
                    const isResearch = c.category === 'research' || (c.category as any)?.slug?.includes('research');
                    return (
                      <tr key={c.id} className="hover:bg-tristarc-bg/50 transition-colors">
                        <td className="px-4 py-3.5 font-semibold text-tristarc-text-primary max-w-xs truncate">{c.title}</td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${isResearch ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-blue-100 text-blue-800 border border-blue-200'}`}>
                            {isResearch ? <><FlaskConical size={12}/> Research Course</> : <><GraduationCap size={12}/> Academic Skills</>}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-tristarc-text-secondary font-medium">{c.mode??'-'}</td>
                        <td className="px-4 py-3.5 text-tristarc-text-secondary">{c.level??'-'}</td>
                        <td className="px-4 py-3.5 text-tristarc-text-secondary">{c.duration??'-'}</td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${c.isPublished?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'}`}>
                            {c.isPublished?'Published':'Draft'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <button onClick={()=>setModuleTarget(c)} className="p-1.5 rounded-lg hover:bg-blue-50 text-tristarc-text-muted hover:text-blue-600 transition-all" title="Manage Curriculum Modules"><ListPlus size={14}/></button>
                            <button onClick={()=>setBatchTarget(c)} className="p-1.5 rounded-lg hover:bg-orange-50 text-tristarc-text-muted hover:text-orange-600 transition-all" title="Manage Course Batches"><Calendar size={14}/></button>
                            <button onClick={()=>openEdit(c)} className="p-1.5 rounded-lg hover:bg-primary-light text-tristarc-text-muted hover:text-primary transition-all" title="Edit Course"><Edit2 size={14}/></button>
                            <button onClick={()=>handleDelete(c.id)} disabled={deletingId===c.id} className="p-1.5 rounded-lg hover:bg-red-50 text-tristarc-text-muted hover:text-red-600 transition-all" title="Delete Course">
                              {deletingId===c.id?<RefreshCw size={14} className="animate-spin"/>:<Trash2 size={14}/>}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {totalPages>1 && <div className="flex items-center justify-between px-4 py-3 border-t border-tristarc-border">
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="btn-secondary btn-sm disabled:opacity-40"><ChevronLeft size={14}/></button>
              <span className="text-sm text-tristarc-text-muted">Page {page}/{totalPages}</span>
              <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page>=totalPages} className="btn-secondary btn-sm disabled:opacity-40"><ChevronRight size={14}/></button>
            </div>}
          </div>
        )}

        {/* Modules Modal */}
        <AnimatePresence>
          {moduleTarget && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl p-6 max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-tristarc-border pb-3">
                  <div>
                    <h3 className="font-bold text-lg text-tristarc-text-primary">Manage Curriculum Modules</h3>
                    <p className="text-xs text-tristarc-text-muted">{moduleTarget.title}</p>
                  </div>
                  <button onClick={()=>setModuleTarget(null)} className="text-tristarc-text-muted hover:text-tristarc-text-primary"><X size={18}/></button>
                </div>

                {/* Add Module Form */}
                <div className="p-4 rounded-xl bg-tristarc-bg border border-tristarc-border space-y-3">
                  <h4 className="text-xs font-bold uppercase text-primary tracking-wider">Add New Module</h4>
                  <input type="text" className="form-input" placeholder="Module Title (e.g. Module 1: Data Analytics)" value={modTitle} onChange={e=>setModTitle(e.target.value)}/>
                  <textarea rows={2} className="form-input" placeholder="Module Topics / Overview..." value={modDesc} onChange={e=>setModDesc(e.target.value)}/>
                  <button onClick={handleAddModule} disabled={addingMod || !modTitle.trim()} className="btn-primary btn-sm flex items-center gap-1.5">
                    {addingMod ? <RefreshCw size={12} className="animate-spin"/> : <Plus size={14}/>} Add Module
                  </button>
                </div>

                {/* Existing Modules List */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-tristarc-text-muted tracking-wider">Current Modules</h4>
                  {((moduleTarget as any).modules ?? []).length === 0 ? (
                    <p className="text-xs text-tristarc-text-muted italic py-3 text-center">No modules created for this course yet.</p>
                  ) : (
                    ((moduleTarget as any).modules ?? []).map((m: any, idx: number) => (
                      <div key={m.id || idx} className="p-3 rounded-lg border border-tristarc-border bg-white flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-tristarc-text-primary">{m.title}</p>
                          {m.description && <p className="text-xs text-tristarc-text-secondary leading-relaxed">{m.description}</p>}
                        </div>
                        <button onClick={()=>handleDeleteModule(m.id)} className="p-1 text-tristarc-text-muted hover:text-red-600 transition-colors" title="Delete Module">
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Batches Modal */}
        <AnimatePresence>
          {batchTarget && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl p-6 max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-tristarc-border pb-3">
                  <div>
                    <h3 className="font-bold text-lg text-tristarc-text-primary">Manage Course Batches</h3>
                    <p className="text-xs text-tristarc-text-muted">{batchTarget.title}</p>
                  </div>
                  <button onClick={()=>setBatchTarget(null)} className="text-tristarc-text-muted hover:text-tristarc-text-primary"><X size={18}/></button>
                </div>

                {/* Add Batch Form */}
                <div className="p-4 rounded-xl bg-tristarc-bg border border-tristarc-border space-y-3">
                  <h4 className="text-xs font-bold uppercase text-accent-orange tracking-wider">Create New Batch</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-tristarc-text-muted">Mode</label>
                      <select className="form-input text-xs" value={batchMode} onChange={e=>setBatchMode(e.target.value as any)}>
                        <option value="ONLINE">ONLINE</option>
                        <option value="OFFLINE">OFFLINE</option>
                        <option value="HYBRID">HYBRID</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-tristarc-text-muted">Start Date</label>
                      <input type="date" className="form-input text-xs" value={batchStart} onChange={e=>setBatchStart(e.target.value)}/>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-tristarc-text-muted">Capacity Seats</label>
                      <input type="number" className="form-input text-xs" min={1} value={batchSeats} onChange={e=>setBatchSeats(Number(e.target.value))}/>
                    </div>
                  </div>
                  <button onClick={handleAddBatch} disabled={addingBatch || !batchStart} className="btn-accent btn-sm flex items-center gap-1.5">
                    {addingBatch ? <RefreshCw size={12} className="animate-spin"/> : <Plus size={14}/>} Create Batch
                  </button>
                </div>

                {/* Existing Batches List */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-tristarc-text-muted tracking-wider">Scheduled Batches</h4>
                  {((batchTarget as any).batches ?? []).length === 0 ? (
                    <p className="text-xs text-tristarc-text-muted italic py-3 text-center">No batches scheduled for this course yet.</p>
                  ) : (
                    ((batchTarget as any).batches ?? []).map((b: any, idx: number) => (
                      <div key={b.id || idx} className="p-3 rounded-lg border border-tristarc-border bg-white flex items-center justify-between gap-3 text-xs">
                        <div>
                          <p className="font-bold text-tristarc-text-primary flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-primary-light text-primary font-mono">{b.mode}</span>
                            <span>Starts: {fmt(b.startDate)}</span>
                          </p>
                          <p className="text-[10px] text-tristarc-text-muted mt-1">Enrolled: {b.enrolledCount ?? 0} / {b.capacity ?? 30} seats</p>
                        </div>
                        <button onClick={()=>handleDeleteBatch(b.id)} className="p-1 text-tristarc-text-muted hover:text-red-600 transition-colors" title="Delete Batch">
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Registrations Table */}
        {tab==='registrations' && (
          <div className="bg-white rounded-2xl border border-tristarc-border shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-tristarc-bg border-b border-tristarc-border">
                  <tr>{['Name','Email','Course','Registered','Status','Action'].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-semibold text-tristarc-text-muted uppercase tracking-wide">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-tristarc-border">
                  {loading ? Array.from({length:5}).map((_,i)=><tr key={i}><td colSpan={6} className="px-4 py-3"><div className="h-8 bg-tristarc-bg rounded animate-pulse"/></td></tr>) :
                  (regs?.data??[]).length===0 ? <tr><td colSpan={6} className="text-center py-10 text-tristarc-text-muted">No registrations</td></tr> :
                  (regs?.data??[]).map(r=>(
                    <tr key={r.id} className="hover:bg-tristarc-bg/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-tristarc-text-primary whitespace-nowrap">{r.fullName}</td>
                      <td className="px-4 py-3 text-tristarc-text-secondary">{r.email}</td>
                      <td className="px-4 py-3 text-tristarc-text-secondary max-w-[180px] truncate">{r.course?.title??'-'}</td>
                      <td className="px-4 py-3 text-tristarc-text-muted whitespace-nowrap">{fmt(r.createdAt)}</td>
                      <td className="px-4 py-3"><span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${REG_COLORS[r.status]}`}>{r.status}</span></td>
                      <td className="px-4 py-3">
                        <select value={r.status} onChange={e=>handleRegStatus(r.id,e.target.value)}
                          className="text-xs border border-tristarc-border rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary bg-white">
                          {REG_STATUS.map(s=><option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages>1 && <div className="flex items-center justify-between px-4 py-3 border-t border-tristarc-border">
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="btn-secondary btn-sm disabled:opacity-40"><ChevronLeft size={14}/></button>
              <span className="text-sm text-tristarc-text-muted">Page {page}/{totalPages}</span>
              <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page>=totalPages} className="btn-secondary btn-sm disabled:opacity-40"><ChevronRight size={14}/></button>
            </div>}
          </div>
        )}
      </motion.div>
    </>
  );
};

export default CoursesAdminPage;