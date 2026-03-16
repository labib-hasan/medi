import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../utils/translations";

// Department data with translations
const departmentData = {
  "medicine": {
    title: { en: "Department of Medicine", bn: "মেডিসিন বিভাগ" },
    subtitle: { en: "Comprehensive Internal Medicine Healthcare Services", bn: "ব্যাপক অভ্যন্তরীণ চিকিৎসা স্বাস্থ্যসেবা" },
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200",
    intro: { en: "You have a fever and also a little pain in the chest for about a week. Everyone is saying to show the doctor. But do not understand which doctor you have to go to. The kind of doctors we go to in this kind of situation are the doctors of medicine. These reputable physicians treat patients by prescribing medications according to their condition, not in any specific field, and refer to the specialist doctor at a particular specialty. At Medical Center Chattagram, the eight best medicine specialists of Chittagong are providing treatment to patients with dedication and compassion.", bn: "আপনার জ্বর আছে এবং বুকে একটু ব্যথা প্রায় এক সপ্তাহ ধরে। সবাই বলছে ডাক্তারকে দেখাতে। কিন্তু বুঝতে পারছেন না কোন ডাক্তারের কাছে যেতে হবে। এই পরিস্থিতিতে আমরা যে ডাক্তারদের কাছে যাই তারা হলেন মেডিসিনের ডাক্তার। এই সম্মানিত চিকিৎসকরা তাদের অবস্থা অনুযায়ী ওষুধ প্রদান করে রোগীদের চিকিৎসা করেন এবং প্রয়োজনে বিশেষজ্ঞ ডাক্তারের কাছে রেফার করেন। মেডিকেল সেন্টার চট্টগ্রামে চট্টগ্রামের সেরা আটজন মেডিসিন বিশেষজ্ঞ নিষ্ঠা ও সহানুভূতির সাথে রোগীদের চিকিৎসা প্রদান করছেন।" },
    services: [
      { title: { en: "General Medicine", bn: "সাধারণ মেডিসিন" }, desc: { en: "Diagnosis and treatment of common illnesses, chronic diseases, and preventive healthcare for adults.", bn: "প্রাপ্তবয়স্কদের সাধারণ অসুস্থতা, দীর্ঘস্থায়ী রোগ এবং প্রতিরোধমূলক স্বাস্থ্যসেবার নির্ণয় ও চিকিৎসা।" } },
      { title: { en: "Diabetes & Endocrinology", bn: "ডায়াবেটিস ও এন্ডোক্রিনোলজি" }, desc: { en: "Specialized care for diabetes, thyroid disorders, and hormonal conditions.", bn: "ডায়াবেটিস, থাইরয়েড ব্যাধি এবং হরমোনাল অবস্থার বিশেষায়িত যত্ন।" } },
      { title: { en: "Infectious Diseases", bn: "সংক্রামক রোগ" }, desc: { en: "Expert management of infectious diseases including tropical diseases and COVID-19.", bn: "ট্রোপিক্যাল রোগ এবং COVID-19 সহ সংক্রামক রোগের বিশেষজ্ঞ ব্যবস্থাপনা।" } },
      { title: { en: "Rheumatology", bn: "রিউম্যাটোলজি" }, desc: { en: "Treatment of arthritis, autoimmune diseases, and musculoskeletal disorders.", bn: "আর্থ্রাইটিস, অটোইমিউন রোগ এবং মাস্কুলোস্কেলেটাল ব্যাধির চিকিৎসা।" } }
    ],
    facilities: { en: ["24/7 Emergency Medicine", "Inpatient Department", "Outpatient Services", "Diabetes Clinic", "Critical Care Support", "Laboratory Services", "Imaging & Diagnostics", "Pharmacy Services", "Health Check Packages"], bn: ["২৪/৭ জরুরি মেডিসিন", "ভর্তি বিভাগ", "বহির্বিভাগ সেবা", "ডায়াবেটিস ক্লিনিক", "ক্রিটিক্যাল কেয়ার সাপোর্ট", "ল্যাবরেটরি সেবা", "ইমেজিং ও ডায়াগনস্টিকস", "ফার্মেসি সেবা", "হেলথ চেক প্যাকেজ"] }
  },
  "cardiology": {
    title: { en: "Department of Cardiology", bn: "কার্ডিওলজি বিভাগ" },
    subtitle: { en: "Comprehensive Heart Care Services", bn: "ব্যাপক হৃদরোগ চিকিৎসা সেবা" },
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200",
    intro: { en: "Heart disease is one of the leading causes of death worldwide.", bn: "হৃদরোগ বিশ্বব্যাপী মৃত্যুর অন্যতম প্রধান কারণ।" },
    services: [
      { title: { en: "Interventional Cardiology", bn: "ইন্টারভেনশনাল কার্ডিওলজি" }, desc: { en: "Cardiac catheterization, angioplasty, and stent placement.", bn: "কার্ডিয়াক ক্যাথেটারাইজেশন, এনজিওপ্লাস্টি এবং স্টেন্ট প্লেসমেন্ট।" } },
      { title: { en: "Non-Invasive Cardiology", bn: "নন-ইনভেসিভ কার্ডিওলজি" }, desc: { en: "ECG, echocardiography, stress testing, and cardiac CT.", bn: "ECG, ইকোকার্ডিওগ্রাফি, স্ট্রেস টেস্টিং এবং কার্ডিয়াক CT।" } },
      { title: { en: "Heart Failure Management", bn: "হার্ট ফেইলিওর ম্যানেজমেন্ট" }, desc: { en: "Comprehensive care for chronic heart failure patients.", bn: "দীর্ঘস্থায়ী হৃদরোগীদের জন্য ব্যাপক যত্ন।" } },
      { title: { en: "Cardiac Surgery", bn: "কার্ডিয়াক সার্জারি" }, desc: { en: "CABG, valve surgery, and complex cardiac procedures.", bn: "CABG, ভালভ সার্জারি এবং জটিল কার্ডিয়াক পদ্ধতি।" } }
    ],
    facilities: { en: ["Cardiac Cath Lab", "CCU", "Echocardiography", "Treadmill Test", "Holter Monitoring", "Cardiac Rehab", "Structural Heart Program", "Heart Failure Clinic", "24/7 Cardiac Emergency"], bn: ["কার্ডিয়াক ক্যাথ ল্যাব", "CCU", "ইকোকার্ডিওগ্রাফি", "ট্রেডমিল টেস্ট", "হল্টার মনিটরিং", "কার্ডিয়াক রিহ্যাব", "স্ট্রাকচারাল হার্ট প্রোগ্রাম", "হার্ট ফেইলিওর ক্লিনিক", "২৪/৭ কার্ডিয়াক জরুরি"] }
  },
  "neuro-medicine": {
    title: { en: "Department of Neuro Medicine", bn: "নিউরো মেডিসিন বিভাগ" },
    subtitle: { en: "Advanced Neurological Care & Treatment", bn: "উন্নত নিউরোলজিক্যাল যত্ন ও চিকিৎসা" },
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200",
    intro: { en: "The brain and nervous system are the most complex parts of the human body.", bn: "মস্তিষ্ক এবং স্নায়ুতন্ত্র মানবদেহের সবচেয়ে জটিল অংশ।" },
    services: [
      { title: { en: "Neurology", bn: "নিউরোলজি" }, desc: { en: "Diagnosis and treatment of brain, spine, and nervous system disorders.", bn: "মস্তিষ্ক, মেরুদণ্ড এবং স্নায়ুতন্ত্রের ব্যাধির নির্ণয় ও চিকিৎসা।" } },
      { title: { en: "Stroke Management", bn: "স্ট্রোক ম্যানেজমেন্ট" }, desc: { en: "Emergency care and rehabilitation for stroke patients.", bn: "স্ট্রোক রোগীদের জরুরি যত্ন ও পুনর্বাসন।" } },
      { title: { en: "Epilepsy Treatment", bn: "এপিলেপসি চিকিৎসা" }, desc: { en: "Comprehensive care for epilepsy and seizure disorders.", bn: "এপিলেপসি এবং অনুরোধ ব্যাধির জন্য ব্যাপক যত্ন।" } },
      { title: { en: "Movement Disorders", bn: "মুভমেন্ট ডিসঅর্ডার" }, desc: { en: "Treatment for Parkinson's disease and other movement disorders.", bn: "পার্কিনসন্স রোগ এবং অন্যান্য মুভমেন্ট ডিসঅর্ডারের চিকিৎসা।" } }
    ],
    facilities: { en: ["Neuro ICU", "EEG Lab", "EMG/NCV Testing", "Stroke Unit", "Neurorehabilitation", "MRI/CT Imaging", "Sleep Lab", "Neurosurgery Support", "24/7 Emergency"], bn: ["নিউরো ICU", "EEG ল্যাব", "EMG/NCV টেস্টিং", "স্ট্রোক ইউনিট", "নিউরোরিহ্যাবিলিটেশন", "MRI/CT ইমেজিং", "স্লিপ ল্যাব", "নিউরোসার্জারি সাপোর্ট", "২৪/৭ জরুরি"] }
  },
  "gastroenterology": {
    title: { en: "Department of Gastroenterology", bn: "গ্যাস্ট্রোএন্টারোলজি বিভাগ" },
    subtitle: { en: "Advanced Digestive & Liver Care", bn: "উন্নত হজম ও লিভার যত্ন" },
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1200",
    intro: { en: "Digestive health is fundamental to overall well-being.", bn: "হজম স্বাস্থ্য সামগ্রিক সুস্থতার মূল ভিত্তি।" },
    services: [
      { title: { en: "Gastroenterology", bn: "গ্যাস্ট্রোএন্টারোলজি" }, desc: { en: "Diagnosis and treatment of digestive system disorders.", bn: "পাচনতন্ত্রের ব্যাধির নির্ণয় ও চিকিৎসা।" } },
      { title: { en: "Hepatology", bn: "হেপাটোলজি" }, desc: { en: "Liver disease management including hepatitis and cirrhosis.", bn: "হেপাটাইটিস এবং সিরোসিস সহ লিভার রোগ ব্যবস্থাপনা।" } },
      { title: { en: "Endoscopy", bn: "এন্ডোস্কোপি" }, desc: { en: "Gastroscopy, colonoscopy, and therapeutic endoscopy.", bn: "গ্যাস্ট্রোস্কোপি, কোলোনোস্কোপি এবং থেরাপিউটিক এন্ডোস্কোপি।" } },
      { title: { en: "Pancreatology", bn: "প্যাঙ্ক্রিওটোলজি" }, desc: { en: "Treatment of pancreatic disorders.", bn: "অগ্ন্যাশয়ের ব্যাধির চিকিৎসা।" } }
    ],
    facilities: { en: ["Endoscopy Suite", "ERCP", "Liver Clinic", "GI Lab", "Capsule Endoscopy", "Hepatology Unit", "Gastroenterology OPD", "24/7 Emergency", "Day Care"], bn: ["এন্ডোস্কোপি স্যুট", "ERCP", "লিভার ক্লিনিক", "GI ল্যাব", "ক্যাপসুল এন্ডোস্কোপি", "হেপাটোলজি ইউনিট", "গ্যাস্ট্রোএন্টারোলজি OPD", "২৪/৭ জরুরি", "ডে কেয়ার"] }
  },
  "ent": {
    title: { en: "Department of ENT", bn: "ENT বিভাগ" },
    subtitle: { en: "Ear, Nose, Throat & Head-Neck Surgery", bn: "কান, নাক, গলা ও মাথা-গলা সার্জারি" },
    image: "https://images.unsplash.com/photo-1584063366292-4c8e9f1a5c0e?w=1200",
    intro: { en: "Ear, Nose, and Throat disorders are extremely common.", bn: "কান, নাক এবং গলার ব্যাধি খুবই সাধারণ।" },
    services: [
      { title: { en: "Otology", bn: "অটোলজি" }, desc: { en: "Treatment of ear disorders, hearing loss, and balance problems.", bn: "কানের ব্যাধি, শ্রবণ ক্ষতি এবং ভারসাম্য সমস্যার চিকিৎসা।" } },
      { title: { en: "Rhinology", bn: "রাইনোলজি" }, desc: { en: "Management of nasal and sinus conditions.", bn: "নাক এবং সাইনাসের অবস্থা ব্যবস্থাপনা।" } },
      { title: { en: "Laryngology", bn: "ল্যারিংগোলজি" }, desc: { en: "Voice and throat disorder treatment.", bn: "কণ্ঠস্বর এবং গলার ব্যাধি চিকিৎসা।" } },
      { title: { en: "Head & Neck Surgery", bn: "মাথা ও গলা সার্জারি" }, desc: { en: "Surgical treatment of head and neck tumors.", bn: "মাথা এবং গলার টিউমারের শল্য চিকিৎসা।" } }
    ],
    facilities: { en: ["Audiology Lab", "Endoscopy Suite", "Otology OT", "Sinus Surgery", "Hearing Aid Center", "Sleep Apnea Clinic", "Vertigo Clinic", "Speech Therapy", "24/7 Emergency"], bn: ["অডিওলজি ল্যাব", "এন্ডোস্কোপি স্যুট", "অটোলজি OT", "সাইনাস সার্জারি", "হেয়ারিং এইড সেন্টার", "স্লিপ অ্যাপনা ক্লিনিক", "ভার্টিগো ক্লিনিক", "স্পিচ থেরাপি", "২৪/৭ জরুরি"] }
  },
  "gynee-obs": {
    title: { en: "Department of Gynecology & Obstetrics", bn: "গাইনি ও প্রসূতি বিভাগ" },
    subtitle: { en: "Complete Women's Healthcare", bn: "সম্পূর্ণ মহিলা স্বাস্থ্যসেবা" },
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200",
    intro: { en: "Women's healthcare needs special attention at every stage of life.", bn: "মহিলাদের স্বাস্থ্যসেবা জীবনের প্রতিটি পর্যায়ে বিশেষ মনোযোগ প্রয়োজন।" },
    services: [
      { title: { en: "Obstetrics", bn: "প্রসূতি" }, desc: { en: "Prenatal care, delivery, and postpartum care.", bn: "প্রসব পূর্ব যত্ন, প্রসব এবং প্রসব পরবর্তী যত্ন।" } },
      { title: { en: "Gynecology", bn: "গাইনোকোলজি" }, desc: { en: "Women's reproductive health services.", bn: "মহিলাদের প্রজনন স্বাস্থ্য সেবা।" } },
      { title: { en: "High-Risk Pregnancy", bn: "উচ্চ ঝুঁকিপূর্ণ গর্ভাবস্থা" }, desc: { en: "Specialized care for complicated pregnancies.", bn: "জটিল গর্ভাবস্থার জন্য বিশেষায়িত যত্ন।" } },
      { title: { en: "Fertility Treatment", bn: "ফার্টিলিটি চিকিৎসা" }, desc: { en: "IVF and reproductive medicine services.", bn: "IVF এবং প্রজনন চিকিৎসা সেবা।" } }
    ],
    facilities: { en: ["Labor & Delivery", "NICU", "Fetal Medicine Unit", "Gyne Oncology", "Laparoscopic Surgery", "IVF Center", "Antenatal Clinic", "Postnatal Care", "24/7 Emergency"], bn: ["লেবার ও ডেলিভারি", "NICU", "ফিটাল মেডিসিন ইউনিট", "গাইনি অনকোলজি", "ল্যাপারোস্কোপিক সার্জারি", "IVF সেন্টার", "এন্টেনেটাল ক্লিনিক", "পোস্টনেটাল কেয়ার", "২৪/৭ জরুরি"] }
  },
  "nephrology": {
    title: { en: "Department of Nephrology", bn: "নেফ্রোলজি বিভাগ" },
    subtitle: { en: "Comprehensive Kidney Care", bn: "ব্যাপক কিডনি যত্ন" },
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200",
    intro: { en: "Kidney diseases are often silent until they reach advanced stages.", bn: "কিডনি রোগ প্রায়ই উন্নত পর্যায়ে না পৌঁছানো পর্যন্ত নীরব থাকে।" },
    services: [
      { title: { en: "Nephrology", bn: "নেফ্রোলজি" }, desc: { en: "Kidney disease diagnosis and management.", bn: "কিডনি রোগ নির্ণয় ও ব্যবস্থাপনা।" } },
      { title: { en: "Dialysis", bn: "ডায়ালাইসিস" }, desc: { en: "Hemodialysis and peritoneal dialysis services.", bn: "হিমোডায়ালাইসিস এবং পেরিটোনিয়াল ডায়ালাইসিস সেবা।" } },
      { title: { en: "Kidney Transplantation", bn: "কিডনি ট্রান্সপ্লান্টেশন" }, desc: { en: "Pre and post-transplant care.", bn: "ট্রান্সপ্লান্ট পূর্ব ও পরবর্তী যত্ন।" } },
      { title: { en: "Hypertension", bn: "উচ্চ রক্তচাপ" }, desc: { en: "Blood pressure management and renal hypertension.", bn: "রক্তচাপ ব্যবস্থাপনা এবং রেনাল উচ্চ রক্তচাপ।" } }
    ],
    facilities: { en: ["Dialysis Center", "Kidney Transplant Unit", "Nephrology ICU", "CAPD Program", "AV Fistula Surgery", "Hypertension Clinic", "Urinalysis Lab", "24/7 Emergency", "Renal Nutrition"], bn: ["ডায়ালাইসিস সেন্টার", "কিডনি ট্রান্সপ্লান্ট ইউনিট", "নেফ্রোলজি ICU", "CAPD প্রোগ্রাম", "AV ফিস্টুলা সার্জারি", "হাইপারটেনশন ক্লিনিক", "ইউরিনালাইসিস ল্যাব", "২৪/৭ জরুরি", "রেনাল নিউট্রিশন"] }
  },
  "orthopedics": {
    title: { en: "Department of Orthopedics", bn: "অর্থোপেডিক্স বিভাগ" },
    subtitle: { en: "Bone, Joint & Trauma Care", bn: "হাড়, জয়েন্ট ও ট্রমা যত্ন" },
    image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=1200",
    intro: { en: "Bone and joint problems can severely affect mobility and quality of life.", bn: "হাড় এবং জয়েন্টের সমস্যা গতিশীলতা এবং জীবনের মানিকে গুরুতরভাবে প্রভাবিত করতে পারে।" },
    services: [
      { title: { en: "Orthopedic Surgery", bn: "অর্থোপেডিক সার্জারি" }, desc: { en: "Joint replacement, arthroscopy, and trauma surgery.", bn: "জয়েন্ট রিপ্লেসমেন্ট, আর্থ্রোস্কোপি এবং ট্রমা সার্জারি।" } },
      { title: { en: "Spine Surgery", bn: "স্পাইন সার্জারি" }, desc: { en: "Treatment of spinal disorders and injuries.", bn: "মেরুদণ্ডের ব্যাধি এবং আঘাতের চিকিৎসা।" } },
      { title: { en: "Sports Medicine", bn: "স্পোর্টস মেডিসিন" }, desc: { en: "Sports injury treatment and rehabilitation.", bn: "ক্রীড়া আঘাতের চিকিৎসা ও পুনর্বাসন।" } },
      { title: { en: "Pediatric Orthopedics", bn: "পেডিয়াট্রিক অর্থোপেডিক্স" }, desc: { en: "Children's bone and joint care.", bn: "শিশুদের হাড় ও জয়েন্ট যত্ন।" } }
    ],
    facilities: { en: ["Joint Replacement Center", "Spine Surgery OT", "Arthroscopy Suite", "Trauma Center", "Physiotherapy", "Sports Medicine", "Orthopedic Rehab", "24/7 Emergency", "Bone Density"], bn: ["জয়েন্ট রিপ্লেসমেন্ট সেন্টার", "স্পাইন সার্জারি OT", "আর্থ্রোস্কোপি স্যুট", "ট্রমা সেন্টার", "ফিজিওথেরাপি", "স্পোর্টস মেডিসিন", "অর্থোপেডিক রিহ্যাব", "২৪/৭ জরুরি", "বোন ডেনসিটি"] }
  },
  "oncology": {
    title: { en: "Department of Oncology", bn: "অনকোলজি বিভাগ" },
    subtitle: { en: "Comprehensive Cancer Care", bn: "ব্যাপক ক্যান্সার যত্ন" },
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200",
    intro: { en: "Cancer is a devastating diagnosis, but early detection can lead to cure.", bn: "ক্যান্সার একটি বিধ্বংসী রোগ নির্ণয়, তবে প্রারম্ভিক সনাক্তকরণ নিরাময়ে পরিচালিত করতে পারে।" },
    services: [
      { title: { en: "Medical Oncology", bn: "মেডিকেল অনকোলজি" }, desc: { en: "Chemotherapy and cancer medication treatment.", bn: "কেমোথেরাপি এবং ক্যান্সার ওষুধ চিকিৎসা।" } },
      { title: { en: "Radiation Oncology", bn: "রেডিয়েশন অনকোলজি" }, desc: { en: "Advanced radiation therapy for cancer.", bn: "ক্যান্সারের জন্য উন্নত রেডিয়েশন থেরাপি।" } },
      { title: { en: "Surgical Oncology", bn: "সার্জিক্যাল অনকোলজি" }, desc: { en: "Cancer removal and tumor surgery.", bn: "ক্যান্সার অপসারণ এবং টিউমার সার্জারি।" } },
      { title: { en: "Palliative Care", bn: "প্যালিয়েটিভ কেয়ার" }, desc: { en: "Pain management and quality of life care.", bn: "ব্যথা ব্যবস্থাপনা এবং জীবনের মানের যত্ন।" } }
    ],
    facilities: { en: ["Chemotherapy Day Care", "Linear Accelerator", "Brachytherapy", "PET-CT", "Oncology ICU", "Palliative Care", "Cancer Screening", "Genetic Counseling", "24/7 Emergency"], bn: ["কেমোথেরাপি ডে কেয়ার", "লিনিয়ার অ্যাক্সিলেরেটর", "ব্র্যাকিথেরাপি", "PET-CT", "অনকোলজি ICU", "প্যালিয়েটিভ কেয়ার", "ক্যান্সার স্ক্রিনিং", "জেনেটিক কাউন্সেলিং", "২৪/৭ জরুরি"] }
  },
  "psychiatry": {
    title: { en: "Department of Psychiatry", bn: "সাইকিয়াট্রি বিভাগ" },
    subtitle: { en: "Mental Health & Behavioral Sciences", bn: "মানসিক স্বাস্থ্য ও আচরণবিজ্ঞান" },
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200",
    intro: { en: "Mental health is as important as physical health.", bn: "মানসিক স্বাস্থ্য শারীরিক স্বাস্থ্যের মতোই গুরুত্বপূর্ণ।" },
    services: [
      { title: { en: "General Psychiatry", bn: "সাধারণ সাইকিয়াট্রি" }, desc: { en: "Diagnosis and treatment of mental disorders.", bn: "মানসিক ব্যাধির নির্ণয় ও চিকিৎসা।" } },
      { title: { en: "Child Psychiatry", bn: "শিশু সাইকিয়াট্রি" }, desc: { en: "Mental health services for children and adolescents.", bn: "শিশু এবং কিশোর-কিশোরীদের মানসিক স্বাস্থ্য সেবা।" } },
      { title: { en: "Addiction Treatment", bn: "আ্যডিকশন চিকিৎসা" }, desc: { en: "Drug and alcohol rehabilitation programs.", bn: "মাদক ও অ্যালকোহল পুনর্বাসন প্রোগ্রাম।" } },
      { title: { en: "Psychotherapy", bn: "সাইকোথেরাপি" }, desc: { en: "Individual and group therapy sessions.", bn: "ব্যক্তিগত এবং গ্রুপ থেরাপি সেশন।" } }
    ],
    facilities: { en: ["Inpatient Psychiatry", "ECT Therapy", "Psychology Lab", "Addiction Center", "Child Guidance", "Sleep Disorder Clinic", "Outpatient Clinic", "24/7 Crisis Line", "Rehabilitation"], bn: ["ইনপেশেন্ট সাইকিয়াট্রি", "ECT থেরাপি", "সাইকোলজি ল্যাব", "অ্যাডিকশন সেন্টার", "শিশু গাইডেন্স", "স্লিপ ডিসঅর্ডার ক্লিনিক", "আউটপেশেন্ট ক্লিনিক", "২৪/৭ ক্রাইসিস লাইন", "পুনর্বাসন"] }
  },
  "pediatrics": {
    title: { en: "Department of Pediatrics", bn: "পেডিয়াট্রিক্স বিভাগ" },
    subtitle: { en: "Comprehensive Child Healthcare", bn: "ব্যাপক শিশু স্বাস্থ্যসেবা" },
    image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=1200",
    intro: { en: "Children are not small adults; they have unique healthcare needs.", bn: "শিশুরা ছোট প্রাপ্তবয়স্ক নয়; তাদের অনন্য স্বাস্থ্যসেবার প্রয়োজনীয়তা রয়েছে।" },
    services: [
      { title: { en: "General Pediatrics", bn: "সাধারণ পেডিয়াট্রিক্স" }, desc: { en: "Comprehensive healthcare for infants and children.", bn: "শিশু এবং শিশুদের জন্য ব্যাপক স্বাস্থ্যসেবা।" } },
      { title: { en: "Pediatric ICU", bn: "পেডিয়াট্রিক ICU" }, desc: { en: "Critical care for seriously ill children.", bn: "গুরুতর অসুস্থ শিশুদের জন্য ক্রিটিক্যাল কেয়ার।" } },
      { title: { en: "Neonatology", bn: "নিওন্যাটোলজি" }, desc: { en: "Care for newborns and premature infants.", bn: "নবজাত এবং প্রিম্যাচার শিশুদের যত্ন।" } },
      { title: { en: "Pediatric Surgery", bn: "পেডিয়াট্রিক সার্জারি" }, desc: { en: "Surgical services for children.", bn: "শিশুদের জন্য শল্য চিকিৎসা সেবা।" } }
    ],
    facilities: { en: ["NICU", "Pediatric ICU", "Well Baby Clinic", "Vaccination Center", "Pediatric Emergency", "Child Development Center", "Neonatal Surgery", "24/7 Pediatric Care", "Ambulance Service"], bn: ["NICU", "পেডিয়াট্রিক ICU", "ওয়েল বেবি ক্লিনিক", "ভ্যাক্সিনেশন সেন্টার", "পেডিয়াট্রিক জরুরি", "শিশু ডেভেলপমেন্ট সেন্টার", "নিওনেটাল সার্জারি", "২৪/৭ পেডিয়াট্রিক কেয়ার", "অ্যাম্বুলেন্স সেবা"] }
  },
  "physical-medicine": {
    title: { en: "Department of Physical Medicine", bn: "ফিজিক্যাল মেডিসিন বিভাগ" },
    subtitle: { en: "Rehabilitation & Pain Management", bn: "পুনর্বাসন ও ব্যথা ব্যবস্থাপনা" },
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200",
    intro: { en: "Recovery from illness, injury, or surgery often requires rehabilitation.", bn: "অসুস্থতা, আঘাত বা অপারেশন থেকে সুস্থতা প্রায়ই পুনর্বাসন প্রয়োজন।" },
    services: [
      { title: { en: "Physiotherapy", bn: "ফিজিওথেরাপি" }, desc: { en: "Movement therapy and rehabilitation exercises.", bn: "মুভমেন্ট থেরাপি এবং পুনর্বাসন ব্যায়াম।" } },
      { title: { en: "Pain Management", bn: "ব্যথা ব্যবস্থাপনা" }, desc: { en: "Chronic pain treatment and intervention.", bn: "দীর্ঘস্থায়ী ব্যথা চিকিৎসা ও হস্তক্ষেপ।" } },
      { title: { en: "Occupational Therapy", bn: "অকুপেশনাল থেরাপি" }, desc: { en: "Rehabilitation for daily living skills.", bn: "দৈনন্দিন জীবন দক্ষতার জন্য পুনর্বাসন।" } },
      { title: { en: "Electrotherapy", bn: "ইলেক্ট্রোথেরাপি" }, desc: { en: "Modern pain relief treatments.", bn: "আধুনিক ব্যথা উপশম চিকিৎসা।" } }
    ],
    facilities: { en: ["Physiotherapy Gym", "Electrotherapy Unit", "Hydrotherapy", "Occupational Therapy", "Pain Clinic", "Sports Rehab", "Stroke Rehab", "Back Pain Center", "24/7 Emergency"], bn: ["ফিজিওথেরাপি জিম", "ইলেক্ট্রোথেরাপি ইউনিট", "হাইড্রোথেরাপি", "অকুপেশনাল থেরাপি", "পেইন ক্লিনিক", "স্পোর্টস রিহ্যাব", "স্ট্রোক রিহ্যাব", "ব্যাক পেইন সেন্টার", "২৪/৭ জরুরি"] }
  },
  "skin-vd": {
    title: { en: "Department of Skin & VD", bn: "স্কিন ও VD বিভাগ" },
    subtitle: { en: "Dermatology & Venereology Care", bn: "ডার্মাটোলজি ও ভেনেরিওলজি যত্ন" },
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200",
    intro: { en: "Skin is the largest organ of the body and reflects overall health.", bn: "ত্বক শরীরের বৃহত্তম অঙ্গ এবং সামগ্রিক স্বাস্থ্য প্রতিফলিত করে।" },
    services: [
      { title: { en: "Dermatology", bn: "ডার্মাটোলজি" }, desc: { en: "Skin disease diagnosis and treatment.", bn: "ত্বকের রোগ নির্ণয় ও চিকিৎসা।" } },
      { title: { en: "Cosmetology", bn: "কসমেটোলজি" }, desc: { en: "Skin aesthetic and cosmetic procedures.", bn: "ত্বকের সৌন্দর্য এবং প্রসাধন পদ্ধতি।" } },
      { title: { en: "Venereology", bn: "ভেনেরিওলজি" }, desc: { en: "Sexually transmitted infection treatment.", bn: "যৌন সংক্রমিত সংক্রমণের চিকিৎসা।" } },
      { title: { en: "Laser Therapy", bn: "লেজার থেরাপি" }, desc: { en: "Advanced laser treatments for skin conditions.", bn: "ত্বকের অবস্থার জন্য উন্নত লেজার চিকিৎসা।" } }
    ],
    facilities: { en: ["Dermatology OPD", "Cosmetology Center", "Laser Suite", "STI Clinic", "Skin Biopsy", "Cryotherapy", "Phototherapy", "Allergy Testing", "24/7 Emergency"], bn: ["ডার্মাটোলজি OPD", "কসমেটোলজি সেন্টার", "লেজার স্যুট", "STI ক্লিনিক", "স্কিন বায়োপসি", "ক্রায়োথেরাপি", "ফোটোথেরাপি", "অ্যালার্জি টেস্টিং", "২৪/৭ জরুরি"] }
  },
  "surgery": {
    title: { en: "Department of Surgery", bn: "সার্জারি বিভাগ" },
    subtitle: { en: "Comprehensive Surgical Services", bn: "ব্যাপক শল্য চিকিৎসা সেবা" },
    image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=1200",
    intro: { en: "Surgery is often the best treatment option for many conditions.", bn: "অনেক অবস্থার জন্য সার্জারি প্রায়ই সেরা চিকিৎসা বিকল্প।" },
    services: [
      { title: { en: "General Surgery", bn: "সাধারণ সার্জারি" }, desc: { en: "Abdominal and gastrointestinal surgery.", bn: "পেট এবং গ্যাস্ট্রোইনটেস্টাইনাল সার্জারি।" } },
      { title: { en: "Laparoscopic Surgery", bn: "ল্যাপারোস্কোপিক সার্জারি" }, desc: { en: "Minimally invasive surgical techniques.", bn: "ন্যূনতম আক্রমণাত্মক শল্য কৌশল।" } },
      { title: { en: "Vascular Surgery", bn: "ভাস্কুলার সার্জারি" }, desc: { en: "Blood vessel and circulation surgery.", bn: "রক্তনালী এবং রক্ত সংবহন সার্জারি।" } },
      { title: { en: "Trauma Surgery", bn: "ট্রমা সার্জারি" }, desc: { en: "Emergency surgical care for injuries.", bn: "আঘাতের জন্য জরুরি শল্য যত্ন।" } }
    ],
    facilities: { en: ["Main OT", "Laparoscopic OT", "Recovery Room", "Surgical ICU", "Pre-op Suite", "Post-op Care", "Day Surgery", "24/7 Emergency", "Ambulance"], bn: ["মেইন OT", "ল্যাপারোস্কোপিক OT", "রিকভারি রুম", "সার্জিক্যাল ICU", "প্রি-অপ স্যুট", "পোস্ট-অপ কেয়ার", "ডে সার্জারি", "২৪/৭ জরুরি", "অ্যাম্বুলেন্স"] }
  },
  "urology": {
    title: { en: "Department of Urology", bn: "ইউরোলজি বিভাগ" },
    subtitle: { en: "Comprehensive Urological Care", bn: "ব্যাপক ইউরোলজিক্যাল যত্ন" },
    image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=1200",
    intro: { en: "Urological problems can affect quality of life.", bn: "ইউরোলজিক্যাল সমস্যা জীবনের মান প্রভাবিত করতে পারে।" },
    services: [
      { title: { en: "Urology", bn: "ইউরোলজি" }, desc: { en: "Urinary tract and male reproductive system care.", bn: "মূত্রনালী এবং পুরুষ প্রজনন তন্ত্রের যত্ন।" } },
      { title: { en: "Endourology", bn: "এন্ডোইউরোলজি" }, desc: { en: "Minimally invasive urinary tract procedures.", bn: "ন্যূনতম আক্রমণাত্মক মূত্রনালী পদ্ধতি।" } },
      { title: { en: "Uro-Oncology", bn: "ইউরো-অনকোলজি" }, desc: { en: "Cancer treatment for urinary system.", bn: "মূত্রতন্ত্রের জন্য ক্যান্সার চিকিৎসা।" } },
      { title: { en: "Kidney Stone Management", bn: "কিডনি স্টোন ম্যানেজমেন্ট" }, desc: { en: "Stone removal and prevention treatment.", bn: "পাথর অপসারণ এবং প্রতিরোধ চিকিৎসা।" } }
    ],
    facilities: { en: ["Urology OT", "ESWL Unit", "Urodynamics Lab", "Laser Surgery", "Andrology Lab", "Stone Clinic", "Urology OPD", "24/7 Emergency", "Minor OT"], bn: ["ইউরোলজি OT", "ESWL ইউনিট", "ইউরোডায়নামিক্স ল্যাব", "লেজার সার্জারি", "অ্যান্ড্রোলজি ল্যাব", "স্টোন ক্লিনিক", "ইউরোলজি OPD", "২৪/৭ জরুরি", "মাইনর OT"] }
  }
};

