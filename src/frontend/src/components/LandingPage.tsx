import { Button } from "@/components/ui/button";
import {
  Camera,
  Clock,
  Heart,
  Lock,
  Share2,
  Smile,
  Star,
  Tag,
  TreePine,
  Users,
} from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const HOW_STEPS = [
  {
    icon: Camera,
    step: "01",
    title: "Add Memories",
    desc: "Upload photos, add descriptions, dates, and tags to capture each special moment exactly as it happened.",
  },
  {
    icon: Users,
    step: "02",
    title: "Share with Family",
    desc: "Invite family members to view and contribute. Every generation adds their unique perspective and stories.",
  },
  {
    icon: Heart,
    step: "03",
    title: "Relive Together",
    desc: "Browse your family timeline, explore the gallery, and revisit memories that bring joy and connection.",
  },
];

const TIMELINE_ITEMS = [
  { year: "2024", title: "Christmas Morning", tag: "Holiday" },
  { year: "2024", title: "Emma's Graduation", tag: "Milestone" },
  { year: "2023", title: "Summer Beach Trip", tag: "Vacation" },
  { year: "2023", title: "Grandpa's 80th Birthday", tag: "Celebration" },
];

const GALLERY_ITEMS = [
  { bg: "from-amber-200 to-orange-300", label: "Summer" },
  { bg: "from-emerald-200 to-teal-300", label: "Garden" },
  { bg: "from-rose-200 to-pink-300", label: "Birthday" },
  { bg: "from-sky-200 to-blue-300", label: "Beach" },
  { bg: "from-purple-200 to-violet-300", label: "Christmas" },
  { bg: "from-yellow-200 to-amber-300", label: "School" },
];

const FEATURES = [
  { icon: Camera, label: "Photo Albums" },
  { icon: Tag, label: "Smart Tags" },
  { icon: Clock, label: "Timeline View" },
  { icon: Share2, label: "Share Stories" },
  { icon: Lock, label: "Private & Secure" },
  { icon: Smile, label: "Family Reactions" },
];

const TESTIMONIALS = [
  {
    name: "Margaret Collins",
    relation: "Grandmother",
    text: "Kinship has brought our family closer than ever. I love scrolling through all our precious moments together — from holidays to everyday magic.",
    rating: 5,
  },
  {
    name: "David & Sarah Park",
    relation: "Parents",
    text: "Finally a place to store our children's memories in a beautiful, organized way. Our kids love reading through the timeline!",
    rating: 5,
  },
];

