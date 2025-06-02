import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaCalendarCheck,
  FaCheckCircle,
} from "react-icons/fa";
import Header from "./Header";
import Paymentheader from "./payment Header/Paymentheader";
import { Radio } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getImageUrl = (path) =>
  path ? `${API_URL}/assets/${path}` : "https://placehold.co/400x320?text=No+Image";

const UserBookRoom = () => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: "short", day: "numeric", month: "short" };
    return date.toLocaleDateString("en-US", options).replace(",", "");
  };

  const { propertyId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [bookingDetails, setBookingDetails] = useState(null);

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');
  const [bookingFor, setBookingFor] = useState("self");
  const [travelForWork, setTravelForWork] = useState("no");
  const [form, setForm] = useState({
    bookingFor: "myself",
    Name: "",

    email: "",
    phone: "",
    country: "India",
    paperless: true,
    mainGuest: true,
    travelingForWork: false,
  });

  useEffect(() => {
    if (location.state) {
      const requiredFields = [
        "propertyName",
        "propertyAddress",
        "facilities",
        "amenities",
        "rules",
        "rooms",
        "dates",
        "guests",
        "price",
      ];
      const missingFields = requiredFields.filter((field) => !location.state[field]);
      if (missingFields.length > 0) {
        navigate(`/property/${propertyId}`);
        return;
      }
      setBookingDetails({
        ...location.state,
        facilities: location.state.facilities || {},
        amenities: location.state.amenities || [],
        rules: location.state.rules || {},
      });
    } else {
      navigate(`/property/${propertyId}`);
    }
  }, [location.state, propertyId, navigate]);

  if (!bookingDetails) {
    return (
      <>
        <Header />
        <div className="flex items-center  justify-center min-h-screen">
          <motion.div
            className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </>
    );
  }

  const {
    rooms,
    dates,
    guests,
    price,
    propertyName,
    propertyType,
  } = bookingDetails;

  const calculateNights = () => {
    const checkIn = new Date(dates.checkIn);
    const checkOut = new Date(dates.checkOut);
    const diffTime = Math.abs(checkOut - checkIn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const numberOfNights = calculateNights();

  const calculateRoomPrice = (room) => room.price?.basePrice || 0;

  const totalBasePrice = rooms.reduce((total, room) => {
    const price = calculateRoomPrice(room);
    return total + price * (room.selectedCount || 0);
  }, 0);

  const gstAmount = price.gstAmount;
  const finalPrice = price.finalPrice;

  const formatCurrency = (amt) => `₹${Math.max(0, amt).toLocaleString("en-IN")}`;

  const propertyImage =
    bookingDetails?.rooms?.[0]?.image_urls?.[0]
      ? getImageUrl(bookingDetails.rooms[0].image_urls[0])
      : "https://placehold.co/400x320?text=No+Image";

  const totalSelectedRooms = rooms.reduce(
    (total, room) => total + (room.selectedCount || 0),
    0
  );

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const sendOtp = async () => {
    if (!form.phone || form.phone.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: form.phone }),
      });

      const data = await response.json();
      if (data.success) {
        setOtpSent(true);
        setVerificationStatus('OTP sent successfully!');
      } else {
        setVerificationStatus('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setVerificationStatus('Failed to send OTP. Please try again.');
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await fetch(`${API_URL}/api/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: form.phone, otp }),
      });

      const data = await response.json();
      if (data.success) {
        setVerificationStatus('Phone number verified successfully!');
        return true;
      } else {
        setVerificationStatus('Invalid OTP. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setVerificationStatus('Failed to verify OTP. Please try again.');
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpSent) {
      await sendOtp();
      return;
    }

    const isVerified = await verifyOtp();
    if (isVerified) {
      // Proceed with booking
      console.log('Proceeding with booking...');
    }
  };

  return (
    <div className="bg-white">
   
      <Paymentheader />

      {/* Price Summary */}
      <div className="fixed top-40 right-[300px] w-[450px] z-10 font-inter">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className=" p-6 border border-blue-100 hover:shadow-2xl transition-shadow duration-300"
        >
          <div className="space-y-6 text-gray-700">
            {/* Property Info */}
            <div className="flex items-start gap-5">
              <img
                src={propertyImage}
                alt={propertyName}
                className="w-28 h-24 object-cover rounded-xl shadow-sm"
                onError={(e) => {
                  e.target.src = "https://placehold.co/400x320?text=No+Image";
                }}
              />
              <div className="flex flex-col justify-center">
                <h2 className="text-xl font-semibold text-gray-900">{propertyName}</h2>
                <p className="text-sm text-gray-500 mt-1">{propertyType}</p>
              </div>
            </div>

            {/* Dates & Guests */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
              <FaCalendarCheck className="text-orange-500 text-lg" />
              <span className="font-medium">
                {formatDate(dates.checkIn)} – {formatDate(dates.checkOut)}
              </span>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <span className="font-semibold">
                {totalSelectedRooms} {totalSelectedRooms === 1 ? "room" : "rooms"},{" "}
                {guests.adults} {guests.adults === 1 ? "Guest" : "Guests"}
              </span>
            </div>

            <hr className="border-gray-200" />

            {/* Price Summary */}
            <div className="space-y-3 text-sm">
              <h3 className="text-lg font-bold text-gray-900">Price Summary</h3>
              <div className="flex justify-between">
                <span>
                  Room Price for {numberOfNights} {numberOfNights === 1 ? "Night" : "Nights"} x{" "}
                  {guests.adults} {guests.adults === 1 ? "Guest" : "Guests"}
                </span>
                <span className="font-medium">{formatCurrency(totalBasePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span className="font-medium">{formatCurrency(gstAmount)}</span>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Total */}
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-gray-800">Total (INR)</div>
              <div className="text-3xl font-extrabold text-orange-600">
                {formatCurrency(finalPrice)}
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-500 mt-1">
              <FaCheckCircle className="text-green-500 mr-2" />
              Includes all taxes and fees
            </div>
          </div>
        </motion.div>
      </div>

      {/* Booking Form */}
      <div className="max-w-2xl ml-80 mt-16 p-6  border-gray-100  space-y-6">
      <h2 className="text-xxl font-bold">Enter your details</h2>
     
  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">First name *</label>
          <input type="text" className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" placeholder="First name"  />
        </div>
        <div>
          <label className="block text-sm font-medium">Last name *</label>
          <input type="text" className="mt-1 block w-full border rounded-md px-3 py-2  focus:ring-blue-500 focus:border-blue-500" placeholder="Last name"  />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Email address *    <span className="text-gray-400">(Booking Details will be sent to this email ID)</span></label>
        <input type="email" className="mt-1 block w-full border rounded-md px-3 py-2  focus:ring-blue-500 focus:border-blue-500" placeholder="example@email.com" />
        <p className="text-sm text-green-600 mt-1">Confirmation email goes to this address</p>
      </div>

      <div>
        <label className="block text-sm font-medium">Phone number *</label>
        <div className="flex gap-2 mt-1">
          <select className="border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
            <option>IN +91</option>
            {/* Add more country codes here if needed */}
          </select>
          <input type="tel" className="flex-1 border rounded-md px-3 py-2  focus:ring-blue-500 focus:border-blue-500" placeholder="Phone number"  />
        </div>
        <p className="text-sm text-gray-500 mt-1">Needed by the property to validate your booking</p>
      </div>

      <div>
        <label className="block text-sm font-medium">Country/region *</label>
        <select className="mt-1 block w-full border rounded-md px-3 py-2  focus:ring-blue-500 focus:border-blue-500">
          <option value="">Select a country</option>
          <option value="AF">Afghanistan</option>
          <option value="AL">Albania</option>
          <option value="DZ">Algeria</option>
          <option value="AD">Andorra</option>
          <option value="AO">Angola</option>
          <option value="AG">Antigua and Barbuda</option>
          <option value="AR">Argentina</option>
          <option value="AM">Armenia</option>
          <option value="AU">Australia</option>
          <option value="AT">Austria</option>
          <option value="AZ">Azerbaijan</option>
          <option value="BS">Bahamas</option>
          <option value="BH">Bahrain</option>
          <option value="BD">Bangladesh</option>
          <option value="BB">Barbados</option>
          <option value="BY">Belarus</option>
          <option value="BE">Belgium</option>
          <option value="BZ">Belize</option>
          <option value="BJ">Benin</option>
          <option value="BT">Bhutan</option>
          <option value="BO">Bolivia</option>
          <option value="BA">Bosnia and Herzegovina</option>
          <option value="BW">Botswana</option>
          <option value="BR">Brazil</option>
          <option value="BN">Brunei</option>
          <option value="BG">Bulgaria</option>
          <option value="BF">Burkina Faso</option>
          <option value="BI">Burundi</option>
          <option value="KH">Cambodia</option>
          <option value="CM">Cameroon</option>
          <option value="CA">Canada</option>
          <option value="CV">Cape Verde</option>
          <option value="CF">Central African Republic</option>
          <option value="TD">Chad</option>
          <option value="CL">Chile</option>
          <option value="CN">China</option>
          <option value="CO">Colombia</option>
          <option value="KM">Comoros</option>
          <option value="CG">Congo</option>
          <option value="CR">Costa Rica</option>
          <option value="HR">Croatia</option>
          <option value="CU">Cuba</option>
          <option value="CY">Cyprus</option>
          <option value="CZ">Czech Republic</option>
          <option value="DK">Denmark</option>
          <option value="DJ">Djibouti</option>
          <option value="DM">Dominica</option>
          <option value="DO">Dominican Republic</option>
          <option value="EC">Ecuador</option>
          <option value="EG">Egypt</option>
          <option value="SV">El Salvador</option>
          <option value="GQ">Equatorial Guinea</option>
          <option value="ER">Eritrea</option>
          <option value="EE">Estonia</option>
          <option value="ET">Ethiopia</option>
          <option value="FJ">Fiji</option>
          <option value="FI">Finland</option>
          <option value="FR">France</option>
          <option value="GA">Gabon</option>
          <option value="GM">Gambia</option>
          <option value="GE">Georgia</option>
          <option value="DE">Germany</option>
          <option value="GH">Ghana</option>
          <option value="GR">Greece</option>
          <option value="GD">Grenada</option>
          <option value="GT">Guatemala</option>
          <option value="GN">Guinea</option>
          <option value="GW">Guinea-Bissau</option>
          <option value="GY">Guyana</option>
          <option value="HT">Haiti</option>
          <option value="HN">Honduras</option>
          <option value="HU">Hungary</option>
          <option value="IS">Iceland</option>
          <option value="IN">India</option>
          <option value="ID">Indonesia</option>
          <option value="IR">Iran</option>
          <option value="IQ">Iraq</option>
          <option value="IE">Ireland</option>
          <option value="IL">Israel</option>
          <option value="IT">Italy</option>
          <option value="JM">Jamaica</option>
          <option value="JP">Japan</option>
          <option value="JO">Jordan</option>
          <option value="KZ">Kazakhstan</option>
          <option value="KE">Kenya</option>
          <option value="KI">Kiribati</option>
          <option value="KP">North Korea</option>
          <option value="KR">South Korea</option>
          <option value="KW">Kuwait</option>
          <option value="KG">Kyrgyzstan</option>
          <option value="LA">Laos</option>
          <option value="LV">Latvia</option>
          <option value="LB">Lebanon</option>
          <option value="LS">Lesotho</option>
          <option value="LR">Liberia</option>
          <option value="LY">Libya</option>
          <option value="LI">Liechtenstein</option>
          <option value="LT">Lithuania</option>
          <option value="LU">Luxembourg</option>
          <option value="MK">North Macedonia</option>
          <option value="MG">Madagascar</option>
          <option value="MW">Malawi</option>
          <option value="MY">Malaysia</option>
          <option value="MV">Maldives</option>
          <option value="ML">Mali</option>
          <option value="MT">Malta</option>
          <option value="MH">Marshall Islands</option>
          <option value="MR">Mauritania</option>
          <option value="MU">Mauritius</option>
          <option value="MX">Mexico</option>
          <option value="FM">Micronesia</option>
          <option value="MD">Moldova</option>
          <option value="MC">Monaco</option>
          <option value="MN">Mongolia</option>
          <option value="ME">Montenegro</option>
          <option value="MA">Morocco</option>
          <option value="MZ">Mozambique</option>
          <option value="MM">Myanmar</option>
          <option value="NA">Namibia</option>
          <option value="NR">Nauru</option>
          <option value="NP">Nepal</option>
          <option value="NL">Netherlands</option>
          <option value="NZ">New Zealand</option>
          <option value="NI">Nicaragua</option>
          <option value="NE">Niger</option>
          <option value="NG">Nigeria</option>
          <option value="NO">Norway</option>
          <option value="OM">Oman</option>
          <option value="PK">Pakistan</option>
          <option value="PW">Palau</option>
          <option value="PA">Panama</option>
          <option value="PG">Papua New Guinea</option>
          <option value="PY">Paraguay</option>
          <option value="PE">Peru</option>
          <option value="PH">Philippines</option>
          <option value="PL">Poland</option>
          <option value="PT">Portugal</option>
          <option value="QA">Qatar</option>
          <option value="RO">Romania</option>
          <option value="RU">Russia</option>
          <option value="RW">Rwanda</option>
          <option value="KN">Saint Kitts and Nevis</option>
          <option value="LC">Saint Lucia</option>
          <option value="VC">Saint Vincent and the Grenadines</option>
          <option value="WS">Samoa</option>
          <option value="SM">San Marino</option>
          <option value="ST">Sao Tome and Principe</option>
          <option value="SA">Saudi Arabia</option>
          <option value="SN">Senegal</option>
          <option value="RS">Serbia</option>
          <option value="SC">Seychelles</option>
          <option value="SL">Sierra Leone</option>
          <option value="SG">Singapore</option>
          <option value="SK">Slovakia</option>
          <option value="SI">Slovenia</option>
          <option value="SB">Solomon Islands</option>
          <option value="SO">Somalia</option>
          <option value="ZA">South Africa</option>
          <option value="SS">South Sudan</option>
          <option value="ES">Spain</option>
          <option value="LK">Sri Lanka</option>
          <option value="SD">Sudan</option>
          <option value="SR">Suriname</option>
          <option value="SZ">Eswatini</option>
          <option value="SE">Sweden</option>
          <option value="CH">Switzerland</option>
          <option value="SY">Syria</option>
          <option value="TW">Taiwan</option>
          <option value="TJ">Tajikistan</option>
          <option value="TZ">Tanzania</option>
          <option value="TH">Thailand</option>
          <option value="TL">Timor-Leste</option>
          <option value="TG">Togo</option>
          <option value="TO">Tonga</option>
          <option value="TT">Trinidad and Tobago</option>
          <option value="TN">Tunisia</option>
          <option value="TR">Turkey</option>
          <option value="TM">Turkmenistan</option>
          <option value="TV">Tuvalu</option>
          <option value="UG">Uganda</option>
          <option value="UA">Ukraine</option>
          <option value="AE">United Arab Emirates</option>
          <option value="GB">United Kingdom</option>
          <option value="US">United States</option>
          <option value="UY">Uruguay</option>
          <option value="UZ">Uzbekistan</option>
          <option value="VU">Vanuatu</option>
          <option value="VA">Vatican City</option>
          <option value="VE">Venezuela</option>
          <option value="VN">Vietnam</option>
          <option value="YE">Yemen</option>
          <option value="ZM">Zambia</option>
          <option value="ZW">Zimbabwe</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input type="checkbox" defaultChecked className="form-checkbox text-blue-600" />
          <span className="text-sm">Yes, I'd like free paperless confirmation (recommended)</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox"  className="form-checkbox text-blue-600" />
          <span className="text-sm">Update my account to include these new details</span>
        </label>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Who are you booking for? <span className="text-gray-500">(optional)</span></p>
        <label className="flex items-center space-x-2 mb-1">
          <input type="radio" name="bookingFor" value="self" checked={bookingFor === "self"} onChange={() => setBookingFor("self")} />
          <span>I am the main guest</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="radio" name="bookingFor" value="someoneElse" checked={bookingFor === "someoneElse"} onChange={() => setBookingFor("someoneElse")} />
          <span>Booking is for someone else</span>
        </label>
      </div>

      {/* <div>
        <p className="text-sm font-medium mb-2">Are you travelling for work? <span className="text-gray-500">(optional)</span></p>
        <label className="flex items-center space-x-2 mb-1">
          <input type="radio" name="travelForWork" value="yes" checked={travelForWork === "yes"} onChange={() => setTravelForWork("yes")} />
          <span>Yes</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="radio" name="travelForWork" value="no" checked={travelForWork === "no"} onChange={() => setTravelForWork("no")} />
          <span>No</span>
        </label>
      </div>
       */}
    </div>
    <button className="bg-orange-600 mt-10 ml-80 mb-10 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition">Request to Book</button>
    </div>
  );
};

export default UserBookRoom;