// Department mapping from URL slug to standard department name
// MUST match exactly with DEPARTMENTS array in admin/doctors.js
const departmentMap = {
  "medicine": "Medicine",
  "cardiology": "Cardiology",
  "neuro-medicine": "Neuro Medicine",
  "gastroenterology": "Gastroenterology",
  "ent": "ENT",
  "gynee-obs": "Gynee & Obs.",  // Fixed: matches admin panel exactly
  "nephrology": "Nephrology",
  "orthopedics": "Orthopedics",
  "oncology": "Oncology",
  "psychiatry": "Psychiatry",
  "pediatrics": "Pediatrics",
  "physical-medicine": "Physical Medicine",
  "skin-vd": "Skin & VD",
  "surgery": "Surgery",
  "urology": "Urology"
};

// Extended fallback doctors for demonstration
const allFallbackDoctors = [
  { id: 1, name: "Prof. Dr. A. S. M. Zahed", specialization: "Senior Consultant", experience_years: 15, degrees: "MBBS, FCPS (Medicine)", designation: "Professor, Medicine", institute: "Chattogram Medical College", department: "Medicine", visiting_days: ["Sunday", "Tuesday", "Thursday"], visiting_time: "4.30 pm to 9 pm", room_no: "308", phone: "+880 1234 567890", serial_note: "Call our hotline" },
  { id: 2, name: "Dr. Sarah Khan", specialization: "Consultant", experience_years: 10, degrees: "MBBS, FCPS (Gynae)", designation: "Associate Professor", institute: "Chattogram Medical College", department: "Gynecology", visiting_days: ["Saturday", "Monday", "Wednesday"], visiting_time: "10 am to 4 pm", room_no: "405", phone: "+880 1234 567891", serial_note: "First come first serve" },
  { id: 3, name: "Dr. Rezaul Islam", specialization: "Specialist", experience_years: 8, degrees: "MBBS, MD (Cardiology)", designation: "Assistant Professor", institute: "National Heart Foundation", department: "Cardiology", visiting_days: ["Sunday", "Monday", "Tuesday", "Thursday"], visiting_time: "8 am to 12 pm", room_no: "201", phone: "+880 1234 567892", serial_note: "Emergency cases prioritized" },
  { id: 4, name: "Dr. Fatema Begum", specialization: "Senior Consultant", experience_years: 12, degrees: "MBBS, MD (Pediatrics)", designation: "Professor & Head", institute: "Chattogram Medical College", department: "Pediatrics", visiting_days: ["Saturday", "Sunday", "Monday"], visiting_time: "9 am to 3 pm", room_no: "108", phone: "+880 1234 567893", serial_note: "Specialized care for children" },
  { id: 5, name: "Dr. Mohammad Hossain", specialization: "Consultant", experience_years: 7, degrees: "MBBS, MS (Surgery)", designation: "Associate Professor", institute: "Chattogram Medical College", department: "Surgery", visiting_days: ["Sunday", "Monday", "Wednesday"], visiting_time: "5 pm to 9 pm", room_no: "502", phone: "+880 1234 567894", serial_note: "Online booking available" },
  { id: 6, name: "Dr. Aysha Rahman", specialization: "Specialist", experience_years: 6, degrees: "MBBS, FCPS (Neuro)", designation: "Assistant Professor", institute: "National Institute of Neuro Sciences", department: "Neuro Medicine", visiting_days: ["Tuesday", "Thursday", "Saturday"], visiting_time: "10 am to 2 pm", room_no: "310", phone: "+880 1234 567895", serial_note: "Referral required" },
  { id: 7, name: "Dr. Kamal Hossain", specialization: "Senior Consultant", experience_years: 18, degrees: "MBBS, MD (Nephrology)", designation: "Professor", institute: "Kidney Foundation", department: "Nephrology", visiting_days: ["Monday", "Wednesday", "Friday"], visiting_time: "3 pm to 7 pm", room_no: "215", phone: "+880 1234 567896", serial_note: "Dialysis patients priority" },
  { id: 8, name: "Dr. Lisa Ferdous", specialization: "Consultant", experience_years: 9, degrees: "MBBS, DGO (Obs & Gynae)", designation: "Associate Professor", institute: "Chattogram Medical College", department: "Gynecology", visiting_days: ["Sunday", "Tuesday", "Thursday"], visiting_time: "8 am to 2 pm", room_no: "412", phone: "+880 1234 567897", serial_note: "Normal delivery specialist" },
  { id: 9, name: "Dr. Ahmed Hassan", specialization: "Specialist", experience_years: 5, degrees: "MBBS, MD (Ortho)", designation: "Assistant Professor", institute: "National Orthopedic Hospital", department: "Orthopedics", visiting_days: ["Monday", "Tuesday", "Wednesday", "Thursday"], visiting_time: "9 am to 1 pm", room_no: "605", phone: "+880 1234 567898", serial_note: "Sports injury expert" }
];

