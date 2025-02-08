"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, WifiOff, Camera, CameraOff } from "lucide-react";
import { analyzePersonality } from "@/app/utils/api";

// Define interfaces for type safety in our component
interface AnalysisResult {
  personalityAnalysis: string;
  recommendedTherapist: string;
}

interface PersonalityData {
  question: string;
  answer: string;
}

const CameraFeed = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [error, setError] = useState<string>("");

  // Function to start the camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOn(true);
        setError("");
      }
    } catch (err) {
      setError("Unable to access camera. Please check permissions.");
      console.error("Camera access error:", err);
    }
  };

  // Function to stop the camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOn(false);
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 p-6 backdrop-blur-md bg-white/[0.03] border border-white/[0.05] rounded-lg"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-blue-200">Camera Feed</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isCameraOn ? stopCamera : startCamera}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
            isCameraOn
              ? "bg-red-500 hover:bg-red-600"
              : "bg-gradient-to-r from-blue-500 to-indigo-500"
          } text-white font-medium transition-all duration-300`}
        >
          {isCameraOn ? (
            <>
              <CameraOff className="w-4 h-4" />
              <span>Stop Camera</span>
            </>
          ) : (
            <>
              <Camera className="w-4 h-4" />
              <span>Start Camera</span>
            </>
          )}
        </motion.button>
      </div>

      <div className="relative aspect-video w-full bg-black/20 rounded-lg overflow-hidden">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center text-red-400">
            {error}
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        )}
      </div>
    </motion.div>
  );
};

// Animation variants for smooth transitions between states
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

const PersonalityTest = () => {
  // State management for core functionality
  const [isListening, setIsListening] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );

  // UI state management
  const [progressWidth, setProgressWidth] = useState(0);
  const [networkError, setNetworkError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Refs for managing speech detection timing and processing
  const silenceTimer = useRef<NodeJS.Timeout | null>(null);
  const lastSpeechTime = useRef<number>(Date.now());
  const isProcessing = useRef(false);

  // Configuration constants
  const MAX_RETRIES = 3;
  const SILENCE_THRESHOLD = 3000; // Time in milliseconds to wait before considering speech complete

  // Questions for the personality assessment
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

  // Function to analyze personality based on answers
  const generateAnalysis = async (questionAnswers: PersonalityData[]) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzePersonality(questionAnswers);
      setAnalysis({
        personalityAnalysis: result.personalityAnalysis,
        recommendedTherapist: result.recommendedTherapist,
      });
    } catch (error) {
      console.error("Error generating analysis:", error);
      let errorMessage = "An unexpected error occurred during analysis.";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setAnalysis({
        personalityAnalysis: `Analysis Error: ${errorMessage}`,
        recommendedTherapist:
          "Unable to generate therapist recommendation at this time.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Function to handle progression to next question
  const moveToNextQuestion = () => {
    if (isProcessing.current) return;
    isProcessing.current = true;

    // Save current answer if it's not empty
    if (currentTranscript.trim()) {
      setAnswers((prev) => {
        const newAnswers = [...prev];
        newAnswers[currentQuestion] = currentTranscript;
        return newAnswers;
      });
    }

    // Reset transcripts for the next question
    setCurrentTranscript("");
    setInterimTranscript("");

    // Check if we're at the last question
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setProgressWidth(((currentQuestion + 2) / questions.length) * 100);

      // Restart recognition for the next question
      if (recognition) {
        recognition.stop();
        setTimeout(() => {
          recognition.start();
          isProcessing.current = false;
        }, 500);
      }
    } else {
      // Process final results when all questions are answered
      const finalData = questions.map((question, index) => ({
        question,
        answer: answers[index] || currentTranscript,
      }));

      generateAnalysis(finalData);
      stopListening();
    }
  };

  // Initialize speech recognition
  useEffect(() => {
    if (window.webkitSpeechRecognition) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = "en-US";

      // Handle speech recognition results
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        setNetworkError(false);
        lastSpeechTime.current = Date.now();

        let currentQuestionTranscript = "";

        // Process only the latest recognition results
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            currentQuestionTranscript = transcript;
            setCurrentTranscript(transcript);
          } else {
            setInterimTranscript(transcript);
          }
        }

        // Reset and set silence timer
        if (silenceTimer.current) {
          clearTimeout(silenceTimer.current);
        }

        silenceTimer.current = setTimeout(() => {
          if (Date.now() - lastSpeechTime.current >= SILENCE_THRESHOLD) {
            if (currentQuestionTranscript) {
              moveToNextQuestion();
            }
          }
        }, SILENCE_THRESHOLD);
      };

      // Handle recognition errors
      recognition.onerror = async (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error);

        if (event.error === "network") {
          setNetworkError(true);
          setIsListening(false);

          if (retryCount < MAX_RETRIES) {
            const backoffTime = Math.pow(2, retryCount) * 1000;
            await new Promise((resolve) => setTimeout(resolve, backoffTime));

            if (navigator.onLine) {
              setRetryCount((prev) => prev + 1);
              startListening();
            }
          }
        }
      };

      // Restart recognition when it ends (if still listening)
      recognition.onend = () => {
        if (isListening && !networkError) {
          recognition.start();
        }
      };

      setRecognition(recognition);

      // Start listening automatically when component mounts
      setTimeout(() => {
        startListening();
      }, 1000);
    }

    // Cleanup function
    return () => {
      if (silenceTimer.current) {
        clearTimeout(silenceTimer.current);
      }
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  // Functions to control recording state
  const startListening = () => {
    if (recognition) {
      try {
        recognition.start();
        setIsListening(true);
        setCurrentTranscript("");
        setInterimTranscript("");
        setNetworkError(false);
      } catch (error) {
        console.error("Error starting recognition:", error);
        setNetworkError(true);
        setIsListening(false);
      }
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  // Network error message component
  const NetworkErrorMessage = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
    >
      <div className="flex items-center space-x-2 text-red-400">
        <WifiOff className="w-5 h-5" />
        <p>Network connection issue detected</p>
      </div>
      <p className="text-white/70 mt-2">
        Please check your internet connection and try again.
      </p>
      {retryCount < MAX_RETRIES && (
        <button
          onClick={() => {
            setRetryCount(0);
            startListening();
          }}
          className="mt-3 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-md text-white/90 text-sm transition-colors"
        >
          Retry Recording
        </button>
      )}
    </motion.div>
  );

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
                      disabled={networkError}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-full ${
                        networkError
                          ? "bg-gray-500 cursor-not-allowed"
                          : isListening
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

                  {networkError && <NetworkErrorMessage />}

                  {/* Real-time transcript display */}
                  {isListening && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 backdrop-blur-md bg-white/[0.03] border border-white/[0.05] rounded-lg"
                    >
                      <p className="text-blue-200/90">Currently speaking:</p>
                      <p className="text-white/90 italic mt-2">
                        {interimTranscript ||
                          currentTranscript ||
                          "Listening..."}
                      </p>
                    </motion.div>
                  )}

                  {/* Previous answer display */}
                  {answers[currentQuestion] && !isListening && (
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
                <motion.div
                  variants={cardVariants}
                  className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-2xl p-8 shadow-lg h-fit"
                >
                  <CameraFeed />
                </motion.div>
              </>
            ) : (
              // Analysis display
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
                    transition={{ delay: 0.4 }}
                    className="p-6 backdrop-blur-md bg-white/[0.03] border border-white/[0.05] rounded-lg"
                  >
                    <h3 className="text-xl font-semibold mb-3 text-blue-200">
                      Therapist Recommendation
                    </h3>
                    <p className="text-white/90">
                      {analysis.recommendedTherapist}
                    </p>
                  </motion.div>

                  {/* Restart Assessment Button */}
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    onClick={() => {
                      // Reset all state to initial values
                      setAnalysis(null);
                      setCurrentQuestion(0);
                      setAnswers([]);
                      setProgressWidth(0);
                      setCurrentTranscript("");
                      setInterimTranscript("");
                      // Restart listening after a brief delay to ensure clean state
                      setTimeout(startListening, 500);
                    }}
                    className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Start New Assessment
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Loading Overlay - Shown during analysis */}
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="mt-4 text-blue-200">
                    Analyzing your responses...
                  </p>
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
