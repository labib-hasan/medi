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

// Memoized Submenu Item component
const SubmenuItem = memo(({ subitem, closeMenu }) => (
  <motion.div
    initial={{ opacity: 0, x: 10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 5 }}
    transition={{ duration: 0.15 }}
  >
    <Link
      href={subitem.href}
      onClick={closeMenu}
      className="flex items-center justify-between rounded-xl border border-transparent bg-white/5 px-4 py-2.5 text-sm text-slate-100/90 transition-all duration-200 hover:border-cyan-300/30 hover:bg-white/10 hover:text-white"
    >
      <span>{subitem.label}</span>
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-cyan-200 transition-transform duration-200 group-hover:translate-x-0.5">
        <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </Link>
  </motion.div>
));

SubmenuItem.displayName = 'SubmenuItem';

// Memoized Menu Item component
const MenuItem = memo(({ item, idx, openSubmenu, toggleSubmenu, closeMenu }) => {
  if (item.submenu) {
    return (
      <motion.div
        variants={itemVariants}
        className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
      >
        <button
          onClick={() => toggleSubmenu(idx)}
          className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-all duration-200 hover:bg-white/5"
          aria-expanded={openSubmenu === idx}
        >
          <div>
            <p className="text-base font-semibold text-white">{item.label}</p>
            <p className="mt-0.5 text-[10px] uppercase tracking-wider text-cyan-100/60">
              {item.submenu.length} links
            </p>
          </div>
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-all duration-200 ${
              openSubmenu === idx ? "rotate-180 bg-cyan-300/10 text-cyan-100" : ""
            }`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </button>

        <AnimatePresence initial={false}>
          {openSubmenu === idx && (
            <motion.div
              key={`submenu-${idx}`}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              variants={submenuVariants}
              className="overflow-hidden"
            >
              <div className="mx-3 mb-3 space-y-1.5 rounded-xl bg-black/20 p-2">
                {item.submenu.map((subitem, subidx) => (
                  <SubmenuItem key={subidx} subitem={subitem} closeMenu={closeMenu} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div variants={itemVariants}>
      <Link
        href={item.href}
        onClick={closeMenu}
        className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10"
      >
        <div>
          <p className="text-base font-semibold">{item.label}</p>
          <p className="mt-0.5 text-[10px] uppercase tracking-wider text-cyan-100/60">Direct access</p>
        </div>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300/20 to-emerald-300/20 text-cyan-100 transition-transform duration-200 group-hover:translate-x-0.5">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </Link>
    </motion.div>
  );
});

MenuItem.displayName = 'MenuItem';

export default function Navbar() {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, changeLanguage } = useLanguage();
  const { menuItems, mainMenuItems } = useMenuItems();

  const closeMenu = useCallback(() => {
    setMobileMenuOpen(false);
    setOpenSubmenu(null);
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
                className="h-20 w-55 lg:h-24 lg:w-70"
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

            {/* Mobile Menu Button */}
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

          {/* Mobile Menu */}
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
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    background: "rgba(0, 0, 0, 0.6)",
                  }}
                />

                <motion.aside
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={drawerVariants}
                  className="fixed right-0 top-0 z-50 h-full w-[85vw] max-w-[360px] overflow-hidden rounded-l-3xl bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl"
                >
                  <div className="relative flex h-full flex-col">
                    {/* Header */}
                    <div className="border-b border-white/10 px-5 pb-4 pt-6">
                      <div className="mb-4 flex items-start justify-between">
                        <div>
                          <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-100/90">
                            WELCOME
                          </div>
                          <h3 className="text-lg font-bold text-white">MEDICAL CENTRE</h3>
                          <p className="text-xs text-slate-300/70">Quality care, always</p>
                        </div>

                        <button
                          onClick={closeMenu}
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-all duration-200 hover:rotate-90 hover:bg-white/10"
                          aria-label="Close menu"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2">
                        <div className="flex-1 rounded-lg bg-white/5 px-3 py-2">
                          <p className="text-[10px] uppercase tracking-wider text-cyan-100/75">Emergency</p>
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
                                ? "bg-cyan-300 text-slate-900"
                                : "text-white/70 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            BN
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <motion.div
                      className="flex-1 overflow-y-auto px-4 pb-4 pt-3"
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

                      {/* Bottom CTA */}
                      <motion.div variants={itemVariants} className="mt-3">
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/20 via-sky-500/20 to-emerald-500/20 p-4">
                          <div className="relative">
                            <p className="text-[10px] uppercase tracking-wider text-cyan-50/75">Quick Access</p>
                            <h4 className="mt-1 text-base font-semibold text-white">Book Appointment</h4>
                            <p className="mt-0.5 text-sm text-slate-100/80">Get care in one tap</p>
                            <Link
                              href="/appointment"
                              onClick={closeMenu}
                              className="mt-3 inline-block rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-transform duration-200 hover:translate-x-1"
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
    </>
  );
}
