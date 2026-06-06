import type { FAQItem } from "../types";

export const faqs: FAQItem[] = [
  { question: "Does this guarantee monetization?", answer: "No. ContentShield AI helps reduce risk before upload, but YouTube makes the final monetization decision." },
  { question: "Can it detect words shown on screen?", answer: "Yes. ContentShield AI runs OCR-style review for on-screen text and includes those findings in the Safety Report." },
  { question: "Can it scan captions?", answer: "Yes, the planned workflow reviews captions and subtitles alongside speech and screen text." },
  { question: "Does it support multiple languages?", answer: "The interface is ready for multilingual scan providers when backend integrations are added." },
  { question: "Can editors export reports?", answer: "Yes. Safety Report and timestamp export surfaces are planned for the editor workflow." },
  { question: "Is this connected to YouTube directly?", answer: "Not in this frontend module. No backend or external YouTube integration is included yet." }
];
