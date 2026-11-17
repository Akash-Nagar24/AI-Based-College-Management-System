import React, { useMemo, useState } from "react";
import {
  GraduationCap, LayoutDashboard, Users, BookOpen, ClipboardList,
  BrainCircuit, Search, Bell, Menu, TrendingUp, TrendingDown,
  CalendarDays, Plus, LogOut, Award, Activity, X, Target, Bot,
  Lightbulb, ChartNoAxesCombined, AlertTriangle, FileText, Send,
  BookMarked, CheckCircle2, Clock3, Sparkles
} from "lucide-react";

const initialStudents = [
  { id: "STU001", name: "Rahul Sharma", course: "Information Technology", attendance: 92, marks: 88, assignments: 90, previousMarks: 82 },
  { id: "STU002", name: "Priya Verma", course: "Computer Science", attendance: 75, marks: 68, assignments: 72, previousMarks: 70 },
  { id: "STU003", name: "Aman Singh", course: "Information Technology", attendance: 58, marks: 42, assignments: 45, previousMarks: 55 },
  { id: "STU004", name: "Sneha Gupta", course: "Artificial Intelligence", attendance: 95, marks: 91, assignments: 94, previousMarks: 87 }
];

const initialCourses = [
  { id: 1, name: "Data Structures", code: "IT301", students: 65 },
  { id: 2, name: "Database Management", code: "IT302", students: 58 },
  { id: 3, name: "Artificial Intelligence", code: "IT303", students: 48 },
  { id: 4, name: "Web Development", code: "IT304", students: 60 }
];

const learningResources = [
  { title: "Data Structures: Arrays and Linked Lists", type: "Notes", subject: "Data Structures", level: "Beginner", description: "Revise core data structure concepts with examples." },
  { title: "SQL Practice: Joins and Queries", type: "Practice", subject: "Database Management", level: "Intermediate", description: "Practice SQL queries and check your understanding." },
  { title: "Introduction to Machine Learning", type: "Course", subject: "Artificial Intelligence", level: "Beginner", description: "Learn supervised learning and model evaluation." },
  { title: "JavaScript Fundamentals Quiz", type: "Quiz", subject: "Web Development", level: "Beginner", description: "Test your knowledge of JavaScript basics." }
];

function getStatus(student) {
  const score = student.marks * 0.55 + student.attendance * 0.25 + student.assignments * 0.2;
  return score >= 75 ? "Good" : score >= 50 ? "Average" : "At Risk";
}

