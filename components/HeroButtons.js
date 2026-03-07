import Link from "next/link";
import { User, CalendarCheck, FileText, Headphones, Users } from "lucide-react";

export default function HeroButtons() {
  const buttons = [
    { title: "FIND A DOCTOR", icon: <User size={28} />, link: "/doctors" },
    { title: "REQUEST AN APPOINTMENT", icon: <CalendarCheck size={28} />, link: "/appointment" },
    { title: "ONLINE REPORT", icon: <FileText size={28} />, link: "/reports" },
    { title: "TELE-ONLINE", icon: <Headphones size={28} />, link: "/contact" },
    { title: "PATIENT & VISITORS GUIDE", icon: <Users size={28} />, link: "/patient-guide" },
  ];

  return (
    <div className="absolute bottom-8 lg:bottom-4 left-1/2 -translate-x-1/2 z-20 w-full max-w-7xl px-4 mb-5px">
      <div className="grid lg:grid lg:grid-cols-5 grid-cols-2 md:grid-cols-5 lg:h-18 h-30 gap-4">
        {buttons.map((btn, index) => (
         <Link
  key={index}
  href={btn.link}
  className="group relative overflow-hidden flex items-center gap-4 p-6 bg-white shadow-lg rounded transition-all lg:h-full h-17 duration-500 hover:-translate-y-1"
>
  {/* Blue slide background */}
  <span className="absolute inset-0 bg-blue-900 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />

  {/* Icon */}
  <div className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full bg-blue-900 text-white transition-all duration-500 group-hover:bg-white group-hover:text-blue-900">
    {btn.icon}
  </div>

  {/* Text */}
  <span className="relative z-10 text-sm font-semibold text-blue-900 leading-tight transition-colors duration-500 group-hover:text-white">
    {btn.title}
  </span>
</Link>

        ))}
      </div>
    </div>
  );
}
