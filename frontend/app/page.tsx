"use client";

import { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";

export default function Home() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionRefs.current.forEach((ref) => ref && observer.observe(ref));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-blue-900 to-gray-900 opacity-30"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <Navbar />

      <main className="relative z-10">
        {/* Hero Section */}
        <section
          ref={(el) => {
            sectionRefs.current[0] = el;
          }}
          className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 opacity-0"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 animate-fade-in-down">
              AI-Powered Therapy for Your Mind
            </h1>
            <p className="text-xl text-blue-200 mb-8 animate-fade-in-up animation-delay-300">
              Experience personalized mental health support with our advanced AI
              agents, available 24/7.
            </p>
            <a
              href="#"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 hover:shadow-lg animate-fade-in-up animation-delay-600"
            >
              Start Your Journey
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          ref={(el) => {
            sectionRefs.current[1] = el;
          }}
          className="py-20 px-4 sm:px-6 lg:px-8 opacity-0"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-extrabold text-center mb-12">
              Why Choose MindAI?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "24/7 Availability",
                  description: "Access support anytime, anywhere.",
                },
                {
                  title: "Personalized Therapy",
                  description: "AI-tailored sessions for your unique needs.",
                },
                {
                  title: "Data-Driven Insights",
                  description: "Track your progress with advanced analytics.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 transform transition duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-blue-200">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          ref={(el) => {
            sectionRefs.current[2] = el;
          }}
          className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800 bg-opacity-50 opacity-0"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-extrabold text-center mb-12">
              What Our Users Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  name: "Alex P.",
                  quote:
                    "MindAI has been a game-changer for my mental health journey.",
                },
                {
                  name: "Sam T.",
                  quote:
                    "I love how I can access support whenever I need it. Truly revolutionary!",
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 transform transition duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <p className="text-lg mb-4">"{testimonial.quote}"</p>
                  <p className="text-blue-300 font-semibold">
                    {testimonial.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          id="contact"
          ref={(el) => {
            sectionRefs.current[3] = el;
          }}
          className="py-20 px-4 sm:px-6 lg:px-8 opacity-0"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold mb-4">
              Ready to Transform Your Mental Health?
            </h2>
            <p className="text-xl text-blue-200 mb-8">
              Join thousands of users who have found peace and growth with
              MindAI.
            </p>
            <a
              href="#"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Get Started Now
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
