import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../utils/translations";


const NavButton = ({ children }) => (
  <span className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xs font-semibold text-gray-800 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200">
    <span className="relative px-1 py-2 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-transparent leading-5">
      {children}
    </span>
  </span>
);


export default function Navbar() {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuAnimating, setMenuAnimating] = useState(false);
  const [menuItemsVisible, setMenuItemsVisible] = useState(false);
  const drawerRef = useRef(null);
  const { language, changeLanguage } = useLanguage();
  const t = translations[language];

  const menuItems = [
  { label: "FAQ", href: "/faq" },
  { label: t.appointment, href: "/appointment" },
  { label: t.specialities, 
  href: "#", 
  submenu: [
    { label: "ICU – Intensive Care Unit", href: "/specialities/icu" },
    { label: "CCU – Critical Care Unit", href: "/specialities/ccu" },
    { label: "HDU – High Dependency Unit", href: "/specialities/hdu" },
    { label: "SDU – Step Down Unit", href: "/specialities/sdu" },
    { label: "NICU – Neonatal ICU", href: "/specialities/nicu" },
    { label: "GYNAE - Gynecology", href: "/specialities/gynae" },
    { label: "PAEDI - Pediatric", href: "/specialities/paedi" },
    { label: "OT - Operation Theatre", href: "/specialities/ot" },
    { label: "ED - Emergency", href: "/specialities/ed" },
    { label: "Dialysis - Kidney Care", href: "/specialities/dialysis" },
  ],
},

];

const mainMenuItems = [
 { label: t.home, href: "/" },

{
  label: t.specialities,
  href: "#",
  submenu: [
    { label: "ICU ", href: "/specialities/icu" },
    { label: "CCU ", href: "/specialities/ccu" },
    { label: "HDU ", href: "/specialities/hdu" },
    { label: "SDU ", href: "/specialities/sdu" },
    { label: "NICU ", href: "/specialities/nicu" },
    { label: "GYNAE - Gynecology", href: "/specialities/gynae" },
    { label: "PAEDI - Pediatric", href: "/specialities/paedi" },
     { label: "OT - Operation Theatre", href: "/specialities/ot" },
   { label: "ED - Emergency", href: "/specialities/ed" },
   { label: "Dialysis - Kidney Care", href: "/specialities/dialysis" },
  ],
},

  {
    label: t.about,
    href: "#",
    submenu: [
      { label: "Our Story", href: "/about/our-story" },
      { label: "Mission & Vision", href: "/about/mission-vision" },
    ],
  },
  {
    label: t.departments,
    href: "#",
    submenu: [
      { label: "Medicine", href: "/departments/medicine" },
      { label: "Neuro Medicine", href: "/departments/neuro-medicine" },
      { label: "Cardiology", href: "/departments/cardiology" },
      { label: "Gastroenterology", href: "/departments/gastroenterology" },
      { label: "ENT", href: "/departments/ent" },
      { label: "Gynee & Obs.", href: "/departments/gynee-obs" },
      { label: "Nephrology", href: "/departments/nephrology" },
      { label: "Orthopedics", href: "/departments/orthopedics" },
      { label: "Oncology", href: "/departments/oncology" },
      { label: "Psychiatry", href: "/departments/psychiatry" },
      { label: "Pediatrics", href: "/departments/pediatrics" },
      { label: "Physical Medicine", href: "/departments/physical-medicine" },
      { label: "Skin & VD", href: "/departments/skin-vd" },
      { label: "Surgery", href: "/departments/surgery" },
      { label: "Urology", href: "/departments/urology" },
    ],
  },
 {
      label: t.ourClinic,
      href: "#",
      submenu: [
        { label: "Message from MD", href: "/our-clinic/md-message" },
        { label: "Photo Gallery", href: "/our-clinic/photo-gallery" },
      ],
    },
  {
    label: t.forDoctors,
    href: "#",
    submenu: [
      { label: "Doctor Info 1", href: "/for-doctors/info1" },
      { label: "Doctor Info 2", href: "/for-doctors/info2" },
    ],
  },
  { label: t.news, href: "/news" },
  {
    label: t.contact,
    href: "/contact",
   
  },
 /*  { label: t.diagnostic, href: "/diagnostic-report" }, */
  {
    label: t.diagnosticService,
    href: "#",
    submenu: [
      { label: t.radiology, href: "/diagnostic/radiology" },
      { label: t.pathology, href: "/diagnostic/pathology" },
    ],
  },
  
];

useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      setMobileMenuOpen(false);
      setOpenSubmenu(null);
    }
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

useEffect(() => {
  if (mobileMenuOpen) {
    setMenuAnimating(true);
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      setMenuItemsVisible(true);
      setMenuAnimating(false);
    }, 150);
  } else {
    setMenuItemsVisible(false);
    setMenuAnimating(true);
    document.body.style.overflow = "unset";
    setTimeout(() => {
      setMenuAnimating(false);
    }, 300);
  }
}, [mobileMenuOpen]);

