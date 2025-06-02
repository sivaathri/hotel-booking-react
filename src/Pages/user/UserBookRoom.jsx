import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();

  // Get selected rooms from URL query parameters
  const selectedRooms = {};
  for (const [key, value] of searchParams.entries()) {
    if (key.startsWith('room')) {
      const roomId = key.replace('room', '');
      selectedRooms[roomId] = parseInt(value);
    }
  }
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
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "India",
    paperless: true,
    mainGuest: true,
    travelingForWork: false,
    phoneCountryCode: "+91", // Assuming a default, you might want to manage this dynamically
    phoneNumber: ""
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
      console.log('bookingDetails', bookingDetails);
    } else {
      navigate(`/property/${propertyId}`);
    }
  }, [location.state, propertyId, navigate]);

  if (!bookingDetails) {
    return (
      <>
        <Header />
        <div className="flex items-center  justify-center min-h-screen">
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const sendOtp = async () => {
    if (!form.phoneNumber || form.phoneNumber.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: `${form.phoneCountryCode}${form.phoneNumber}` }),
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
        body: JSON.stringify({ phone: `${form.phoneCountryCode}${form.phoneNumber}`, otp }),
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
  const handleBookingSubmission = async () => {
    if (!form.firstName || !form.lastName || !form.email) {
      alert('Please fill in all required fields: First Name, Last Name, and Email');
      return;
    }
    // Consider adding OTP verification here before allowing submission
    // if (!verificationStatus.includes('successfully!')) {
    //   alert('Please verify your phone number first.');
    //   return;
    // }

    try {
      const bookingData = {
        user_id: 1, // Replace with actual user ID from authentication
        property_id: propertyId,
        propertyName: bookingDetails.propertyName,
        propertyAddress: bookingDetails.propertyAddress,
        checkInDate: dates.checkIn,
        checkOutDate: dates.checkOut,
        numberOfNights: numberOfNights,
        guests: guests,
        roomsBooked: rooms.map(room => ({
          roomId: room.room_id,
          room_type: room.room_type.split('_')[0],
          count: room.selectedCount || 0,
          pricePerNight: room.price?.basePrice || 0,
        })),
        totalPrice: finalPrice,
        gstAmount: gstAmount,

        // ✅ Keep as userDetails object
        userDetails: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: `${form.phoneCountryCode}${form.phoneNumber}`,
          country: form.country,
          paperlessConfirmation: form.paperless,
          bookingFor: bookingFor,
        },
      };


      const response = await fetch(`${API_URL}/api/booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include authorization token if your API requires it
          // 'Authorization': `Bearer ${yourAuthToken}`
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Booking successful!');
        // Redirect to a confirmation page or home
        navigate('/booking-confirmation', { state: { bookingId: data.bookingId } });
      } else {
        alert(`Booking failed: ${data.message || 'Something went wrong.'}`);
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('An error occurred during booking. Please try again.');
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
      <div className="max-w-2xl ml-80 mt-16 p-6 rounded-md border border-gray-100  space-y-6">
        <h2 className="text-xxl font-bold">Enter your details</h2>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">First name *</label>
            <input type="text" name="firstName" value={form.firstName} onChange={handleChange} className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" placeholder="First name" />
          </div>
          <div>
            <label className="block text-sm font-medium">Last name *</label>
            <input type="text" name="lastName" value={form.lastName} onChange={handleChange} className="mt-1 block w-full border rounded-md px-3 py-2  focus:ring-blue-500 focus:border-blue-500" placeholder="Last name" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Email address * <span className="text-gray-400">(Booking Details will be sent to this email ID)</span></label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className="mt-1 block w-full border rounded-md px-3 py-2  focus:ring-blue-500 focus:border-blue-500" placeholder="example@email.com" />
          <p className="text-sm text-green-600 mt-1">Confirmation email goes to this address</p>
        </div>
        <div>
          <label className="block text-sm font-medium">Country/region *</label>
          <select name="country" value={form.country} onChange={handleChange} className="mt-1 block w-full border rounded-md px-3 py-2  focus:ring-blue-500 focus:border-blue-500">
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
        <div>
          <label className="block text-sm font-medium">Phone number *</label>
          <div className="flex gap-2 mt-1">
            <select name="phoneCountryCode" value={form.phoneCountryCode} onChange={handleChange} className="border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="+91">IN +91</option>
              {/* Add more country codes here if needed */}
            </select>
            <input type="tel" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className="flex-1 border rounded-md px-3 py-2  focus:ring-blue-500 focus:border-blue-500" placeholder="Phone number" />
          </div>
          {otpSent && (
            <div className="mt-2">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={verifyOtp}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Verify OTP
              </button>
              <p className="text-sm mt-1">{verificationStatus}</p>
            </div>
          )}
          {!otpSent && (
            <button
              type="button"
              onClick={sendOtp}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Send OTP
            </button>
          )}
        </div>

        {/* Room Details Section */}
        {/* <div className="mt-6 space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Selected Rooms Details</h3>
          {bookingDetails.rooms.map((room, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-200 transition-all duration-300">
              <h4 className="text-md font-semibold text-gray-800 mb-2">Room {index + 1}</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">Room Type:</span> {room.room_type.split('_')[0]}</p>
                <p><span className="font-medium">Room ID:</span> {room.room_id}</p>
                <p><span className="font-medium">Selected Count:</span> {room.selectedCount}</p>
                <p><span className="font-medium">Available Rooms:</span> {room.rpa_number_of_rooms}</p>
              </div>
            </div>
          ))}
        </div> */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input type="checkbox" name="paperless" checked={form.paperless} onChange={handleChange} className="form-checkbox text-blue-600" />
            <span className="text-sm">Yes, I'd like free paperless confirmation (recommended)</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" name="mainGuest" checked={form.mainGuest} onChange={handleChange} className="form-checkbox text-blue-600" />
            <span className="text-sm">Update my account to include these new details</span>
          </label>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Who are you booking for? <span className="text-gray-500">(optional)</span></p>
          <label className="flex items-center space-x-2 mb-1">
            <input type="radio" name="bookingFor" value="myself" checked={form.bookingFor === "myself"} onChange={handleChange} />
            <span>I am the main guest</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" name="bookingFor" value="someoneElse" checked={form.bookingFor === "someoneElse"} onChange={handleChange} />
            <span>Booking is for someone else</span>
          </label>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Are you travelling for work? <span className="text-gray-500">(optional)</span></p>
          <label className="flex items-center space-x-2 mb-1">
            <input type="radio" name="travelingForWork" value={true} checked={form.travelingForWork === true} onChange={handleChange} />
            <span>Yes</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" name="travelingForWork" value={false} checked={form.travelingForWork === false} onChange={handleChange} />
            <span>No</span>
          </label>
        </div>
      </div>
      {/* Property Rules */}
      <div className="max-w-2xl ml-80  p-6 border-gray-100  space-y-6">
        <h2 className="text-xxl font-bold">Cancellation policy
        </h2>
        <p>Cancel before check-in on 2 Jun for a partial refund. After that, your refund depends on when you cancel. Learn more</p>
        <hr className="border-gray-200" />
      </div>
      <div className="max-w-2xl ml-80  p-6  space-y-6">
        <p className="font-bold">By selecting the button below, I agree to the Host's House Rules, Ground rules for guests, Airbnb's Rebooking and Refund Policy and that Airbnb can charge my payment method if I’m responsible for damage.</p>
      </div>
      <button className="bg-orange-600 mt-10 ml-80 mb-10 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition"
        onClick={handleBookingSubmission}
      >Request to Book</button>

    </div>

  );
};

export default UserBookRoom;