const getDoctorImage = (id) =>
  `https://randomuser.me/api/portraits/${id % 2 === 0 ? "men" : "women"}/${(id * 17) % 90}.jpg`;

const formatTimeToAMPM = (timeString) => {
  if (!timeString || typeof timeString !== 'string') return '';

  // Replace periods with colons for consistency
  let normalized = timeString.replace(/(\d)\.(\d)/g, '$1:$2').trim();

  // Helper function to convert a single time to 12-hour format
  const convertTo12Hour = (timeStr) => {
    if (!timeStr) return '';

    // Extract hour, minute, and period
    const match = timeStr.match(/^(\d{1,2}):?(\d{2})?\s*(am|pm|AM|PM)?$/i);
    if (!match) return timeStr;

    let [, hourStr, minuteStr, period] = match;
    let hour = parseInt(hourStr);
    let minute = minuteStr || '00';

    // Ensure minute is 2 digits
    if (minute.length === 1) minute = '0' + minute;

    // If period is specified, use it
    if (period) {
      period = period.toUpperCase();
      if (period === 'AM' && hour === 12) hour = 0;
      if (period === 'PM' && hour !== 12) hour += 12;
      // Convert back to 12-hour for display
      if (hour === 0) return `12:${minute} AM`;
      if (hour < 12) return `${hour}:${minute} AM`;
      if (hour === 12) return `12:${minute} PM`;
      return `${hour - 12}:${minute} PM`;
    }

    // No period specified, assume 24-hour format
    if (hour === 0) return `12:${minute} AM`;
    if (hour === 12) return `12:${minute} PM`;
    if (hour < 12) return `${hour}:${minute} AM`;
    return `${hour - 12}:${minute} PM`;
  };

  // Check for time ranges (with various separators)
  const rangePatterns = [
    /(\d{1,2}:?\d*\s*(?:am|pm)?)\s*-\s*(\d{1,2}:?\d*\s*(?:am|pm)?)/i,
    /(\d{1,2}:?\d*\s*(?:am|pm)?)\s*to\s*(\d{1,2}:?\d*\s*(?:am|pm)?)/i,
    /(\d{1,2}:?\d*\s*(?:am|pm)?)\s*—\s*(\d{1,2}:?\d*\s*(?:am|pm)?)/i
  ];

  for (const pattern of rangePatterns) {
    const match = normalized.match(pattern);
    if (match) {
      const startTime = convertTo12Hour(match[1].trim());
      const endTime = convertTo12Hour(match[2].trim());
      return `${startTime} - ${endTime}`;
    }
  }

  // Single time
  return convertTo12Hour(normalized);
};

