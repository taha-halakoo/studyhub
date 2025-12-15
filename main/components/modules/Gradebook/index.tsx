import React, { useState } from 'react';
import { GraduationCap, BookOpen, Plus, Trash2, TrendingUp, Calculator, PieChart, Award } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { MagneticButton } from '../../ui/MagneticButton';
import { TiltCard } from '../../ui/TiltCard';

export default function GradebookModule() {
  const { semesters, courses, assignments, addSemester, addCourse, addAssignment, deleteAcademicItem } = useApp();
  
  const [activeSemester, setActiveSemester] = useState<string | null>(semesters.find(s => s.is_current)?.id || null);
  
  // Forms
  const [newSemTitle, setNewSemTitle] = useState('');
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseCredits, setNewCourseCredits] = useState(3);
  const [newAssignTitle, setNewAssignTitle] = useState('');
  const [newAssignWeight, setNewAssignWeight] = useState(20);
  const [newAssignScore, setNewAssignScore] = useState(0);
  const [newAssignTotal, setNewAssignTotal] = useState(100);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);

  const handleAddSemester = async () => {
    if (!newSemTitle) return;
    await addSemester(newSemTitle, new Date().toISOString(), new Date().toISOString());
    setNewSemTitle('');
  };

  const handleAddCourse = async () => {
    if (!newCourseTitle || !activeSemester) return;
    await addCourse(activeSemester, newCourseTitle, newCourseCode, newCourseCredits, '#89b4fa');
    setNewCourseTitle(''); setNewCourseCode('');
  };

  const handleAddAssignment = async () => {
    if (!newAssignTitle || !activeCourseId) return;
    await addAssignment(activeCourseId, newAssignTitle, newAssignWeight, newAssignScore, newAssignTotal, new Date().toISOString());
    setNewAssignTitle('');
  };

  const calculateCourseGrade = (courseId: string) => {
    const courseAssignments = assignments.filter(a => a.course_id === courseId);
    if (courseAssignments.length === 0) return 100;
    
    let totalWeight = 0;
    let weightedScore = 0;
    
    courseAssignments.forEach(a => {
      totalWeight += a.weight;
      weightedScore += (a.score_obtained / a.score_total) * a.weight;
    });

    return totalWeight === 0 ? 0 : (weightedScore / totalWeight) * 100;
  };

  const calculateGPA = (semesterId: string) => {
    const semCourses = courses.filter(c => c.semester_id === semesterId);
    let totalCredits = 0;
    let totalPoints = 0;

    semCourses.forEach(c => {
      const grade = calculateCourseGrade(c.id);
      let points = 0;
      if (grade >= 93) points = 4.0;
      else if (grade >= 90) points = 3.7;
      else if (grade >= 87) points = 3.3;
      else if (grade >= 83) points = 3.0;
      else if (grade >= 80) points = 2.7;
      else if (grade >= 77) points = 2.3;
      else if (grade >= 73) points = 2.0;
      else if (grade >= 70) points = 1.7;
      else if (grade >= 60) points = 1.0;
      
      totalPoints += points * c.credits;
      totalCredits += c.credits;
    });

    return totalCredits === 0 ? 0 : (totalPoints / totalCredits).toFixed(2);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            Academic Core <span className="text-xs bg-[#a6e3a1]/10 text-[#a6e3a1] px-2 py-1 rounded border border-[#a6e3a1]/20 font-mono tracking-widest">GPA SYSTEM</span>
          </h1>
          <p className="text-[#a6adc8] mt-1">Performance Tracking & Grade Analysis.</p>
        </div>
        
        <TiltCard className="bg-[#252535] p-4 rounded-2xl border border-[#313244] flex items-center gap-6 shadow-xl relative overflow-hidden group hover:border-[#a6e3a1]/30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#a6e3a1] blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity" />
          
          <div className="text-right z-10">
            <div className="text-xs font-bold text-[#a6adc8] uppercase tracking-widest mb-1">Semester GPA</div>
            <div className="text-3xl font-mono font-black text-[#a6e3a1] drop-shadow-md">{activeSemester ? calculateGPA(activeSemester) : '0.00'}</div>
          </div>
          <div className="h-12 w-px bg-[#313244]" />
          <div className="text-right z-10">
            <div className="text-xs font-bold text-[#a6adc8] uppercase tracking-widest mb-1">CGPA</div>
            <div className="text-3xl font-mono font-black text-[#89b4fa] drop-shadow-md">3.85</div>
          </div>
        </TiltCard>
      </div>

      {/* SEMESTER TABS */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {semesters.map(sem => (
          <button 
            key={sem.id}
            onClick={() => setActiveSemester(sem.id)}
            className={`px-6 py-3 rounded-xl text-sm font-bold border transition-all duration-300 relative overflow-hidden group
              ${activeSemester === sem.id 
                ? 'bg-[#89b4fa] text-[#1e1e2e] border-[#89b4fa] shadow-[0_0_15px_rgba(137,180,250,0.4)]' 
                : 'bg-[#252535] text-[#a6adc8] border-[#313244] hover:text-white hover:border-[#89b4fa]/50'
              }
            `}
          >
            <span className="relative z-10">{sem.title}</span>
            {activeSemester === sem.id && <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />}
          </button>
        ))}
        
        <div className="flex bg-[#252535] rounded-xl border border-[#313244] overflow-hidden p-1 gap-2 items-center">
            <input 
                value={newSemTitle} onChange={e => setNewSemTitle(e.target.value)} 
                placeholder="New Semester..." className="bg-[#1e1e2e] px-4 py-2 rounded-lg text-sm text-white outline-none w-40 border border-[#313244] focus:border-[#89b4fa]"
            />
            <MagneticButton onClick={handleAddSemester} className="bg-[#89b4fa] text-[#1e1e2e] p-2 rounded-lg hover:bg-white transition-all">
                <Plus size={16} />
            </MagneticButton>
        </div>
      </div>

      {/* COURSES LIST */}
      {activeSemester && (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-[#313244] pb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <BookOpen className="text-[#f9e2af]" /> Enrolled Courses
                </h2>
                <div className="flex gap-2 bg-[#252535] p-2 rounded-xl border border-[#313244]">
                    <input value={newCourseCode} onChange={e => setNewCourseCode(e.target.value)} placeholder="Code (CS101)" className="bg-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-white border border-[#313244] w-28 outline-none focus:border-[#89b4fa]" />
                    <input value={newCourseTitle} onChange={e => setNewCourseTitle(e.target.value)} placeholder="Course Name" className="bg-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-white border border-[#313244] w-48 outline-none focus:border-[#89b4fa]" />
                    <input type="number" value={newCourseCredits} onChange={e => setNewCourseCredits(parseInt(e.target.value))} className="bg-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-white border border-[#313244] w-16 outline-none focus:border-[#89b4fa]" />
                    <MagneticButton onClick={handleAddCourse} className="bg-[#89b4fa] text-[#1e1e2e] p-2 rounded-lg hover:bg-white transition-all"><Plus size={18} /></MagneticButton>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {courses.filter(c => c.semester_id === activeSemester).map(course => {
                    const grade = calculateCourseGrade(course.id);
                    const courseAssigns = assignments.filter(a => a.course_id === course.id);
                    
                    return (
                        <TiltCard key={course.id} className="bg-[#252535]/80 backdrop-blur-md rounded-3xl border border-[#313244] overflow-hidden shadow-lg group hover:border-[#89b4fa]/30 transition-all">
                            <div className="p-6 bg-[#1e1e2e]/50 border-b border-[#313244] flex justify-between items-center relative">
                                <div className="absolute top-0 left-0 w-1 h-full bg-[#89b4fa]" />
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-black text-white text-xl tracking-tight">{course.title}</h3>
                                        <span className="text-xs font-mono bg-[#89b4fa]/10 text-[#89b4fa] px-2 py-1 rounded border border-[#89b4fa]/20 font-bold">{course.code}</span>
                                        <span className="text-xs font-mono text-[#585b70] border border-[#313244] px-2 py-1 rounded bg-[#1e1e2e]">{course.credits} Cr</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className={`text-3xl font-black ${grade >= 90 ? 'text-[#a6e3a1]' : grade >= 80 ? 'text-[#89b4fa]' : 'text-[#f9e2af]'}`}>{grade.toFixed(1)}%</div>
                                        <div className="text-[10px] uppercase font-bold text-[#585b70] tracking-wider">Current Standing</div>
                                    </div>
                                    <MagneticButton onClick={() => deleteAcademicItem('course', course.id)} className="text-[#f38ba8] hover:bg-[#f38ba8]/10 p-3 rounded-xl transition-all opacity-50 group-hover:opacity-100">
                                        <Trash2 size={18} />
                                    </MagneticButton>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="mb-4 flex justify-between items-center">
                                    <h4 className="text-xs font-bold text-[#a6adc8] uppercase tracking-widest flex items-center gap-2"><PieChart size={14}/> Assessments</h4>
                                    <button 
                                        onClick={() => setActiveCourseId(activeCourseId === course.id ? null : course.id)}
                                        className="text-xs font-bold bg-[#313244] hover:bg-[#89b4fa] hover:text-[#1e1e2e] px-4 py-2 rounded-lg transition-colors text-white border border-[#45475a]"
                                    >
                                        {activeCourseId === course.id ? 'Cancel' : '+ Add Grade'}
                                    </button>
                                </div>

                                {activeCourseId === course.id && (
                                    <div className="flex gap-2 mb-4 bg-[#1e1e2e] p-3 rounded-xl border border-[#89b4fa]/30 animate-in slide-in-from-top-2 shadow-inner">
                                        <input value={newAssignTitle} onChange={e => setNewAssignTitle(e.target.value)} placeholder="Assessment Title" className="flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder-[#585b70]" />
                                        <div className="w-px h-6 bg-[#313244]" />
                                        <input type="number" value={newAssignScore} onChange={e => setNewAssignScore(parseInt(e.target.value))} placeholder="Score" className="w-16 bg-[#252535] rounded-lg px-2 text-sm text-white border border-[#313244] outline-none focus:border-[#89b4fa]" />
                                        <span className="text-[#585b70] self-center">/</span>
                                        <input type="number" value={newAssignTotal} onChange={e => setNewAssignTotal(parseInt(e.target.value))} placeholder="Total" className="w-16 bg-[#252535] rounded-lg px-2 text-sm text-white border border-[#313244] outline-none focus:border-[#89b4fa]" />
                                        <input type="number" value={newAssignWeight} onChange={e => setNewAssignWeight(parseInt(e.target.value))} placeholder="Weight %" className="w-16 bg-[#252535] rounded-lg px-2 text-sm text-white border border-[#313244] outline-none focus:border-[#89b4fa]" />
                                        <MagneticButton onClick={handleAddAssignment} className="bg-[#a6e3a1] text-[#1e1e2e] px-4 rounded-lg text-xs font-bold hover:bg-white shadow-lg">Save</MagneticButton>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    {courseAssigns.map(a => (
                                        <div key={a.id} className="flex justify-between items-center p-3 rounded-xl bg-[#1e1e2e]/50 border border-[#313244] hover:border-[#89b4fa]/50 transition-all group/item">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-[#89b4fa] shadow-[0_0_8px_#89b4fa]" />
                                                <span className="text-sm font-medium text-white">{a.title}</span>
                                            </div>
                                            <div className="flex items-center gap-6 text-xs font-mono">
                                                <span className="text-[#a6adc8] bg-[#313244] px-2 py-0.5 rounded">{a.weight}% Weight</span>
                                                <span className="font-bold text-[#a6e3a1]">{a.score_obtained}/{a.score_total}</span>
                                                <button onClick={() => deleteAcademicItem('assignment', a.id)} className="opacity-0 group-hover/item:opacity-100 text-[#f38ba8] hover:scale-110 transition-all"><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                    ))}
                                    {courseAssigns.length === 0 && <div className="text-center text-xs text-[#585b70] py-4 italic border-2 border-dashed border-[#313244] rounded-xl">No grades logged yet.</div>}
                                </div>
                            </div>
                        </TiltCard>
                    );
                })}
            </div>
        </div>
      )}
      <style>{`@keyframes shimmer { 100% { transform: translateX(100%); } }`}</style>
    </div>
  );
}