import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, ArrowRight } from "lucide-react";

const PersonalityTest = () => {
  const [isListening, setIsListening] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [recognition, setRecognition] = useState(null);
  const [progressWidth, setProgressWidth] = useState(0);

  const questions = [
    "How do you typically spend your free time?",
    "How do you handle stressful situations?",
    "Describe your ideal social gathering.",
    "How do you approach making important decisions?",
    "What energizes you more: being alone or being with others?",
    "How do you prefer to receive feedback?",
    "What's your typical reaction to unexpected changes?",
    "How do you express your emotions?",
    "What role do you usually take in group settings?",
    "How do you recharge after a demanding day?",
  ];

  useEffect(() => {
    if ((window as any).webkitSpeechRecognition) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const answer = event.results[0][0].transcript;
        setAnswers((prev) => [...prev, answer]);
        setIsListening(false);
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion((prev) => prev + 1);
          setProgressWidth(((currentQuestion + 2) / questions.length) * 100);
        } else {
          analyzePersonality([...answers, answer]);
        }
      };

      setRecognition(recognition);
    }
  }, [currentQuestion]);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const analyzePersonality = (allAnswers) => {
    // ... (keeping the same analysis logic as before)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400/20 via-blue-900/20 to-gray-900/40"></div>
        <div className="absolute left-0 top-1/4 w-[500px] h-[500px] bg-blue-400/30 rounded-full mix-blend-soft-light filter blur-[128px] animate-blob"></div>
        <div className="absolute right-0 top-1/3 w-[600px] h-[600px] bg-indigo-400/30 rounded-full mix-blend-soft-light filter blur-[128px] animate-blob animation-delay-2000"></div>
      </div>

      <main className="relative z-10 container mx-auto px-4 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="max-w-3xl mx-auto"
        >
          <motion.div
            variants={cardVariants}
            className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-2xl p-8 shadow-lg"
          >
            {!analysis ? (
              <>
                {/* Progress bar */}
                <div className="mb-8">
                  <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressWidth}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p className="text-blue-200/90 mt-2 text-sm">
                    Question {currentQuestion + 1} of {questions.length}
                  </p>
                </div>

                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
                    {questions[currentQuestion]}
                  </h2>

                  <div className="flex justify-center mt-8">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={isListening ? stopListening : startListening}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-full ${
                        isListening
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-gradient-to-r from-blue-500 to-indigo-500"
                      } text-white font-bold transition-all duration-300`}
                    >
                      {isListening ? (
                        <>
                          <MicOff className="w-5 h-5" />
                          <span>Stop Recording</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-5 h-5" />
                          <span>Start Recording</span>
                        </>
                      )}
                    </motion.button>
                  </div>

                  {answers[currentQuestion] && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 backdrop-blur-md bg-white/[0.03] border border-white/[0.05] rounded-lg"
                    >
                      <p className="text-blue-200/90">Your answer:</p>
                      <p className="text-white/90 italic mt-2">
                        {answers[currentQuestion]}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
                  Your Personality Profile
                </h2>
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 backdrop-blur-md bg-white/[0.03] border border-white/[0.05] rounded-lg"
                  >
                    <h3 className="text-xl font-semibold mb-3 text-blue-200">
                      Personality Insights
                    </h3>
                    <p className="text-white/90">{analysis.profile}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-6 backdrop-blur-md bg-white/[0.03] border border-white/[0.05] rounded-lg"
                  >
                    <h3 className="text-xl font-semibold mb-3 text-blue-200">
                      Therapist Recommendation
                    </h3>
                    <p className="text-white/90">{analysis.recommendation}</p>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default PersonalityTest;