function App() {
  const [students, setStudents] = useState(initialStudents);
  const [courses, setCourses] = useState(initialCourses);
  const [activePage, setActivePage] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [newStudent, setNewStudent] = useState({ id: "", name: "", course: "", attendance: "", marks: "", assignments: "", previousMarks: "" });
  const [newCourse, setNewCourse] = useState({ name: "", code: "" });
  const [selectedStudentId, setSelectedStudentId] = useState(initialStudents[0].id);
  const [prediction, setPrediction] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { from: "bot", text: "Hello! I am the EduSmart demo tutor. Ask me about study strategies, revision, or the learning resources available here." }
  ]);

  const selectedStudent = students.find((student) => student.id === selectedStudentId) || students[0] || null;
  const atRiskStudents = students.filter((student) => getStatus(student) === "At Risk");
  const averageAttendance = students.length ? Math.round(students.reduce((sum, s) => sum + Number(s.attendance), 0) / students.length) : 0;
  const averageMarks = students.length ? Math.round(students.reduce((sum, s) => sum + Number(s.marks), 0) / students.length) : 0;
  const filteredStudents = useMemo(() => students.filter((student) =>
    `${student.name} ${student.id} ${student.course}`.toLowerCase().includes(search.toLowerCase())
  ), [students, search]);

  const navigation = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Students", icon: Users },
    { name: "Courses", icon: BookOpen },
    { name: "Academic Records", icon: ClipboardList },
    { name: "AI Prediction", icon: BrainCircuit },
    { name: "At-Risk Analysis", icon: AlertTriangle },
    { name: "Weak Topic Analysis", icon: Target },
    { name: "Personalized Learning", icon: Lightbulb },
    { name: "AI Chatbot Tutor", icon: Bot },
    { name: "Progress Tracking", icon: ChartNoAxesCombined }
  ];

  function addStudent(event) {
    event.preventDefault();
    const attendance = Number(newStudent.attendance);
    const marks = Number(newStudent.marks);
    const assignments = Number(newStudent.assignments);
    const previousMarks = Number(newStudent.previousMarks);
    if (!newStudent.id.trim() || !newStudent.name.trim() || !newStudent.course ||
      [attendance, marks, assignments, previousMarks].some((value) => !Number.isFinite(value) || value < 0 || value > 100)) {
      window.alert("Enter all details. Attendance, marks and scores must be between 0 and 100.");
      return;
    }
    if (students.some((student) => student.id.toLowerCase() === newStudent.id.trim().toLowerCase())) {
      window.alert("Student ID already exists.");
      return;
    }
    setStudents((current) => [...current, { ...newStudent, id: newStudent.id.trim(), name: newStudent.name.trim(), attendance, marks, assignments, previousMarks }]);
    setNewStudent({ id: "", name: "", course: "", attendance: "", marks: "", assignments: "", previousMarks: "" });
    setShowStudentForm(false);
  }

  function addCourse(event) {
    event.preventDefault();
    if (!newCourse.name.trim() || !newCourse.code.trim()) return;
    if (courses.some((course) => course.code.toLowerCase() === newCourse.code.trim().toLowerCase())) {
      window.alert("Course code already exists.");
      return;
    }
    setCourses((current) => [...current, { id: Date.now(), name: newCourse.name.trim(), code: newCourse.code.trim(), students: 0 }]);
    setNewCourse({ name: "", code: "" });
    setShowCourseForm(false);
  }

  function predictPerformance() {
    if (!selectedStudent) return;
    const score = Math.round(selectedStudent.attendance * 0.2 + selectedStudent.marks * 0.45 + selectedStudent.assignments * 0.2 + selectedStudent.previousMarks * 0.15);
    const result = score >= 75 ? "High Performance" : score >= 50 ? "Average Performance" : "Needs Academic Support";
    setPrediction({ score, result });
  }

  function sendChatMessage(event) {
    event.preventDefault();
    const question = chatInput.trim();
    if (!question) return;
    const lower = question.toLowerCase();
    let answer = "I can help you plan revision. Choose one topic, review the related notes, practise questions, and take a short quiz to check your understanding.";
    if (lower.includes("attendance")) answer = "Attendance is one of the indicators shown in the student records. If attendance is low, discuss the reason with the faculty and make a realistic plan to attend upcoming classes.";
    else if (lower.includes("data structure") || lower.includes("dsa")) answer = "For Data Structures, revise arrays, linked lists, stacks, queues, trees, and graphs. Start with notes, trace examples by hand, and then solve practice questions.";
    else if (lower.includes("sql") || lower.includes("database")) answer = "For DBMS, revise keys, normalization, joins, grouping, and SQL clauses. Practise writing queries on small sample tables.";
    else if (lower.includes("resource") || lower.includes("study")) answer = "Open Personalized Learning to see the sample notes, courses, practice activities, and quizzes available in this frontend demo.";
    setChatMessages((messages) => [...messages, { from: "user", text: question }, { from: "bot", text: answer }]);
    setChatInput("");
  }

  function goTo(page) { setActivePage(page); setMobileMenu(false); }

  function renderDashboard() {
    return <>
      <div className="welcome-section">
        <div><h2>Welcome to EduSmart</h2><p>Monitor academic activities and identify students who may need support.</p></div>
        <div className="date-box"><CalendarDays size={18} /> Academic Year 2026–27</div>
      </div>
      <div className="stats-grid">
        <StatCard title="Total Students" value={students.length} icon={Users} color="blue" change="Registered in this demo" />
        <StatCard title="Total Courses" value={courses.length} icon={BookOpen} color="purple" change="Available courses" />
        <StatCard title="Average Attendance" value={`${averageAttendance}%`} icon={Activity} color="green" change="Based on listed students" />
        <StatCard title="At-Risk Students" value={atRiskStudents.length} icon={TrendingDown} color="orange" change="May need academic support" />
      </div>
      <div className="content-grid">
        <div className="panel"><div className="panel-heading"><div><h3>Recent Students</h3><p>Latest student records</p></div><button className="text-button" onClick={() => goTo("Students")}>View All</button></div><StudentTable data={students.slice(0, 5)} /></div>
        <div className="panel"><div className="panel-heading"><div><h3>Academic Overview</h3><p>Summary of current sample data</p></div><TrendingUp size={20} color="#16a34a" /></div>
          <PerformanceBar label="Average Marks" value={averageMarks} color="good" />
          <PerformanceBar label="Average Attendance" value={averageAttendance} color="average" />
          <PerformanceBar label="Students needing support" value={students.length ? Math.round(atRiskStudents.length / students.length * 100) : 0} color="risk" />
          <div className="ai-notice"><BrainCircuit size={25} /><div><strong>AI-assisted academic support</strong><p>Review predictions and learning suggestions. Demo values are not a trained model output.</p></div></div>
        </div>
      </div>
    </>;
  }

  function renderStudents() {
    return <div className="panel"><div className="panel-heading"><div><h3>Student Management</h3><p>Add, search, and review student information.</p></div><button className="primary-button" onClick={() => setShowStudentForm(true)}><Plus size={17} /> Add Student</button></div>
      {showStudentForm && <form className="add-form" onSubmit={addStudent}><h3>Add New Student</h3>
        <input placeholder="Student ID" value={newStudent.id} onChange={(e) => setNewStudent({ ...newStudent, id: e.target.value })} required />
        <input placeholder="Student Name" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} required />
        <select value={newStudent.course} onChange={(e) => setNewStudent({ ...newStudent, course: e.target.value })} required><option value="">Select Course</option>{courses.map((course) => <option key={course.id} value={course.name}>{course.name}</option>)}</select>
        <NumberInput placeholder="Attendance (0–100)" value={newStudent.attendance} onChange={(value) => setNewStudent({ ...newStudent, attendance: value })} />
        <NumberInput placeholder="Current marks (0–100)" value={newStudent.marks} onChange={(value) => setNewStudent({ ...newStudent, marks: value })} />
        <NumberInput placeholder="Assignment score (0–100)" value={newStudent.assignments} onChange={(value) => setNewStudent({ ...newStudent, assignments: value })} />
        <NumberInput placeholder="Previous marks (0–100)" value={newStudent.previousMarks} onChange={(value) => setNewStudent({ ...newStudent, previousMarks: value })} />
        <button className="primary-button" type="submit">Save Student</button><button className="cancel-button" type="button" onClick={() => setShowStudentForm(false)}>Cancel</button>
      </form>}
      <div className="table-search"><Search size={18} /><input placeholder="Search by name, ID, or course..." value={search} onChange={(e) => setSearch(e.target.value)} /></div><StudentTable data={filteredStudents} />
    </div>;
  }

  function renderCourses() {
    return <div className="panel"><div className="panel-heading"><div><h3>Course Management</h3><p>Manage courses available in the system.</p></div><button className="primary-button" onClick={() => setShowCourseForm(true)}><Plus size={17} /> Add Course</button></div>
      {showCourseForm && <form className="add-form" onSubmit={addCourse}><h3>Add New Course</h3><input placeholder="Course Name" value={newCourse.name} onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })} required /><input placeholder="Course Code" value={newCourse.code} onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })} required /><button className="primary-button" type="submit">Save Course</button><button className="cancel-button" type="button" onClick={() => setShowCourseForm(false)}>Cancel</button></form>}
      <div className="course-grid">{courses.map((course) => <div className="course-card" key={course.id}><div className="course-icon"><BookOpen size={25} /></div><h3>{course.name}</h3><p>Course Code: {course.code}</p><div className="course-bottom"><Users size={17} /> {course.students} Students</div></div>)}</div>
    </div>;
  }

  function renderRecords() {
    return <div className="panel"><div className="panel-heading"><div><h3>Academic Records</h3><p>Attendance, marks, assignments, and previous performance.</p></div></div><StudentTable data={students} showRecords /></div>;
  }

  function renderPrediction() {
    return <div className="panel prediction-panel"><div className="prediction-heading"><div className="prediction-icon"><BrainCircuit size={32} /></div><div><h3>Student Performance Prediction</h3><p>Review an illustrative score using academic indicators.</p></div></div>
      {students.length ? <><label htmlFor="prediction-student">Select Student</label><select id="prediction-student" value={selectedStudent?.id || ""} onChange={(e) => { setSelectedStudentId(e.target.value); setPrediction(null); }}>{students.map((student) => <option key={student.id} value={student.id}>{student.name} ({student.id})</option>)}</select>
        <div className="prediction-inputs"><MetricBox label="Attendance" value={`${selectedStudent.attendance}%`} /><MetricBox label="Current Marks" value={`${selectedStudent.marks}%`} /><MetricBox label="Assignment Score" value={`${selectedStudent.assignments}%`} /><MetricBox label="Previous Marks" value={`${selectedStudent.previousMarks}%`} /></div>
        <button className="primary-button predict-button" onClick={predictPerformance}><BrainCircuit size={18} /> Calculate Demo Estimate</button>
        {prediction && <div className="prediction-result"><Award size={30} /><h3>{prediction.result}</h3><p>Illustrative performance score</p><strong>{prediction.score}%</strong></div>}
      </> : <p className="empty-message">Add a student record to view a demo estimate.</p>}
      <div className="notice-box"><AlertTriangle size={19} /><p><strong>Prototype notice:</strong> This is a frontend demonstration using a weighted formula. It is not a trained machine-learning prediction. A Flask API and validated ML model must be connected before presenting it as actual AI output.</p></div>
    </div>;
  }

  function renderAtRisk() {
    return <div className="panel"><div className="panel-heading"><div><h3>At-Risk Student Analysis</h3><p>Students whose sample academic indicator score is below 50.</p></div><div className="section-icon warning"><AlertTriangle /></div></div>
      {atRiskStudents.length ? <StudentTable data={atRiskStudents} /> : <div className="empty-state"><CheckCircle2 size={30} /><h3>No at-risk students in current sample</h3><p>Continue monitoring attendance, marks, and assignments.</p></div>}
      <div className="notice-box"><AlertTriangle size={19} /><p>This rule is a simple demo classification. In the final system, the ML model and faculty review should guide academic support decisions; a label alone should not determine a student's outcome.</p></div>
    </div>;
  }

  function renderWeakTopics() {
    const topicData = [
      { topic: "Data Structures", weak: "Trees and Graph Traversal", score: 48, action: "Review tree traversals and solve guided examples." },
      { topic: "Database Management", weak: "Normalization", score: 56, action: "Revise 1NF, 2NF, 3NF with practice tables." },
      { topic: "Mathematics", weak: "Probability", score: 42, action: "Start with basic events, then solve simple problems." }
    ];
    return <div className="panel"><div className="panel-heading"><div><h3>Weak Topic Analysis</h3><p>Example subject-level learning gaps and suggested next steps.</p></div><div className="section-icon"><Target /></div></div>
      <div className="topic-grid">{topicData.map((item) => <div className="topic-card" key={item.topic}><div className="topic-card-top"><span>{item.topic}</span><span className="demo-label">Demo data</span></div><h3>{item.weak}</h3><div className="topic-score"><span>Sample assessment score</span><strong>{item.score}%</strong></div><div className="progress"><div className="progress-fill risk" style={{ width: `${item.score}%` }} /></div><p>{item.action}</p></div>)}</div>
      <div className="notice-box"><Sparkles size={19} /><p>These are illustrative topics for the frontend. Actual weak-topic detection needs topic-wise quiz or assessment results stored in the database.</p></div>
    </div>;
  }

  function renderLearning() {
    return <div className="panel"><div className="panel-heading"><div><h3>Personalized Learning Resources</h3><p>Sample notes, courses, quizzes, and practice activities.</p></div><div className="section-icon"><Lightbulb /></div></div>
      <div className="resource-grid">{learningResources.map((resource) => <div className="resource-card" key={resource.title}><div className="resource-icon"><ResourceIcon type={resource.type} /></div><div className="resource-meta"><span>{resource.type}</span><span>{resource.level}</span></div><h3>{resource.title}</h3><p>{resource.description}</p><div className="course-bottom"><BookMarked size={16} /> {resource.subject}</div></div>)}</div>
      <div className="notice-box"><Lightbulb size={19} /><p>In the connected system, recommendations should be selected from a student's predicted weak topics, learning progress, and assessment history.</p></div>
    </div>;
  }

  function renderChatbot() {
    return <div className="panel chatbot-panel"><div className="panel-heading"><div><h3>AI Chatbot Tutor</h3><p>Demo study assistant interface.</p></div><div className="section-icon"><Bot /></div></div>
      <div className="chat-window" aria-live="polite">{chatMessages.map((message, index) => <div className={`chat-message ${message.from}`} key={`${message.from}-${index}`}><div className="chat-bubble">{message.text}</div></div>)}</div>
      <form className="chat-form" onSubmit={sendChatMessage}><input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask about a subject or study strategy..." aria-label="Message the demo tutor" /><button className="primary-button" type="submit" aria-label="Send message"><Send size={18} /> Send</button></form>
      <div className="notice-box"><Bot size={19} /><p>This is a rule-based demo response, not a connected generative AI chatbot. A real tutor needs an AI service/backend and appropriate safety controls.</p></div>
    </div>;
  }

  function renderProgress() {
    return <div className="panel"><div className="panel-heading"><div><h3>Student Progress Tracking</h3><p>Compare previous marks with current marks in the sample records.</p></div><div className="section-icon"><ChartNoAxesCombined /></div></div>
      <div className="table-container"><table><thead><tr><th>Student</th><th>Previous Marks</th><th>Current Marks</th><th>Change</th><th>Attendance</th></tr></thead><tbody>{students.map((student) => { const change = student.marks - student.previousMarks; return <tr key={student.id}><td><strong>{student.name}</strong></td><td>{student.previousMarks}%</td><td>{student.marks}%</td><td><span className={`change-pill ${change >= 0 ? "positive" : "negative"}`}>{change > 0 ? "+" : ""}{change}%</span></td><td>{student.attendance}%</td></tr>; })}</tbody></table></div>
      <div className="progress-cards">{students.map((student) => <div className="progress-student" key={student.id}><div><strong>{student.name}</strong><span>{student.marks}% current marks</span></div><div className="progress"><div className="progress-fill good" style={{ width: `${student.marks}%` }} /></div><small>Previous: {student.previousMarks}%</small></div>)}</div>
      <div className="notice-box"><Clock3 size={19} /><p>Progress history is currently represented by sample previous/current marks. Long-term tracking requires dated assessment records stored in the database.</p></div>
    </div>;
  }

  function getPageContent() {
    switch (activePage) {
      case "Students": return renderStudents();
      case "Courses": return renderCourses();
      case "Academic Records": return renderRecords();
      case "AI Prediction": return renderPrediction();
      case "At-Risk Analysis": return renderAtRisk();
      case "Weak Topic Analysis": return renderWeakTopics();
      case "Personalized Learning": return renderLearning();
      case "AI Chatbot Tutor": return renderChatbot();
      case "Progress Tracking": return renderProgress();
      default: return renderDashboard();
    }
  }

  return <div className="app-container">
    <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}><div className="brand"><div className="brand-icon"><GraduationCap size={27} /></div><div><h2>EduSmart</h2><span>AI College Management</span></div><button className="close-menu" onClick={() => setMobileMenu(false)} aria-label="Close menu"><X size={20} /></button></div>
      <p className="menu-label">MAIN MENU</p><nav>{navigation.map((item) => { const Icon = item.icon; return <button key={item.name} className={`nav-item ${activePage === item.name ? "active" : ""}`} onClick={() => goTo(item.name)}><Icon size={19} /><span>{item.name}</span></button>; })}</nav>
      <div className="sidebar-bottom"><div className="profile"><div className="avatar">A</div><div><strong>Admin User</strong><span>Administrator</span></div><LogOut size={18} /></div></div>
    </aside>
    {mobileMenu && <div className="sidebar-overlay" onClick={() => setMobileMenu(false)} />}
    <main className="main-content"><header className="topbar"><button className="menu-button" onClick={() => setMobileMenu(true)} aria-label="Open menu"><Menu size={23} /></button><div><h2>{activePage}</h2><p>EduSmart / {activePage}</p></div><div className="topbar-right"><button className="notification-button" aria-label="Notifications"><Bell size={20} /><span /></button><div className="top-avatar">A</div></div></header><section className="page-content">{getPageContent()}</section><footer>© 2026 EduSmart · AI-Based College Management System</footer></main>
  </div>;
}

