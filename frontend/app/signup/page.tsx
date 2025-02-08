import SignUpForm from "@/components/SignupForm";

export default function TherapistSignUp() {
  return (
    <div className="flex">
      {/* Fixed Left Section */}
      <div className="w-1/2 h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-8 flex flex-col justify-center items-center fixed top-0 left-0">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Eunoia</h1>
        <p className="text-xl text-gray-600 mb-8 text-center">
          Join our platform and make a difference in mental health
        </p>
        <div className="w-4/41 h-64 bg-white rounded-lg shadow-lg overflow-hidden">
        <img src="/icon.png" alt="Eunoia Icon" className="w-full h-full object-cover" />
          <div className="w-full h-full bg-gradient-to-br from-blue-200 to-purple-200 animate-pulse"></div>
        </div>
      </div>

      {/* Scrollable Right Section */}
      <div className="w-1/2 min-h-screen bg-white p-8 flex items-center justify-center ml-auto overflow-y-auto">
        <SignUpForm />
      </div>
    </div>
  );
}
