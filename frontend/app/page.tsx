"use client";

import { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

export default function Home() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Enhanced intersection observer with more sophisticated animation logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
            (entry.target as HTMLElement).style.opacity = "1";
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    sectionRefs.current.forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  // Animation variants for smoother transitions
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Enhanced background effects */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400/20 via-blue-900/20 to-gray-900/40"></div>

        {/* Modernized blob animations positioned on the sides */}
        <div className="absolute left-0 top-1/4 w-[500px] h-[500px] bg-blue-400/30 rounded-full mix-blend-soft-light filter blur-[128px] animate-blob"></div>
        <div className="absolute right-0 top-1/3 w-[600px] h-[600px] bg-indigo-400/30 rounded-full mix-blend-soft-light filter blur-[128px] animate-blob animation-delay-2000"></div>
        <div className="absolute left-0 bottom-1/4 w-[700px] h-[700px] bg-purple-400/30 rounded-full mix-blend-soft-light filter blur-[128px] animate-blob animation-delay-4000"></div>
      </div>

      {/* Enhanced glassmorphism navbar */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-white/[0.02] border-b border-white/[0.05] shadow-lg">
        <Navbar />
      </div>

      <main className="relative z-10">
        {/* Enhanced Hero Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          ref={(el) => {
            sectionRefs.current[0] = el;
          }}
          className="pt-32 pb-20 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-blue-400 to-purple-200">
              AI-Powered Therapy for Your Mind
            </h1>
            <p className="text-xl md:text-2xl text-blue-200/90 mb-10">
              Experience personalized mental health support with our advanced AI
              agents, available 24/7.
            </p>
            <motion.a
              href="#"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
            >
              Start Your Journey
            </motion.a>
          </div>
        </motion.section>

        {/* Enhanced Features Section */}
        <section
          ref={(el) => {
            sectionRefs.current[1] = el;
          }}
          className="py-24 px-4 sm:px-6 lg:px-8 opacity-0"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
              Why Choose MindAI?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "24/7 Availability",
                  description:
                    "Access support anytime, anywhere with our always-on AI companions.",
                  gradient: "from-blue-400 to-blue-600",
                },
                {
                  title: "Personalized Therapy",
                  description:
                    "Experience uniquely tailored sessions that adapt to your personal growth journey.",
                  gradient: "from-indigo-400 to-indigo-600",
                },
                {
                  title: "Data-Driven Insights",
                  description:
                    "Gain deep understanding of your progress through advanced analytics and visualizations.",
                  gradient: "from-purple-400 to-purple-600",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-2xl p-8 h-full shadow-lg">
                    <h3
                      className={`text-2xl font-semibold mb-4 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}
                    >
                      {feature.title}
                    </h3>
                    <p className="text-lg text-blue-100/80">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Infinitely Scrolling Testimonials Carousel */}
        <section
          ref={(el) => {
            sectionRefs.current[2] = el;
          }}
          className="py-24 px-4 sm:px-6 lg:px-8 opacity-0 overflow-hidden"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
              What Our Users Say
            </h2>
            <div className="relative">
              <div className="flex space-x-6 animate-scroll">
                {[
                  {
                    name: "Alex P.",
                    role: "Tech Professional",
                    quote:
                      "MindAI has been a transformative force in my mental health journey. The personalized approach and 24/7 availability make it truly exceptional.",
                  },
                  {
                    name: "Sam T.",
                    role: "Creative Director",
                    quote:
                      "The combination of AI intelligence and human-like empathy is remarkable. It's like having a supportive friend who's always there when you need them.",
                  },
                  {
                    name: "Jamie L.",
                    role: "Student",
                    quote:
                      "As a busy student, MindAI has been a lifesaver. It's helped me manage stress and improve my focus, all on my own schedule.",
                  },
                  {
                    name: "Morgan K.",
                    role: "Healthcare Worker",
                    quote:
                      "The insights I've gained through MindAI have been invaluable. It's like having a personal therapist and life coach rolled into one.",
                  },
                ].map((testimonial, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-80 backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6"
                  >
                    <p className="text-lg text-blue-100/90 mb-4">
                      &quot;{testimonial.quote}&quot;
                    </p>
                    <div>
                      <p className="text-lg font-semibold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                        {testimonial.name}
                      </p>
                      <p className="text-blue-300/70">{testimonial.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section
      ref={(el) => {
        sectionRefs.current[3] = el;
      }}
      className="py-24 px-4 sm:px-6 lg:px-8 opacity-0"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
          Are You a Therapist Looking to Make an Impact?
        </h2>
        <p className="text-xl text-blue-200/90 mb-10">
          Join our platform and help individuals on their journey to mental wellness.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <motion.a
            href="/signup"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
          >
            Sign-Up
          </motion.a>
        </div>
      </div>
    </section>
      </main>
    </div>
  );
}
