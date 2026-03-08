import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
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

export default function DepartmentPage() {
  const router = useRouter();
  const { department } = router.query;
  const [doctors, setDoctors] = useState(allFallbackDoctors);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const { language } = useLanguage();
  
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
        
        // Debug: Log all doctors and their departments
        console.log('=== DEBUG: All doctors from API ===');
        console.log('Total doctors:', data.length);
        data.forEach((doc, i) => {
          console.log(`Doctor ${i + 1}: "${doc.name}" -> Department: "${doc.department}"`);
        });
        console.log('===================================');
        console.log('Current URL department:', department);
        console.log('Standard department name:', standardDeptName);
        console.log('Standard (lowercase):', standardDeptNameLower);
        console.log('URL format (lowercase):', urlDeptNameLower);

        // Filter doctors by department - STRICT matching only
        // Doctors from one department should NEVER show in other departments
        const filteredDoctors = data.filter(doc => {
          const docDept = (doc.department || '').toLowerCase().trim();
          const docDeptRaw = (doc.department || '').trim();
          
          const match1 = docDept === standardDeptNameLower;
          const match2 = docDept === urlDeptNameLower;
          const match3 = docDeptRaw === standardDeptName;
          
          // Debug each doctor
          console.log(`Checking "${doc.name}": dept="${docDeptRaw}" | matches: ${match1 || match2 || match3}`);
          
          // Only exact matches allowed - no partial matching to prevent cross-department display
          return match1 || match2 || match3;
        });

        console.log(`✓ Found ${filteredDoctors.length} doctors for department: ${standardDeptName}`);
        
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

  // Translation helpers
  const dayNames = isBangla 
    ? ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"]
    : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <>
      <Navbar />
      <section className="relative h-[300px] md:h-[420px] overflow-hidden">
        <Image
          src={deptConfig.image}
          alt={getTitle(deptConfig.title)}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent flex items-center">
          <div className="max-w-7xl mx-auto px-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-5xl font-bold text-white mb-3"
            >
              {getTitle(deptConfig.title)}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-white/90 max-w-xl"
            >
              {getTitle(deptConfig.subtitle)}
            </motion.p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Department Introduction */}
          {deptConfig.intro && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-12 bg-white rounded-2xl shadow-lg p-8 md:p-10"
            >
              <div className="text-gray-700 text-lg leading-relaxed space-y-4">
                <p>{getIntro(deptConfig.intro)}</p>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-6 text-center">
              {isBangla ? "আমাদের সেবাসমূহ" : "Our Services"}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {deptConfig.services.map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5, scale: 1.01 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-md p-5 border-l-4 border-blue-600 hover:shadow-lg transition-all"
                >
                  <h3 className="text-base font-semibold text-gray-800 mb-1">{getTitle(item.title)}</h3>
                  <p className="text-gray-600 text-sm">{getIntro(item.desc)}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-12"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-5 text-center">
              {isBangla ? "সুবিধা ও সেবা" : "Facilities & Services"}
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Array.isArray(deptConfig.facilities) && deptConfig.facilities.map((f, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.03 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 text-xs text-gray-700"
                >
                  {typeof f === 'object' ? (f[language] || f.en) : f}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="text-center mb-6">
              <span className="text-sm uppercase tracking-wider text-blue-600 font-semibold">
                {t.ourExperts || (isBangla ? "আমাদের বিশেষজ্ঞ" : "Our Experts")}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                {isBangla ? "বিশেষজ্ঞ ডাক্তার" : "Specialist Doctors"}
              </h2>
              <p className="text-gray-500 text-sm mt-1">{doctors.length} {isBangla ? "জন ডাক্তার উপলব্ধ" : "doctors available"}</p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : displayedDoctors.length > 0 ? (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedDoctors.map((doctor, index) => {
                  const visitingDaysArray = getVisitingDaysArray(doctor.visiting_days);
                  const visitingDaysText = visitingDaysArray.length > 0 
                    ? `${isBangla ? "শুধুমাত্র " : "Only "}${visitingDaysArray.join(", ")}` 
                    : (isBangla ? "নির্দিষ্ট নয়" : "Not specified");
                  
                  return (
                    <motion.div
  key={doctor.id || index}
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, delay: index * 0.05 }}
  whileHover={{ y: -10 }}
  className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col transition-all hover:shadow-2xl h-full"
>

  {/* IMAGE AREA */}
  <div className="relative h-[250px] w-full overflow-hidden flex-shrink-0">

    <img
      src={doctor.image || getDoctorImage(doctor.id || index + 1)}
      alt={doctor.name}
      className="w-full h-full object-cover object-top transition duration-500 hover:scale-110"
      onError={(e) => {
        e.target.src = getDoctorImage(doctor.id || index + 1);
      }}
    />

    {/* gradient overlay - lighter to keep photo visible */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.05))"
      }}
    />

    {/* availability badge */}
    <div
      style={{
        position: "absolute",
        top: "14px",
        right: "14px",
        background: "#22c55e",
        color: "white",
        fontSize: "12px",
        fontWeight: "600",
        padding: "4px 10px",
        borderRadius: "999px",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
      }}
    />
      <span
        style={{
          width: "8px",
          height: "8px",
          background: "white",
          borderRadius: "50%",
          animation: "pulse 1.5s infinite"
        }}
      ></span>

      {isBangla ? "উপলব্ধ" : "Available"}
    </div>

    {/* doctor name overlay */}
    <div
      style={{
        position: "absolute",
        bottom: "16px",
        left: "16px",
        right: "16px",
        color: "white"
      }}
    >
      <h3 className="text-lg font-bold leading-tight truncate">
        {doctor.name}
      </h3>

      <p className="text-sm opacity-90 truncate">
        {doctor.degrees || doctor.specialization}
      </p>
    </div>

  


  {/* CONTENT */}
  <div className="p-5 flex flex-col flex-grow">

    {/* designation */}
    <p className="text-gray-700 font-semibold text-sm truncate">
      {doctor.designation || (isBangla ? "ডাক্তার" : "Doctor")}
    </p>

    <p className="text-gray-500 text-sm mb-3 truncate">
      {doctor.institute ||
        (isBangla
          ? "মেডিকেল সেন্টার চট্টগ্রাম"
          : "Medical Center Chattagram")}
    </p>


    {/* INFO GRID */}
    <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm text-gray-600">

      <div className="truncate">
        <span className="font-medium text-gray-800">
          {isBangla ? "অভিজ্ঞতা:" : "Experience:"}
        </span>
        <br />
        <span className="truncate">{doctor.experience_years || "5"} {isBangla ? "বছর" : "years"}</span>
      </div>

      <div className="truncate">
        <span className="font-medium text-gray-800">
          {isBangla ? "রুম:" : "Room:"}
        </span>
        <br />
        <span className="truncate">{doctor.room_no || "TBA"}</span>
      </div>

      <div className="truncate">
        <span className="font-medium text-gray-800">
          {isBangla ? "সময়:" : "Time:"}
        </span>
        <br />
        <span className="truncate">
          {formatTimeToAMPM(doctor.visiting_time) ||
            (isBangla ? "সকাল ৯টা - বিকাল ৫টা" : "9 AM - 5 PM")}
        </span>
      </div>

      <div className="truncate">
        <span className="font-medium text-gray-800">
          {isBangla ? "সিরিয়াল:" : "Serial:"}
        </span>
        <br />
        <span className="truncate">
          {doctor.serial_note ||
            (isBangla ? "হটলাইনে কল করুন" : "Call hotline")}
        </span>
      </div>

    </div>


    {/* PHONE */}
    {doctor.phone && (
      <p className="text-sm text-gray-600 mt-3 truncate">
        <span className="font-medium text-gray-800">
          {isBangla ? "ফোন:" : "Phone:"}
        </span>{" "}
        {doctor.phone}
      </p>
    )}


    {/* CTA BUTTON */}
    <motion.div
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className="mt-auto pt-4"
    >

      <Link
        href={`/doctors/${doctor.id}`}
        className="block w-full text-center py-2.5 rounded-lg text-white font-semibold text-sm transition-all duration-300"
        style={{
          background:
            "linear-gradient(135deg,#2563eb,#06b6d4)",
          boxShadow: "0 10px 25px rgba(37,99,235,0.3)"
        }}
      >
        {isBangla ? "প্রোফাইল দেখুন" : "View Profile"}
      </Link>

    </motion.div>

  </div>
</motion.div>
                  );
                })}
                </div>

                {/* View All Button at the end */}
                {hasMoreDoctors && !showAll && (
                  <div className="text-center mt-8">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowAll(true)}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-cyan-700 transition"
                    >
                      {isBangla ? `সব ${doctors.length} জন ডাক্তার দেখুন →` : `View All (${doctors.length}) Doctors →`}
                    </motion.button>
                  </div>
                )}
                {showAll && doctors.length > MAX_VISIBLE_DOCTORS && (
                  <div className="text-center mt-8">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowAll(false)}
                      className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-300 transition"
                    >
                      {isBangla ? "কম দেখুন ↑" : "Show Less ↑"}
                    </motion.button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-gray-500">{isBangla ? "কোনো বিশেষজ্ঞ পাওয়া যায়নি" : "No specialists found"}</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
