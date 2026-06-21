import { CheckCircle, ClipboardList, BookOpen, Calendar } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import AttendanceChart from '../components/AttendanceChart';
import RecentAssignments from '../components/RecentAssignments';
import UpcomingQuizzes from '../components/UpcomingQuizzes';
import CourseProgress from '../components/CourseProgress';
import TopBar from '../components/TopBar';

function Dashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <TopBar />
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Row 1: 4 Stats Cards */}
      <div className="grid-4">
        <StatsCard icon={CheckCircle}  title="Attendance"  value="85%" sub="Good"       subColor="#16a34a" trend="↑" />
        <StatsCard icon={ClipboardList} title="Assignments" value="05"  sub="2 Pending"  subColor="#f59e0b" />
        <StatsCard icon={BookOpen}     title="Quizzes"     value="03"  sub="1 Upcoming" subColor="#555" />
        <StatsCard icon={Calendar}     title="Leaves"      value="02"  sub="This Month" subColor="#555" />
      </div>

      {/* Row 2: Attendance Chart + Recent Assignments */}
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: 1.2 }}>
          <AttendanceChart />
        </div>
        <div style={{ flex: 1 }}>
          <RecentAssignments />
        </div>
      </div>

      {/* Row 3: Upcoming Quizzes + Course Progress */}
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <UpcomingQuizzes />
        </div>
        <div style={{ flex: 1 }}>
          <CourseProgress />
        </div>
      </div>

    </div>
    </div>
  );
}

export default Dashboard;
