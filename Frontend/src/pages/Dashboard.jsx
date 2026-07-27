import { CheckCircle, ClipboardList, BookOpen, Calendar } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import AttendanceChart from '../components/dashboard/AttendanceChart';
import RecentAssignments from '../components/dashboard/RecentAssignments';
import UpcomingQuizzes from '../components/dashboard/UpcomingQuizzes';
import CourseProgress from '../components/dashboard/CourseProgress';
import TopBar from '../components/layout/TopBar';

function Dashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <TopBar />
    <div className="page-body">

      <div className="grid-4">
        <StatsCard icon={CheckCircle}  title="Attendance"  value="85%" sub="Good"       subColor="#16a34a" trend="↑" />
        <StatsCard icon={ClipboardList} title="Assignments" value="05"  sub="2 Pending"  subColor="#f59e0b" />
        <StatsCard icon={BookOpen}     title="Quizzes"     value="03"  sub="1 Upcoming" subColor="#555" />
        <StatsCard icon={Calendar}     title="Leaves"      value="02"  sub="This Month" subColor="#555" />
      </div>

      <div className="flex-row-responsive">
        <div style={{ flex: 1.2 }}>
          <AttendanceChart />
        </div>
        <div style={{ flex: 1 }}>
          <RecentAssignments />
        </div>
      </div>

      <div className="flex-row-responsive">
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
