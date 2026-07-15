import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../utils/translations";

const NavButton = ({ children }) => (
  <span className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-600 p-[1px] text-xs font-semibold text-slate-900 shadow-[0_10px_24px_rgba(14,165,233,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:text-white">
    <span className="relative rounded-[11px] bg-white px-2.5 py-2 leading-5 transition-all duration-300 group-hover:bg-transparent">
      {children}
    </span>
  </span>
);

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const drawerVariants = {
  hidden: { x: "108%", opacity: 0.85, scale: 0.96 },
  visible: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    x: "108%",
    opacity: 0.85,
    scale: 0.96,
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
  },
};

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 22, y: 8 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};

const submenuVariants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  },
};

// Memoized menu items to prevent re-creation
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
        label: t.forDoctors,
        href: "#",
        submenu: [
          { label: "Doctor Info 1", href: "/for-doctors/info1" },
          { label: "Doctor Info 2", href: "/for-doctors/info2" },
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

export default function Navbar() {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, changeLanguage } = useLanguage();
  const { menuItems, mainMenuItems } = useMenuItems();

  // Memoized handlers
  const closeMenu = useCallback(() => {
    setMobileMenuOpen(false);
    setOpenSubmenu(null);
  }, []);

  const toggleSubmenu = useCallback((index) => {
    setOpenSubmenu((current) => (current === index ? null : index));
  }, []);

  // Optimized resize handler with debounce
  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (window.innerWidth >= 1024) {
          setMobileMenuOpen(false);
          setOpenSubmenu(null);
        }
      }, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Optimized body overflow control
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

  // Memoized mobile menu to prevent re-renders
  const mobileMenu = useMemo(() => (
    <AnimatePresence mode="wait">
      {mobileMenuOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close menu overlay"
            className="fixed inset-0 z-40 border-0 p-0"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            onClick={closeMenu}
            style={{
              backdropFilter: "blur(18px) saturate(140%)",
              WebkitBackdropFilter: "blur(18px) saturate(140%)",
              background:
                "linear-gradient(135deg, rgba(5, 15, 35, 0.72), rgba(9, 74, 122, 0.36) 58%, rgba(34, 197, 94, 0.16))",
            }}
          />

          <motion.aside
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={drawerVariants}
            className="fixed right-0 top-0 z-50 h-full w-[min(88vw,390px)] overflow-hidden rounded-l-[34px] border-l border-white/20"
            style={{
              background:
                "linear-gradient(180deg, rgba(8, 18, 36, 0.92), rgba(11, 39, 66, 0.9) 36%, rgba(15, 79, 111, 0.84) 100%)",
              boxShadow:
                "-36px 0 90px rgba(2, 6, 23, 0.42), inset 1px 0 0 rgba(255, 255, 255, 0.14)",
              backdropFilter: "blur(28px) saturate(145%)",
              WebkitBackdropFilter: "blur(28px) saturate(145%)",
            }}
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -left-20 top-8 h-40 w-40 rounded-full bg-cyan-400/18 blur-3xl" />
              <div className="absolute right-[-60px] top-28 h-52 w-52 rounded-full bg-emerald-300/14 blur-3xl" />
              <div className="absolute bottom-20 left-6 h-44 w-44 rounded-full bg-blue-500/18 blur-3xl" />
              <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_34%,rgba(255,255,255,0.07)_100%)]" />
              <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:18px_18px]" />
            </div>

            <div className="relative flex h-full flex-col">
              <div className="border-b border-white/12 px-5 pb-5 pt-6">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-100/90">
                      WELCOME
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-white">MEDICAL CENTRE HOSPITAL</h3>
                    <p className="mt-1 max-w-xs text-sm leading-6 text-slate-200/78">
                     
                    </p>
                  </div>

                  <button
                    onClick={closeMenu}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/16 bg-white/10 text-white transition-all duration-300 hover:rotate-90 hover:bg-white/16 active:scale-95"
                    aria-label="Close menu"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-[1fr_auto] gap-3 rounded-[26px] border border-white/12 bg-white/[0.07] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                  <div className="min-w-0 rounded-[20px] bg-gradient-to-r from-cyan-400/14 via-white/8 to-emerald-300/14 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-100/75">Emergency Hotline</p>
                    <a
                      href="tel:+8809610818888"
                      className="mt-1 inline-flex items-center text-base font-semibold text-white transition-colors hover:text-cyan-200"
                    >
                      +8809610-818888
                    </a>
                  </div>

                  <div className="flex items-center gap-2 rounded-[20px] border border-white/12 bg-slate-950/20 p-1.5">
                    <button
                      onClick={() => changeLanguage("en")}
                      className={`rounded-2xl px-3 py-2 text-xs font-semibold transition-all duration-300 ${
                        language === "en"
                          ? "bg-white text-slate-900 shadow-[0_10px_18px_rgba(255,255,255,0.2)]"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => changeLanguage("bn")}
                      className={`rounded-2xl px-3 py-2 text-xs font-semibold transition-all duration-300 ${
                        language === "bn"
                          ? "bg-cyan-300 text-slate-950 shadow-[0_10px_18px_rgba(34,211,238,0.28)]"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      BN
                    </button>
                  </div>
                </div>
              </div>

              <motion.div
                className="relative flex-1 overflow-y-auto px-4 pb-6 pt-4"
                initial="hidden"
                animate="visible"
                variants={listVariants}
              >
                <div className="space-y-3">
                  {mainMenuItems.map((item, idx) =>
                    item.submenu ? (
                      <motion.div
                        key={idx}
                        variants={itemVariants}
                        className="overflow-hidden rounded-[28px] border border-white/12 bg-white/[0.08] shadow-[0_18px_44px_rgba(8,15,30,0.28)] backdrop-blur-2xl"
                      >
                        <button
                          onClick={() => toggleSubmenu(idx)}
                          className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition-all duration-300 hover:bg-white/[0.05]"
                          aria-expanded={openSubmenu === idx}
                        >
                          <div>
                            <p className="text-base font-semibold text-white">{item.label}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.28em] text-cyan-100/60">
                              {item.submenu.length} links
                            </p>
                          </div>

                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-2xl border border-white/12 bg-white/10 text-white transition-all duration-300 ${
                              openSubmenu === idx ? "rotate-180 bg-cyan-300/18 text-cyan-100" : ""
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
                              <div className="mx-3 mb-3 space-y-2 rounded-[22px] border border-white/10 bg-slate-950/18 p-2.5">
                                {item.submenu.map((subitem, subidx) => (
                                  <motion.div
                                    key={subidx}
                                    initial={{ opacity: 0, x: 14 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 8 }}
                                    transition={{ delay: subidx * 0.02, duration: 0.2 }}
                                  >
                                    <Link
                                      href={subitem.href}
                                      onClick={closeMenu}
                                      className="group flex items-center justify-between gap-3 rounded-[18px] border border-transparent bg-white/[0.04] px-4 py-3 text-sm text-slate-100/90 transition-all duration-300 hover:border-cyan-300/30 hover:bg-white/[0.08] hover:text-white"
                                    >
                                      <span className="leading-5">{subitem.label}</span>
                                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/8 text-cyan-200 transition-transform duration-300 group-hover:translate-x-0.5">
                                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                      </span>
                                    </Link>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ) : (
                      <motion.div key={idx} variants={itemVariants}>
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          className="group flex items-center justify-between rounded-[26px] border border-white/12 bg-white/[0.08] px-4 py-4 text-white shadow-[0_18px_44px_rgba(8,15,30,0.28)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.11]"
                        >
                          <div>
                            <p className="text-base font-semibold">{item.label}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.28em] text-cyan-100/60">Direct access</p>
                          </div>

                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300/20 via-white/10 to-emerald-300/20 text-cyan-100 transition-transform duration-300 group-hover:translate-x-1">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </Link>
                      </motion.div>
                    )
                  )}
                </div>

                <motion.div variants={itemVariants} className="mt-4">
                  <div className="relative overflow-hidden rounded-[30px] border border-cyan-200/18 bg-gradient-to-br from-cyan-400/24 via-sky-500/18 to-emerald-300/18 p-4 shadow-[0_22px_48px_rgba(8,15,30,0.34)]">
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.16),rgba(255,255,255,0)_46%)]" />
                    <div className="relative">
                      <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-50/75">Need care fast?</p>
                      <h4 className="mt-2 text-lg font-semibold text-white">Book an appointment in one tap.</h4>
                      <p className="mt-1 max-w-xs text-sm leading-6 text-slate-100/80">
                        Reach the right department quickly with a calmer, cleaner mobile experience.
                      </p>
                      <Link
                        href="/appointment"
                        onClick={closeMenu}
                        className="mt-4 inline-flex items-center justify-center rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition-transform duration-300 hover:translate-x-1"
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
  ), [mobileMenuOpen, mainMenuItems, language, openSubmenu, closeMenu, toggleSubmenu, changeLanguage]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-20 items-center justify-between border-b border-gray-300 bg-gray-100">
        <div className="hidden flex-row flex-nowrap items-center justify-between border-b border-gray-300 px-2 py-1 text-xs text-gray-700 lg:flex sm:px-4">
          <div className="ml-2 flex flex-nowrap space-x-1 text-xs sm:space-x-2 md:space-x-6">
            {menuItems.map((item, idx) =>
              item.submenu ? (
                <div key={idx} className="group relative">
                  <div className="invisible absolute left-0 top-full z-30 mt-1 min-w-max rounded border border-gray-300 bg-white opacity-0 shadow-md transition-opacity duration-300 group-hover:visible group-hover:opacity-100">
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
                <Link key={idx} href={item.href} className="normal-case hover:text-blue-600">
                  {item.label}
                </Link>
              )
            )}
          </div>

          <div className="flex items-center space-x-3 text-xs sm:text-sm">
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
                className={`rounded px-2 py-1 text-xs font-semibold transition ${
                  language === "en" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                EN
              </button>

              <button
                onClick={() => changeLanguage("bn")}
                className={`rounded px-2 py-1 text-xs font-semibold transition ${
                  language === "bn" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                BN
              </button>
            </div>
          </div>
        </div>

        <nav className="relative z-50 mt-0 flex items-center justify-center bg-gray-100 px-2 shadow-md sm:px-2 lg:px-5">
          <div className="flex w-full max-w-7xl items-center justify-between">
            <Link href="/" className="flex flex-shrink-0 items-center space-x-0">
              <Image
                src="/logo.jpg"
                alt="Hospital"
                width={32}
                height={32}
                unoptimized
                className="mx-[-9] h-22 w-74 lg:mt-[-8] lg:h-24"
              />
            </Link>

            <ul className="hidden space-x-3 text-xs font-medium text-gray-700 lg:flex">
              {mainMenuItems.map((item, idx) =>
                item.submenu ? (
                  <li key={idx} className="group relative">
                    <button className="cursor-pointer">
                      <NavButton>{item.label} ▼</NavButton>
                    </button>
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

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-sky-500 to-cyan-300 p-2.5 text-white shadow-[0_14px_32px_rgba(14,165,233,0.38)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(14,165,233,0.42)] active:scale-95 lg:hidden"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.45),transparent_52%)] opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
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

          {mobileMenu}
        </nav>
      </header>
    </>
  );
}