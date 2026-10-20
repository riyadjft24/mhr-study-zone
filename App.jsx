import { useEffect, useMemo, useState } from "react";
import {
  BookOpen, Search, GraduationCap, Menu, X, LogIn, LogOut,
  UserPlus, ShieldCheck, Plus, Pencil, Trash2, ExternalLink,
  PlayCircle, FileText, CircleHelp, Sparkles, ChevronRight,
  LoaderCircle, AlertCircle, CheckCircle2, Filter
} from "lucide-react";
import { isSupabaseConfigured, supabase } from "./supabase";

const sampleCourses = [
  { id: "demo-1", title: "গণিতের ভিত্তি", subject: "গণিত", level: "সবার জন্য", description: "সংখ্যা, বীজগণিত ও সমস্যা সমাধানের সহজ পাঠ।", published: true, lessons: 12, color: "violet" },
  { id: "demo-2", title: "ইংরেজি শেখা শুরু", subject: "ইংরেজি", level: "শুরু", description: "দৈনন্দিন ইংরেজি, শব্দভাণ্ডার ও ব্যাকরণ।", published: true, lessons: 9, color: "blue" },
  { id: "demo-3", title: "বিজ্ঞান পরিচিতি", subject: "বিজ্ঞান", level: "মাধ্যমিক", description: "বিজ্ঞানের মজার ধারণাগুলো সহজ ভাষায়।", published: true, lessons: 15, color: "green" },
  { id: "demo-4", title: "কম্পিউটার ও কোডিং", subject: "প্রযুক্তি", level: "শুরু", description: "কম্পিউটার বেসিক এবং প্রোগ্রামিংয়ের প্রথম ধাপ।", published: true, lessons: 8, color: "orange" },
];

const subjects = ["সব বিষয়", "গণিত", "ইংরেজি", "বিজ্ঞান", "প্রযুক্তি", "বাংলা", "অন্যান্য"];

function getErrorMessage(error) {
  const message = error?.message || "একটি অপ্রত্যাশিত সমস্যা হয়েছে।";
  if (/Invalid login credentials/i.test(message)) return "ইমেইল বা পাসওয়ার্ড সঠিক নয়।";
  if (/Email not confirmed/i.test(message)) return "ইমেইল নিশ্চিত করতে হবে। ইনবক্স দেখো।";
  if (/User already registered/i.test(message)) return "এই ইমেইল দিয়ে আগে থেকেই অ্যাকাউন্ট আছে।";
  if (/Failed to fetch/i.test(message)) return "ইন্টারনেট বা Supabase URL/key পরীক্ষা করো।";
  return message;
}

function AuthModal({ mode, setMode, onClose, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function submit(event) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      if (mode === "signup") {
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: fullName.trim() } },
        });
        if (authError) throw authError;
        if (data.session) {
          onSuccess(data.session);
          onClose();
        } else {
          setNotice("নিবন্ধন হয়েছে। ইমেইল confirmation চালু থাকলে ইনবক্স থেকে ইমেইল নিশ্চিত করো, তারপর লগইন করো।");
          setMode("login");
        }
      } else {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (authError) throw authError;
        onSuccess(data.session);
        onClose();
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button className="icon-button modal-close" onClick={onClose} aria-label="বন্ধ করো"><X size={20} /></button>
        <div className="brand-mark modal-brand"><GraduationCap size={25} /></div>
        <h2 id="auth-title">{mode === "signup" ? "নতুন অ্যাকাউন্ট তৈরি করো" : "আবার ফিরে আসায় স্বাগতম"}</h2>
        <p className="muted">{mode === "signup" ? "শেখার যাত্রা শুরু করতে নিবন্ধন করো।" : "তোমার অ্যাকাউন্টে প্রবেশ করো।"}</p>
        <form onSubmit={submit} className="form-stack">
          {mode === "signup" && (
            <label>তোমার নাম<input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="যেমন: রিয়াদ" required maxLength={80} /></label>
          )}
          <label>ইমেইল<input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></label>
          <label>পাসওয়ার্ড<input type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="কমপক্ষে ৬ অক্ষর" minLength={6} required /></label>
          {error && <div className="message error"><AlertCircle size={17} />{error}</div>}
          {notice && <div className="message success"><CheckCircle2 size={17} />{notice}</div>}
          <button className="button primary full" type="submit" disabled={busy}>
            {busy ? <LoaderCircle className="spin" size={18} /> : mode === "signup" ? <UserPlus size={18} /> : <LogIn size={18} />}
            {busy ? "অপেক্ষা করো..." : mode === "signup" ? "নিবন্ধন করো" : "লগইন করো"}
          </button>
        </form>
        <p className="switch-auth">
          {mode === "signup" ? "আগে থেকেই অ্যাকাউন্ট আছে?" : "নতুন এখানে এসেছ?"}
          <button className="text-button" onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(""); setNotice(""); }}>
            {mode === "signup" ? "লগইন" : "অ্যাকাউন্ট খোলো"}
          </button>
        </p>
      </section>
    </div>
  );
}

