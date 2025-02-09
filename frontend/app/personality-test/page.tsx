"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Mic,
  MicOff,
  WifiOff,
  Camera,
  CameraOff,
  ArrowRight,
} from "lucide-react";
import { analyzePersonality } from "@/app/utils/api";
import { useAccount } from "wagmi";

// Define interfaces for type safety
interface AnalysisResult {
  personalityAnalysis: {
    personalityTraits: string;
    communicationStyle: string;
    behavioralPatterns: string;
  };
  recommendedTherapist: {
    typeOfTherapist: string;
    therapeuticApproach: string;
  };
}

interface PersonalityData {
  question: string;
  answer: string;
}

// Animation variants for smooth transitions
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

// Camera component with real-time video feed
const CameraFeed = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [error, setError] = useState<string>("");

  // Function to initialize camera stream
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

  // Function to stop camera stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOn(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 backdrop-blur-md bg-white/[0.03] border border-white/[0.05] rounded-lg h-full"
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

// Main PersonalityTest component
const PersonalityTest = () => {
  // State management for core functionality
  const { address } = useAccount();

  const [isListening, setIsListening] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );
  const [progressWidth, setProgressWidth] = useState(0);
  const [networkError, setNetworkError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Refs for managing speech detection
  const silenceTimer = useRef<NodeJS.Timeout | null>(null);
  const lastSpeechTime = useRef<number>(Date.now());

  // Configuration constants
  const MAX_RETRIES = 3;

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
      console.log("interimTranscript", interimTranscript);
      const resultData = {
        walletAddress: address,
        personalityAnalysis: result.personalityAnalysis,
        recommendedTherapist: result.recommendedTherapist,
      };
      const response = await fetch("/api/personality-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resultData),
      });

      if (!response.ok) {
        throw new Error("Failed to save results");
      }

      const responseData = await response.json();
      console.log(responseData.message);
    } catch (error) {
      console.error("Error generating analysis:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during analysis.";
      setAnalysis({
        personalityAnalysis: {
          personalityTraits: `Analysis Error: ${errorMessage}`,
          communicationStyle: "N/A",
          behavioralPatterns: "N/A",
        },
        recommendedTherapist: {
          typeOfTherapist:
            "Unable to generate therapist recommendation at this time.",
          therapeuticApproach: "N/A",
        },
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Function to handle progression to next question
  const moveToNextQuestion = () => {
    if (currentTranscript.trim() || answers[currentQuestion]) {
      setAnswers((prev) => {
        const newAnswers = [...prev];
        newAnswers[currentQuestion] =
          currentTranscript || answers[currentQuestion];
        return newAnswers;
      });

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setProgressWidth(((currentQuestion + 2) / questions.length) * 100);
        setCurrentTranscript("");
        setInterimTranscript("");
      } else {
        const finalData = questions.map((question, index) => ({
          question,
          answer: answers[index] || currentTranscript,
        }));
        generateAnalysis(finalData);
        stopListening();
      }
    }
  };

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

  // Initialize speech recognition
  useEffect(() => {
    if (window.webkitSpeechRecognition) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = "en-US";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        setNetworkError(false);
        lastSpeechTime.current = Date.now();

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setCurrentTranscript(transcript);
          } else {
            setInterimTranscript(transcript);
          }
        }
      };

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

      recognition.onend = () => {
        if (isListening && !networkError) {
          recognition.start();
        }
      };

      setRecognition(recognition);
      setTimeout(() => {
        startListening();
      }, 1000);
    }

    return () => {
      if (silenceTimer.current) {
        clearTimeout(silenceTimer.current);
      }
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

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
          className="max-w-6xl mx-auto"
        >
          {!analysis ? (
            <div className="grid grid-cols-2 gap-6">
              {/* Left side: Questionnaire */}
              <motion.div
                variants={cardVariants}
                className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-2xl p-8 shadow-lg"
              >
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

                  <div className="flex justify-center space-x-4 mt-8">
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

                    {/* Next Question Button - Added for manual progression */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={moveToNextQuestion}
                      disabled={!currentTranscript && !answers[currentQuestion]}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-full ${
                        currentTranscript || answers[currentQuestion]
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90"
                          : "bg-gray-500 cursor-not-allowed"
                      } text-white font-bold transition-all duration-300`}
                    >
                      <span>Next</span>
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </div>

                  {networkError && <NetworkErrorMessage />}

                  {/* Real-time transcript display - Shows current speech input */}
                  {isListening && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 backdrop-blur-md bg-white/[0.03] border border-white/[0.05] rounded-lg"
                    >
                      <p className="text-blue-200/90">Currently speaking:</p>
                      <p className="text-white/90 italic mt-2">
                        {currentTranscript || "Listening..."}
                      </p>
                    </motion.div>
                  )}

                  {/* Previous answer display - Shows saved answer for current question */}
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
              </motion.div>

              {/* Right side: Camera Feed */}
              <motion.div
                variants={cardVariants}
                className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-2xl shadow-lg h-fit"
              >
                <CameraFeed />
              </motion.div>
            </div>
          ) : (
            // Analysis Results Display
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 gap-6"
            >
              {/* Left side: Personality Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 backdrop-blur-md bg-white/[0.03] border border-white/[0.05] rounded-lg"
              >
                <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
                  Your Personality Profile
                </h2>
                <div className="space-y-6">
                  <div className="prose prose-invert">
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold mb-3 text-blue-200">
                        Personality Traits
                      </h3>
                      <p className="text-white/90">
                        {analysis.personalityAnalysis.personalityTraits}
                      </p>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-xl font-semibold mb-3 text-blue-200">
                        Communication Style
                      </h3>
                      <p className="text-white/90">
                        {analysis.personalityAnalysis.communicationStyle}
                      </p>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-xl font-semibold mb-3 text-blue-200">
                        Behavioral Patterns
                      </h3>
                      <p className="text-white/90">
                        {analysis.personalityAnalysis.behavioralPatterns}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right side: Therapist Recommendation and Reset Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
              >
                <div className="p-6 backdrop-blur-md bg-white/[0.03] border border-white/[0.05] rounded-lg">
                  <h3 className="text-xl font-semibold mb-3 text-blue-200">
                    Recommended Therapist
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-medium text-blue-200/90 mb-2">
                        Type of Therapist
                      </h4>
                      <p className="text-white/90">
                        {analysis.recommendedTherapist.typeOfTherapist}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-blue-200/90 mb-2">
                        Therapeutic Approach
                      </h4>
                      <p className="text-white/90">
                        {analysis.recommendedTherapist.therapeuticApproach}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reset Assessment Button remains the same */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  onClick={() => {
                    setAnalysis(null);
                    setCurrentQuestion(0);
                    setAnswers([]);
                    setProgressWidth(0);
                    setCurrentTranscript("");
                    setInterimTranscript("");
                    setTimeout(startListening, 500);
                  }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Start New Assessment
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* Loading Overlay - Displayed during analysis */}
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
      </main>
    </div>
  );
};

export default PersonalityTest;
