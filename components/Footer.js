import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <div className="relative">
      {/* Footer */}
      <footer
        className="relative w-full top-10 min-h-[700px] mt-37 px-6 md:px-8 py-12"
        style={{ backgroundColor: "#00bafe" }}
      >
        {/* Waves - untouched as requested */}
        <div className="absolute left-0 top-[-70px] w-full h-[100px] pointer-events-none">
          <div
            className="absolute w-full h-full opacity-95 animate-[wave1_3s_linear_infinite]"
            style={{
              backgroundImage: 'url("./ss.png")',
              backgroundSize: "1000px 100px",
              backgroundRepeat: "repeat-x",
              backgroundPosition: "0 0",
              bottom: -5,
            }}
          />
          <div
            className="absolute w-full h-full opacity-20 animate-[wave1_5s_linear_infinite]"
            style={{
              backgroundImage: 'url("./ss.png")',
              backgroundSize: "1000px 100px",
              backgroundRepeat: "repeat-x",
              backgroundPosition: "0 0",
              bottom: 10,
            }}
          />
          <div
            className="relative w-full h-full opacity-40 animate-[wave2_4s_linear_infinite]"
            style={{
              backgroundImage: 'url("./ss.png")',
              backgroundSize: "1000px 100px",
              backgroundRepeat: "repeat-x",
              backgroundPosition: "0 0",
              bottom: 0,
            }}
          />
          <div
            className="absolute w-full h-full opacity-30 animate-[wave1_4s_linear_infinite]"
            style={{
              backgroundImage: 'url("./ss.png")',
              backgroundSize: "1000px 100px",
              backgroundRepeat: "repeat-x",
              backgroundPosition: "0 0",
              bottom: 15,
            }}
          />
          <div
            className="absolute w-full h-full opacity-20 animate-[wave2_3s_linear_infinite]"
            style={{
              backgroundImage: 'url("./ss.png")',
              backgroundSize: "1000px 100px",
              backgroundRepeat: "repeat-x",
              backgroundPosition: "0 0",
              bottom: 15,
            }}
          />
        </div>

        {/* Main Content Container - Premium Design */}
        <div className="relative z-10 w-full max-w-7xl mx-auto">
          {/* Grid Layout - 4 columns with premium styling */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-18 text-black">
            
            {/* Column 1 - Hospital Info with Logo */}
            <div className="group">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative  w-83">
                 <Image
                src="/logo.jpg"
                alt="Hospital"
                width={32}
                height={32}
                unoptimized
                className="h-22 h-24 mx-[-9] mt-[-8] w-74"
              />
                </div>
                
              </div>

              <p className="text-sm leading-6 text-white/90 font-medium">
                Providing advanced healthcare services, specialist doctors,
                diagnostic facilities, emergency treatment and compassionate
                patient care for the community.
              </p>

              <div className="mt-4 p-4 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-xl transition-all hover:shadow-2xl hover:bg-white/25">
                <h4 className="font-semibold text-white flex items-center gap-2">
                  <span className="text-xl">🚑</span> Emergency Hotline
                </h4>
                <p className="font-bold text-2xl text-white tracking-wide mt-1">
                  +880241355143
                </p>
              </div>
            </div>

            {/* Column 2 - Medical Departments */}
            

            {/* Column 3 - Contact Information */}
            <div>
              <h3 className="font-bold text-lg mb-4 pb-2 text-white border-b-2 border-white/30 inline-block">
                Contact Information
              </h3>
              <div className="space-y-3 text-sm mt-4">
                <p className="text-white/90 font-medium flex items-center gap-2">
                  <span className="text-base">📍</span> MEDICAL CENTRE HOSPITAL 953, O.R. Nizam Road, GEC Circle, Panchlaish, Chattogram.
                </p>
                <p className="text-white/90 font-medium flex items-center gap-2">
                  <span className="text-base">☎</span> 0241355611-616,
                  0241355143,02334451054
                </p>
              
                <p className="text-white/90 font-medium flex items-center gap-2 break-all">
                  <span className="text-base">✉</span>info@medicalcentrectg.com
                </p>
                <p className="text-white/90 font-medium flex items-center gap-2">
                  <span className="text-base">🕒</span> Open 24 Hours
                </p>

                <div className="mt-6 pt-2">
                  <h4 className="font-semibold mb-3 text-white">Follow Us</h4>
                  <a
              href="https://www.facebook.com/MedicalCtg/?locale=bn_IN"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/70 hover:text-white transition-colors duration-200 inline-block mt-1"
            >
              Medical Centre Hospital | chittagong
            </a>
                  <div className="flex gap-5 text-2xl">
                    {["logo-facebook", "logo-instagram", "logo-twitter", "logo-linkedin"].map(
                      (icon) => (
                        <a
                          key={icon}
                          href="#"
                          className="text-white/80 hover:text-white hover:scale-110 transition-all duration-200"
                        >
                          <ion-icon name={icon}></ion-icon>
                        </a>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Column 4 - Google Map Location */}
            <div>
              <h3 className="font-bold text-lg mb-4 pb-2 text-white border-b-2 border-white/30 inline-block">
                Location
              </h3>
              <div className="mt-4 overflow-hidden rounded-2xl shadow-2xl border border-white/30 transform transition-all hover:shadow-3xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3689.8473189914257!2d91.82293890000003!3d22.359393199999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30acd8854c6350d5%3A0xfa58c26ac5708278!2sMedical%20Centre!5e0!3m2!1sen!2sbd!4v1780936912188!5m2!1sen!2sbd"
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Hospital Location"
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Premium Stats Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            {[
              { value: "50+", label: "Specialist Doctors", icon: "👨‍⚕️" },
              { value: "24/7", label: "Emergency Service", icon: "🚨" },
              { value: "10K+", label: "Happy Patients", icon: "😊" },
              { value: "100%", label: "Patient Care", icon: "💯" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-white/15 backdrop-blur-md rounded-xl p-4 text-center transform transition-all duration-300 hover:scale-105 hover:bg-white/25 hover:shadow-xl border border-white/20"
              >
                <div className="text-3xl mb-1">{stat.icon}</div>
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                <p className="text-sm text-white/80 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Bottom Footer Bar */}
          <div className="mt-10 border-t border-white/20 pt-5 text-center">
            <p className="text-sm font-medium text-white/90">
              © 2026 Medical Centre chittagong. All Rights Reserved.
            </p>
            <a
              href="https://www.facebook.com/share/1CBKq7jpxF/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/70 hover:text-white transition-colors duration-200 inline-block mt-1"
            >
              Designed & Developed by Tawazun Computer Labib Hasan
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;