import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "./QuizStore";
import audio1 from "../assets/Audio/1 .mp3";
import audio2 from "../assets/Audio/2.mp3";
import audio3 from "../assets/Audio/3.mp3";
import audio4 from "../assets/Audio/4.mp3";

function Form2() {
  const navigate = useNavigate();
  const { quiz, setQuiz } = useQuiz();

  const [startTime, setStartTime] = useState(Date.now());
  const [answers, setAnswers] = useState<Record<string, string>>(quiz.form2 || {});
  const [audioCount, setAudioCount] = useState<Record<string, number>>(quiz.audioCount || {});

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  const questions = [
    { id: 1, audio: audio1, groups: { "1.1": ["あ⬈め", "あ⬊め"], "1.2": ["あ⬈め", "あ⬊め"] } },
    { id: 2, audio: audio2, groups: { "2.1": ["は⬈し", "は⬊し"], "2.2": ["は⬈し", "は⬊し"] } },
    { id: 3, audio: audio3, groups: { "3.1": ["か⬈み", "か⬊み"], "3.2": ["か⬈み", "か⬊み"] } },
    { id: 4, audio: audio4, groups: { "4.1": ["さ⬈け", "さ⬊け"], "4.2": ["さ⬈け", "さ⬊け"] } },
  ];

  const handleAnswer = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleAudioPlay = (id: string) => {
    setAudioCount((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const saveAndNavigate = (path: string) => {
    const timeSpent = Date.now() - startTime;
    setQuiz((prev: any) => ({
      ...prev,
      form2: answers,
      audioCount,
      timeSpent: { ...prev.timeSpent, form2: timeSpent },
    }));
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-[#2e7d86] flex items-center justify-center px-3 sm:px-6 lg:px-10 py-6">
      {/* MAIN CARD */}
      <div className="w-full max-w-4xl bg-[#a9c2c9] rounded-3xl sm:rounded-[50px] lg:rounded-[60px] p-4 sm:p-8 lg:p-10">
        {/* TITLE */}
        <p className="text-center text-white mb-8  sm:text-4xl lg:text-2xl font-bold">
          Audio Test 01
          එක් හඩපටයක ශබ්ධ ද්විත්වයක් පවතී. ඔබට ඇසෙන හඩේ උස් හෝ පහත් ස්වාභාවය පහතින් තෝරන්න.
          එහිදී එක් ප්‍රශ්ණයකට අදාළ පිළිතුරු 2ක් තිබිය යුතුය. ex: (⬈ = low – high  AND  ⬊= high – low)
        </p>

        {/* QUESTIONS */}
        {questions.map((q) => (
          <div key={q.id} className="w-full flex flex-col gap-5 mb-6">
            {/* NUMBER + AUDIO */}
            <div className="flex items-center gap-4">
              <span className="text-white text-lg sm:text-xl font-bold">{q.id}.</span>
              <audio controls className="w-full max-w-md" onPlay={() => handleAudioPlay(q.id.toString())}>
                <source src={q.audio} type="audio/mpeg" />
              </audio>
            </div>
            {/* GROUPS SIDE BY SIDE WITH LABEL ON LEFT */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 w-full">
              {Object.entries(q.groups).map(([key, opts]) => (
                <div key={key} className="flex items-center gap-3 min-w-[250px]">
                  {/* LABEL ON LEFT */}
                  <span className="font-bold text-lg text-white w-12">{key}</span>

                  {/* BUTTONS */}
                  <div className="flex flex-wrap gap-2">
                    {opts.map((opt : string) => (
                      <button
                        key={opt}
                        onClick={() => handleAnswer(key, opt)}
                        className={`bg-[#6aa0ab] rounded-full transition text-sm sm:text-base px-4 py-2 sm:w-28 sm:h-11 hover:scale-105 ${
                          answers[key] === opt ? "ring-4 ring-yellow-400" : ""
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* NAV BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-12">
          <button
            onClick={() => saveAndNavigate("/")}
            className="w-full sm:w-auto bg-gray-300 px-8 sm:px-12 py-3 rounded-full hover:bg-gray-400 transition"
          >
            Back
          </button>
          <button
            onClick={() => saveAndNavigate("/form3")}
            className="w-full sm:w-auto bg-gray-300 px-8 sm:px-12 py-3 rounded-full hover:bg-gray-400 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Form2;