function CourseCard({ course, onOpen, admin, onEdit, onDelete }) {
  const colors = {
    violet: "course-violet", blue: "course-blue", green: "course-green", orange: "course-orange",
  };
  return (
    <article className="course-card">
      <div className={`course-art ${colors[course.color] || "course-violet"}`}>
        <span className="course-subject">{course.subject || "অন্যান্য"}</span>
        <div className="art-icon"><BookOpen size={34} strokeWidth={1.7} /></div>
        <span className="art-level">{course.level || "সবার জন্য"}</span>
      </div>
      <div className="course-body">
        <div className="course-meta"><span><BookOpen size={14} /> {course.lessons ?? 0}টি লেসন</span><span className="dot">•</span><span>{course.level || "সবার জন্য"}</span></div>
        <h3>{course.title}</h3>
        <p>{course.description || "এই কোর্সে ধাপে ধাপে শিখতে পারবে।"}</p>
        <div className="course-footer">
          <button className="text-link" onClick={() => onOpen(course)}>কোর্স দেখো <ChevronRight size={17} /></button>
          {admin && <div className="admin-actions">
            <button className="icon-button small" title="সম্পাদনা" onClick={() => onEdit(course)}><Pencil size={15} /></button>
            <button className="icon-button small danger-icon" title="মুছে ফেলো" onClick={() => onDelete(course)}><Trash2 size={15} /></button>
          </div>}
        </div>
      </div>
    </article>
  );
}

function CourseDetail({ course, onBack }) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      if (!supabase || String(course.id).startsWith("demo-")) return;
      setLoading(true);
      const { data, error: queryError } = await supabase.from("lessons")
        .select("id,title,content_type,content_url,body,position")
        .eq("course_id", course.id).order("position", { ascending: true });
      if (!active) return;
      if (queryError) setError(getErrorMessage(queryError));
      else setLessons(data || []);
      setLoading(false);
    }
    load();
    return () => { active = false; };
  }, [course.id]);

  return (
    <section className="detail-view">
      <button className="back-link" onClick={onBack}>← সব কোর্সে ফিরে যাও</button>
      <div className="detail-hero">
        <span className="eyebrow">{course.subject || "শিক্ষা"} · {course.level || "সবার জন্য"}</span>
        <h1>{course.title}</h1>
        <p>{course.description}</p>
      </div>
      <div className="section-heading"><div><span className="eyebrow">কোর্সের বিষয়বস্তু</span><h2>লেসনসমূহ</h2></div></div>
      {loading && <div className="loading-line"><LoaderCircle className="spin" size={18} /> লেসন লোড হচ্ছে...</div>}
      {error && <div className="message error"><AlertCircle size={17} />{error}</div>}
      {!loading && lessons.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon"><BookOpen size={26} /></div>
          <h3>এখনো কোনো লেসন যোগ করা হয়নি</h3>
          <p>অ্যাডমিন প্যানেল থেকে এই কোর্সে লেসন যোগ করা যাবে।</p>
        </div>
      )}
      <div className="lesson-list">
        {lessons.map((lesson, index) => (
          <article className="lesson-row" key={lesson.id}>
            <div className="lesson-number">{String(index + 1).padStart(2, "0")}</div>
            <div className="lesson-info"><h3>{lesson.title}</h3><p>{lesson.content_type === "video" ? "ভিডিও ক্লাস" : lesson.content_type === "pdf" ? "PDF নোট" : lesson.content_type === "quiz" ? "কুইজ" : "পাঠ"}</p></div>
            {lesson.content_url && <a className="icon-button" href={lesson.content_url} target="_blank" rel="noreferrer" aria-label="কনটেন্ট খোলো"><ExternalLink size={18} /></a>}
            {lesson.body && <details className="lesson-body"><summary>পড়ো</summary><p>{lesson.body}</p></details>}
          </article>
        ))}
      </div>
    </section>
  );
}

