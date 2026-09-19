import { useScroll, useTransform, motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { useContent } from "../context/ContentContext";
import { Mail, Send, CheckCircle2, ArrowRight } from "lucide-react";

const EMAILJS_SERVICE_ID  = "service_gha7k8n";
const EMAILJS_TEMPLATE_ID = "template_3yqhd0l";
const EMAILJS_PUBLIC_KEY  = "kzjV6myYnsFlE8BZL";

function ContactPage() {
  const { content } = useContent();
  const contact = content?.contact || {};
  const containerRef = useRef(null);
  const formRef      = useRef(null);

  const [form, setForm]     = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Clip path circle expands to cover full screen right as we reach the end
  const clipPath = useTransform(
    scrollYProgress,
    [0.05, 0.92],
    ["circle(8% at 50% 50%)", "circle(140% at 50% 50%)"]
  );

  // Scroll hint fades out early as reveal begins
  const scrollHintOpacity = useTransform(
    scrollYProgress,
    [0, 0.15],
    [1, 0]
  );

  // Left card: slides into place and fades in alongside expanding circle
  const leftX = useTransform(scrollYProgress, [0.15, 0.92], [-70, 0]);
  const leftOpacity = useTransform(scrollYProgress, [0.15, 0.88], [0, 1]);
  const leftScale = useTransform(scrollYProgress, [0.15, 0.92], [0.92, 1]);

  // Right card: on mobile, no large horizontal offset (prevents offscreen clipping); subtle vertical slide + fade instead
  const rightX = useTransform(scrollYProgress, [0.18, 0.94], [isMobile ? 0 : 70, 0]);
  const rightY = useTransform(scrollYProgress, [0.18, 0.94], [isMobile ? 24 : 0, 0]);
  const rightOpacity = useTransform(scrollYProgress, [0.18, 0.90], [0, 1]);
  const rightScale = useTransform(scrollYProgress, [0.18, 0.94], [0.94, 1]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      // 1. Submit to portfolio backend database
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to send message. Please try again.");
      }

      // 2. Also send via EmailJS if configured (non-blocking)
      try {
        if (formRef.current && EMAILJS_SERVICE_ID && EMAILJS_PUBLIC_KEY) {
          await emailjs.sendForm(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            formRef.current,
            EMAILJS_PUBLIC_KEY
          );
        }
      } catch (emailErr) {
        console.warn("EmailJS notification error:", emailErr);
      }

      setStatus("success");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      console.error("Contact submit error:", err);
      setErrorMsg(err.message || "Failed to send. Please try again.");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const inputClass =
    "w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl bg-white dark:bg-gray-800/95 border border-slate-300 dark:border-gray-700/80 shadow-sm outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 text-base sm:text-sm transition-all duration-200";

  return (
    <div
      id="contact"
      ref={containerRef}
      className="h-[160vh] sm:h-[180vh] bg-slate-200 dark:bg-black relative transition-colors duration-300"
    >
      {/* Single sticky viewport — expands with clip-path reveal */}
      <div className="sticky top-0 h-screen h-[100dvh] relative overflow-hidden flex items-center justify-center">

        {/* ── Scroll hint on the raw background (z-5, behind panel) ── */}
        <motion.div
          style={{ opacity: scrollHintOpacity, zIndex: 5 }}
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 sm:gap-2 pointer-events-none"
        >
          <span className="text-slate-800 dark:text-white text-xs sm:text-sm font-medium tracking-wide drop-shadow-md">
            Scroll to reveal
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800 dark:text-white drop-shadow-md"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* ── Expanding Clip-path panel (z-10, on top of indicator) ── */}
        <motion.div
          style={{ clipPath, zIndex: 10 }}
          className="absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-gray-950 transition-colors duration-300 px-4 sm:px-6 lg:px-8"
        >
          {/* MAIN GRID */}
          <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6 lg:gap-14 items-center my-auto py-2 sm:py-4">
            
            {/* LEFT SIDE — info showcase (slides in alongside expanding circle on md+ screens) */}
            <motion.div
              style={{
                x: leftX,
                opacity: leftOpacity,
                scale: leftScale,
              }}
              className="hidden md:flex justify-center"
            >
              <div className="w-80 p-8 border border-slate-200/80 dark:border-white/10 rounded-3xl flex flex-col items-center justify-center gap-5 bg-white/90 dark:bg-gray-900/70 shadow-2xl backdrop-blur-xl text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-500/20 to-cyan-500/20 border border-violet-500/30 flex items-center justify-center text-violet-600 dark:text-violet-400 shadow-inner">
                  <Mail className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                    Direct Contact
                  </h3>
                  <p className="text-slate-600 dark:text-gray-300 text-xs leading-relaxed px-2">
                    {contact.tagline || "I'm always open to exciting ideas and collaborations."}
                  </p>
                </div>
                <a
                  href={`mailto:${contact.email || "matimelkamu15@gmail.com"}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 text-violet-700 dark:text-violet-300 text-xs font-semibold border border-violet-500/20 transition-all hover:scale-105"
                >
                  <span>{contact.email || "matimelkamu15@gmail.com"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>

            {/* RIGHT SIDE — form (slides into place alongside expanding circle) */}
            <motion.div
              style={{
                x: rightX,
                y: rightY,
                opacity: rightOpacity,
                scale: rightScale,
              }}
              className="flex flex-col justify-center max-w-md mx-auto md:max-w-none w-full"
            >
              <div className="mb-2 sm:mb-4">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-slate-900 dark:text-white tracking-tight mb-1 sm:mb-1.5">
                  {contact.heading || "Have Some Questions?"}
                </h2>
                <p className="text-slate-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">
                  {contact.subtitle || "Feel free to send your message anytime, or reach out directly at"}{" "}
                  <a
                    href={`mailto:${contact.email || "matimelkamu15@gmail.com"}`}
                    className="text-violet-600 dark:text-violet-400 font-semibold underline underline-offset-2 break-all"
                  >
                    {contact.email || "matimelkamu15@gmail.com"}
                  </a>
                  .
                </p>
              </div>

              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center justify-center py-8 sm:py-10 gap-3 sm:gap-4 text-center bg-gray-900/90 rounded-2xl sm:rounded-3xl shadow-xl border border-emerald-900/40 backdrop-blur-sm p-4"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-900/30 flex items-center justify-center border border-emerald-500/20">
                      <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-white">Message Sent!</h3>
                    <p className="text-gray-400 text-xs sm:text-sm max-w-xs">
                      Thanks for reaching out. I'll get back to you as soon as possible.
                    </p>
                  </motion.div>
                ) : (
                  <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="space-y-2.5 sm:space-y-3.5"
                  >
                    <input type="hidden" name="title" value="Portfolio Contact" />

                    <div>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Your Full Name"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="What's your email?"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <textarea
                        rows={3}
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        placeholder="Your questions or project ideas..."
                        className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl bg-white dark:bg-gray-800/95 border border-slate-300 dark:border-gray-700/80 shadow-sm outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 text-base sm:text-sm resize-none transition-all duration-200"
                      />
                    </div>

                    {status === "error" && (
                      <p className="text-rose-500 text-xs sm:text-sm text-center font-medium">{errorMsg}</p>
                    )}

                    <motion.button
                      type="submit"
                      disabled={status === "loading"}
                      whileHover={{ scale: status === "loading" ? 1 : 1.02 }}
                      whileTap={{ scale: status === "loading" ? 1 : 0.98 }}
                      className="w-full py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:brightness-110 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-1"
                    >
                      {status === "loading" ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          <span>Sending…</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>SEND MESSAGE</span>
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Footer credit at the absolute bottom of panel */}
          <div className="absolute bottom-2 sm:bottom-3 left-0 right-0 text-center pointer-events-none px-4">
            <p className="text-[10px] sm:text-xs text-slate-400 dark:text-gray-500 tracking-wider">
              © {new Date().getFullYear()} Matias Melkamu • Built with React & Tailwind CSS
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ContactPage;