function StatCard({ title, value, icon: Icon, color, change }) { return <div className="stat-card"><div className={`stat-icon ${color}`}><Icon size={23} /></div><p>{title}</p><h2>{value}</h2><span>{change}</span></div>; }
function StudentTable({ data, showRecords = false }) { return <div className="table-container"><table><thead><tr><th>Student ID</th><th>Student Name</th><th>Course</th><th>Attendance</th><th>{showRecords ? "Marks / Assignments" : "Status"}</th></tr></thead><tbody>{data.length ? data.map((student) => <tr key={student.id}><td>{student.id}</td><td><strong>{student.name}</strong></td><td>{student.course}</td><td>{student.attendance}%</td><td>{showRecords ? <span>{student.marks}% / {student.assignments}%</span> : <span className={`status ${getStatus(student).toLowerCase().replace(" ", "-")}`}>{getStatus(student)}</span>}</td></tr>) : <tr><td colSpan="5" className="empty-message">No students found.</td></tr>}</tbody></table></div>; }
function PerformanceBar({ label, value, color }) { return <div className="performance-item"><div className="performance-label"><span>{label}</span><strong>{value}%</strong></div><div className="progress"><div className={`progress-fill ${color}`} style={{ width: `${value}%` }} /></div></div>; }
function MetricBox({ label, value }) { return <div><span>{label}</span><strong>{value}</strong></div>; }
function NumberInput({ placeholder, value, onChange }) { return <input type="number" min="0" max="100" placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} required />; }
function ResourceIcon({ type }) { if (type === "Notes") return <FileText />; if (type === "Quiz") return <ClipboardList />; if (type === "Course") return <BookOpen />; return <Target />; }

export default App;



