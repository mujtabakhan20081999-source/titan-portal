import React, { useState } from 'react';

const today = new Date();

const quizzesByDay = {
  10: [{ title: 'JavaScript Quiz', time: '09:00 AM', course: 'Modern Web App Development', students: 30, color: '#6366f1' }],
  17: [{ title: 'React Basics Quiz', time: '10:00 AM', course: 'Modern Web App Development', students: 30, color: '#0ea5e9' }],
  24: [{ title: 'HTML & CSS Quiz', time: '09:00 AM', course: 'Little Geniuses Lab', students: 12, color: '#10b981' }],
};

const baseEvents = {
  1: ['Modern Web App'],
  3: ['Modern Web App'],
  5: ['Modern Web App'],
  6: ['Little Geniuses', 'Little Geniuses'],
  7: ['Little Geniuses', 'Little Geniuses'],
  8: ['Modern Web App'],
  10: ['Modern Web App'],
  12: ['Modern Web App'],
  13: ['Little Geniuses', 'Little Geniuses'],
  14: ['Little Geniuses', 'Little Geniuses'],
  15: ['Modern Web App'],
  17: ['Modern Web App'],
  19: ['Modern Web App'],
  20: ['Little Geniuses', 'Little Geniuses'],
  21: ['Little Geniuses', 'Little Geniuses'],
  22: ['Modern Web App'],
  24: ['Modern Web App'],
  26: ['Modern Web App'],
  27: ['Little Geniuses', 'Little Geniuses'],
  28: ['Little Geniuses', 'Little Geniuses'],
  29: ['Modern Web App'],
};

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1));

  const changeMonth = (dir) => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setMonth(prev.getMonth() + dir);
      return d;
    });
    setSelectedDay(null);
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const total = new Date(year, month + 1, 0).getDate();
    const prevTotal = new Date(year, month, 0).getDate();
    const cells = [];
    for (let i = firstDay - 1; i >= 0; i--) cells.push({ dayNum: prevTotal - i, isCurrentMonth: false });
    for (let i = 1; i <= total; i++) cells.push({ dayNum: i, isCurrentMonth: true });
    const rem = 42 - cells.length;
    for (let i = 1; i <= rem; i++) cells.push({ dayNum: i, isCurrentMonth: false });
    return cells;
  };

  const isToday = (cell) => {
    return cell.isCurrentMonth &&
      cell.dayNum === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear();
  };

  const formattedMonth = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const dayCells = getDaysInMonth();
  const selectedEvents = selectedDay ? baseEvents[selectedDay] : null;
  const selectedQuizzes = selectedDay ? quizzesByDay[selectedDay] : null;

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans">

      {/* Page Title */}
      <div className="px-7 pt-7 pb-4">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-1">
          <span>Dashboard</span>
          <span>›</span>
          <span className="text-blue-600">Calendar</span>
        </div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">My Calendar</h1>
        <p className="text-slate-500 text-sm mt-1">Track your class schedules and upcoming quizzes</p>
      </div>

      {/* Main Content */}
      <div className="px-7 pb-8 flex gap-6">

        {/* Calendar Card */}
        <div className="flex-1 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">

          {/* Calendar Header */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-5 flex items-center justify-between">
            <button
              onClick={() => changeMonth(-1)}
              className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-all hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <div className="text-center">
              <span className="text-white font-black text-xl tracking-tight">{formattedMonth}</span>
            </div>
            <button
              onClick={() => changeMonth(1)}
              className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-all hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>

          {/* Legend */}
          <div className="flex gap-5 px-6 py-3 bg-slate-50 border-b border-slate-100">
            <span className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 inline-block"></span> Class
            </span>
            <span className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="w-2.5 h-2.5 rounded-sm bg-violet-500 inline-block"></span> Quiz
            </span>
            <span className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-700 inline-block rounded-full"></span> Today
            </span>
          </div>

          {/* Weekday Row */}
          <div className="grid grid-cols-7">
            {weekdays.map((d, i) => (
              <div key={i} className="py-3 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 bg-slate-50">
                {d}
              </div>
            ))}
          </div>

          {/* Day Cells */}
          <div className="grid grid-cols-7">
            {dayCells.map((cell, idx) => {
              const hasEvent = cell.isCurrentMonth && baseEvents[cell.dayNum];
              const hasQuiz = cell.isCurrentMonth && quizzesByDay[cell.dayNum];
              const isTodayCell = isToday(cell);
              const isSelected = cell.isCurrentMonth && selectedDay === cell.dayNum;
              const col = idx % 7;
              const isLastRow = idx >= 35;

              return (
                <div
                  key={idx}
                  onClick={() => cell.isCurrentMonth && setSelectedDay(isSelected ? null : cell.dayNum)}
                  className={`
                    min-h-[100px] p-2 flex flex-col gap-1 transition-all cursor-pointer relative
                    ${col < 6 ? 'border-r border-slate-100' : ''}
                    ${!isLastRow ? 'border-b border-slate-100' : ''}
                    ${!cell.isCurrentMonth ? 'bg-slate-50/60' : isSelected ? 'bg-blue-50 ring-2 ring-inset ring-blue-400' : 'bg-white hover:bg-slate-50'}
                  `}
                >
                  {/* Day Number */}
                  <div className="flex items-center justify-between">
                    <span className={`
                      w-7 h-7 flex items-center justify-center rounded-full text-[13px] font-bold transition-all
                      ${!cell.isCurrentMonth ? 'text-slate-300' :
                        isTodayCell ? 'bg-blue-700 text-white shadow-md shadow-blue-300' :
                        isSelected ? 'bg-blue-600 text-white' :
                        'text-slate-700 hover:bg-slate-200'}
                    `}>
                      {cell.dayNum}
                    </span>
                    {hasQuiz && (
                      <span className="w-2 h-2 rounded-full bg-violet-500 shadow-sm shadow-violet-300"></span>
                    )}
                  </div>

                  {/* Events */}
                  <div className="flex flex-col gap-1 overflow-hidden">
                    {hasEvent && baseEvents[cell.dayNum].slice(0, 2).map((ev, eIdx) => (
                      <span key={eIdx} className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 truncate block uppercase tracking-wide">
                        {ev}
                      </span>
                    ))}
                    {hasQuiz && quizzesByDay[cell.dayNum].map((q, qIdx) => (
                      <span key={qIdx} className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-violet-50 text-violet-700 border border-violet-100 truncate block uppercase tracking-wide">
                        📝 {q.title}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-72 flex flex-col gap-4 shrink-0">

          {/* Selected Day Detail */}
          <div className={`bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden transition-all duration-300 ${selectedDay ? 'opacity-100 translate-y-0' : 'opacity-60'}`}>
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-4">
              <div className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">
                {selectedDay ? currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Select a day'}
              </div>
              <div className="text-white font-black text-4xl leading-none">
                {selectedDay ?? '—'}
              </div>
            </div>

            <div className="p-4">
              {!selectedDay && (
                <p className="text-slate-400 text-sm text-center py-4">Click any date to see events</p>
              )}

              {selectedDay && !selectedEvents && !selectedQuizzes && (
                <div className="text-center py-6">
                  <div className="text-3xl mb-2">🎉</div>
                  <p className="text-slate-500 text-sm font-medium">No events today</p>
                  <p className="text-slate-400 text-xs mt-1">Enjoy your free day!</p>
                </div>
              )}

              {selectedEvents && (
                <div className="mb-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Classes</div>
                  <div className="flex flex-col gap-2">
                    {selectedEvents.map((ev, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                        <div className="w-8 h-8 rounded-xl bg-emerald-400 flex items-center justify-center text-white shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                        </div>
                        <span className="text-xs font-bold text-emerald-800 leading-snug">{ev}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedQuizzes && (
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Quizzes</div>
                  <div className="flex flex-col gap-2">
                    {selectedQuizzes.map((q, i) => (
                      <div key={i} className="p-3 rounded-2xl bg-violet-50 border border-violet-100">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 rounded-lg bg-violet-500 flex items-center justify-center text-white text-sm shrink-0">📝</div>
                          <span className="text-xs font-black text-violet-800">{q.title}</span>
                        </div>
                        <div className="space-y-1 pl-9">
                          <div className="text-[11px] text-violet-600"><span className="font-semibold">Time:</span> {q.time}</div>
                          <div className="text-[11px] text-violet-600"><span className="font-semibold">Students:</span> {q.students}</div>
                        </div>
                        <span className="mt-2 inline-block px-3 py-1 rounded-full text-[10px] font-black bg-violet-500 text-white uppercase tracking-wide">
                          Upcoming
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-5">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">This Month</div>
            <div className="space-y-3">
              {[
                { label: 'Total Classes', value: '22', color: 'bg-emerald-100 text-emerald-700' },
                { label: 'Quizzes', value: '3', color: 'bg-violet-100 text-violet-700' },
                { label: 'Courses', value: '2', color: 'bg-blue-100 text-blue-700' },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 font-medium">{s.label}</span>
                  <span className={`text-sm font-black px-3 py-1 rounded-full ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
