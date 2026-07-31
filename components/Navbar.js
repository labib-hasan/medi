import { useEffect, useState, useCallback, useMemo, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../utils/translations";

// Memoized NavButton component
const NavButton = memo(({ children }) => (
  <span className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-600 p-[1px] text-xs font-semibold text-slate-900 shadow-[0_10px_24px_rgba(14,165,233,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:text-white">
    <span className="relative rounded-[11px] bg-white px-2.5 py-2 leading-5 transition-all duration-200 group-hover:bg-transparent">
      {children}
    </span>
  </span>
));

NavButton.displayName = 'NavButton';

// Simplified variants for better performance
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const drawerVariants = {
  hidden: { x: "100%", opacity: 0.9 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    x: "100%",
    opacity: 0.9,
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
  },
};

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 15 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

const submenuVariants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.25, ease: "easeInOut" },
  },
};

// Memoized menu items
const useMenuItems = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return useMemo(() => ({
    menuItems: [
      { label: "FAQ", href: "/faq" },
      { label: t.appointment, href: "/appointment" },
      {
        label: t.specialities,
        href: "#",
        submenu: [
          { label: "ICU - Intensive Care Unit", href: "/specialities/icu" },
          { label: "CCU - Critical Care Unit", href: "/specialities/ccu" },
          { label: "Blood Bank", href: "/specialities/blood-bank" },
          { label: "Anesthesia", href: "/specialities/anesthesia" },
          { label: "HDU - High Dependency Unit", href: "/specialities/hdu" },
          { label: "SDU - Step Down Unit", href: "/specialities/sdu" },
          { label: "NICU - Neonatal ICU", href: "/specialities/nicu" },
          { label: "GYNAE - Gynecology", href: "/specialities/gynae" },
          { label: "PAEDI - Pediatric", href: "/specialities/paedi" },
          { label: "OT - Operation Theatre", href: "/specialities/ot" },
          { label: "ED - Emergency", href: "/specialities/ed" },
          { label: "Dialysis - Kidney Care", href: "/specialities/dialysis" },
        ],
      },
    ],
    mainMenuItems: [
      { label: t.home, href: "/" },
      {
        label: t.specialities,
        href: "#",
        submenu: [
          { label: "ICU", href: "/specialities/icu" },
          { label: "CCU", href: "/specialities/ccu" },
          { label: "Blood Bank", href: "/specialities/blood-bank" },
          { label: "Anesthesia", href: "/specialities/anesthesia" },
          { label: "HDU", href: "/specialities/hdu" },
          { label: "SDU", href: "/specialities/sdu" },
          { label: "NICU", href: "/specialities/nicu" },
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
          { label: "Our Story", href: "/stry" },
          { label: "Mission & Vision", href: "/msn" },
        ],
      },
      {
        label: t.departments,
        href: "#",
        submenu: [
          { label: "Medicine", href: "/departments/medicine" },
          { label: "Neuro Medicine", href: "/departments/neuro-medicine" },
          { label: "Neurosurgery", href: "/departments/neurosurgery" },
          { label: "Cardiology", href: "/departments/cardiology" },
          { label: "Gastroenterology", href: "/departments/gastroenterology" },
          { label: "Hepatology", href: "/departments/hepatology" },
          { label: "Hematology", href: "/departments/hematology" },
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
        label: t.directors,
        href: "#",
        submenu: [
          { label: "Director 1", href: "/directors/director-1" },
          { label: "Director 2", href: "/directors/director-2" },
        ],
      },
      { label: t.news, href: "/news" },
      { label: t.contact, href: "/contact" },
      {
        label: t.diagnosticService,
        href: "#",
        submenu: [
          { label: t.radiology, href: "/diagnostic/radiology" },
          { label: t.pathology, href: "/diagnostic/pathology" },
        ],
      },
    ]
  }), [language, t]);
};

// Memoized Submenu Item component - MFB style
const SubmenuItem = memo(({ subitem, closeMenu, index }) => (
  <motion.div
    initial={{ opacity: 0, x: 10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 5 }}
    transition={{ duration: 0.15, delay: index * 0.02 }}
    className="mfb-component__child-wrapper"
  >
    <Link
      href={subitem.href}
      onClick={closeMenu}
      className="mfb-component__child-link"
    >
      <span className="mfb-component__child-icon">✦</span>
      <span className="mfb-component__child-label">{subitem.label}</span>
    </Link>
  </motion.div>
));

SubmenuItem.displayName = 'SubmenuItem';

