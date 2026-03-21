import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { Toaster } from 'react-hot-toast';

// Layouts
import PublicLayout from './layouts/PublicLayout.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';

// Public pages
import Home from './pages/public/Home.jsx';
import About from './pages/public/About.jsx';
import Pastors from './pages/public/Pastors.jsx';
import Contact from './pages/public/Contact.jsx';
import Events from './pages/public/Events.jsx';
import Announcements from './pages/public/Announcements.jsx';
import JoinMinistry from './pages/public/JoinMinistry.jsx';

// Auth pages
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import ResetPassword from './pages/auth/ResetPassword.jsx';

// Member dashboard
import MemberDashboard from './pages/member/MemberDashboard.jsx';
import JoinChurch from './pages/member/JoinChurch.jsx';
import BaptismRegister from './pages/member/BaptismRegister.jsx';
import MarriageRegister from './pages/member/MarriageRegister.jsx';
import PrayerRequest from './pages/member/PrayerRequest.jsx';
import BookAppointment from './pages/member/BookAppointment.jsx';

// Pastor dashboard
import PastorDashboard from './pages/pastor/PastorDashboard.jsx';
import ManageMembers from './pages/pastor/ManageMembers.jsx';
import PrayerRequests from './pages/pastor/PrayerRequests.jsx';
import BaptismManage from './pages/pastor/BaptismManage.jsx';
import MarriageManage from './pages/pastor/MarriageManage.jsx';
import Appointments from './pages/pastor/Appointments.jsx';

// Manager dashboard
import ManagerDashboard from './pages/manager/ManagerDashboard.jsx';
import ManageEvents from './pages/manager/ManageEvents.jsx';
import ManageAnnouncements from './pages/manager/ManageAnnouncements.jsx';
import ManageFamilies from './pages/manager/ManageFamilies.jsx';
import DeletionRequests from './pages/manager/DeletionRequests.jsx';
import PhotoOfDay from './pages/manager/PhotoOfDay.jsx';

// Protected Route
const ProtectedRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-page">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) return <Navigate to="/login" />;

    const userRole = user.role || user.profile?.role;
    if (roles && !roles.includes(userRole)) {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

function App() {
    const { user } = useAuth();

    const getDashboardRedirect = () => {
        if (!user) return '/login';
        const role = user.role || user.profile?.role;
        if (role === 'pastor') return '/pastor';
        if (role === 'manager') return '/manager';
        return '/member';
    };

    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#1a2235',
                        color: '#f8fafc',
                        border: '1px solid rgba(255,255,255,0.08)',
                    },
                }}
            />
            <Routes>
                {/* Public */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/pastors" element={<Pastors />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/announcements" element={<Announcements />} />
                    <Route path="/join-ministry" element={<JoinMinistry />} />
                </Route>

                {/* Auth */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />

                {/* Dashboard redirect */}
                <Route path="/dashboard" element={<Navigate to={getDashboardRedirect()} />} />

                {/* Member Dashboard */}
                <Route path="/member" element={<ProtectedRoute roles={['member', 'pastor', 'manager']}><DashboardLayout role="member" /></ProtectedRoute>}>
                    <Route index element={<MemberDashboard />} />
                    <Route path="join" element={<JoinChurch />} />
                    <Route path="baptism" element={<BaptismRegister />} />
                    <Route path="marriage" element={<MarriageRegister />} />
                    <Route path="prayer" element={<PrayerRequest />} />
                    <Route path="appointment" element={<BookAppointment />} />
                </Route>

                {/* Pastor Dashboard */}
                <Route path="/pastor" element={<ProtectedRoute roles={['pastor']}><DashboardLayout role="pastor" /></ProtectedRoute>}>
                    <Route index element={<PastorDashboard />} />
                    <Route path="members" element={<ManageMembers />} />
                    <Route path="prayer-requests" element={<PrayerRequests />} />
                    <Route path="baptism" element={<BaptismManage />} />
                    <Route path="marriage" element={<MarriageManage />} />
                    <Route path="appointments" element={<Appointments />} />
                </Route>

                {/* Manager Dashboard */}
                <Route path="/manager" element={<ProtectedRoute roles={['manager']}><DashboardLayout role="manager" /></ProtectedRoute>}>
                    <Route index element={<ManagerDashboard />} />
                    <Route path="events" element={<ManageEvents />} />
                    <Route path="announcements" element={<ManageAnnouncements />} />
                    <Route path="families" element={<ManageFamilies />} />
                    <Route path="deletion-requests" element={<DeletionRequests />} />
                    <Route path="photos" element={<PhotoOfDay />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
}

export default App;