function AdminPanel({ courses, onClose, onSaved }) {
  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("অন্যান্য");
  const [level, setLevel] = useState("সবার জন্য");
  const [description, setDescription] = useState("");
  const [published, setPublished] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function startEdit(course = null) {
    setEditing(course);
    setTitle(course?.title || "");
    setSubject(course?.subject || "অন্যান্য");
    setLevel(course?.level || "সবার জন্য");
    setDescription(course?.description || "");
    setPublished(course?.published ?? true);
    setError("");
    setNotice("");
  }

  async function save(event) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true); setError(""); setNotice("");
    const payload = { title: title.trim(), subject, level, description: description.trim(), published };
    try {
      let result;
      if (editing?.id) {
        result = await supabase.from("courses").update(payload).eq("id", editing.id).select().single();
      } else {
        result = await supabase.from("courses").insert(payload).select().single();
      }
      if (result.error) throw result.error;
      setNotice(editing ? "কোর্স আপডেট হয়েছে।" : "নতুন কোর্স যোগ হয়েছে।");
      startEdit(null);
      await onSaved();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally { setBusy(false); }
  }

  async function remove(course) {
    if (!window.confirm(`“${course.title}” কোর্সটি মুছে ফেলবে? এর লেসনও মুছে যেতে পারে।`)) return;
    const { error: deleteError } = await supabase.from("courses").delete().eq("id", course.id);
    if (deleteError) setError(getErrorMessage(deleteError));
    else { setNotice("কোর্স মুছে ফেলা হয়েছে।"); await onSaved(); }
  }

  return (
    <div className="admin-screen">
      <div className="admin-top"><div><span className="eyebrow">ADMIN WORKSPACE</span><h1>কনটেন্ট পরিচালনা</h1><p className="muted">কোর্স তৈরি, সম্পাদনা ও প্রকাশ নিয়ন্ত্রণ করো।</p></div><button className="button secondary" onClick={onClose}><X size={17} /> বন্ধ করো</button></div>
      {error && <div className="message error"><AlertCircle size={17} />{error}</div>}
      {notice && <div className="message success"><CheckCircle2 size={17} />{notice}</div>}
      <div className="admin-layout">
        <section className="panel">
          <div className="panel-title"><h2>{editing ? "কোর্স সম্পাদনা" : "নতুন কোর্স"}</h2><span className="panel-badge"><ShieldCheck size={14} /> Admin</span></div>
          <form onSubmit={save} className="form-stack">
            <label>কোর্সের নাম<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="যেমন: সাধারণ গণিত" maxLength={140} required /></label>
            <div className="form-grid">
              <label>বিষয়<select value={subject} onChange={(e) => setSubject(e.target.value)}>{subjects.filter(s => s !== "সব বিষয়").map(s => <option key={s} value={s}>{s}</option>)}</select></label>
              <label>স্তর<select value={level} onChange={(e) => setLevel(e.target.value)}>{["সবার জন্য", "শুরু", "প্রাথমিক", "মাধ্যমিক", "উচ্চমাধ্যমিক", "বিশ্ববিদ্যালয়", "পরীক্ষার প্রস্তুতি"].map(s => <option key={s}>{s}</option>)}</select></label>
            </div>
            <label>সংক্ষিপ্ত বিবরণ<textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} maxLength={500} placeholder="এই কোর্সে কী শেখানো হবে?" /></label>
            <label className="checkbox-label"><input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} /> শিক্ষার্থীদের জন্য প্রকাশ করো</label>
            <div className="button-row"><button className="button primary" disabled={busy} type="submit">{busy ? <LoaderCircle className="spin" size={17} /> : <Plus size={17} />}{busy ? "সেভ হচ্ছে..." : editing ? "পরিবর্তন সেভ করো" : "কোর্স যোগ করো"}</button>{editing && <button className="button secondary" type="button" onClick={() => startEdit(null)}>বাতিল</button>}</div>
          </form>
        </section>
        <section className="panel">
          <div className="panel-title"><h2>কোর্সের তালিকা</h2><span className="count-badge">{courses.length}</span></div>
          {courses.length === 0 ? <p className="muted">এখনো কোনো কোর্স নেই।</p> : <div className="admin-course-list">{courses.map(c => <div className="admin-course-row" key={c.id}><div className="admin-course-text"><strong>{c.title}</strong><span>{c.subject} · {c.published ? "প্রকাশিত" : "খসড়া"}</span></div><button className="icon-button small" onClick={() => startEdit(c)} aria-label="সম্পাদনা"><Pencil size={15} /></button><button className="icon-button small danger-icon" onClick={() => remove(c)} aria-label="মুছে ফেলো"><Trash2 size={15} /></button></div>)}</div>}
          <div className="admin-tip"><ShieldCheck size={17} /><p>কোর্সে লেসন যোগ করার ফর্ম পরবর্তী ধাপে বাড়ানো যাবে। বর্তমানে কোর্স তৈরি ও সম্পাদনা সম্পূর্ণ কার্যকর।</p></div>
        </section>
      </div>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authReady, setAuthReady] = useState(!isSupabaseConfigured);
  const [authModal, setAuthModal] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("সব বিষয়");
  const [courses, setCourses] = useState(sampleCourses);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [courseError, setCourseError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setSession(data.session);
      setAuthReady(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthReady(true);
    });
    return () => { alive = false; listener.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    let active = true;
    async function loadProfile() {
      setProfile(null);
      if (!session?.user || !supabase) return;
      const { data, error } = await supabase.from("profiles").select("id,full_name,role").eq("id", session.user.id).maybeSingle();
      if (!active) return;
      if (error) console.error("Profile load error:", error.message);
      setProfile(data || { id: session.user.id, full_name: session.user.user_metadata?.full_name || "", role: "student" });
    }
    loadProfile();
    return () => { active = false; };
  }, [session]);

  async function loadCourses() {
    if (!supabase) { setCourses(sampleCourses); return; }
    setLoadingCourses(true); setCourseError("");
    const { data, error } = await supabase.from("courses").select("id,title,subject,level,description,published").eq("published", true).order("created_at", { ascending: false });
    if (error) {
      setCourseError(getErrorMessage(error));
      setCourses([]);
    } else {
      setCourses((data || []).map((c, i) => ({ ...c, lessons: 0, color: ["violet", "blue", "green", "orange"][i % 4] })));
    }
    setLoadingCourses(false);
  }

  useEffect(() => { loadCourses(); }, []);

  const isAdmin = profile?.role === "admin";
  const visibleCourses = useMemo(() => courses.filter((course) => {
    const term = query.trim().toLocaleLowerCase();
    const matchesText = !term || `${course.title} ${course.subject} ${course.description}`.toLocaleLowerCase().includes(term);
    const matchesSubject = subject === "সব বিষয়" || course.subject === subject;
    return matchesText && matchesSubject;
  }), [courses, query, subject]);

  async function logout() {
    if (supabase) await supabase.auth.signOut();
    setShowAdmin(false); setSelectedCourse(null); setToast("তুমি লগআউট করেছ।");
    window.setTimeout(() => setToast(""), 3000);
  }

  if (!authReady) return <div className="full-loader"><LoaderCircle className="spin" size={30} /><span>অ্যাপ লোড হচ্ছে...</span></div>;

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <button className="brand" onClick={() => { setShowAdmin(false); setSelectedCourse(null); }} aria-label="হোম">
            <span className="brand-mark"><GraduationCap size={25} /></span>
            <span className="brand-copy"><strong>MHR Study Zone</strong><small>শেখো নিজের গতিতে</small></span>
          </button>
          <nav className={`main-nav ${mobileMenu ? "nav-open" : ""}`}>
            <button className={!showAdmin && !selectedCourse ? "nav-link active" : "nav-link"} onClick={() => { setShowAdmin(false); setSelectedCourse(null); setMobileMenu(false); }}>হোম</button>
            <button className="nav-link" onClick={() => { setShowAdmin(false); setSelectedCourse(null); document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" }); setMobileMenu(false); }}>কোর্সসমূহ</button>
            {isAdmin && <button className={`nav-link ${showAdmin ? "active" : ""}`} onClick={() => { setShowAdmin(true); setSelectedCourse(null); setMobileMenu(false); }}><ShieldCheck size={16} /> অ্যাডমিন</button>}
          </nav>
          <div className="header-actions">
            {session ? <>
              <span className="user-chip"><span className="avatar">{(profile?.full_name || session.user.email || "U").slice(0, 1).toUpperCase()}</span><span className="user-name">{profile?.full_name || session.user.email}</span></span>
              <button className="button secondary logout-button" onClick={logout}><LogOut size={16} /> <span>লগআউট</span></button>
            </> : <><button className="button ghost login-button" onClick={() => setAuthModal("login")}><LogIn size={17} /> লগইন</button><button className="button primary signup-button" onClick={() => setAuthModal("signup")}><UserPlus size={17} /> <span>শুরু করো</span></button></>}
          </div>
          <button className="icon-button menu-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label="মেনু">{mobileMenu ? <X /> : <Menu />}</button>
        </div>
      </header>

      {showAdmin && isAdmin ? <main className="page-container"><AdminPanel courses={courses} onClose={() => setShowAdmin(false)} onSaved={loadCourses} /></main> :
      selectedCourse ? <main className="page-container"><CourseDetail course={selectedCourse} onBack={() => setSelectedCourse(null)} /></main> :
      <>
        <main>
          <section className="hero page-container">
            <div className="hero-copy">
              <div className="hero-badge"><Sparkles size={15} /> জ্ঞান অর্জন হোক আনন্দের</div>
              <h1>আজকের শেখা,<br /><span>আগামীর সম্ভাবনা।</span></h1>
              <p>তোমার শেখার যাত্রা শুরু হোক MHR Study Zone-এর সঙ্গে। সহজ পাঠ, দরকারি নোট আর নিজের গতিতে এগিয়ে যাওয়ার সুযোগ—সব এক জায়গায়।</p>
              <div className="hero-actions"><button className="button primary hero-button" onClick={() => document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" })}>কোর্স খুঁজে দেখো <ChevronRight size={18} /></button><button className="button secondary hero-button" onClick={() => setAuthModal(session ? "" : "signup")}>{session ? <CheckCircle2 size={18} /> : <UserPlus size={18} />}{session ? "তুমি লগইন করেছ" : "বিনামূল্যে যোগ দাও"}</button></div>
              <div className="hero-proof"><div className="proof-avatars"><span>শি</span><span>ক্ষ</span><span>ক</span></div><span>সবার জন্য শেখার উন্মুক্ত জায়গা</span></div>
            </div>
            <div className="hero-visual" aria-label="শিক্ষার ইলাস্ট্রেশন">
              <div className="visual-orbit orbit-one"></div><div className="visual-orbit orbit-two"></div>
              <div className="floating-card floating-top"><span className="float-icon purple"><BookOpen size={19} /></span><div><strong>নিজের গতিতে শেখো</strong><small>একটি পাঠ, এক ধাপ এগিয়ে</small></div></div>
              <div className="learning-illustration"><div className="illustration-sun"></div><div className="book-stack"><div className="book book-back"></div><div className="book book-mid"></div><div className="book book-front"><span>MHR</span><BookOpen size={36} /></div></div><div className="plant"><i></i><i></i><i></i><b></b></div><div className="illustration-floor"></div></div>
              <div className="floating-card floating-bottom"><span className="float-icon green"><GraduationCap size={20} /></span><div><strong>জ্ঞানই শক্তি</strong><small>প্রতিদিন একটু করে</small></div><span className="sparkle-dot">✦</span></div>
              <div className="mini-star star-one">✳</div><div className="mini-star star-two">✦</div>
            </div>
          </section>

          <section className="benefit-strip page-container">
            <div className="benefit"><span className="benefit-icon lavender"><BookOpen size={21} /></span><div><strong>গোছানো পাঠ</strong><small>বিষয়ভিত্তিক কনটেন্ট</small></div></div>
            <div className="benefit"><span className="benefit-icon mint"><PlayCircle size={21} /></span><div><strong>ভিডিও ও নোট</strong><small>বিভিন্ন মাধ্যমে শেখো</small></div></div>
            <div className="benefit"><span className="benefit-icon peach"><CircleHelp size={21} /></span><div><strong>কুইজ ও অনুশীলন</strong><small>নিজের প্রস্তুতি যাচাই</small></div></div>
          </section>

          <section id="courses" className="courses-section page-container">
            <div className="section-heading"><div><span className="eyebrow">তোমার শেখার জায়গা</span><h2>জনপ্রিয় কোর্সসমূহ</h2><p>পছন্দের বিষয় বেছে নিয়ে শেখা শুরু করো।</p></div><div className="course-total"><span>{visibleCourses.length.toLocaleString("bn-BD")}</span>টি কোর্স</div></div>
            {!isSupabaseConfigured && <div className="message info"><AlertCircle size={17} /><span><strong>Demo mode:</strong> এখন নমুনা কোর্স দেখানো হচ্ছে। বাস্তব লগইন ও ডেটাবেস চালু করতে Supabase সেটআপ করো।</span></div>}
            <div className="course-tools">
              <div className="search-box"><Search size={19} /><input aria-label="কোর্স খোঁজো" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="কোর্স বা বিষয় খুঁজে দেখো..." />{query && <button className="clear-search" onClick={() => setQuery("")} aria-label="সার্চ মুছো"><X size={16} /></button>}</div>
              <div className="filter-box"><Filter size={17} /><select aria-label="বিষয় দিয়ে ফিল্টার" value={subject} onChange={(e) => setSubject(e.target.value)}>{subjects.map(s => <option key={s}>{s}</option>)}</select></div>
            </div>
            {courseError && <div className="message error"><AlertCircle size={17} />{courseError} — Supabase SQL ও RLS সেটআপ হয়েছে কি না দেখো।</div>}
            {loadingCourses ? <div className="loading-line"><LoaderCircle className="spin" size={20} /> কোর্স লোড হচ্ছে...</div> :
              visibleCourses.length ? <div className="course-grid">{visibleCourses.map(course => <CourseCard key={course.id} course={course} onOpen={setSelectedCourse} admin={isAdmin} onEdit={(c) => { setShowAdmin(true); setSelectedCourse(null); }} onDelete={() => {}} />)}</div> :
              <div className="empty-state"><div className="empty-icon"><Search size={25} /></div><h3>কোনো কোর্স পাওয়া যায়নি</h3><p>অন্য শব্দ বা বিষয় দিয়ে খুঁজে দেখো।</p><button className="button secondary" onClick={() => { setQuery(""); setSubject("সব বিষয়"); }}>ফিল্টার মুছে ফেলো</button></div>}
          </section>

          <section className="cta-section page-container"><div className="cta-card"><div className="cta-decoration">✦</div><div><span className="eyebrow">আজ থেকেই শুরু করো</span><h2>শেখার কোনো শেষ নেই।</h2><p>ছোট ছোট পদক্ষেপই বড় সাফল্যের শুরু। তোমার শেখার যাত্রায় MHR Study Zone পাশে আছে।</p></div><button className="button cta-button" onClick={() => setAuthModal(session ? "" : "signup")}>{session ? "শেখা চালিয়ে যাও" : "ফ্রি অ্যাকাউন্ট খোলো"} <ChevronRight size={18} /></button></div></section>
        </main>
      </>}

      <footer className="site-footer"><div className="page-container footer-inner"><button className="brand footer-brand" onClick={() => { setShowAdmin(false); setSelectedCourse(null); }}><span className="brand-mark"><GraduationCap size={22} /></span><span className="brand-copy"><strong>MHR Study Zone</strong><small>শেখো নিজের গতিতে</small></span></button><p>জ্ঞান ভাগ করলে বাড়ে। © {new Date().getFullYear()} MHR Study Zone</p><a href="#courses" className="footer-top">কোর্স দেখো ↑</a></div></footer>
      {authModal && <AuthModal mode={authModal} setMode={setAuthModal} onClose={() => setAuthModal("")} onSuccess={(next) => setSession(next)} />}
      {toast && <div className="toast"><CheckCircle2 size={17} />{toast}</div>}
    </div>
  );
}
