import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import BookingForm from "./Pages/BookingForm";
import RoomForm from "./Pages/RoomForm";
import UserForm from "./Pages/UserForm";
import ContactForm from "./Pages/ContactForm";
import Gallery from "./Pages/Gallery";
import Services from "./Pages/Services";
import AdminLogin from "./Pages/AdminLogin";
import AdminDashboard from "./Pages/admin/AdminDashboard";
import CustomersList from "./Pages/admin/CustomersList";
import StaffList from "./Pages/admin/StaffList";
import InvoiceList from "./Pages/admin/InvoiceList";
import ServiceList from "./Pages/admin/ServiceList";
import BookRoom from "./Pages/customer/BookRoom";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./Pages/admin/Dashboard";
import BookingList from "./Pages/admin/BookingList";
import RoomList from "./Pages/admin/RoomList";
import UserList from "./Pages/admin/UserList";

import Home from "./Pages/user/Home";
import UserRoomList from "./Pages/user/UserRoomList";
import RoomDetails from './Pages/user/RoomDetails';
import UserBookRoom from './Pages/user/UserBookRoom';
import Register from './Pages/user/Register';
import UserLogin from './Pages/user/UserLogin';
import UserDashboard from './Pages/user/UserDashboard';
import MyBookings from './Pages/user/MyBookings';
import BookingRoom from './Pages/user/BookingRoom';
import UserProfile from './Pages/user/UserProfile';
import AuthLogin from './Pages/auth/SignIn';
import AuthRegister from './Pages/auth/SignupForm';
import About from './Pages/user/About';
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<UserRoomList />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/book/:id" element={<UserBookRoom />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/book-room" element={<BookingRoom />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/login" element={<AuthLogin />} />
          <Route path="/register" element={<AuthRegister />} />
          <Route path="/About" element={<About />} />



          <Route path="/login" element={<Login />} />
          <Route path="/admin/bookings/add" element={<BookingForm />} />
          <Route path="/admin/rooms/add" element={<RoomForm />} />
          <Route path="/admin/users/add" element={<UserForm />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/services" element={<Services />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/customers" element={<CustomersList />} />
          <Route path="/admin/invoices" element={<InvoiceList />} />
          <Route path="/admin/staff" element={<StaffList />} />
          <Route path="/admin/services" element={<ServiceList />} />
          <Route path="/book" element={<BookRoom />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="bookings" element={<BookingList />} />
            <Route path="rooms" element={<RoomList />} />
            <Route path="users" element={<UserList />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