const getVisitingDaysArray = (days) => {
  if (!days) return [];
  if (typeof days === 'string') {
    try {
      days = JSON.parse(days);
    } catch {
      return [];
    }
  }
  return Array.isArray(days) ? days : [];
};

// Premium decorative elements with smoother animations
const FloatingParticle = ({ delay = 0, size = 4, left = "0%", top = "0%" }) => (
  <motion.div
    style={{
      position: "absolute",
      width: size,
      height: size,
      borderRadius: "50%",
      background: "rgba(59, 130, 246, 0.2)",
      left,
      top,
      filter: "blur(1px)"
    }}
    animate={{
      y: [0, -30, 0],
      x: [0, 15, 0],
      opacity: [0.2, 0.5, 0.2]
    }}
    transition={{
      duration: 8,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);

const GradientOrb = ({ position, color1 = "#3b82f6", color2 = "#06b6d4", size = 300, blur = 100 }) => (
  <motion.div
    style={{
      position: "absolute",
      ...position,
      width: size,
      height: size,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${color1} 0%, ${color2} 70%, transparent 100%)`,
      filter: `blur(${blur}px)`,
      opacity: 0.15,
      zIndex: 0,
      pointerEvents: "none"
    }}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.1, 0.2, 0.1]
    }}
    transition={{
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);

// Premium Section Header with smoother animations
const SectionHeader = ({ title, subtitle, icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    style={{
      textAlign: "center",
      marginBottom: "48px",
      position: "relative"
    }}
  >
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      whileInView={{ scale: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
      style={{
        width: 64,
        height: 64,
        margin: "0 auto 16px",
        background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        boxShadow: "0 20px 30px -10px rgba(59, 130, 246, 0.3)",
        transform: "rotate(45deg)"
      }}
    >
      <span style={{ transform: "rotate(-45deg)", fontSize: 28 }}>{icon}</span>
    </motion.div>
    <motion.h2
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, duration: 0.5 }}
      style={{
        fontSize: "clamp(28px, 5vw, 40px)",
        fontWeight: 800,
        background: "linear-gradient(135deg, #1e293b, #0f172a)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        marginBottom: 8
      }}
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.5 }}
        style={{
          color: "#64748b",
          fontSize: 18,
          maxWidth: 600,
          margin: "0 auto"
        }}
      >
        {subtitle}
      </motion.p>
    )}
  </motion.div>
);

// Premium Stat Card with smoother animations
const StatCard = ({ icon, value, label, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 20 }}
    whileInView={{ opacity: 1, scale: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ 
      delay, 
      duration: 0.5,
      type: "spring",
      stiffness: 100,
      damping: 15
    }}
    whileHover={{ 
      y: -5, 
      boxShadow: "0 30px 40px -15px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.2 }
    }}
    style={{
      background: "white",
      padding: 24,
      borderRadius: 24,
      boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.1)",
      border: "1px solid rgba(226, 232, 240, 0.6)",
      backdropFilter: "blur(10px)",
      display: "flex",
      alignItems: "center",
      gap: 16,
      cursor: "default"
    }}
  >
    <motion.div
      whileHover={{ rotate: [0, -10, 10, -5, 0] }}
      transition={{ duration: 0.5 }}
      style={{
        width: 56,
        height: 56,
        background: "linear-gradient(135deg, #dbeafe, #e0f2fe)",
        borderRadius: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 28
      }}
    >
      {icon}
    </motion.div>
    <div>
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: delay + 0.2, duration: 0.3 }}
        style={{ fontSize: 28, fontWeight: 700, color: "#0f172a" }}
      >
        {value}
      </motion.div>
      <div style={{ fontSize: 14, color: "#64748b" }}>{label}</div>
    </div>
  </motion.div>
);

export default function DepartmentPage() {
  const [coverImages, setCoverImages] = useState({});
  const router = useRouter();
  const { department } = router.query;
  const [doctors, setDoctors] = useState(allFallbackDoctors);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  
  const t = translations[language] || translations.en;
  const deptConfig = departmentData[department] || departmentData["medicine"];
  const isBangla = language === 'bn';

  // Get translated content
  const getTitle = (obj) => obj[language] || obj.en;
  const getIntro = (obj) => obj[language] || obj.en;

  const MAX_VISIBLE_DOCTORS = 8;
  const displayedDoctors = showAll ? doctors : doctors.slice(0, MAX_VISIBLE_DOCTORS);
  const hasMoreDoctors = doctors.length > MAX_VISIBLE_DOCTORS;

  
  useEffect(() => {
    if (department) {
      fetchDoctors();
    }
  }, [department]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("hospital_cover_images");
      if (saved) {
        try {
          setCoverImages(JSON.parse(saved));
        } catch (e) {
          console.error("Error parsing cover images", e);
        }
      }
    }
  }, []);

  const fetchDoctors = async () => {
    try {
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctors`);
      if (!response.ok) {
        console.log("API response not ok, using fallback data");
        const standardDeptName = departmentMap[department] || department.replace(/-/g, ' ').replace(/&/g, 'and');
        const filteredFallback = allFallbackDoctors.filter(doc => {
          const docDept = (doc.department || '');
          return docDept === standardDeptName;
        });
        if (filteredFallback.length > 0) {
          setDoctors(filteredFallback);
        }
        setLoading(false);
        return;
      }
      const data = await response.json();
      
      if (Array.isArray(data)) {
        // Get the standard department name from the map
        const standardDeptName = departmentMap[department] || department.replace(/-/g, ' ').replace(/&/g, 'and');
        const standardDeptNameLower = standardDeptName.toLowerCase();
        const urlDeptNameLower = department.replace(/-/g, ' ').replace(/&/g, 'and').toLowerCase();
        
        // Filter doctors by department - STRICT matching only
        const filteredDoctors = data.filter(doc => {
          const docDept = (doc.department || '').toLowerCase().trim();
          const docDeptRaw = (doc.department || '').trim();
          
          const match1 = docDept === standardDeptNameLower;
          const match2 = docDept === urlDeptNameLower;
          const match3 = docDeptRaw === standardDeptName;
          
          // Only exact matches allowed - no partial matching to prevent cross-department display
          return match1 || match2 || match3;
        });

        // Always set the filtered doctors, even if empty (to show "No doctors found" message)
        if (filteredDoctors.length > 0) {
          setDoctors(filteredDoctors);
        } else {
          // If no doctors from API match, try fallback data
          const filteredFallback = allFallbackDoctors.filter(doc => {
            const docDept = (doc.department || '');
            return docDept === standardDeptName;
          });
          if (filteredFallback.length > 0) {
            setDoctors(filteredFallback);
          } else {
            setDoctors([]); // Empty array to show "No doctors found"
          }
        }
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      // On error, use fallback data
      const standardDeptName = departmentMap[department] || department.replace(/-/g, ' ').replace(/&/g, 'and');
      const filteredFallback = allFallbackDoctors.filter(doc => {
        const docDept = (doc.department || '');
        return docDept === standardDeptName;
      });
      if (filteredFallback.length > 0) {
        setDoctors(filteredFallback);
      } else {
        setDoctors([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const getCoverImage = () => {
    const key = `dept_${department}`;
    return (
      coverImages[key] ||
      deptConfig.image ||
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200"
    );
  };

  // Translation helpers
  const dayNames = isBangla 
    ? ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"]
    : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Premium Stats
  const departmentStats = [
    { icon: "👨‍⚕️", value: doctors.length, label: isBangla ? "বিশেষজ্ঞ ডাক্তার" : "Specialists" },
    { icon: "🏥", value: "24/7", label: isBangla ? "সেবা" : "Service" },
    { icon: "⭐", value: "15+", label: isBangla ? "বছরের অভিজ্ঞতা" : "Years Experience" },
    { icon: "🛏️", value: "50+", label: isBangla ? "শয্যা" : "Beds" }
  ];

  return (
    <>
      <Navbar />
      
      {/* Add padding-top to account for fixed navbar */}
      <div style={{ paddingTop: "80px"  }}>
        
        {/* Premium Hero Section with Parallax */}
        <section style={{
          position: "relative",
          height: "clamp(400px, 160vh, 600px)",
          overflow: "hidden",
          background: "#0f172a"
        }}>
          {/* Background Image with Parallax */}
          <motion.div
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${getCoverImage()})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.4) saturate(1.2)",
            }}
          />
          
          {/* Animated Gradient Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), linear-gradient(90deg, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.4) 100%)"
            }}
          />
          
          {/* Floating Particles */}
          <FloatingParticle left="10%" top="20%" delay={0} size={6} />
          <FloatingParticle left="20%" top="70%" delay={2} size={4} />
          <FloatingParticle left="80%" top="40%" delay={4} size={8} />
          <FloatingParticle left="90%" top="80%" delay={1} size={5} />
          
          {/* Content */}
          <div style={{
            position: "relative",
            height: "100%",
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            zIndex: 10
          }}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ maxWidth: 800 }}
            >
              {/* Breadcrumb */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 24,
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: 14,
                  fontWeight: 500
                }}
              >
                <Link href="/" style={{ color: "white", opacity: 0.8, textDecoration: "none" }}>
                  {isBangla ? "হোম" : "Home"}
                </Link>
                <span style={{ color: "#3b82f6" }}>•</span>
                <span style={{ color: "white" }}>{getTitle(deptConfig.title)}</span>
              </motion.div>
              
              {/* Title with Gradient */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                style={{
                  fontSize: "clamp(40px, 8vw, 72px)",
                  fontWeight: 800,
                  lineHeight: 1.1,
                  marginBottom: 16,
                  background: "linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                {getTitle(deptConfig.title)}
              </motion.h1>
              
              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                style={{
                  fontSize: 20,
                  color: "rgba(255, 255, 255, 0.8)",
                  maxWidth: 600,
                  marginBottom: 32,
                  lineHeight: 1.6
                }}
              >
                {getTitle(deptConfig.subtitle)}
              </motion.p>
              
              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  style={{
                    padding: "16px 32px",
                    background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                    border: "none",
                    borderRadius: 40,
                    color: "white",
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 20px 30px -10px rgba(59, 130, 246, 0.4)"
                  }}
                >
                  {isBangla ? "এপয়েন্টমেন্ট নিন" : "Book Appointment"}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  style={{
                    padding: "16px 32px",
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: 40,
                    color: "white",
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: "pointer",
                    backdropFilter: "blur(10px)"
                  }}
                >
                  {isBangla ? "ডাক্তার দেখুন" : "View Doctors"}
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Bottom Gradient */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 100,
            background: "linear-gradient(to top, #f8fafc, transparent)"
          }} />
        </section>

        {/* Main Content */}
        <main style={{
          position: "relative",
          background: "#f8fafc",
          padding: "80px 0",
          overflow: "hidden"
        }}>
          {/* Background Decorative Elements */}
          <GradientOrb position={{ top: "-100px", right: "-100px" }} size={400} blur={120} />
          <GradientOrb position={{ bottom: "-100px", left: "-100px" }} color1="#f97316" color2="#fbbf24" size={400} blur={120} />
          
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
            
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 24,
                marginBottom: 80
              }}
            >
              {departmentStats.map((stat, index) => (
                <StatCard key={index} {...stat} delay={index * 0.1} />
              ))}
            </motion.div>

            {/* Department Introduction */}
            {deptConfig.intro && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{
                  background: "white",
                  borderRadius: 40,
                  padding: 48,
                  marginBottom: 80,
                  boxShadow: "0 30px 60px -20px rgba(0, 0, 0, 0.2)",
                  border: "1px solid rgba(226, 232, 240, 0.6)",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {/* Decorative Element */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, type: "spring" }}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 300,
                    height: 300,
                    background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
                    borderRadius: "50%"
                  }}
                />
                
                <div style={{ position: "relative", zIndex: 2 }}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: 80 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{
                      height: 4,
                      background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
                      borderRadius: 2,
                      marginBottom: 24
                    }}
                  />
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    style={{
                      fontSize: 18,
                      lineHeight: 1.8,
                      color: "#334155",
                      margin: 0
                    }}
                  >
                    {getIntro(deptConfig.intro)}
                  </motion.p>
                </div>
              </motion.div>
            )}

            {/* Tabs Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 16,
                marginBottom: 48,
                flexWrap: "wrap"
              }}
            >
              {[
                { id: "overview", label: isBangla ? "ওভারভিউ" : "Overview", icon: "📊" },
                { id: "services", label: isBangla ? "সেবাসমূহ" : "Services", icon: "⚕️" },
                { id: "facilities", label: isBangla ? "সুবিধা" : "Facilities", icon: "🏥" },
                { id: "doctors", label: isBangla ? "ডাক্তার" : "Doctors", icon: "👨‍⚕️" }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  style={{
                    padding: "12px 28px",
                    background: activeTab === tab.id 
                      ? "linear-gradient(135deg, #3b82f6, #06b6d4)"
                      : "white",
                    border: activeTab === tab.id ? "none" : "1px solid #e2e8f0",
                    borderRadius: 40,
                    color: activeTab === tab.id ? "white" : "#64748b",
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: activeTab === tab.id 
                      ? "0 20px 30px -10px rgba(59, 130, 246, 0.4)"
                      : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease"
                  }}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </motion.button>
              ))}
            </motion.div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  {/* Services Grid */}
                  <SectionHeader 
                    title={isBangla ? "আমাদের সেবাসমূহ" : "Our Services"}
                    subtitle={isBangla ? "আমরা প্রদান করি এমন বিশেষায়িত সেবা" : "Specialized care we provide"}
                    icon="⚕️"
                  />
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: 24
                  }}>
                    {deptConfig.services.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                        whileHover={{ 
                          y: -8, 
                          boxShadow: "0 30px 50px -20px rgba(0, 0, 0, 0.2)",
                          transition: { duration: 0.2 }
                        }}
                        style={{
                          background: "white",
                          borderRadius: 24,
                          padding: 32,
                          boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.1)",
                          border: "1px solid rgba(226, 232, 240, 0.6)",
                          position: "relative",
                          overflow: "hidden",
                          cursor: "default"
                        }}
                      >
                        {/* Icon */}
                        <motion.div
                          whileHover={{ rotate: [0, -5, 5, 0] }}
                          transition={{ duration: 0.5 }}
                          style={{
                            width: 48,
                            height: 48,
                            background: "linear-gradient(135deg, #dbeafe, #e0f2fe)",
                            borderRadius: 16,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 24,
                            marginBottom: 16
                          }}
                        >
                          {String.fromCodePoint(0x1F489 + i)}
                        </motion.div>
                        
                        <h3 style={{
                          fontSize: 20,
                          fontWeight: 700,
                          color: "#0f172a",
                          marginBottom: 8
                        }}>
                          {getTitle(item.title)}
                        </h3>
                        
                        <p style={{
                          fontSize: 14,
                          lineHeight: 1.7,
                          color: "#64748b",
                          margin: 0
                        }}>
                          {getIntro(item.desc)}
                        </p>
                        
                        {/* Hover Effect Line */}
                        <motion.div
                          initial={{ width: 0 }}
                          whileHover={{ width: "100%" }}
                          transition={{ duration: 0.3 }}
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            height: 4,
                            background: "linear-gradient(90deg, #3b82f6, #06b6d4)"
                          }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "services" && (
                <motion.div
                  key="services"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <SectionHeader 
                    title={isBangla ? "বিস্তারিত সেবা" : "Detailed Services"}
                    subtitle={isBangla ? "আমাদের বিশেষায়িত চিকিৎসা সেবা" : "Our specialized medical services"}
                    icon="🔬"
                  />
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: 20
                  }}>
                    {deptConfig.services.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: i * 0.05, duration: 0.4, type: "spring", stiffness: 200 }}
                        whileHover={{ 
                          y: -5,
                          boxShadow: "0 25px 40px -15px rgba(0, 0, 0, 0.15)",
                          transition: { duration: 0.2 }
                        }}
                        style={{
                          background: "white",
                          borderRadius: 20,
                          padding: 24,
                          boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.1)",
                          border: "1px solid #e2e8f0",
                          display: "flex",
                          flexDirection: "column",
                          gap: 12,
                          cursor: "default"
                        }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.2 }}
                          style={{
                            width: 40,
                            height: 40,
                            background: "#3b82f6",
                            borderRadius: 12,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: 20
                          }}
                        >
                          {i + 1}
                        </motion.div>
                        <h3 style={{ fontSize: 18, fontWeight: 600, color: "#0f172a" }}>
                          {getTitle(item.title)}
                        </h3>
                        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>
                          {getIntro(item.desc)}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "facilities" && (
                <motion.div
                  key="facilities"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <SectionHeader 
                    title={isBangla ? "সুবিধা ও সেবা" : "Facilities & Services"}
                    subtitle={isBangla ? "আধুনিক সুবিধাসমূহ" : "Modern amenities and features"}
                    icon="🏛️"
                  />
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: 16
                  }}>
                    {Array.isArray(deptConfig.facilities) && deptConfig.facilities.map((f, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: i * 0.03, duration: 0.3, type: "spring", stiffness: 200 }}
                        whileHover={{ 
                          scale: 1.08, 
                          backgroundColor: "#f0f9ff",
                          boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.1)",
                          transition: { duration: 0.2 }
                        }}
                        style={{
                          background: "white",
                          borderRadius: 16,
                          padding: 20,
                          textAlign: "center",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                          border: "1px solid #e2e8f0",
                          cursor: "default",
                          transition: "all 0.3s ease"
                        }}
                      >
                        <motion.div
                          animate={{ 
                            y: [0, -3, 0],
                          }}
                          transition={{ 
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.1
                          }}
                          style={{
                            fontSize: 32,
                            marginBottom: 8
                          }}
                        >
                          {String.fromCodePoint(0x1F3E5 + i % 10)}
                        </motion.div>
                        <span style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: "#1e293b"
                        }}>
                          {typeof f === 'object' ? (f[language] || f.en) : f}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "doctors" && (
                <motion.div
                  key="doctors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <SectionHeader 
                    title={isBangla ? "আমাদের বিশেষজ্ঞ ডাক্তার" : "Our Specialist Doctors"}
                    subtitle={`${doctors.length} ${isBangla ? "জন ডাক্তার উপলব্ধ" : "doctors available"}`}
                    icon="👥"
                  />

                  {loading ? (
                    <div style={{ textAlign: "center", padding: 60 }}>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        style={{
                          width: 48,
                          height: 48,
                          border: "3px solid #e2e8f0",
                          borderTopColor: "#3b82f6",
                          borderRadius: "50%",
                          margin: "0 auto"
                        }}
                      />
                    </div>
                  ) : displayedDoctors.length > 0 ? (
                    <>
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: 24
                      }}>
                        {displayedDoctors.map((doctor, index) => {
                          const visitingDaysArray = getVisitingDaysArray(doctor.visiting_days);
                          const visitingDaysText = visitingDaysArray.length > 0 
                            ? `${isBangla ? "শুধুমাত্র " : "Only "}${visitingDaysArray.join(", ")}` 
                            : (isBangla ? "নির্দিষ্ট নয়" : "Not specified");
                          
                          return (
                            <motion.div
                              key={doctor.id || index}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true, margin: "-50px" }}
                              transition={{ duration: 0.2, delay: index * 0.05 }}
                              whileHover={{
                                y: -6,
                                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.69)"
                              }}
                              className="max-w-[280px] rounded-3xl overflow-hidden bg-gray-100 mx-auto relative group flex flex-col h-full shadow-md hover:shadow-2xl transition"
                            >

                              {/* IMAGE */}
                              <div className="relative">
                                <img
                                  src={doctor.image || getDoctorImage(doctor.id || index + 1)}
                                  alt={doctor.name}
                                  className="w-full transition-transform duration-500 group-hover:scale-95"
                                  style={{
                                    clipPath: "polygon(0 0, 100% 0, 100% 75%, 0% 100%)",
                                    height: "280px",
                                    objectFit: "cover",
                                    objectPosition: "top center"
                                  }}
                                  onError={(e) => {
                                    e.target.src = getDoctorImage(doctor.id || index + 1);
                                  }}
                                />

                                {/* overlay */}
                                <div
                                  style={{
                                    clipPath: "polygon(0 0, 100% 0, 100% 75%, 0% 100%)",
                                    position: "absolute",
                                    inset: 0,
                                    background:
                                      "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(150, 159, 186, 0.32) 100%)"
                                  }}
                                />

                                {/* availability */}
                               <div className="absolute top-2 left-2 bg-green-500 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                                  {isBangla ? "উপলব্ধ" : "Available"}
                                </div>

                                {/* circle button */}
                                <motion.div
                                  initial={{ scale: 0 }}
                                  whileInView={{ scale: 1 }}
                                  transition={{ delay: index * 0.05 + 0.2 }}
                                  whileHover={{ scale: 1.4 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="absolute bottom-5 right-5 h-14 w-14 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white shadow-lg z-20"
                                  onClick={() => window.location.href = `/doctors/${doctor.id}`}
                                >
                                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </motion.div>
                              </div>

                              {/* CONTENT */}
                              <div className="p-3 flex flex-col flex-grow">

                                <h3 className="font-bold text-xl mt-auto text-gray-800 text-center break-normal">
                                  {doctor.name}
                                </h3>

                                <p className="text-blue-600 text-[11px] text-center mt-auto">
                                  {doctor.degrees || doctor.specialization}
                                </p>

                                <p className="text-gray-500 text-[11px] text-center mt-auto">
                                  {doctor.designation || (isBangla ? "পরামর্শক" : "Consultant")}
                                </p>

                                {/* stats */}
                                <div className="grid grid-cols-3 text-center border-t border-b border-gray-100 mt-auto text-[10px]">

                                  <div className="text-center">
                                    <p className="text-gray-400 text-[9px]">
                                      {isBangla ? "অভিজ্ঞতা" : "Experience"}
                                    </p>
                                    <p className="font-semibold text-gray-800">
                                      {doctor.experience_years || "5"}
                                      <span className="text-xs ml-1">
                                        {isBangla ? "বছর" : "yrs"}
                                      </span>
                                    </p>
                                  </div>

                                  <div className="text-center border-l border-r border-gray-100">
                                    <p className="text-gray-400 text-[9px]">
                                      {isBangla ? "রুম নং" : "Room"}
                                    </p>
                                    <p className="font-semibold text-gray-800">
                                      {doctor.room_no || (isBangla ? "টিবিএ" : "TBA")}
                                    </p>
                                  </div>

                                  <div className="text-center">
                                    <p className="text-gray-500 text-[9px]">
                                      {isBangla ? "সময়" : "Time"}
                                    </p>
                                    <p className="font-semibold text-gray-800 text-[10px]">
                                      {formatTimeToAMPM(doctor.visiting_time) || "9 AM"}
                                    </p>
                                  </div>

                                </div>

                                {/* hospital */}
                                <p className="text-gray-500 text-[10px] text-center mt-auto">
                                  <span className="font-medium text-gray-700">
                                    {isBangla ? "হাসপাতাল:" : "Hospital:"}
                                  </span>{" "}
                                  {doctor.institute || "Medical Center"}
                                </p>

                                {/* phone */}
                                {doctor.phone && (
                                  <p className="text-gray-600 text-xs text-center mt-auto">
                                    <span className="font-medium text-gray-700">
                                      {isBangla ? "ফোন:" : "Phone:"}
                                    </span>{" "}
                                    {doctor.phone}
                                  </p>
                                )}

                                {/* BUTTON */}
                                <motion.div
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="mt-auto"
                                >
                                  <Link
                                    href={`/doctors/${doctor.id}`}
                                    className="inline-flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-3xl font-semibold text-sm hover:from-blue-500 hover:to-cyan-700 transition shadow-lg shadow-blue-500/25"
                                  >
                                    {isBangla ? "সম্পূর্ণ প্রোফাইল দেখুন" : "View Full Profile"}
                                  </Link>
                                </motion.div>

                              </div>

                            </motion.div>
                          );
                        })}
                      </div>

                      {/* View All / Show Less Button */}
                      {(hasMoreDoctors || showAll) && (
                        <div style={{ textAlign: "center", marginTop: 48 }}>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowAll(!showAll)}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            style={{
                              padding: "16px 40px",
                              background: showAll ? "white" : "linear-gradient(135deg, #3b82f6, #06b6d4)",
                              border: showAll ? "2px solid #3b82f6" : "none",
                              borderRadius: 40,
                              color: showAll ? "#3b82f6" : "white",
                              fontSize: 16,
                              fontWeight: 600,
                              cursor: "pointer",
                              boxShadow: showAll 
                                ? "none"
                                : "0 20px 30px -10px rgba(59, 130, 246, 0.4)"
                            }}
                          >
                            {showAll 
                              ? (isBangla ? "কম দেখুন ↑" : "Show Less ↑")
                              : (isBangla ? `সব ${doctors.length} জন ডাক্তার দেখুন →` : `View All ${doctors.length} Doctors →`)}
                          </motion.button>
                        </div>
                      )}
                    </>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      style={{
                        textAlign: "center",
                        padding: 60,
                        background: "white",
                        borderRadius: 32,
                        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.1)"
                      }}
                    >
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        style={{ fontSize: 48, marginBottom: 16 }}
                      >
                        👨‍⚕️
                      </motion.div>
                      <p style={{ fontSize: 18, color: "#64748b" }}>
                        {isBangla ? "কোনো বিশেষজ্ঞ পাওয়া যায়নি" : "No specialists found"}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Premium CTA Section */}
        <section style={{
          background: "linear-gradient(135deg, #0f172a, #1e293b)",
          padding: "100px 0",
          position: "relative",
          overflow: "hidden"
        }}>
          <GradientOrb position={{ top: "-150px", right: "-150px" }} color1="#3b82f6" color2="#06b6d4" size={500} blur={150} />
          <GradientOrb position={{ bottom: "-150px", left: "-150px" }} color1="#f97316" color2="#fbbf24" size={500} blur={150} />
          
          <div style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
            position: "relative",
            zIndex: 2,
            textAlign: "center"
          }}>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                fontSize: "clamp(32px, 5vw, 48px)",
                fontWeight: 700,
                color: "white",
                marginBottom: 24,
                maxWidth: 800,
                marginLeft: "auto",
                marginRight: "auto"
              }}
            >
              {isBangla 
                ? "আপনার স্বাস্থ্য আমাদের অগ্রাধিকার" 
                : "Your Health is Our Priority"}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{
                fontSize: 18,
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: 40,
                maxWidth: 600,
                marginLeft: "auto",
                marginRight: "auto"
              }}
            >
              {isBangla 
                ? "আজই অ্যাপয়েন্টমেন্ট নিন এবং বিশেষজ্ঞ ডাক্তারের পরামর্শ নিন" 
                : "Book an appointment today and consult with our specialist doctors"}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 30px 40px -15px rgba(59, 130, 246, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                style={{
                  padding: "18px 48px",
                  background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                  border: "none",
                  borderRadius: 50,
                  color: "white",
                  fontSize: 18,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 20px 30px -10px rgba(59, 130, 246, 0.4)"
                }}
              >
                {isBangla ? "এপয়েন্টমেন্ট নিন" : "Book Appointment"}
              </motion.button>
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />

      {/* Global Styles for Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
}