const closeMenu = () => {
  setMobileMenuOpen(false);
  setOpenSubmenu(null);
};

 

  const toggleSubmenu = (index) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };
  
  return (
    <>
     
     

      {/* Main navbar */}
      <header className="bg-gray-100 border-b justify-between items-center fixed top-0 left-0 right-0 z-20 border-gray-300">
         {/* New top bar */}
        <div className="hidden lg:flex flex-row flex-nowrap justify-between items-center px-2 sm:px-4 py-1 text-xs text-gray-700 border-b border-gray-300">
          <div className="flex ml-2 flex-nowrap space-x-1 sm:space-x-2 md:space-x-6 text-xs">
            {menuItems.map((item, idx) =>
              item.submenu ? (
                <div key={idx} className="relative group">
                 {/*  <button className="hover:text-blue-600 cursor-pointer">
                    {item.label} ▼
                  </button> */}
                  <div className="absolute left-0 top-full bg-white border border-gray-300 rounded shadow-md mt-1 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-opacity duration-300 z-30 min-w-max">
                    {item.submenu.map((subitem, subidx) => (
                      <Link key={subidx} href={subitem.href} className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap">
                        {subitem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link key={idx} href={item.href} className="hover:text-blue-600 normal-case">
                  {item.label}
                </Link>
              )
            )}
          </div>
         <div className="text-xs sm:text-sm flex items-center space-x-3">

  {/* Hotline */}
  <div className="flex items-center space-x-1">
    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h1l2 5h13"></path>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 16a2 2 0 11-4 0 2 2 0 014 0z"></path>
    </svg>
    <span>24/7 Hotline +8809610-818888</span>
  </div>

  {/* Language Switch */}
  <div className="flex items-center gap-1">
    <button
      onClick={() => changeLanguage("en")}
      className={`px-2 py-1 rounded text-xs font-semibold transition ${
        language === "en"
          ? "bg-blue-600 text-white"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
    >
      EN
    </button>

    <button
      onClick={() => changeLanguage("bn")}
      className={`px-2 py-1 rounded text-xs font-semibold transition ${
        language === "bn"
          ? "bg-blue-600 text-white"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
    >
      বাংলা
    </button>
  </div>

</div>

        </div>

        {/* Main navigation */}
        <nav className="flex items-center justify-center px-2 sm:px-4 lg:px-6 py-3 bg-gray-100 shadow-md z-50 mt-0 relative">
          <div className="flex items-center justify-between w-full max-w-7xl">
            <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
              <Image
                src="https://banner2.cleanpng.com/20180605/jwr/kisspng-computer-icons-interview-engineering-hospita-5b166644787189.9441098015281946284934.jpg"
                alt="Hospital"
                width={32}
                height={32}
                unoptimized
                className="h-6 w-auto lg:h-8"
              />
              <span className="text-xs md:text-sm text-blue-500 uppercase tracking-widest font-bold">
  Medical Center</span>
            </Link>

            {/* Desktop menu */}
           <ul className="hidden lg:flex space-x-3 text-xs text-gray-700 font-medium">
              {mainMenuItems.map((item, idx) =>
                item.submenu ? (
                  <li key={idx} className="relative group">
                    
                    <button className="cursor-pointer">
          <NavButton>
            {item.label} ▼
          </NavButton>
        </button>
                    <ul className="absolute left-0 top-full bg-white border border-gray-300 rounded shadow-md mt-1 hidden group-hover:block z-10 min-w-max">
                      {item.submenu.map((subitem, subidx) => (
                        <li key={subidx}>
                          <Link href={subitem.href} className="block px-4 py-2 text-sm hover:bg-gray-100 whitespace-nowrap">
                            {subitem.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ) : (
                  <li key={idx}>
                    <Link href={item.href} >
                      <NavButton>
            {item.label}
          </NavButton>
                    </Link>
                  </li>
                )
              )}
            </ul>

           {/* Mobile toggle button */}
<button
  onClick={() => setMobileMenuOpen(true)}
  className="lg:hidden p-2 rounded-xl 
  bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 
  text-white shadow-[0_4px_16px_rgba(0,180,255,0.35)] 
  active:scale-60 transition-all duration-150"
>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    {/* Outer Scan Ring */}
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="currentColor"
      strokeWidth="1.3"
      opacity="0.6"
    />

    {/* Pulse Line */}
    <path
      d="M4 12h3l2-3 3 6 2-3h4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Center Dot */}
    <circle cx="12" cy="12" r="1.2" fill="currentColor" />
  </svg>
</button>





</div>
{/* Mobile Overlay - Premium Animation */}
{/* Premium Glass Overlay */}
<div
  className={`fixed inset-0 z-40 transition-all duration-500 ${
    mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
  }`}
  onClick={closeMenu}
  style={{
    backdropFilter: "blur(18px) saturate(160%)",
    WebkitBackdropFilter: "blur(18px) saturate(160%)",
    background:
      "linear-gradient(135deg, rgba(10,20,40,0.55), rgba(20,40,80,0.35))",
  }}
/>

{/* Premium Mobile Drawer - Spring Animation */}
<div
  ref={drawerRef}
  className={`fixed top-0 right-0 h-full w-[85%] max-w-sm z-50 rounded-l-[32px]
  transform transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)]
  ${mobileMenuOpen ? "translate-x-0 opacity-100 scale-100" : "translate-x-full opacity-80 scale-95"}`}
  style={{
    backdropFilter: "blur(24px) saturate(180%)",
    WebkitBackdropFilter: "blur(24px) saturate(180%)",
    background:
      "linear-gradient(160deg, rgba(255,255,255,0.75), rgba(255,255,255,0.35))",
    borderLeft: "1px solid rgba(255,255,255,0.4)",
    boxShadow:
      "-40px 0 80px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.2)",
  }}
>
{/* Header with premium animation */}
  <div
  className="flex items-center justify-between px-6 py-5 text-white rounded-tl-[32px] relative overflow-hidden"
  style={{
    background:
      "linear-gradient(135deg, rgba(0,140,255,0.85), rgba(0,200,255,0.55))",
    backdropFilter: "blur(12px)",
  }}
>
    {/* Animated shine effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000" />
    <div className="relative z-10">
      <h3 className="font-bold text-lg">Medical Center</h3>
      <p className="text-xs opacity-90">Premium Healthcare</p>
    </div>
    <button
      onClick={closeMenu}
      className="p-2 rounded-full bg-white/20 hover:bg-white/40 transition-all duration-300 hover:rotate-90 active:scale-95"
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>

  {/* Language Switch */}
  <div className="flex justify-center gap-3 py-3 border-b">
    <button
      onClick={() => changeLanguage("en")}
      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
        language === "en"
          ? "bg-blue-600 text-white shadow"
          : "bg-gray-200 text-gray-700"
      }`}
    >
      EN
    </button>
    <button
      onClick={() => changeLanguage("bn")}
      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
        language === "bn"
          ? "bg-blue-600 text-white shadow"
          : "bg-gray-200 text-gray-700"
      }`}
    >
      বাংলা
    </button>
  </div>

{/* Menu Content with staggered animations */}
  <div className="h-[calc(100%-120px)] overflow-y-auto px-4 py-4 space-y-2">

    {mainMenuItems.map((item, idx) =>
      item.submenu ? (
        <div
          key={idx}
         className="rounded-2xl overflow-hidden backdrop-blur-lg border border-white/40 shadow-[0_10px_40px_rgba(0,0,0,0.15)] bg-white/40 hover:bg-white/60 transition-all duration-300"
          style={{
            animation: mobileMenuOpen ? `slideInLeft 0.4s ease-out ${idx * 0.05}s both` : 'none',
          }}
        >
          <button
            onClick={() => toggleSubmenu(idx)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 transition-all duration-300 hover:pl-5 active:scale-[0.98]"
          >
            <span className="transition-transform duration-300">{item.label}</span>
            <svg
              className={`w-4 h-4 transition-all duration-300 ${
                openSubmenu === idx ? "rotate-180 scale-110" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </button>

          <div
            className={`transition-all duration-400 ease-out ${
              openSubmenu === idx ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            } overflow-hidden`}
          >

           <div className="flex flex-col bg-white border-t max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100">

              {item.submenu.map((subitem, subidx) => (
                <Link
                  key={subidx}
                  href={subitem.href}
                  onClick={closeMenu}
                  className="px-5 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:pl-6 transition-all duration-200 border-l-2 border-transparent hover:border-blue-500"
                >
                  {subitem.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Link
          key={idx}
          href={item.href}
          onClick={closeMenu}
         className="block px-4 py-3 rounded-xl text-sm font-semibold text-gray-900 backdrop-blur-md bg-white/40 border border-white/40 hover:bg-white/70 hover:shadow-lg transition-all duration-300 hover:scale-[1.03]"
          style={{
            animation: mobileMenuOpen ? `slideInLeft 0.4s ease-out ${idx * 0.05}s both` : 'none',
          }}
        >
          {item.label}
        </Link>
      )
    )}

    {/* Hotline Card with pulse animation */}
    <div 
      className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600
shadow-[0_10px_40px_rgba(0,120,255,0.4)] text-white shadow-lg relative overflow-hidden group"
      style={{
        animation: mobileMenuOpen ? `slideInLeft 0.4s ease-out ${mainMenuItems.length * 0.05}s both` : 'none',
      }}
    >
      {/* Animated pulse rings */}
      <div className="absolute inset-0 bg-white/20 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-700 ease-out" />
      <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
      <div className="relative z-10">
        <p className="text-xs opacity-90">24/7 Emergency Hotline</p>
        <h4 className="text-lg font-bold mt-1">+8809610-818888</h4>
      </div>
    </div>
  </div>
</div>
        </nav>
      </header>
    </>
  );
}
