import { useState, useEffect } from "react";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when user scrolls down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Smooth scroll function
  const scrollToTop = () => window.scrollTo(0, 0);


  return (
    <>
      <footer className="bg-[#0B1120] text-white pt-20">
        <div className="bg-gradient-to-r from-white via-orange-50 to-white p-12 max-w-5xl mx-auto rounded-3xl shadow-2xl -mt-40 relative z-10 min-h-[280px]">
          <h2 className="text-center text-4xl font-extrabold text-[#0B1120] tracking-tight">
            Subscribe Our <span className="text-orange-500">NEWSLETTER</span>
          </h2>
          <p className="text-center text-gray-600 mt-2 text-sm">
            Get the latest news, updates, and offers delivered straight to your
            inbox.
          </p>
          <div className="flex justify-center mt-8">
            <input
              type="email"
              placeholder="Enter your email address"
              required
              className="border-2 border-orange-300 focus:border-orange-500 focus:ring-orange-200 focus:outline-none px-5 py-3 w-full max-w-md rounded-l-full shadow-sm transition-all duration-300 text-black"
            />
            <button className="border-2 focus:ring-orange-200 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-r-full font-medium transition-all duration-300 shadow-md hover:shadow-lg">
              SUBMIT
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="bg-orange-500 p-6 rounded-md">
            <h3 className="text-3xl font-bold text-white mb-4">HOTELIER</h3>
            <p className="text-white text-sm">
              Download Hotelier –{" "}
              <span className="font-semibold">Premium Version</span>, build a
              professional website for your hotel business and grab the
              attention of new visitors upon your site's launch.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">CONTACT</h4>
            <p className="flex items-center mb-2">
              <span className="mr-2">📍</span> 123 Street, New York, USA
            </p>
            <p className="flex items-center mb-2">
              <span className="mr-2">📞</span> +012 345 67890
            </p>
            <p className="flex items-center mb-4">
              <span className="mr-2">✉️</span> info@example.com
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">COMPANY</h4>
            <ul className="space-y-2">
              <li>› About Us</li>
              <li>› Contact Us</li>
              <li>› Privacy Policy</li>
              <li>› Terms & Condition</li>
              <li>› Support</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">SERVICES</h4>
            <ul className="space-y-2">
              <li>› Food & Restaurant</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 py-6 text-sm text-gray-400 flex flex-col md:flex-row justify-between items-center px-4">
          <p>
            © Your Site Name, All Right Reserved. Designed By{" "}
            <a href="#" className="underline text-white">
              HTML Codex
            </a>
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">
              Home
            </a>
            <a href="#" className="hover:text-white">
              Cookies
            </a>
            <a href="#" className="hover:text-white">
              Help
            </a>
            <a href="#" className="hover:text-white">
              FAQs
            </a>
          </div>
        </div>
      </footer>

      {/* 🚀 Scroll To Top Button */}
      {isVisible && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <button
            onClick={scrollToTop}
            className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
            aria-label="Scroll to top"
          >
            ↑
          </button>
        </div>
      )}
    </>
  );
};

export default Footer;
