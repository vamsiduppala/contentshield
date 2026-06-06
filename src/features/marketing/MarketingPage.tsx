import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Play, ShieldAlert, WandSparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "../../components/layout/Navbar";
import { FaqAccordion } from "../../components/marketing/FaqAccordion";
import { FeatureGrid } from "../../components/marketing/FeatureGrid";
import { ProductMockup } from "../../components/marketing/ProductMockup";
import { Section } from "../../components/marketing/Section";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { pricingPlans } from "../../data/pricing";
import { testimonials } from "../../data/testimonials";
import { useMouseGlow } from "../../hooks/useMouseGlow";
import { fadeUp, stagger } from "../../lib/motion";

const logos = ["Creator Studio", "Newsroom Pro", "PodcastFlow", "ClipForge", "StreamDesk"];
const problems = [
  ["Manual editing takes hours", "Teams scrub timelines by hand and still miss revenue-sensitive moments."],
  ["Demonetization is unpredictable", "Creators need a consistent pre-upload lens before the platform review."],
  ["Editors miss hidden on-screen text", "Risk can live in captions, graphics, overlays, and background footage."]
];
const steps = [
  ["01", "Upload video", "Bring a draft into the review flow."],
  ["02", "AI scans speech + screen text", "Analyze speech, captions, and visible words."],
  ["03", "Review timestamped risk moments", "See what matters, where it happens, and why."],
  ["04", "Export fixes for editor", "Package the Safety Report for clean handoff."]
];

