'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ArrowUpRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Flame,
  LayoutDashboard,
  ListTodo,
  Menu,
  MoreHorizontal,
  Moon,
  Play,
  Plus,
  Search,
  Settings,
  Sparkles,
  Target,
  Trophy,
  Upload,
  X,
  Zap,
} from 'lucide-react'

type Goal = { id: number; name: string; meta: string; progress: number; hours: string; color: string; icon: string; due: string; predicted: string }
type Task = { id: number; title: string; subject: string; time: number; priority: 'Critical' | 'High' | 'Medium'; due: string; progress: number; color: string; done: boolean }

const initialGoals: Goal[] = [
  { id: 1, name: 'Machine Learning', meta: '5 of 14 topics', progress: 35, hours: '18.5h', color: '#7765e3', icon: 'ML', due: 'May 28', predicted: 'May 31' },
  { id: 2, name: 'AWS Data Engineering', meta: '3 of 15 topics', progress: 20, hours: '9.2h', color: '#e78b54', icon: 'AWS', due: 'Jun 14', predicted: 'Jun 12' },
  { id: 3, name: 'Python Programming', meta: '12 of 20 topics', progress: 60, hours: '24.0h', color: '#4eaa83', icon: 'Py', due: 'May 12', predicted: 'May 10' },
  { id: 4, name: 'Data Structures', meta: '6 of 24 topics', progress: 25, hours: '12.4h', color: '#4a8fd8', icon: 'DS', due: 'Jun 02', predicted: 'Jun 08' },
  { id: 5, name: 'Interview Preparation', meta: '4 of 18 topics', progress: 15, hours: '6.5h', color: '#d879a4', icon: 'IP', due: 'Jun 20', predicted: 'Jun 24' },
]

const initialTasks: Task[] = [
  { id: 1, title: 'Gradient Descent', subject: 'Machine Learning', time: 45, priority: 'Critical', due: 'Due today', progress: 65, color: '#7765e3', done: false },
  { id: 2, title: 'Pandas: GroupBy & Merge', subject: 'Python Programming', time: 30, priority: 'High', due: 'Due today', progress: 20, color: '#4eaa83', done: false },
  { id: 3, title: 'Amazon S3 Fundamentals', subject: 'AWS Data Engineering', time: 40, priority: 'High', due: 'Due tomorrow', progress: 0, color: '#e78b54', done: false },
  { id: 4, title: 'Binary Search Trees', subject: 'Data Structures', time: 35, priority: 'Medium', due: 'May 09', progress: 0, color: '#4a8fd8', done: false },
]

const nav = [
  { label: 'Dashboard', icon: LayoutDashboard }, { label: 'Important Goals', icon: Target }, { label: 'Extracurricular', icon: Trophy },
  { label: 'My Subjects', icon: BookOpen }, { label: 'Syllabus & Topics', icon: ListTodo }, { label: 'Daily Planner', icon: CalendarDays },
  { label: 'Weekly Review', icon: BarChart3 }, { label: 'Progress Analytics', icon: Zap },
]

function ProgressBar({ value, color = '#7765e3' }: { value: number; color?: string }) {
  return <div className="progress-track"><div className="progress-fill" style={{ width: `${value}%`, background: color }} /></div>
}

function Priority({ value }: { value: Task['priority'] }) {
  return <span className={`priority ${value.toLowerCase()}`}><span />{value}</span>
}