const FOOTER_COLS = [
  { title: "Product", links: ["Timeline", "Gallery", "Sharing", "Privacy"] },
  { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
  { title: "Support", links: ["Help Center", "Community", "Status", "Docs"] },
];

export default function LandingPage() {
  const { login, isLoggingIn } = useInternetIdentity();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 120]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur border-b border-border shadow-xs">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center">
              <TreePine className="w-4 h-4 text-white" strokeWidth={1.8} />
            </div>
            <span className="font-heading text-xl font-semibold text-charcoal tracking-tight">
              Kinship
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-warm-gray">
            <a
              href="#how-it-works"
              className="hover:text-charcoal transition-all duration-300"
              data-ocid="nav.link"
            >
              How It Works
            </a>
            <a
              href="#explore"
              className="hover:text-charcoal transition-all duration-300"
              data-ocid="nav.link"
            >
              Explore
            </a>
            <a
              href="#features"
              className="hover:text-charcoal transition-all duration-300"
              data-ocid="nav.link"
            >
              Features
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={login}
              className="text-sm font-medium text-warm-gray hover:text-charcoal transition-all duration-300"
              data-ocid="nav.link"
            >
              Log In
            </button>
            <Button
              onClick={login}
              disabled={isLoggingIn}
              className="bg-teal text-primary-foreground hover:bg-teal/90 rounded-full px-5 text-sm transition-all duration-300 shadow-warm hover:shadow-card-hover"
              data-ocid="landing.primary_button"
            >
              {isLoggingIn ? "Connecting…" : "Start Your Memory Book"}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        ref={heroRef}
        className="relative overflow-hidden grain-overlay"
        style={{ minHeight: "100svh" }}
      >
        {/* Parallax image */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 scale-110">
          <img
            src="/assets/generated/family-hero.dim_1400x700.jpg"
            alt="Happy family together"
            className="w-full h-full object-cover"
          />
        </motion.div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.14_0.020_55/0.4)] via-[oklch(0.14_0.020_55/0.65)] to-[oklch(0.14_0.020_55/0.90)]" />

        {/* Hero content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 flex flex-col items-center justify-center min-h-[100svh] px-6 pb-20"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-body text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-6 flex items-center gap-2"
          >
            <span className="w-8 h-px bg-gold inline-block" />
            Your Family Story
            <span className="w-8 h-px bg-gold inline-block" />
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-bold leading-[1.05] text-center mb-6 max-w-4xl"
          >
            Preserve Every <br />
            <span className="text-gradient-gold-teal">Precious Moment</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-white/75 text-lg leading-relaxed mb-10 max-w-xl text-center"
          >
            Create a living memory book for your family. Capture milestones,
            share stories, and relive cherished moments — together, forever.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-col sm:flex-row gap-3 items-center"
          >
            <Button
              onClick={login}
              disabled={isLoggingIn}
              size="lg"
              className="bg-gold text-charcoal hover:bg-gold/90 font-semibold px-9 rounded-full text-base shadow-gold transition-all duration-300 hover:scale-105 hover:shadow-lg"
              data-ocid="hero.primary_button"
            >
              {isLoggingIn ? "Connecting…" : "Begin Your Memory Book"}
            </Button>
            <button
              type="button"
              onClick={login}
              className="text-white/80 hover:text-white text-sm underline underline-offset-4 transition-all duration-300"
              data-ocid="nav.link"
            >
              Already have an account?
            </button>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              className="w-5 h-8 border-2 border-white/40 rounded-full flex items-start justify-center pt-1.5"
            >
              <div className="w-1 h-2 rounded-full bg-white/60" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-semibold text-gold-dark tracking-[0.2em] uppercase mb-3">
              Simple &amp; Intuitive
            </p>
            <h2 className="font-heading text-4xl md:text-5xl text-charcoal mb-4">
              How Kinship Works
            </h2>
            <p className="text-warm-gray text-lg">
              Simple steps to a lifetime of memories
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {HOW_STEPS.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="bg-card rounded-2xl p-8 shadow-card border border-border text-center group hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-cream mx-auto flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-all duration-300">
                  <item.icon
                    className="w-7 h-7 text-gold-dark"
                    strokeWidth={1.5}
                  />
                </div>
                <p className="text-xs font-bold text-gold-dark tracking-[0.2em] mb-3">
                  {item.step}
                </p>
                <h3 className="font-heading text-xl text-charcoal font-semibold mb-3">
                  {item.title}
                </h3>
                <p className="text-warm-gray text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Mock */}
      <section id="explore" className="py-28 bg-cream-deep px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-semibold text-gold-dark tracking-[0.2em] uppercase mb-3">
              Your Memory Archive
            </p>
            <h2 className="font-heading text-4xl md:text-5xl text-charcoal mb-4">
              Explore Your Memories
            </h2>
            <p className="text-warm-gray text-lg">
              A timeline and gallery in one beautiful place
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
              className="bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-card-hover transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-teal" />
                <p className="font-heading text-lg text-charcoal font-semibold">
                  Timeline
                </p>
              </div>
              <div className="space-y-5">
                {TIMELINE_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-gold border-2 border-gold-dark mt-1.5 shrink-0" />
                    </div>
                    <div className="flex-1 pb-1">
                      <p className="text-xs text-warm-gray mb-0.5">
                        {item.year}
                      </p>
                      <p className="text-sm font-medium text-charcoal">
                        {item.title}
                      </p>
                      <span className="inline-block mt-1.5 text-xs bg-gold/20 text-charcoal px-2.5 py-0.5 rounded-full border border-gold/30">
                        {item.tag}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-card-hover transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-gold" />
                <p className="font-heading text-lg text-charcoal font-semibold">
                  Gallery
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {GALLERY_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    className={`${
                      i % 3 === 0 ? "aspect-[3/4]" : "aspect-square"
                    } rounded-xl bg-gradient-to-br ${item.bg} flex items-end p-2 overflow-hidden hover:scale-105 transition-transform duration-300`}
                  >
                    <span className="text-xs font-semibold text-white/90 drop-shadow">
                      {item.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials + Features */}
      <section id="features" className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-14">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs font-semibold text-gold-dark tracking-[0.2em] uppercase mb-3">
                Family Stories
              </p>
              <h2 className="font-heading text-3xl md:text-4xl text-charcoal mb-10">
                Loved by Families Like Yours
              </h2>
              <div className="space-y-6">
                {TESTIMONIALS.map((t, i) => (
                  <motion.div
                    key={t.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: star rating has no other key
                        <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                      ))}
                    </div>
                    <p className="text-warm-gray text-sm leading-relaxed mb-4 italic">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center">
                        <span className="text-gold-dark font-bold text-sm">
                          {t.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-charcoal">
                          {t.name}
                        </p>
                        <p className="text-xs text-warm-gray">{t.relation}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p className="text-xs font-semibold text-gold-dark tracking-[0.2em] uppercase mb-3">
                Everything You Need
              </p>
              <h2 className="font-heading text-3xl md:text-4xl text-charcoal mb-10">
                Features You&apos;ll Love
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-10">
                {FEATURES.map((f, i) => (
                  <motion.div
                    key={f.label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    className="bg-card rounded-xl p-4 shadow-card border border-border flex items-center gap-3 hover:shadow-card-hover hover:border-gold/40 transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center shrink-0 group-hover:bg-gold/25 transition-all duration-300">
                      <f.icon
                        className="w-5 h-5 text-gold-dark"
                        strokeWidth={1.6}
                      />
                    </div>
                    <span className="text-sm font-medium text-charcoal">
                      {f.label}
                    </span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative overflow-hidden bg-teal rounded-2xl p-8 text-white"
              >
                {/* Subtle decorative circles */}
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/5" />
                <div className="absolute -right-4 top-8 w-20 h-20 rounded-full bg-white/5" />
                <div className="absolute -left-6 -bottom-6 w-24 h-24 rounded-full bg-white/5" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <TreePine className="w-5 h-5 text-gold" strokeWidth={1.6} />
                    <p className="font-heading text-xl font-semibold">
                      Ready to begin?
                    </p>
                  </div>
                  <p className="text-white/80 text-sm mb-6 leading-relaxed">
                    Join thousands of families preserving their most precious
                    memories.
                  </p>
                  <Button
                    onClick={login}
                    disabled={isLoggingIn}
                    className="bg-gold text-charcoal hover:bg-gold/90 font-semibold rounded-full px-6 shadow-gold hover:scale-105 transition-all duration-300"
                    data-ocid="cta.primary_button"
                  >
                    {isLoggingIn ? "Connecting…" : "Start Free Today"}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-cream-deep border-t border-border py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center">
                  <TreePine className="w-4 h-4 text-white" strokeWidth={1.8} />
                </div>
                <span className="font-heading text-xl font-semibold text-charcoal">
                  Kinship
                </span>
              </div>
              <p className="text-warm-gray text-sm leading-relaxed max-w-xs">
                A beautiful space to preserve and share your family&apos;s most
                treasured memories across generations.
              </p>
            </div>
            {FOOTER_COLS.map((col) => (
              <div key={col.title}>
                <p className="text-xs font-bold text-charcoal tracking-[0.15em] uppercase mb-4">
                  {col.title}
                </p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <span className="text-sm text-warm-gray hover:text-charcoal transition-all duration-300 cursor-default">
                        {link}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-warm-gray">
            <span>
              © {new Date().getFullYear()} Kinship. Made by Alishba Tanveer
            </span>
            <div className="flex gap-5">
              <span className="hover:text-charcoal transition-all duration-300 cursor-default">
                Terms
              </span>
              <span className="hover:text-charcoal transition-all duration-300 cursor-default">
                Privacy
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