export function MarketingPage() {
  const glow = useMouseGlow();

  return (
    <div className="min-h-screen overflow-hidden bg-void text-white">
      <div className="pointer-events-none fixed inset-0 bg-mesh" />
      <div className="pointer-events-none fixed inset-0 opacity-70" style={{ background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(85,214,255,.16), transparent 18rem)` }} />
      <Navbar />

      <main className="relative">
        <section className="mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-4 pb-20 pt-32 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.p variants={fadeUp} className="mb-5 inline-flex rounded-full border border-acid/30 bg-acid/10 px-4 py-2 text-sm font-semibold text-acid">
              Scan your video before YouTube demonetizes it.
            </motion.p>
            <motion.h1 variants={fadeUp} className="max-w-5xl text-5xl font-semibold leading-[0.96] tracking-tight md:text-7xl lg:text-8xl">
              Protect Creator Revenue Before YouTube Flags Your Video.
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-lg leading-8 text-white/62">
              ContentShield AI scans speech, captions, and on-screen text to detect monetization-risk language before upload.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-9 flex flex-wrap gap-3">
              <Link to="/signup"><Button>Start Free Scan <ArrowRight size={17} /></Button></Link>
              <Button variant="secondary"><Play size={17} /> Watch Demo</Button>
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, delay: 0.18 }}>
            <ProductMockup />
          </motion.div>
        </section>

        <section className="border-y border-line bg-white/[0.03] py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="mb-5 text-center text-sm text-white/45">Built for creators, editors, agencies, and media teams</p>
            <div className="grid gap-3 text-center text-sm font-semibold text-white/34 sm:grid-cols-5">
              {logos.map((logo) => <span key={logo} className="rounded-2xl border border-line bg-white/[0.03] px-4 py-3 transition hover:border-cyan/30 hover:text-cyan">{logo}</span>)}
            </div>
          </div>
        </section>

        <Section eyebrow="The problem" title="One risky word can cost the whole video.">
          <div className="grid gap-4 lg:grid-cols-3">
            {problems.map(([title, body]) => (
              <motion.div key={title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Card className="h-full p-6">
                  <ShieldAlert className="mb-8 text-amber" />
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <p className="mt-3 leading-7 text-white/56">{body}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section id="product" eyebrow="Solution" title="A monetization safety layer built for modern video teams.">
          <FeatureGrid />
        </Section>

        <Section id="how-it-works" eyebrow="How it works" title="Upload, scan, review, export. No hunting through timelines.">
          <div className="relative grid gap-4 lg:grid-cols-4">
            <div className="absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent lg:block" />
            {steps.map(([number, title, body]) => (
              <Card key={number} className="relative p-6">
                <span className="mb-8 grid h-14 w-14 place-items-center rounded-2xl border border-cyan/30 bg-cyan/10 text-lg font-semibold text-cyan">{number}</span>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-3 leading-7 text-white/56">{body}</p>
              </Card>
            ))}
          </div>
        </Section>

        <Section eyebrow="Product preview" title="A real SaaS dashboard feel, ready for scan results later.">
          <Card className="overflow-hidden p-4 md:p-6">
            <div className="grid gap-4 lg:grid-cols-[15rem_1fr]">
              <aside className="rounded-3xl border border-line bg-black/20 p-4">
                <div className="mb-6 h-10 rounded-2xl bg-white/10" />
                {["Overview", "Scan Jobs", "Risk Findings", "Safety Reports"].map((item, index) => <div key={item} className={`mb-2 rounded-2xl px-4 py-3 text-sm ${index === 1 ? "bg-acid/12 text-acid" : "text-white/44"}`}>{item}</div>)}
              </aside>
              <div className="grid gap-4 md:grid-cols-[1fr_18rem]">
                <div className="space-y-4">
                  <Card className="p-5">
                    <p className="text-sm text-white/45">Scan result</p>
                    <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
                      <div><strong className="text-6xl">87</strong><span className="text-white/42">/100</span><p className="mt-2 text-acid">Review recommended before upload</p></div>
                      <div className="flex gap-2">{["Speech", "OCR", "Captions"].map((chip) => <span key={chip} className="rounded-full border border-line px-3 py-1 text-sm text-white/58">{chip}</span>)}</div>
                    </div>
                  </Card>
                  <Card className="p-5">
                    <p className="mb-4 text-sm text-white/45">Flagged words table preview</p>
                    {["weaponized", "graphic detail", "medical claim"].map((word, index) => <div key={word} className="flex items-center justify-between border-t border-line py-3 text-sm"><span>{word}</span><span className="text-white/42">0{index + 2}:{14 + index * 9}</span></div>)}
                  </Card>
                </div>
                <Card className="p-5">
                  <div className="mb-5 grid aspect-square place-items-center rounded-full border-[14px] border-acid/70 bg-acid/10 text-center shadow-[0_0_50px_rgba(124,255,155,.2)]">
                    <div><strong className="block text-4xl">87</strong><span className="text-sm text-white/48">score gauge</span></div>
                  </div>
                  <div className="space-y-3">
                    {[23, 48, 76].map((marker) => <div key={marker} className="h-2 rounded-full bg-white/10"><span className="block h-2 rounded-full bg-amber" style={{ width: `${marker}%` }} /></div>)}
                  </div>
                </Card>
              </div>
            </div>
          </Card>
        </Section>

        <Section id="pricing" eyebrow="Pricing" title="Premium review workflows without enterprise friction.">
          <div className="grid gap-4 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <Card key={plan.id} className={`p-6 ${plan.recommended ? "border-acid/60 bg-acid/[0.07] shadow-[0_0_70px_rgba(124,255,155,.14)]" : ""}`}>
                {plan.recommended && <span className="mb-5 inline-flex rounded-full bg-acid px-3 py-1 text-xs font-semibold text-void">Recommended</span>}
                <h3 className="text-2xl font-semibold">{plan.name}</h3>
                <p className="mt-3 min-h-14 text-white/56">{plan.description}</p>
                <div className="mt-6"><span className="text-5xl font-semibold">${plan.priceMonthly}</span><span className="text-white/42">/month</span></div>
                <p className="mt-3 text-cyan">{plan.scans}</p>
                <ul className="mt-6 space-y-3 text-sm text-white/64">
                  {plan.features.map((feature) => <li key={feature} className="flex gap-2"><BadgeCheck size={17} className="text-acid" /> {feature}</li>)}
                </ul>
                <Link to="/signup"><Button className="mt-7 w-full" variant={plan.recommended ? "primary" : "secondary"}>Start Free Scan</Button></Link>
              </Card>
            ))}
          </div>
        </Section>

        <Section eyebrow="Testimonials" title="Built for people whose revenue depends on the edit.">
          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map((item) => (
              <Card key={item.name} className="p-6">
                <p className="text-lg leading-8 text-white/72">“{item.quote}”</p>
                <div className="mt-6"><strong>{item.name}</strong><p className="text-sm text-white/42">{item.role}</p></div>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="faq" eyebrow="FAQ" title="Clear answers before your team depends on it.">
          <FaqAccordion />
        </Section>

        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <Card className="relative overflow-hidden p-8 text-center md:p-14">
            <div className="absolute inset-0 bg-gradient-to-r from-acid/10 via-cyan/10 to-violet/10" />
            <div className="relative mx-auto max-w-3xl">
              <h2 className="text-4xl font-semibold tracking-tight md:text-6xl">Stop guessing. Scan before you upload.</h2>
              <p className="mt-5 text-white/58">Give every draft a monetization safety pass before it reaches YouTube.</p>
              <Link to="/signup"><Button className="mt-8">Start Free Scan <WandSparkles size={17} /></Button></Link>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}
