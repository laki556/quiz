import { useNavigate } from "react-router-dom";

function ThankYou() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#2e7d86] flex items-center justify-center px-4">
      <div className="bg-[#a9c2c9] rounded-3xl sm:rounded-[50px] p-8 sm:p-12 text-center max-w-xl w-full">

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          Thank You for Your Participation!
        </h1>

        <p className="text-white text-base sm:text-lg mb-6">
          Your responses have been successfully submitted.<br/>
          We truly appreciate your time and valuable input.
        </p>

        <button
          onClick={() => navigate("/")}
          className="bg-green-500 text-white px-8 py-3 rounded-full hover:bg-green-600 transition"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}

export default ThankYou;