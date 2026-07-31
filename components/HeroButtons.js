import Link from "next/link";
import { User, CalendarCheck, FileText, Headphones, Users } from "lucide-react";

export default function HeroButtons() {
  const buttons = [
    { title: "FIND A DOCTOR", icon: <User size={20} />, link: "/doctors" },
    { title: "REQUEST AN APPOINTMENT", icon: <CalendarCheck size={20} />, link: "/appointment" },
    { title: "ONLINE REPORT", icon: <FileText size={20} />, link: "/reports" },
    { title: "TELE-ONLINE", icon: <Headphones size={20} />, link: "/contact" },
    { title: "PATIENT & VISITORS GUIDE", icon: <Users size={20} />, link: "/patient-guide" },
  ];

  return (
    <div className="w-full max-w-7xl px-3 lg:px-4 lg:mb-10">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 lg:gap-4">
        {buttons.map((btn, index) => (
         <Link
  key={index}
  href={btn.link}
  className={`
    group relative overflow-hidden flex items-center
    gap-2 lg:gap-4
    p-3 lg:p-6
    bg-white shadow-lg rounded-3xl
    transition-all duration-500
    h-14 lg:h-20
    hover:-translate-y-1

    ${index === 4 ? "col-span-2 mx-auto w-[48%] lg:col-span-1 lg:w-full" : ""}
  `}
>
  {/* Blue slide background */}
  <span className="absolute inset-0 bg-blue-900 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />

  {/* Icon */}
 <div className=" relative z-10
    flex items-center justify-center
    w-10 h-10 lg:w-12 lg:h-12
    min-w-10 min-h-10
    lg:min-w-12 lg:min-h-12
    flex-shrink-0
    rounded-full
    bg-blue-900 text-white
    transition-all duration-500
    group-hover:bg-white
    group-hover:text-blue-900">
    {btn.icon}
    
  </div>

  {/* Text */}
  <span className="relative z-10 text-xs lg:text-sm font-semibold text-blue-900 leading-tight transition-colors duration-500 group-hover:text-white ">
    {btn.title}
  </span>
</Link>

        ))}
      </div>
    </div>
  );
}