export default function Page() {
  const [goals, setGoals] = useState(initialGoals)
  const [tasks, setTasks] = useState(initialTasks)
  const [active, setActive] = useState('Dashboard')
  const [sidebar, setSidebar] = useState(true)
  const [focus, setFocus] = useState<Task | null>(null)
  const [seconds, setSeconds] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [newGoal, setNewGoal] = useState('')
  const [newTask, setNewTask] = useState('')
  const [newSubject, setNewSubject] = useState('')
  const [topicOpen, setTopicOpen] = useState(true)
  const [greeting, setGreeting] = useState('Good afternoon')
  const [dateLabel, setDateLabel] = useState('Tuesday, May 6')

  useEffect(() => {
    const hour = new Date().getHours()
    setGreeting(hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening')
    setDateLabel(new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date()))
  }, [])

  useEffect(() => {
    const saved = window.localStorage.getItem('focusflow-demo')
    if (saved) { try { const data = JSON.parse(saved); setGoals(data.goals); setTasks(data.tasks) } catch {} }
  }, [])
  useEffect(() => { window.localStorage.setItem('focusflow-demo', JSON.stringify({ goals, tasks })) }, [goals, tasks])
  useEffect(() => { if (!running) return; const timer = window.setInterval(() => setSeconds((s) => s > 0 ? s - 1 : 0), 1000); return () => window.clearInterval(timer) }, [running])

  const completed = tasks.filter((task) => task.done).length
  const plannedMinutes = tasks.reduce((sum, task) => sum + (task.done ? 0 : task.time), 0)
  const bestTask = useMemo(() => tasks.find((task) => !task.done) ?? tasks[0], [tasks])

  function toggleTask(id: number) {
    setTasks((items) => items.map((task) => task.id === id ? { ...task, done: !task.done, progress: task.done ? task.progress : 100 } : task))
  }
  function addGoal() {
    if (!newGoal.trim()) return
    setGoals((items) => [...items, { id: Date.now(), name: newGoal, meta: '0 of 0 topics', progress: 0, hours: '0h', color: '#7765e3', icon: 'NEW', due: 'Set a deadline', predicted: '—' }])
    setNewGoal(''); setShowAdd(false)
  }
  function addTask() {
    if (!newTask.trim()) return
    setTasks((items) => [...items, { id: Date.now(), title: newTask.trim(), subject: newSubject.trim() || 'Personal study', time: 30, priority: 'Medium', due: 'Set a deadline', progress: 0, color: '#4a8fd8', done: false }])
    setNewTask('')
    setNewSubject('')
  }
  function startTask(task: Task) { setFocus(task); setSeconds(25 * 60); setRunning(false) }
  const time = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`

  return <div className="app-shell">
    <aside className={`sidebar ${sidebar ? '' : 'collapsed'}`}>
      <div className="brand"><div className="brand-mark"><Sparkles size={16} /></div>{sidebar && <><strong>focus<span>flow</span></strong><button className="collapse-btn" onClick={() => setSidebar(false)} aria-label="Collapse sidebar"><ChevronRight size={15} /></button></>}</div>
      {!sidebar && <button className="expand-btn" onClick={() => setSidebar(true)} aria-label="Expand sidebar"><Menu size={18} /></button>}
      {sidebar && <button className="quick-add" onClick={() => setShowAdd(true)}><Plus size={16} /> Quick add <span>⌘ K</span></button>}
      <nav>{nav.map(({ label, icon: Icon }) => <button key={label} className={active === label ? 'active' : ''} onClick={() => setActive(label)} title={label}><Icon size={17} />{sidebar && <span>{label}</span>}{sidebar && label === 'Dashboard' && <b>⌘1</b>}</button>)}</nav>
      {sidebar && <div className="sidebar-bottom"><button><Settings size={17} /> Settings</button><button><CircleHelp size={17} /> Help & shortcuts</button><div className="profile"><div className="avatar">AK</div><div><strong>Alex Kumar</strong><small>Personal workspace</small></div><MoreHorizontal size={17} /></div></div>}
    </aside>

    <main className="main-content">
      <header className="topbar"><div className="mobile-brand"><div className="brand-mark"><Sparkles size={15} /></div><strong>focus<span>flow</span></strong></div><div className="breadcrumbs"><span>Workspace</span><ChevronRight size={13} /><strong>{active}</strong></div><div className="top-actions"><button className="icon-btn"><Search size={17} /></button><button className="theme-btn"><Moon size={15} /> <span>Dark</span></button><div className="avatar">AK</div></div></header>
      <div className="page-wrap">
        <section className="welcome"><div><p className="eyebrow">{dateLabel}</p><h1>{greeting}, Alex <span>—</span></h1><p className="muted">A focused day starts with one clear next step.</p></div><button className="primary-btn" onClick={() => bestTask && startTask(bestTask)}><Play size={16} fill="currentColor" /> Start today&apos;s plan <ArrowUpRight size={15} /></button></section>

        {active !== 'Dashboard' && <section className="workspace-panel"><div className="workspace-panel-head"><div><p className="eyebrow">Workspace</p><h2>{active}</h2><p className="muted">Manage your study data without leaving your planner.</p></div>{active === 'Important Goals' && <button className="primary-btn small" onClick={() => setShowAdd(true)}><Plus size={14} /> Add goal</button>}</div>{active === 'Daily Planner' || active === 'Syllabus & Topics' ? <div className="entry-form"><label>Task title<input value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="e.g. Review recursion" /></label><label>Subject<input value={newSubject} onChange={(e) => setNewSubject(e.target.value)} placeholder="e.g. Data Structures" /></label><button className="primary-btn small" onClick={addTask}><Plus size={14} /> Add task</button></div> : active === 'Important Goals' ? <div className="workspace-list">{goals.map((goal) => <div className="workspace-row" key={goal.id}><div className="goal-icon" style={{ background: `${goal.color}18`, color: goal.color }}>{goal.icon}</div><div><strong>{goal.name}</strong><small>{goal.meta} · {goal.hours}</small></div><span>{goal.progress}%</span></div>)}</div> : <div className="workspace-list">{tasks.map((task) => <div className="workspace-row" key={task.id}><div className="task-number">{task.done ? <Check size={13} /> : task.id}</div><div><strong>{task.title}</strong><small>{task.subject} · {task.time} min</small></div><button className={`check-btn ${task.done ? 'checked' : ''}`} onClick={() => toggleTask(task.id)}>{task.done && <Check size={13} />}</button></div>)}</div>}</section>}

        <section className="stats-grid"><div className="stat-card"><div className="stat-icon purple"><Target size={17} /></div><div><span>Active goals</span><strong>{goals.length}</strong><small>+1 this month</small></div></div><div className="stat-card"><div className="stat-icon orange"><Clock3 size={17} /></div><div><span>Today&apos;s plan</span><strong>{Math.floor(plannedMinutes / 60)}h {plannedMinutes % 60}m</strong><small>{completed}/{tasks.length} tasks complete</small></div></div><div className="stat-card"><div className="stat-icon green"><Flame size={17} /></div><div><span>Study streak</span><strong>7 days</strong><small className="green-text">Personal best</small></div></div><div className="stat-card"><div className="stat-icon blue"><Trophy size={17} /></div><div><span>Weekly target</span><strong>68%</strong><small>+12% from last week</small></div></div></section>

        <div className="dashboard-grid"><section className="main-column">
          <div className="section-heading"><div><h2>Today&apos;s focus</h2><p>Tuesday · 3 tasks remaining</p></div><button className="text-btn" onClick={() => setActive('Daily Planner')}>View planner <ArrowUpRight size={14} /></button></div>
          <div className="focus-card"><div className="focus-top"><div className="subject-chip" style={{ background: `${bestTask?.color}18`, color: bestTask?.color }}>ML <span>{bestTask?.subject}</span></div><Priority value={bestTask?.priority ?? 'High'} /></div><h3>{bestTask?.title}</h3><p className="muted">Continue with the optimization algorithm and compare learning rates on the training set.</p><div className="focus-meta"><span><Clock3 size={15} /> {bestTask?.time} min</span><span><CalendarDays size={15} /> {bestTask?.due}</span><span className="progress-label">{bestTask?.progress}% complete</span></div><ProgressBar value={bestTask?.progress ?? 0} color={bestTask?.color} /><div className="focus-actions"><button className="primary-btn small" onClick={() => bestTask && startTask(bestTask)}><Play size={14} fill="currentColor" /> Start study</button><button className="ghost-btn" onClick={() => bestTask && toggleTask(bestTask.id)}><Check size={15} /> Mark complete</button><button className="icon-btn"><MoreHorizontal size={17} /></button></div></div>
          <div className="section-heading goals-heading"><div><h2>Important goals</h2><p>Keep momentum across your priorities</p></div><button className="text-btn" onClick={() => setShowAdd(true)}>Manage goals <ArrowUpRight size={14} /></button></div>
          <div className="goal-grid">{goals.slice(0, 5).map((goal) => <button className="goal-card" key={goal.id} onClick={() => setActive('Syllabus & Topics')}><div className="goal-card-top"><div className="goal-icon" style={{ background: `${goal.color}18`, color: goal.color }}>{goal.icon}</div><MoreHorizontal size={17} /></div><strong>{goal.name}</strong><span className="goal-meta">{goal.meta} <i>·</i> {goal.hours}</span><ProgressBar value={goal.progress} color={goal.color} /><div className="goal-footer"><span>{goal.progress}%</span><small>Due {goal.due}</small></div></button>)}</div>
          <div className="section-heading activity-heading"><div><h2>Study activity</h2><p>Your effort over the last 7 days</p></div><button className="select-btn">This week <ChevronDown size={14} /></button></div>
          <div className="activity-card"><div className="chart-y"><span>4h</span><span>3h</span><span>2h</span><span>1h</span><span>0</span></div><div className="bars">{[34, 58, 42, 76, 52, 88, 18].map((height, i) => <div className="bar-day" key={i}><div className="bar-stack"><i style={{ height: `${height * .72}%` }} /><b style={{ height: `${height * .28}%` }} /></div><span>{['M','T','W','T','F','S','S'][i]}</span></div>)}</div><div className="chart-legend"><span><i className="legend-planned" /> Planned</span><span><i className="legend-actual" /> Actual</span><strong>12.4h <small>actual this week</small></strong></div></div>
        </section>
        <aside className="right-column"><div className="section-heading"><div><h2>What&apos;s next</h2><p>Prioritized for your momentum</p></div><Zap size={18} className="accent-icon" /></div><div className="next-list">{tasks.map((task, index) => <div className={`next-task ${task.done ? 'is-done' : ''}`} key={task.id}><div className="task-number">{index + 1}</div><div className="task-body"><div className="task-line"><strong>{task.title}</strong><button onClick={() => toggleTask(task.id)} className={`check-btn ${task.done ? 'checked' : ''}`}>{task.done && <Check size={13} />}</button></div><span style={{ color: task.color }}>{task.subject}</span><div className="task-details"><small><Clock3 size={12} /> {task.time} min</small><Priority value={task.priority} /></div></div></div>)}</div><button className="full-btn" onClick={() => setActive('Daily Planner')}>Open daily planner <ArrowUpRight size={14} /></button>
          <div className="side-card"><div className="side-card-heading"><div><h3>Upcoming deadlines</h3><p>Stay ahead of your targets</p></div><CalendarDays size={17} /></div><div className="deadline"><div className="date-box"><strong>09</strong><span>MAY</span></div><div><strong>Python assessment</strong><small>in 3 days · <em>on track</em></small></div></div><div className="deadline"><div className="date-box warn"><strong>12</strong><span>MAY</span></div><div><strong>ML project checkpoint</strong><small>in 6 days · <em className="orange-text">at risk</em></small></div></div></div>
          <div className="side-card consistency"><div className="side-card-heading"><div><h3>Consistency</h3><p>Last 7 study days</p></div><Flame size={17} className="orange-text" /></div><div className="heatmap">{Array.from({ length: 28 }).map((_, i) => <i key={i} className={i % 7 === 0 || i % 11 === 0 ? 'level-0' : `level-${(i % 4) + 1}`} />)}</div><div className="consistency-foot"><strong>86%</strong><span>weekly consistency score</span></div></div>
        </aside></div>
      </div>
    </main>

    {showAdd && <div className="modal-backdrop" onClick={() => setShowAdd(false)}><div className="modal" onClick={(e) => e.stopPropagation()}><div className="modal-heading"><div><h2>Add a goal</h2><p>What would you like to make progress on?</p></div><button className="icon-btn" onClick={() => setShowAdd(false)}><X size={17} /></button></div><label>Goal name<input autoFocus value={newGoal} onChange={(e) => setNewGoal(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addGoal()} placeholder="e.g. System Design" /></label><label>Category<select><option>Important goal</option><option>Extracurricular activity</option></select></label><label>Target date<input type="date" /></label><div className="modal-actions"><button className="ghost-btn" onClick={() => setShowAdd(false)}>Cancel</button><button className="primary-btn" onClick={addGoal}><Plus size={15} /> Create goal</button></div></div></div>}
    {focus && <div className="modal-backdrop focus-overlay"><div className="focus-modal"><div className="focus-modal-top"><span className="eyebrow">Focus mode</span><button className="icon-btn" onClick={() => { setRunning(false); setFocus(null) }}><X size={17} /></button></div><div className="focus-subject" style={{ color: focus.color }}>{focus.subject}</div><h2>{focus.title}</h2><p>Stay with this one thing. You&apos;ve got this.</p><div className="timer">{time}</div><div className="timer-presets"><button onClick={() => setSeconds(25 * 60)}>25 / 5</button><button onClick={() => setSeconds(50 * 60)}>50 / 10</button><button onClick={() => setSeconds(15 * 60)}>15 min</button></div><button className="primary-btn focus-start" onClick={() => setRunning((value) => !value)}>{running ? 'Pause session' : <><Play size={16} fill="currentColor" /> {seconds < 25 * 60 ? 'Resume session' : 'Start session'}</>}</button><button className="finish-btn" onClick={() => { toggleTask(focus.id); setFocus(null); setRunning(false) }}>Finish & record session</button></div></div>}
  </div>
}
