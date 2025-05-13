import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from './context/UserContext';
import AdminDashboard from "./Pages/admin/AdminDashboard";
import CustomersList from "./Pages/admin/CustomersList";


import BookRoom from "./Pages/customer/BookRoom";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./Pages/admin/Dashboard";
import BookingList from "./Pages/admin/BookingList";
import RoomList from "./Pages/admin/RoomList";
import UserList from "./Pages/admin/UserList";
// Home Screen Imports
import Home from "./Pages/user/Home";
import About from './Pages/user/About';
import UserRoomList from "./Pages/user/UserRoomList";
import RoomDetails from './Pages/user/RoomDetails';
import UserBookRoom from './Pages/user/UserBookRoom';
import Register from './Pages/user/Register';
import UserLogin from './Pages/user/UserLogin';
import UserDashboard from './Pages/user/UserDashboard';
import MyBookings from './Pages/user/MyBookings';
import BookingRoom from './Pages/user/BookingRoom';
import UserProfile from './Pages/user/UserProfile';
// SignIn and SignupForm  Imports
import AuthLogin from './Pages/auth/SignIn';
import AuthRegister from './Pages/auth/SignupForm';
// Host Rooms  Imports
import HostHeader from './Pages/Host/HostHeader';
import Hosthome from './Pages/Host/Home'
import HostUserDashboard from './Pages/Host/HostUserDashboard';
import Listings from './Pages/Host/Listings';
import CreateListing from './Pages/Host/CreateListing';
import CreateNewListing from './Pages/Host/CreateNewListing';
import EditListing from './Pages/Host/EditListing';
import PriceMapPage from './Pages/PriceMapPage';
import Calender from './Pages/Host/Calender/calender';
// Protected Routes
import ProtectedRoute from './components/ProtectedRoute';
import PropertyDetails from './Pages/user/PropertyDetails';


function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* HOme Screen Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/About" element={<About />} />
          <Route path="/rooms" element={
             <ProtectedRoute>
            <UserRoomList />
            </ProtectedRoute>
            } />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/book/:id" element={<UserBookRoom />} />
          <Route path="/register" element={<Register />} />
          <Route path="/price-map" element={<PriceMapPage />} />
          {/* <Route path="/login" element={<UserLogin />} /> */}
          <Route path="/user-dashboard" element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/book-room" element={<BookingRoom />} />
          <Route path="/user-profile" element={<UserProfile />} />

          {/*  Signup and Signin  Routes */}
          <Route path="/login" element={<AuthLogin />} />
          <Route path="/register" element={<AuthRegister />} />

          {/*  Host Rooms  Routes */}
          <Route path="/HostHeader" element={
            <ProtectedRoute>
              <HostHeader />
            </ProtectedRoute>
          } />
          <Route path="/Hosthome" element={
            <ProtectedRoute>
              <Hosthome />
            </ProtectedRoute>
          } />
          <Route path="/hostuserdashboard" element={
            <ProtectedRoute>
              <HostUserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/listings" element={
            <ProtectedRoute>
              <Listings />
            </ProtectedRoute>
          } />
          <Route path="/create-listing" element={
            <ProtectedRoute>
              <CreateListing />
            </ProtectedRoute>
          } />
          <Route path="/create-new-listing" element={
            <ProtectedRoute>
              <CreateNewListing />
            </ProtectedRoute>
          } />
          <Route path="/host/edit-listing/:id" element={
            <ProtectedRoute>
              <EditListing />
            </ProtectedRoute>
          } />
          <Route path="/calender" element=
            {<ProtectedRoute>
              <Calender />
            </ProtectedRoute>
            }
          />


          <Route path="/property/:propertyId" element=

            {<ProtectedRoute>
              <PropertyDetails />
            </ProtectedRoute>
            }
          />

          <Route path="/admin/customers" element={<CustomersList />} />



          <Route path="/book" element={<BookRoom />} />
          <Route path="/admin/dashboard" element=

            {
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>

            } />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="bookings" element={<BookingList />} />
            <Route path="rooms" element={<RoomList />} />
            <Route path="users" element={<UserList />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
