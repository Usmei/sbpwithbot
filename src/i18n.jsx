import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  LANGUAGES                                                           */
/* ------------------------------------------------------------------ */

export const LANGS = [
  { code: "en", label: "English", short: "EN" },
  { code: "ur", label: "اردو", short: "اردو" },
  { code: "roman", label: "Roman Urdu", short: "Roman" },
];

const STORAGE_KEY = "icfs_lang";

/* ------------------------------------------------------------------ */
/*  TRANSLATION DICTIONARY                                             */
/*  Keyed by language -> English source string -> translation.        */
/*  English is the source; any string not found falls back to English */
/*  so the app always renders even where a translation is missing.    */
/* ------------------------------------------------------------------ */

const DICT = {
  ur: {
    // -- Nav / chrome --
    "Home": "ہوم",
    "Staff": "عملہ",
    "Complain & Feedback": "شکایت و رائے",
    "Language": "زبان",
    "Back": "واپس",
    "Back to home": "ہوم پر واپس",
    "Back to options": "اختیارات پر واپس",

    // -- Home hero --
    "Intelligent Customer Facilitation System": "ذہین کسٹمر سہولت نظام",
    "A digital front desk for SBP-BSC.": "ایس بی پی-بی ایس سی کے لیے ڈیجیٹل فرنٹ ڈیسک۔",
    "ICFS guides you through the correct Prize Bond service journey — no need to understand the process yourself. Select a goal below and we'll walk you through a personalized readiness check, the exact counters to visit, and a visit pack to bring with you.":
      "آئی سی ایف ایس آپ کو پرائز بانڈ سروس کے درست مرحلے میں رہنمائی دیتا ہے — آپ کو خود سارا طریقہ سمجھنے کی ضرورت نہیں۔ نیچے سے اپنا مقصد منتخب کریں اور ہم آپ کو ذاتی تیاری کی جانچ، وزٹ کرنے کے صحیح کاؤنٹرز، اور ساتھ لے جانے کے لیے ایک وزٹ پیک کے ذریعے رہنمائی دیں گے۔",
    "Calculate prize tax": "انعامی ٹیکس کا حساب لگائیں",
    "Find a field office": "فیلڈ آفس تلاش کریں",
    "Sample Bond": "نمونہ بانڈ",
    "Serial No.": "سیریل نمبر",
    "Issuing Authority": "جاری کرنے والا ادارہ",
    "Choose a service": "سروس منتخب کریں",
    "What would you like to do today?": "آج آپ کیا کرنا چاہیں گے؟",
    "Select an option below for a step-by-step journey based on the official SBP-BSC counter workflow.":
      "سرکاری ایس بی پی-بی ایس سی کاؤنٹر طریقہ کار پر مبنی مرحلہ وار رہنمائی کے لیے نیچے سے ایک آپشن منتخب کریں۔",
    "Bond categories serviced": "بانڈ کی اقسام",
    "Denominations covered": "شامل مالیت",
    "Income Tax Ordinance basis": "انکم ٹیکس آرڈیننس کی بنیاد",
    "Start journey": "سفر شروع کریں",

    // -- Service cards --
    "Premium Prize Bonds": "پریمیم پرائز بانڈز",
    "National Prize Bonds": "نیشنل پرائز بانڈز",
    "National Prize Bond": "نیشنل پرائز بانڈ",
    "Premium Prize Bond": "پریمیم پرائز بانڈ",
    "Registered bonds — encashment, succession, transfer, and prize claims.":
      "رجسٹرڈ بانڈز — کیش کرانا، وراثت، منتقلی، اور انعامی دعوے۔",
    "Bearer bonds — purchase, encashment, and prize money claims.":
      "بیئرر بانڈز — خریداری، کیش کرانا، اور انعامی رقم کے دعوے۔",
    "Download Forms": "فارم ڈاؤن لوڈ کریں",
    "All prize bond service forms in one place.": "تمام پرائز بانڈ سروس فارم ایک جگہ۔",
    "Office Guidance": "دفتر کی رہنمائی",
    "Field office locations, counters to visit, and what to carry.":
      "فیلڈ آفس کے مقامات، وزٹ کرنے والے کاؤنٹرز، اور کیا ساتھ لے جانا ہے۔",
    "Tax Calculator": "ٹیکس کیلکولیٹر",
    "Estimate the withholding tax on your prize money instantly.":
      "اپنی انعامی رقم پر ود ہولڈنگ ٹیکس کا فوری تخمینہ لگائیں۔",

    // -- Listing subtitles --
    "Registered bonds available in Rs. 25,000 and Rs. 40,000 denominations. Choose a service below to start a guided journey.":
      "روپے 25,000 اور روپے 40,000 مالیت میں دستیاب رجسٹرڈ بانڈز۔ رہنمائی شدہ سفر شروع کرنے کے لیے نیچے سے سروس منتخب کریں۔",
    "Bearer bonds available in Rs. 100, 200, 750, and 1,500 denominations. Choose a service below to start a guided journey.":
      "روپے 100، 200، 750 اور 1,500 مالیت میں دستیاب بیئرر بانڈز۔ رہنمائی شدہ سفر شروع کرنے کے لیے نیچے سے سروس منتخب کریں۔",

    // -- Sub-service titles + summaries --
    "Encashment": "کیش کرانا",
    "Succession": "وراثت",
    "Lost Bond": "گمشدہ بانڈ",
    "Claim Prize Money": "انعامی رقم کا دعویٰ",
    "Transfer": "منتقلی",
    "Purchase": "خریداری",
    "Damaged Bond": "خراب شدہ بانڈ",
    "Redeem your Premium Prize Bond for its full face value.": "اپنے پریمیم پرائز بانڈ کو اس کی پوری مالیت پر کیش کرائیں۔",
    "Transfer bonds to legal heirs after the holder's demise.": "بانڈ ہولڈر کی وفات کے بعد بانڈز قانونی وارثوں کو منتقل کریں۔",
    "Report a lost or stolen bond and request a duplicate.": "گمشدہ یا چوری شدہ بانڈ کی اطلاع دیں اور ڈپلیکیٹ کی درخواست کریں۔",
    "Claim the prize amount won in a Premium Prize Bond draw.": "پریمیم پرائز بانڈ ڈرا میں جیتی گئی انعامی رقم کا دعویٰ کریں۔",
    "Transfer ownership of a bond from one holder to another.": "بانڈ کی ملکیت ایک ہولڈر سے دوسرے کو منتقل کریں۔",
    "Buy new Premium Prize Bonds from authorized branches.": "مجاز برانچوں سے نئے پریمیم پرائز بانڈز خریدیں۔",
    "Claim the prize amount won in a National Prize Bond draw.": "نیشنل پرائز بانڈ ڈرا میں جیتی گئی انعامی رقم کا دعویٰ کریں۔",
    "Exchange a torn or defaced bond for a fresh certificate.": "پھٹے یا خراب بانڈ کو نئے سرٹیفکیٹ سے تبدیل کریں۔",
    "Redeem a National Prize Bond for its full face value.": "نیشنل پرائز بانڈ کو اس کی پوری مالیت پر کیش کرائیں۔",
    "Buy new National Prize Bonds over the counter.": "کاؤنٹر سے نئے نیشنل پرائز بانڈز خریدیں۔",

    // -- Detail page --
    "Your counter journey": "آپ کا کاؤنٹر سفر",
    "Documents required": "درکار دستاویزات",
    "Good to know": "جاننا ضروری",

    // -- Forms page --
    "Standard forms used across Premium and National Prize Bond services.":
      "پریمیم اور نیشنل پرائز بانڈ سروسز میں استعمال ہونے والے معیاری فارم۔",
    "Download": "ڈاؤن لوڈ",
    "Form": "فارم",
    "General": "عام",
    "Premium": "پریمیم",
    "National": "نیشنل",
    "Your download has started. If it doesn't, check your browser's download settings.":
      "آپ کی ڈاؤن لوڈ شروع ہو گئی ہے۔ اگر نہ ہو تو اپنے براؤزر کی ڈاؤن لوڈ سیٹنگز دیکھیں۔",

    // -- Guidance page --
    "What to expect and what to bring when visiting an SBP-BSC field office for prize bond services.":
      "پرائز بانڈ سروسز کے لیے ایس بی پی-بی ایس سی فیلڈ آفس جاتے وقت کیا توقع رکھیں اور کیا ساتھ لے جائیں۔",
    "The counter flow, end to end": "کاؤنٹر کا مکمل سلسلہ",
    "Take a number to start your visit.": "اپنا وزٹ شروع کرنے کے لیے ٹوکن لیں۔",
    "Collect and fill your service form.": "اپنا سروس فارم لیں اور بھریں۔",
    "KYC — CNIC and form verification.": "کے وائی سی — شناختی کارڈ اور فارم کی تصدیق۔",
    "Registration (Premium bonds only).": "رجسٹریشن (صرف پریمیم بانڈز)۔",
    "Cheque submission & receipt.": "چیک جمع کرانا اور رسید۔",
    "Premium Bond services — input & authorization.": "پریمیم بانڈ سروسز — اندراج اور اجازت۔",
    "National Bond services.": "نیشنل بانڈ سروسز۔",
    "Note: National Prize Bonds are bearer instruments and skip the Registration counter entirely.":
      "نوٹ: نیشنل پرائز بانڈز بیئرر دستاویزات ہیں اور رجسٹریشن کاؤنٹر کو مکمل طور پر چھوڑ دیتے ہیں۔",
    "Before you visit": "وزٹ سے پہلے",
    "Visit between 9:00 AM – 1:30 PM, Monday to Friday, for counter services.":
      "کاؤنٹر سروسز کے لیے پیر تا جمعہ صبح 9:00 سے دوپہر 1:30 کے درمیان وزٹ کریں۔",
    "Carry your original CNIC / NICOP — it must not be expired, and photocopies alone are not accepted.":
      "اپنا اصل شناختی کارڈ / نائیکوپ ساتھ لائیں — یہ ایکسپائر نہ ہو، اور صرف فوٹو کاپیاں قبول نہیں کی جاتیں۔",
    "If your CNIC renewal is in progress, bring the NADRA token/acknowledgment receipt as proof.":
      "اگر آپ کے شناختی کارڈ کی تجدید جاری ہے تو ثبوت کے طور پر نادرا ٹوکن/رسید ساتھ لائیں۔",
    "Bring original bond certificates, signed twice on the back if they're Premium bonds.":
      "اصل بانڈ سرٹیفکیٹ لائیں، اگر پریمیم بانڈز ہیں تو پیچھے دو بار دستخط شدہ۔",
    "Have your Account Maintenance Certificate and IBAN ready for any fund transfer.":
      "کسی بھی رقم کی منتقلی کے لیے اپنا اکاؤنٹ مینٹیننس سرٹیفکیٹ اور آئی بی اے این تیار رکھیں۔",
    "A separate application form is required for each individual bond denomination.":
      "ہر انفرادی بانڈ مالیت کے لیے الگ درخواست فارم درکار ہے۔",
    "Premium Prize Bond accounts must be held with a conventional (non-Islamic) bank.":
      "پریمیم پرائز بانڈ اکاؤنٹ کسی روایتی (غیر اسلامی) بینک میں ہونا چاہیے۔",
    "If your account is with an Islamic bank, cheque credits are instead paid via EasyPaisa or cash.":
      "اگر آپ کا اکاؤنٹ اسلامی بینک میں ہے تو چیک کی رقم اس کے بجائے ایزی پیسہ یا نقد ادا کی جاتی ہے۔",
    "Cheque payments need 1 working day to clear; cash payments are processed immediately.":
      "چیک کی ادائیگی کو کلیئر ہونے میں 1 کاروباری دن لگتا ہے؛ نقد ادائیگی فوراً پروسیس ہوتی ہے۔",
    "Field offices": "فیلڈ آفسز",

    // -- Tax calculator --
    "Interactive tool": "انٹرایکٹو ٹول",
    "Prize Bond Tax Calculator": "پرائز بانڈ ٹیکس کیلکولیٹر",
    "Estimate the withholding tax on your prize money in a few quick steps.":
      "چند آسان مراحل میں اپنی انعامی رقم پر ود ہولڈنگ ٹیکس کا تخمینہ لگائیں۔",
    "Which bond did you win?": "آپ نے کون سا بانڈ جیتا؟",
    "Select the category of your prize bond.": "اپنے پرائز بانڈ کی قسم منتخب کریں۔",
    "Select the denomination": "مالیت منتخب کریں",
    "Face value printed on your bond.": "آپ کے بانڈ پر درج مالیت۔",
    "Are you a Filer or Non-Filer?": "کیا آپ فائلر ہیں یا نان فائلر؟",
    "This determines the withholding tax rate under Section 156 of the Income Tax Ordinance.":
      "یہ انکم ٹیکس آرڈیننس کی دفعہ 156 کے تحت ود ہولڈنگ ٹیکس کی شرح طے کرتا ہے۔",
    "Filer": "فائلر",
    "Non-Filer": "نان فائلر",
    "Tax rate: 15%": "ٹیکس کی شرح: 15%",
    "Tax rate: 30%": "ٹیکس کی شرح: 30%",
    "Which prize did you win?": "آپ نے کون سا انعام جیتا؟",
    "Your estimated payout": "آپ کی متوقع ادائیگی",
    "Gross prize amount": "مجموعی انعامی رقم",
    "Tax deducted": "کٹوتی شدہ ٹیکس",
    "Net amount payable": "قابل ادائیگی خالص رقم",
    "Tax is deducted at source under Section 156 of the Income Tax Ordinance, 2001, before payment of prize money on winning prize bonds.":
      "جیتنے والے پرائز بانڈز پر انعامی رقم کی ادائیگی سے پہلے انکم ٹیکس آرڈیننس، 2001 کی دفعہ 156 کے تحت ذریعہ آمدنی پر ٹیکس کاٹا جاتا ہے۔",
    "Calculate another prize": "ایک اور انعام کا حساب لگائیں",
    "This calculator is for informational purposes only. Actual tax deduction is done by the State Bank / National Savings according to current FBR rules.":
      "یہ کیلکولیٹر صرف معلوماتی مقصد کے لیے ہے۔ اصل ٹیکس کٹوتی اسٹیٹ بینک / نیشنل سیونگز موجودہ ایف بی آر قوانین کے مطابق کرتا ہے۔",
    "Bearer bonds · Rs. 100 to Rs. 1,500": "بیئرر بانڈز · روپے 100 تا روپے 1,500",
    "Registered bonds · Rs. 25,000 or Rs. 40,000": "رجسٹرڈ بانڈز · روپے 25,000 یا روپے 40,000",

    // -- Staff --
    "Staff Login": "عملہ لاگ ان",
    "Sign in to view the complaints & feedback dashboard.": "شکایات اور رائے کا ڈیش بورڈ دیکھنے کے لیے سائن ان کریں۔",
    "Email": "ای میل",
    "Password": "پاس ورڈ",
    "Login": "لاگ ان",
    "Invalid email or password. Try staff@sbp.pk / 123456 for this demo.":
      "غلط ای میل یا پاس ورڈ۔ اس ڈیمو کے لیے staff@sbp.pk / 123456 آزمائیں۔",
    "Demo credentials: staff@sbp.pk / 123456": "ڈیمو تفصیلات: staff@sbp.pk / 123456",
    "Admin Dashboard": "ایڈمن ڈیش بورڈ",
    "Log out": "لاگ آؤٹ",
    "Total Complaints": "کل شکایات",
    "Pending": "زیر التوا",
    "In Progress": "جاری",
    "Resolved": "حل شدہ",
    "Avg Rating": "اوسط ریٹنگ",
    "Complaints Over Time": "وقت کے ساتھ شکایات",
    "Rating Distribution": "ریٹنگ کی تقسیم",
    "Recent Complaints": "حالیہ شکایات",
    "Recent Reviews": "حالیہ آراء",
    "Search complaints...": "شکایات تلاش کریں...",
    "Search reviews...": "آراء تلاش کریں...",
    "Name": "نام",
    "Phone": "فون",
    "Complaint": "شکایت",
    "Status": "حالت",
    "Date": "تاریخ",
    "Rating": "ریٹنگ",
    "Comment": "تبصرہ",
    "No complaints match your search.": "آپ کی تلاش سے کوئی شکایت مطابقت نہیں رکھتی۔",
    "No reviews match your search.": "آپ کی تلاش سے کوئی رائے مطابقت نہیں رکھتی۔",

    // -- Feedback --
    "Complain & Feedback ": "شکایت و رائے",
    "Tell us what happened, or share how your visit went.": "ہمیں بتائیں کیا ہوا، یا اپنے وزٹ کا احوال شیئر کریں۔",
    "Submit a Complaint": "شکایت درج کریں",
    "Report an issue with a service, request, or counter visit.": "کسی سروس، درخواست یا کاؤنٹر وزٹ کے مسئلے کی اطلاع دیں۔",
    "Leave a Review / Feedback": "رائے / فیڈبیک دیں",
    "Rate your experience and help us improve.": "اپنے تجربے کی درجہ بندی کریں اور بہتری میں ہماری مدد کریں۔",
    "Leave a Review": "رائے دیں",
    "Full Name": "پورا نام",
    "Phone Number": "فون نمبر",
    "Describe your issue in detail": "اپنے مسئلے کو تفصیل سے بیان کریں",
    "Submit Complaint": "شکایت جمع کریں",
    "Complaint submitted": "شکایت جمع ہو گئی",
    "Submit another complaint": "ایک اور شکایت جمع کریں",
    "Service Quality": "سروس کا معیار",
    "Response Time": "جواب کا وقت",
    "Overall Experience": "مجموعی تجربہ",
    "Comment (optional)": "تبصرہ (اختیاری)",
    "Tell us more about your experience": "اپنے تجربے کے بارے میں مزید بتائیں",
    "Submit Review": "رائے جمع کریں",
    "Review submitted": "رائے جمع ہو گئی",
    "Leave another review": "ایک اور رائے دیں",

    // -- Footer --
    "Quick links": "فوری لنکس",
    "Contact": "رابطہ",
    "Disclaimer": "دستبرداری",
    "A reference resource for Premium and National Prize Bond services offered through SBP-BSC field offices nationwide.":
      "ملک بھر میں ایس بی پی-بی ایس سی فیلڈ آفسز کے ذریعے پیش کی جانے والی پریمیم اور نیشنل پرائز بانڈ سروسز کے لیے ایک حوالہ جاتی وسیلہ۔",
    "Field offices in major cities across Pakistan": "پاکستان کے بڑے شہروں میں فیلڈ آفسز",
    "This website is an informational reference and is not an official SBP-BSC portal. Procedures, forms, and tax rates are subject to change; please confirm current requirements with your nearest SBP-BSC field office or the FBR before acting.":
      "یہ ویب سائٹ ایک معلوماتی حوالہ ہے اور سرکاری ایس بی پی-بی ایس سی پورٹل نہیں۔ طریقہ کار، فارم اور ٹیکس کی شرحیں تبدیل ہو سکتی ہیں؛ عمل سے پہلے براہ کرم اپنے قریبی ایس بی پی-بی ایس سی فیلڈ آفس یا ایف بی آر سے موجودہ تقاضوں کی تصدیق کریں۔",
    "For informational purposes only.": "صرف معلوماتی مقاصد کے لیے۔",

    // -- Chatbot --
    "ICFS Assistant": "آئی سی ایف ایس اسسٹنٹ",
    "Chatbot coming soon": "چیٹ بوٹ جلد آ رہا ہے",
    "This assistant will soon answer questions in English, Urdu, and Roman Urdu.":
      "یہ اسسٹنٹ جلد ہی انگریزی، اردو اور رومن اردو میں سوالات کے جواب دے گا۔",

    // -- Journey stages + chrome --
    "Confirm": "تصدیق",
    "Readiness Check": "تیاری کی جانچ",
    "Counter Journey": "کاؤنٹر سفر",
    "Visit Pack": "وزٹ پیک",
    "You selected": "آپ نے منتخب کیا",
    "Here's what this guided journey will do": "یہ رہنمائی شدہ سفر کیا کرے گا",
    "Ask a few quick readiness questions about your documents": "آپ کی دستاویزات کے بارے میں چند فوری سوالات پوچھے گا",
    "Tell you exactly what's missing before you travel to a branch": "برانچ جانے سے پہلے بتائے گا کہ کیا کمی ہے",
    "Walk you through the exact counters to visit, in order": "ترتیب سے وزٹ کرنے والے کاؤنٹرز کی رہنمائی کرے گا",
    "Generate a Visit Pack summary you can bring with you": "ایک وزٹ پیک خلاصہ بنائے گا جو آپ ساتھ لے جا سکیں",
    "Start guided journey": "رہنمائی شدہ سفر شروع کریں",
    "View static reference page instead": "اس کے بجائے مستقل حوالہ صفحہ دیکھیں",
    "Readiness check": "تیاری کی جانچ",
    "Answer a few quick questions so we can tell you exactly what to bring.":
      "چند فوری سوالات کے جواب دیں تاکہ ہم آپ کو بتا سکیں کہ کیا ساتھ لانا ہے۔",
    "Answer all questions to see your readiness check": "اپنی تیاری کی جانچ دیکھنے کے لیے تمام سوالات کے جواب دیں",
    "You are ready": "آپ تیار ہیں",
    "Based on your answers, you have everything you need. Continue to see your exact counter journey.":
      "آپ کے جوابات کے مطابق، آپ کے پاس سب کچھ موجود ہے۔ اپنا کاؤنٹر سفر دیکھنے کے لیے جاری رکھیں۔",
    "Continue to counter journey": "کاؤنٹر سفر کی طرف جاری رکھیں",
    "Follow these counters in order. Tap \"Mark as done\" as you complete each one during your visit.":
      "ان کاؤنٹرز کو ترتیب سے فالو کریں۔ وزٹ کے دوران ہر ایک مکمل کرنے پر \"مکمل کریں\" دبائیں۔",
    "Back to readiness check": "تیاری کی جانچ پر واپس",
    "Continue to visit pack": "وزٹ پیک کی طرف جاری رکھیں",
    "Your visit pack": "آپ کا وزٹ پیک",
    "Readiness check passed — you're set to visit an SBP-BSC field office.":
      "تیاری کی جانچ کامیاب — آپ ایس بی پی-بی ایس سی فیلڈ آفس جانے کے لیے تیار ہیں۔",
    "Still needed": "ابھی درکار",
    "Documents to bring": "ساتھ لانے والی دستاویزات",
    "Counter sequence": "کاؤنٹر ترتیب",
    "Start another journey": "ایک اور سفر شروع کریں",
    "View full details page": "مکمل تفصیلات کا صفحہ دیکھیں",

    // -- Readiness questions --
    "Do you have a valid, unexpired CNIC / NICOP?": "کیا آپ کے پاس درست، غیر ایکسپائرڈ شناختی کارڈ / نائیکوپ ہے؟",
    "Is your receiving bank account with a conventional bank or an Islamic bank?":
      "آپ کا وصول کنندہ بینک اکاؤنٹ روایتی بینک میں ہے یا اسلامی بینک میں؟",
    "How will you pay?": "آپ ادائیگی کیسے کریں گے؟",
    "Conventional bank": "روایتی بینک",
    "Islamic bank": "اسلامی بینک",
    "Cash": "نقد",
    "Cheque": "چیک",
    "Payment Order": "پیمنٹ آرڈر",
    "yes": "ہاں",
    "no": "نہیں",
    "Please answer this question.": "براہ کرم اس سوال کا جواب دیں۔",

    // -- Misc labels --
    "Done": "مکمل",
    "Mark as done": "مکمل نشان زد کریں",
    "Token": "ٹوکن",
    "Tax rate": "ٹیکس کی شرح",
    "Prize tiers": "انعامی درجے",
    "winner(s) per draw": "فاتحین فی ڈرا",
    "1st Prize": "پہلا انعام",
    "2nd Prize": "دوسرا انعام",
    "3rd Prize": "تیسرا انعام",
    "Missing items": "کمی والی اشیاء",
    "counters": "کاؤنٹرز",
    "item(s) still need attention before your visit — see below.": "اشیاء کو آپ کے وزٹ سے پہلے توجہ درکار ہے — نیچے دیکھیں۔",
    "Thanks": "شکریہ",
    "our team will follow up by email or phone.": "ہماری ٹیم ای میل یا فون کے ذریعے رابطہ کرے گی۔",
    "Thanks for your feedback": "آپ کی رائے کا شکریہ",
    "ID": "آئی ڈی",
    "results": "نتائج",
    "All": "تمام",

    // -- Chatbot --
    "Open chatbot": "چیٹ بوٹ کھولیں",
    "Close": "بند کریں",
    "Ask me anything about Prize Bonds": "پرائز بانڈز کے بارے میں کچھ بھی پوچھیں",
    "Assalam-o-Alaikum! I'm the ICFS Prize Bond Assistant. Ask me about purchase, encashment, claims, tax, or counter procedures.":
      "السلام علیکم! میں آئی سی ایف ایس پرائز بانڈ اسسٹنٹ ہوں۔ خریداری، کیش کرانے، دعوے، ٹیکس، یا کاؤنٹر کے طریقہ کار کے بارے میں پوچھیں۔",
    "Try asking": "یہ پوچھ کر دیکھیں",
    "Sources": "ذرائع",
    "Ask about prize bonds…": "پرائز بانڈز کے بارے میں پوچھیں…",
    "Send": "بھیجیں",
    "Answers are based on official SBP-BSC Prize Bond documents.": "جوابات سرکاری ایس بی پی-بی ایس سی پرائز بانڈ دستاویزات پر مبنی ہیں۔",
    "The assistant is offline right now. Please make sure the bot server is running, then try again.":
      "اسسٹنٹ اس وقت آف لائن ہے۔ براہ کرم یقینی بنائیں کہ بوٹ سرور چل رہا ہے، پھر دوبارہ کوشش کریں۔",
    "How do I encash a National Prize Bond?": "میں نیشنل پرائز بانڈ کیسے کیش کراؤں؟",
    "What tax applies to prize money?": "انعامی رقم پر کون سا ٹیکس لاگو ہوتا ہے؟",
    "Which documents are needed to claim prize money?": "انعامی رقم کے دعوے کے لیے کون سی دستاویزات درکار ہیں؟",
  },

  roman: {
    // -- Nav / chrome --
    "Home": "Home",
    "Staff": "Staff",
    "Complain & Feedback": "Shikayat aur Feedback",
    "Language": "Zaban",
    "Back": "Wapas",
    "Back to home": "Home par wapas",
    "Back to options": "Options par wapas",

    // -- Home hero --
    "Intelligent Customer Facilitation System": "Intelligent Customer Facilitation System",
    "A digital front desk for SBP-BSC.": "SBP-BSC ke liye digital front desk.",
    "ICFS guides you through the correct Prize Bond service journey — no need to understand the process yourself. Select a goal below and we'll walk you through a personalized readiness check, the exact counters to visit, and a visit pack to bring with you.":
      "ICFS aap ko sahi Prize Bond service ke marhale mein rehnumai deta hai — aap ko khud poora tareeqa samajhne ki zaroorat nahi. Neeche se apna maqsad chunein aur hum aap ko personalized readiness check, visit karne ke sahi counters, aur saath le jaane ke liye ek visit pack ke zariye rehnumai denge.",
    "Calculate prize tax": "Prize tax calculate karein",
    "Find a field office": "Field office talash karein",
    "Sample Bond": "Sample Bond",
    "Serial No.": "Serial No.",
    "Issuing Authority": "Issuing Authority",
    "Choose a service": "Service chunein",
    "What would you like to do today?": "Aaj aap kya karna chahenge?",
    "Select an option below for a step-by-step journey based on the official SBP-BSC counter workflow.":
      "Sarkari SBP-BSC counter workflow par mabni step-by-step guidance ke liye neeche se ek option chunein.",
    "Bond categories serviced": "Bond categories serviced",
    "Denominations covered": "Denominations covered",
    "Income Tax Ordinance basis": "Income Tax Ordinance ki bunyad",
    "Start journey": "Journey shuru karein",

    // -- Service cards --
    "Premium Prize Bonds": "Premium Prize Bonds",
    "National Prize Bonds": "National Prize Bonds",
    "National Prize Bond": "National Prize Bond",
    "Premium Prize Bond": "Premium Prize Bond",
    "Registered bonds — encashment, succession, transfer, and prize claims.":
      "Registered bonds — encashment, succession, transfer, aur prize claims.",
    "Bearer bonds — purchase, encashment, and prize money claims.":
      "Bearer bonds — khareedari, encashment, aur prize money claims.",
    "Download Forms": "Forms Download Karein",
    "All prize bond service forms in one place.": "Tamam prize bond service forms aik jagah.",
    "Office Guidance": "Office Guidance",
    "Field office locations, counters to visit, and what to carry.":
      "Field office ke maqamaat, visit karne wale counters, aur kya saath le jana hai.",
    "Tax Calculator": "Tax Calculator",
    "Estimate the withholding tax on your prize money instantly.":
      "Apni prize money par withholding tax ka fauri andaza lagayein.",

    // -- Listing subtitles --
    "Registered bonds available in Rs. 25,000 and Rs. 40,000 denominations. Choose a service below to start a guided journey.":
      "Rs. 25,000 aur Rs. 40,000 denominations mein dastiyab registered bonds. Guided journey shuru karne ke liye neeche se service chunein.",
    "Bearer bonds available in Rs. 100, 200, 750, and 1,500 denominations. Choose a service below to start a guided journey.":
      "Rs. 100, 200, 750 aur 1,500 denominations mein dastiyab bearer bonds. Guided journey shuru karne ke liye neeche se service chunein.",

    // -- Sub-service titles + summaries --
    "Encashment": "Encashment",
    "Succession": "Succession (Wirasat)",
    "Lost Bond": "Gumshuda Bond",
    "Claim Prize Money": "Prize Money ka Claim",
    "Transfer": "Transfer",
    "Purchase": "Khareedari",
    "Damaged Bond": "Kharab Bond",
    "Redeem your Premium Prize Bond for its full face value.": "Apne Premium Prize Bond ko us ki poori face value par cash karayein.",
    "Transfer bonds to legal heirs after the holder's demise.": "Bond holder ki wafat ke baad bonds qanooni warison ko muntaqil karein.",
    "Report a lost or stolen bond and request a duplicate.": "Gumshuda ya chori shuda bond ki ittila dein aur duplicate ki darkhwast karein.",
    "Claim the prize amount won in a Premium Prize Bond draw.": "Premium Prize Bond draw mein jeeti gayi prize amount ka claim karein.",
    "Transfer ownership of a bond from one holder to another.": "Bond ki ownership aik holder se doosre ko muntaqil karein.",
    "Buy new Premium Prize Bonds from authorized branches.": "Mujaz branchon se naye Premium Prize Bonds khareedein.",
    "Claim the prize amount won in a National Prize Bond draw.": "National Prize Bond draw mein jeeti gayi prize amount ka claim karein.",
    "Exchange a torn or defaced bond for a fresh certificate.": "Phate ya kharab bond ko naye certificate se tabdeel karein.",
    "Redeem a National Prize Bond for its full face value.": "National Prize Bond ko us ki poori face value par cash karayein.",
    "Buy new National Prize Bonds over the counter.": "Counter se naye National Prize Bonds khareedein.",

    // -- Detail page --
    "Your counter journey": "Aap ka counter journey",
    "Documents required": "Darkaar documents",
    "Good to know": "Jaanna zaroori",

    // -- Forms page --
    "Standard forms used across Premium and National Prize Bond services.":
      "Premium aur National Prize Bond services mein istemal hone wale standard forms.",
    "Download": "Download",
    "Form": "Form",
    "General": "General",
    "Premium": "Premium",
    "National": "National",
    "Your download has started. If it doesn't, check your browser's download settings.":
      "Aap ki download shuru ho gayi hai. Agar na ho to apne browser ki download settings dekhein.",

    // -- Guidance page --
    "What to expect and what to bring when visiting an SBP-BSC field office for prize bond services.":
      "Prize bond services ke liye SBP-BSC field office jaate waqt kya expect karein aur kya saath le jayein.",
    "The counter flow, end to end": "Counter ka mukammal silsila",
    "Take a number to start your visit.": "Apna visit shuru karne ke liye token lein.",
    "Collect and fill your service form.": "Apna service form lein aur bharein.",
    "KYC — CNIC and form verification.": "KYC — CNIC aur form ki tasdeeq.",
    "Registration (Premium bonds only).": "Registration (sirf Premium bonds).",
    "Cheque submission & receipt.": "Cheque jama karana aur receipt.",
    "Premium Bond services — input & authorization.": "Premium Bond services — input aur authorization.",
    "National Bond services.": "National Bond services.",
    "Note: National Prize Bonds are bearer instruments and skip the Registration counter entirely.":
      "Note: National Prize Bonds bearer instruments hain aur Registration counter ko poori tarah skip kar dete hain.",
    "Before you visit": "Visit se pehle",
    "Visit between 9:00 AM – 1:30 PM, Monday to Friday, for counter services.":
      "Counter services ke liye Monday se Friday, subah 9:00 se dopahar 1:30 ke darmiyan visit karein.",
    "Carry your original CNIC / NICOP — it must not be expired, and photocopies alone are not accepted.":
      "Apna asli CNIC / NICOP saath layein — yeh expire na ho, aur sirf photocopies accept nahi ki jaatin.",
    "If your CNIC renewal is in progress, bring the NADRA token/acknowledgment receipt as proof.":
      "Agar aap ke CNIC ki renewal jaari hai to saboot ke tor par NADRA token/receipt saath layein.",
    "Bring original bond certificates, signed twice on the back if they're Premium bonds.":
      "Asli bond certificates layein, agar Premium bonds hain to peeche do baar signed.",
    "Have your Account Maintenance Certificate and IBAN ready for any fund transfer.":
      "Kisi bhi fund transfer ke liye apna Account Maintenance Certificate aur IBAN tayyar rakhein.",
    "A separate application form is required for each individual bond denomination.":
      "Har individual bond denomination ke liye alag application form darkaar hai.",
    "Premium Prize Bond accounts must be held with a conventional (non-Islamic) bank.":
      "Premium Prize Bond account kisi conventional (non-Islamic) bank mein hona chahiye.",
    "If your account is with an Islamic bank, cheque credits are instead paid via EasyPaisa or cash.":
      "Agar aap ka account Islamic bank mein hai to cheque ki raqam us ke bajaye EasyPaisa ya cash di jaati hai.",
    "Cheque payments need 1 working day to clear; cash payments are processed immediately.":
      "Cheque payment ko clear hone mein 1 working day lagta hai; cash payment fauran process hoti hai.",
    "Field offices": "Field offices",

    // -- Tax calculator --
    "Interactive tool": "Interactive tool",
    "Prize Bond Tax Calculator": "Prize Bond Tax Calculator",
    "Estimate the withholding tax on your prize money in a few quick steps.":
      "Chand aasan steps mein apni prize money par withholding tax ka andaza lagayein.",
    "Which bond did you win?": "Aap ne kaun sa bond jeeta?",
    "Select the category of your prize bond.": "Apne prize bond ki category chunein.",
    "Select the denomination": "Denomination chunein",
    "Face value printed on your bond.": "Aap ke bond par likhi face value.",
    "Are you a Filer or Non-Filer?": "Kya aap Filer hain ya Non-Filer?",
    "This determines the withholding tax rate under Section 156 of the Income Tax Ordinance.":
      "Yeh Income Tax Ordinance ki Section 156 ke tehat withholding tax ki rate tay karta hai.",
    "Filer": "Filer",
    "Non-Filer": "Non-Filer",
    "Tax rate: 15%": "Tax rate: 15%",
    "Tax rate: 30%": "Tax rate: 30%",
    "Which prize did you win?": "Aap ne kaun sa prize jeeta?",
    "Your estimated payout": "Aap ki mutawaqqa payout",
    "Gross prize amount": "Gross prize amount",
    "Tax deducted": "Tax deducted",
    "Net amount payable": "Net qabil-e-adaigi raqam",
    "Tax is deducted at source under Section 156 of the Income Tax Ordinance, 2001, before payment of prize money on winning prize bonds.":
      "Jeetne wale prize bonds par prize money ki adaigi se pehle Income Tax Ordinance, 2001 ki Section 156 ke tehat source par tax kaata jaata hai.",
    "Calculate another prize": "Ek aur prize calculate karein",
    "This calculator is for informational purposes only. Actual tax deduction is done by the State Bank / National Savings according to current FBR rules.":
      "Yeh calculator sirf maloomati maqsad ke liye hai. Asli tax deduction State Bank / National Savings mojooda FBR rules ke mutabiq karta hai.",
    "Bearer bonds · Rs. 100 to Rs. 1,500": "Bearer bonds · Rs. 100 se Rs. 1,500",
    "Registered bonds · Rs. 25,000 or Rs. 40,000": "Registered bonds · Rs. 25,000 ya Rs. 40,000",

    // -- Staff --
    "Staff Login": "Staff Login",
    "Sign in to view the complaints & feedback dashboard.": "Complaints aur feedback dashboard dekhne ke liye sign in karein.",
    "Email": "Email",
    "Password": "Password",
    "Login": "Login",
    "Invalid email or password. Try staff@sbp.pk / 123456 for this demo.":
      "Ghalat email ya password. Is demo ke liye staff@sbp.pk / 123456 try karein.",
    "Demo credentials: staff@sbp.pk / 123456": "Demo credentials: staff@sbp.pk / 123456",
    "Admin Dashboard": "Admin Dashboard",
    "Log out": "Log out",
    "Total Complaints": "Total Complaints",
    "Pending": "Pending",
    "In Progress": "In Progress",
    "Resolved": "Resolved",
    "Avg Rating": "Avg Rating",
    "Complaints Over Time": "Waqt ke saath Complaints",
    "Rating Distribution": "Rating Distribution",
    "Recent Complaints": "Haaliya Complaints",
    "Recent Reviews": "Haaliya Reviews",
    "Search complaints...": "Complaints talash karein...",
    "Search reviews...": "Reviews talash karein...",
    "Name": "Naam",
    "Phone": "Phone",
    "Complaint": "Complaint",
    "Status": "Status",
    "Date": "Date",
    "Rating": "Rating",
    "Comment": "Comment",
    "No complaints match your search.": "Aap ki talash se koi complaint match nahi karti.",
    "No reviews match your search.": "Aap ki talash se koi review match nahi karti.",

    // -- Feedback --
    "Tell us what happened, or share how your visit went.": "Hamein batayein kya hua, ya apne visit ka ahwaal share karein.",
    "Submit a Complaint": "Complaint darj karein",
    "Report an issue with a service, request, or counter visit.": "Kisi service, request ya counter visit ke masle ki ittila dein.",
    "Leave a Review / Feedback": "Review / Feedback dein",
    "Rate your experience and help us improve.": "Apne tajurbe ki rating dein aur behtari mein hamari madad karein.",
    "Leave a Review": "Review dein",
    "Full Name": "Poora Naam",
    "Phone Number": "Phone Number",
    "Describe your issue in detail": "Apne masle ko tafseel se bayan karein",
    "Submit Complaint": "Complaint submit karein",
    "Complaint submitted": "Complaint submit ho gayi",
    "Submit another complaint": "Ek aur complaint submit karein",
    "Service Quality": "Service ka Miyaar",
    "Response Time": "Response Time",
    "Overall Experience": "Mujmai Tajurba",
    "Comment (optional)": "Comment (ikhtiyari)",
    "Tell us more about your experience": "Apne tajurbe ke baare mein mazeed batayein",
    "Submit Review": "Review submit karein",
    "Review submitted": "Review submit ho gayi",
    "Leave another review": "Ek aur review dein",

    // -- Footer --
    "Quick links": "Quick links",
    "Contact": "Raabta",
    "Disclaimer": "Disclaimer",
    "A reference resource for Premium and National Prize Bond services offered through SBP-BSC field offices nationwide.":
      "Mulk bhar mein SBP-BSC field offices ke zariye pesh ki jaane wali Premium aur National Prize Bond services ke liye ek reference resource.",
    "Field offices in major cities across Pakistan": "Pakistan ke baray shehron mein field offices",
    "This website is an informational reference and is not an official SBP-BSC portal. Procedures, forms, and tax rates are subject to change; please confirm current requirements with your nearest SBP-BSC field office or the FBR before acting.":
      "Yeh website ek maloomati reference hai aur sarkari SBP-BSC portal nahi. Procedures, forms aur tax rates tabdeel ho sakte hain; amal se pehle baraye meherbani apne qareebi SBP-BSC field office ya FBR se mojooda taqazon ki tasdeeq karein.",
    "For informational purposes only.": "Sirf maloomati maqasid ke liye.",

    // -- Chatbot --
    "ICFS Assistant": "ICFS Assistant",
    "Chatbot coming soon": "Chatbot jald aa raha hai",
    "This assistant will soon answer questions in English, Urdu, and Roman Urdu.":
      "Yeh assistant jald hi English, Urdu aur Roman Urdu mein sawaalon ke jawab de ga.",

    // -- Journey stages + chrome --
    "Confirm": "Confirm",
    "Readiness Check": "Readiness Check",
    "Counter Journey": "Counter Journey",
    "Visit Pack": "Visit Pack",
    "You selected": "Aap ne chuna",
    "Here's what this guided journey will do": "Yeh guided journey kya kare gi",
    "Ask a few quick readiness questions about your documents": "Aap ki documents ke baare mein chand fauri sawaal pooche gi",
    "Tell you exactly what's missing before you travel to a branch": "Branch jaane se pehle batayegi ke kya kami hai",
    "Walk you through the exact counters to visit, in order": "Tarteeb se visit karne wale counters ki rehnumai kare gi",
    "Generate a Visit Pack summary you can bring with you": "Ek Visit Pack summary banayegi jo aap saath le ja sakein",
    "Start guided journey": "Guided journey shuru karein",
    "View static reference page instead": "Is ke bajaye static reference page dekhein",
    "Readiness check": "Readiness check",
    "Answer a few quick questions so we can tell you exactly what to bring.":
      "Chand fauri sawaalon ke jawab dein taake hum aap ko bata sakein ke kya saath laana hai.",
    "Answer all questions to see your readiness check": "Apni readiness check dekhne ke liye tamam sawaalon ke jawab dein",
    "You are ready": "Aap tayyar hain",
    "Based on your answers, you have everything you need. Continue to see your exact counter journey.":
      "Aap ke jawabaat ke mutabiq, aap ke paas sab kuch mojood hai. Apna counter journey dekhne ke liye jaari rakhein.",
    "Continue to counter journey": "Counter journey ki taraf jaari rakhein",
    "Follow these counters in order. Tap \"Mark as done\" as you complete each one during your visit.":
      "In counters ko tarteeb se follow karein. Visit ke douran har ek mukammal karne par \"Mark as done\" dabayein.",
    "Back to readiness check": "Readiness check par wapas",
    "Continue to visit pack": "Visit pack ki taraf jaari rakhein",
    "Your visit pack": "Aap ka visit pack",
    "Readiness check passed — you're set to visit an SBP-BSC field office.":
      "Readiness check kamyab — aap SBP-BSC field office jaane ke liye tayyar hain.",
    "Still needed": "Abhi darkaar",
    "Documents to bring": "Saath laane wali documents",
    "Counter sequence": "Counter tarteeb",
    "Start another journey": "Ek aur journey shuru karein",
    "View full details page": "Mukammal details ka page dekhein",

    // -- Readiness questions --
    "Do you have a valid, unexpired CNIC / NICOP?": "Kya aap ke paas valid, non-expired CNIC / NICOP hai?",
    "Is your receiving bank account with a conventional bank or an Islamic bank?":
      "Aap ka receiving bank account conventional bank mein hai ya Islamic bank mein?",
    "How will you pay?": "Aap adaigi kaise karenge?",
    "Conventional bank": "Conventional bank",
    "Islamic bank": "Islamic bank",
    "Cash": "Cash",
    "Cheque": "Cheque",
    "Payment Order": "Payment Order",
    "yes": "Haan",
    "no": "Nahi",
    "Please answer this question.": "Baraye meherbani is sawaal ka jawab dein.",

    // -- Misc labels --
    "Done": "Done",
    "Mark as done": "Mark as done",
    "Token": "Token",
    "Tax rate": "Tax rate",
    "Prize tiers": "Prize tiers",
    "winner(s) per draw": "winners per draw",
    "1st Prize": "1st Prize",
    "2nd Prize": "2nd Prize",
    "3rd Prize": "3rd Prize",
    "Missing items": "Missing items",
    "counters": "counters",
    "item(s) still need attention before your visit — see below.": "item(s) ko aap ke visit se pehle tawajjo darkaar hai — neeche dekhein.",
    "Thanks": "Shukriya",
    "our team will follow up by email or phone.": "hamari team email ya phone ke zariye rabta karegi.",
    "Thanks for your feedback": "Aap ki raye ka shukriya",
    "ID": "ID",
    "results": "results",
    "All": "All",

    // -- Chatbot --
    "Open chatbot": "Chatbot kholein",
    "Close": "Band karein",
    "Ask me anything about Prize Bonds": "Prize Bonds ke baare mein kuch bhi poochein",
    "Assalam-o-Alaikum! I'm the ICFS Prize Bond Assistant. Ask me about purchase, encashment, claims, tax, or counter procedures.":
      "Assalam-o-Alaikum! Main ICFS Prize Bond Assistant hoon. Khareedari, encashment, claims, tax, ya counter procedures ke baare mein poochein.",
    "Try asking": "Yeh pooch kar dekhein",
    "Sources": "Sources",
    "Ask about prize bonds…": "Prize bonds ke baare mein poochein…",
    "Send": "Bhejein",
    "Answers are based on official SBP-BSC Prize Bond documents.": "Jawabaat sarkari SBP-BSC Prize Bond documents par mabni hain.",
    "The assistant is offline right now. Please make sure the bot server is running, then try again.":
      "Assistant is waqt offline hai. Baraye meherbani yaqeeni banayein ke bot server chal raha hai, phir dobara koshish karein.",
    "How do I encash a National Prize Bond?": "Main National Prize Bond kaise cash karaoon?",
    "What tax applies to prize money?": "Prize money par kaun sa tax lagta hai?",
    "Which documents are needed to claim prize money?": "Prize money claim karne ke liye kaun si documents darkaar hain?",
  },
};

/* ------------------------------------------------------------------ */
/*  CONTEXT + HOOKS                                                    */
/* ------------------------------------------------------------------ */

const LangCtx = createContext({ lang: "en", setLang: () => {}, dir: "ltr" });

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || "en";
    } catch {
      return "en";
    }
  });

  const setLang = useCallback((l) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const dir = lang === "ur" ? "rtl" : "ltr";

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("lang", lang === "roman" ? "ur-Latn" : lang);
    root.setAttribute("dir", dir);
  }, [lang, dir]);

  return <LangCtx.Provider value={{ lang, setLang, dir }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  return useContext(LangCtx);
}

// Returns a translate function `t(englishString)` bound to the current language.
export function useT() {
  const { lang } = useContext(LangCtx);
  return useCallback(
    (s) => {
      if (s == null || lang === "en") return s;
      const table = DICT[lang];
      if (table && Object.prototype.hasOwnProperty.call(table, s)) return table[s];
      return s;
    },
    [lang]
  );
}