// Memoized Menu Item component - MFB style
const MenuItem = memo(({ item, idx, openSubmenu, toggleSubmenu, closeMenu }) => {
  if (item.submenu) {
    return (
      <motion.div
        variants={itemVariants}
        className="mfb-menu-item"
      >
        <button
          onClick={() => toggleSubmenu(idx)}
          className={`mfb-menu-item__button ${openSubmenu === idx ? 'active' : ''}`}
          aria-expanded={openSubmenu === idx}
        >
          <span className="mfb-menu-item__label">{item.label}</span>
          <span className={`mfb-menu-item__arrow ${openSubmenu === idx ? 'open' : ''}`}>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>

        <AnimatePresence initial={false}>
          {openSubmenu === idx && (
            <motion.div
              key={`submenu-${idx}`}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              variants={submenuVariants}
              className="mfb-submenu"
            >
              {item.submenu.map((subitem, subidx) => (
                <SubmenuItem 
                  key={subidx} 
                  subitem={subitem} 
                  closeMenu={closeMenu}
                  index={subidx}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div variants={itemVariants} className="mfb-menu-item">
      <Link
        href={item.href}
        onClick={closeMenu}
        className="mfb-menu-item__link"
      >
        <span className="mfb-menu-item__icon">▸</span>
        <span className="mfb-menu-item__label">{item.label}</span>
      </Link>
    </motion.div>
  );
});

MenuItem.displayName = 'MenuItem';

export default function Navbar() {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { language, changeLanguage } = useLanguage();
  const { menuItems, mainMenuItems } = useMenuItems();

  const closeMenu = useCallback(() => {
    setMobileMenuOpen(false);
    setOpenSubmenu(null);
    setIsHovering(false);
  }, []);

  const toggleSubmenu = useCallback((index) => {
    setOpenSubmenu((current) => (current === index ? null : index));
  }, []);

  // Handle resize
  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (window.innerWidth >= 1024) {
          setMobileMenuOpen(false);
          setOpenSubmenu(null);
        }
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Handle body scroll and escape key
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalOverflow || "";
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    if (mobileMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = originalOverflow || "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen, closeMenu]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-20 border-b border-gray-300 bg-gray-100">
        {/* Top Bar - Desktop */}
        <div className="hidden border-b border-gray-300 px-2 py-1 text-xs text-gray-700 lg:flex lg:px-4">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
            <div className="flex flex-nowrap space-x-1 sm:space-x-2 md:space-x-6">
              {menuItems.map((item, idx) =>
                item.submenu ? (
                  <div key={idx} className="group relative">
                    <button className="hover:text-blue-600">{item.label}</button>
                    <div className="invisible absolute left-0 top-full z-30 mt-1 min-w-max rounded border border-gray-300 bg-white opacity-0 shadow-md transition-all duration-200 group-hover:visible group-hover:opacity-100">
                      {item.submenu.map((subitem, subidx) => (
                        <Link
                          key={subidx}
                          href={subitem.href}
                          className="block whitespace-nowrap px-4 py-2 hover:bg-gray-100"
                        >
                          {subitem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link key={idx} href={item.href} className="hover:text-blue-600">
                    {item.label}
                  </Link>
                )
              )}
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h1l2 5h13" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 16a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>24/7 Hotline +8809610-818888</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => changeLanguage("en")}
                  className={`rounded px-2 py-1 text-xs font-semibold transition duration-200 ${
                    language === "en" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => changeLanguage("bn")}
                  className={`rounded px-2 py-1 text-xs font-semibold transition duration-200 ${
                    language === "bn" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  BN
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="relative z-50 bg-gray-100 px-2 shadow-md sm:px-2 lg:px-5">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
            <Link href="/" className="flex flex-shrink-0 items-center">
              <Image
                src="/logo.jpg"
                alt="Hospital"
                width={32}
                height={32}
                unoptimized
                className="h-22 w-55 lg:h-24 lg:w-70"
                priority
              />
            </Link>

            {/* Desktop Menu */}
            <ul className="hidden space-x-3 text-xs font-medium text-gray-700 lg:flex">
              {mainMenuItems.map((item, idx) =>
                item.submenu ? (
                  <li key={idx} className="group relative">
                    <NavButton>{item.label} ▼</NavButton>
                    <ul className="absolute left-0 top-full z-10 mt-1 hidden min-w-max rounded border border-gray-300 bg-white shadow-md group-hover:block">
                      {item.submenu.map((subitem, subidx) => (
                        <li key={subidx}>
                          <Link href={subitem.href} className="block whitespace-nowrap px-4 py-2 text-sm hover:bg-gray-100">
                            {subitem.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ) : (
                  <li key={idx}>
                    <Link href={item.href}>
                      <NavButton>{item.label}</NavButton>
                    </Link>
                  </li>
                )
              )}
            </ul>

            {/* Mobile Menu Button - MFB Style with Sky Blue Gradient */}
            <div className="lg:hidden">
              <div 
                className="mfb-component mfb-component--br relative"
                data-mfb-toggle="hover"
                data-mfb-state={mobileMenuOpen ? 'open' : 'closed'}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <button
              onClick={() => setMobileMenuOpen(true)}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-sky-500 to-cyan-300 p-2.5 text-white shadow-[0_14px_32px_rgba(14,165,233,0.38)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(14,165,233,0.42)] active:scale-95 lg:hidden"
              aria-label="Open menu"
            >
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.45),transparent_52%)] opacity-80 transition-opacity duration-200 group-hover:opacity-100" />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="relative z-10">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.3" opacity="0.6" />
                <path
                  d="M4 12h3l2-3 3 6 2-3h4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12" r="1.2" fill="currentColor" />
              </svg>
            </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu - MFB Style */}
          <AnimatePresence mode="wait">
            {mobileMenuOpen && (
              <>
                <motion.button
                  type="button"
                  aria-label="Close menu"
                  className="fixed inset-0 z-40 border-0 p-0"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={overlayVariants}
                  transition={{ duration: 0.2 }}
                  onClick={closeMenu}
                  style={{
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    background: "rgba(0, 0, 0, 0.5)",
                  }}
                />

                <motion.aside
  initial="hidden"
  animate="visible"
  exit="exit"
  variants={drawerVariants}
  className="fixed right-0 top-2 z-50 h-full w-[85vw] max-w-[380px] overflow-hidden rounded-l-3xl shadow-2xl"
   style={{
    background: "transparent",
    backdropFilter: "none",
    WebkitBackdropFilter: "none",
    boxShadow: "none", // optional
  }}
>
                  <div className="relative flex h-full flex-col">
                    {/* Header - MFB Style */}
                    <div
  className="border-b border-white/10 px-5 pb-4 pt-6 rounded-bl-3xl"
  style={{
    background: "#133d5d",
  }}
>
                      <div className="mb-4 flex items-start justify-between">
                        <div>
                          <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sky-300/90">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
                            WELCOME
                          </div>
                          <h3 className="text-lg font-bold text-white">MEDICAL CENTRE</h3>
                          <p className="text-xs text-slate-300/70">Quality care, always</p>
                        </div>

                        <button
                          onClick={closeMenu}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white transition-all duration-200 hover:rotate-90 hover:bg-white/10"
                          style={{
                            border: '1px solid rgba(255,255,255,0.1)',
                          }}
                          aria-label="Close menu"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="flex items-center gap-2 rounded-xl p-2"
  style={{
    background: "#133d5d",
    border: "1px solid rgba(255,255,255,0.08)",
  }}>
                        <div className="flex-1 rounded-lg bg-white/5 px-3 py-2">
                          <p className="text-[10px] uppercase tracking-wider text-sky-300/75">Emergency</p>
                          <a href="tel:+8809610818888" className="text-sm font-semibold text-white">
                            +880241355143
                          </a>
                        </div>
                        <div className="flex gap-1 rounded-lg bg-black/20 p-1">
                          <button
                            onClick={() => changeLanguage("en")}
                            className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition duration-200 ${
                              language === "en"
                                ? "bg-white text-slate-900"
                                : "text-white/70 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            EN
                          </button>
                          <button
                            onClick={() => changeLanguage("bn")}
                            className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition duration-200 ${
                              language === "bn"
                                ? "bg-sky-400 text-slate-900"
                                : "text-white/70 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            BN
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items - MFB Style */}
                    <motion.div
                      className="flex-1 overflow-y-auto px-4 pb-4 pt-3"
                      style={{ background: "transparent" }}
                      initial="hidden"
                      animate="visible"
                      variants={listVariants}
                    >
                      <div className="space-y-2">
                        {mainMenuItems.map((item, idx) => (
                          <MenuItem
                            key={idx}
                            item={item}
                            idx={idx}
                            openSubmenu={openSubmenu}
                            toggleSubmenu={toggleSubmenu}
                            closeMenu={closeMenu}
                          />
                        ))}
                      </div>

                      {/* Bottom CTA - MFB Style with Sky Blue Gradient */}
                      <motion.div variants={itemVariants} className="mt-3">
                       <div
  className="relative overflow-hidden rounded-2xl p-4"
  style={{
    background: "#133d5d",
    border: "1px solid rgba(255,255,255,0.08)",
  }}
>
                          <div className="relative">
                            <p className="text-[10px] uppercase tracking-wider text-sky-300/75">Quick Access</p>
                            <h4 className="mt-1 text-base font-semibold text-white">Book Appointment</h4>
                            <p className="mt-0.5 text-sm text-slate-100/80">Get care in one tap</p>
                            <Link
                              href="/appointment"
                              onClick={closeMenu}
                              className="mt-3 inline-block rounded-full bg-sky-600 hover:bg-sky-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors duration-200"
                              style={{
                                boxShadow: '0 4px 15px rgba(14,165,233,0.4)',
                              }}
                            >
                              {translations[language].appointment}
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* Global styles for MFB mobile menu */}
      <style jsx global>{`
        /* MFB Component Styles for Mobile Menu */
        .mfb-component {
          position: relative;
          z-index: 30;
        }

        .mfb-component__button--main {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .mfb-component__button--main-hover:hover {
          transform: scale(1.1) !important;
          box-shadow: 0 0 8px rgba(14, 165, 233, 0.5), 0 8px 16px rgba(14, 165, 233, 0.4) !important;
        }

        .mfb-component__main-icon--resting,
        .mfb-component__main-icon--active {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Menu Items */
        .mfb-menu-item {
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,.08);
  background: #133d5d;
  overflow: hidden;
  transition: all .2s ease;
}

        .mfb-menu-item:hover {
  background: #1a4d73;
  border-color: rgba(255,255,255,.15);
}

        .mfb-menu-item__button {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          text-align: left;
          color: white;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mfb-menu-item__button:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .mfb-menu-item__button.active {
          background: rgba(14, 165, 233, 0.15);
        }

        .mfb-menu-item__link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          color: white;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .mfb-menu-item__link:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #60a5fa;
        }

        .mfb-menu-item__label {
          font-size: 0.95rem;
          font-weight: 500;
          letter-spacing: 0.01em;
        }

        .mfb-menu-item__icon {
          color: rgba(255, 255, 255, 0.3);
          font-size: 0.75rem;
          transition: all 0.2s ease;
        }

        .mfb-menu-item__link:hover .mfb-menu-item__icon {
          color: #60a5fa;
          transform: translateX(3px);
        }

        .mfb-menu-item__arrow {
          display: flex;
          height: 32px;
          width: 32px;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.6);
          transition: all 0.3s ease;
        }

        .mfb-menu-item__arrow.open {
          background: rgba(14, 165, 233, 0.2);
          border-color: rgba(14, 165, 233, 0.3);
          color: #7dd3fc;
          transform: rotate(180deg);
        }

        .mfb-menu-item__button:hover .mfb-menu-item__arrow {
          background: rgba(255, 255, 255, 0.1);
        }

        /* Submenu */
        .mfb-submenu {
          overflow: hidden;
          background: rgba(0, 0, 0, 0.2);
          padding: 0.5rem 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .mfb-component__child-wrapper {
          margin-bottom: 0.375rem;
        }

        .mfb-component__child-wrapper:last-child {
          margin-bottom: 0;
        }

        .mfb-component__child-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.625rem 0.75rem;
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
          transition: all 0.2s ease;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid transparent;
        }

        .mfb-component__child-link:hover {
          background: rgba(14, 165, 233, 0.1);
          border-color: rgba(14, 165, 233, 0.15);
          color: white;
          transform: translateX(4px);
        }

        .mfb-component__child-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(14, 165, 233, 0.15);
          color: #7dd3fc;
          font-size: 12px;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .mfb-component__child-link:hover .mfb-component__child-icon {
          background: rgba(14, 165, 233, 0.25);
          transform: scale(1.1);
        }

        .mfb-component__child-label {
          font-size: 0.875rem;
          font-weight: 400;
        }

        /* Mobile responsive adjustments */
        @media (max-width: 480px) {
          .mfb-component__button--main {
            height: 48px !important;
            width: 48px !important;
          }
          
          .mfb-component__main-icon--resting,
          .mfb-component__main-icon--active {
            line-height: 48px !important;
            font-size: 20px !important;
          }
        }
      `}</style>
    </>
  );
}