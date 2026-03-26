import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "./QuizStore";
import audio1 from "../assets/Audio/audio2/21.mp3";
import audio2 from "../assets/Audio/audio2/22.mp3";
import audio3 from "../assets/Audio/audio2/23.mp3";
import audio4 from "../assets/Audio/audio2/24.mp3";
import audio5 from "../assets/Audio/audio2/25.mp3";

function Form4() {
  const navigate = useNavigate();
  const { quiz, setQuiz } = useQuiz();

  const questions = [
    { id: 1, audio: audio1, options: ["雨 - rain", "飴 - candies"], correct: "雨 - rain" },
    { id: 2, audio: audio2, options: ["橋 - bridge", "箸-chopsticks"], correct: "橋 - bridge" },
    { id: 3, audio: audio3, options: ["神 - god", "髪 - hair"], correct: "神 - god" },
    { id: 4, audio: audio4, options: ["鮭 - salmon", "酒 - sake"], correct: "鮭 - salmon" },
    { id: 5, audio: audio5, options: ["牡蠣 - oyster", "柿-persimmon"], correct: "牡蠣 - oyster" },
  ];

  const [answers, setAnswers] = useState<Record<number,string>>(quiz.form4 || {});

  const handleAnswer = (id:number,value:string) => {
    setAnswers(prev => ({...prev,[id]:value}));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach(q => { if(answers[q.id]===q.correct) score++; });
    return score;
  };

  const handleBack = () => {
    setQuiz((prev: any) => ({...prev, form4: answers}));
    navigate("/form3");
  };

  const handleSubmit = async () => {
    setQuiz((prev: any) => ({...prev, form4: answers}));

    const allResponses = {
      ...quiz.form1,
      ...quiz.form2,
      ...quiz.form3,
      ...answers
    };

    const score = calculateScore();

    const payload = {
      name: quiz.form1.name,
      responses: allResponses,
      answerType: quiz.answerType,
      score
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/submit`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      alert(`Score: ${score}\n${data.message}`);
    } catch(err){
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#2e7d86] flex items-center justify-center">
      <div className="w-full max-w-4xl bg-[#a9c2c9] rounded-[60px] p-10">
        <h1 className="text-center text-5xl text-white mb-6">Audio Test 03</h1>

        <div className="space-y-10">
          {questions.map(q=>(
            <div key={q.id} className="flex flex-col items-center gap-4">
              <audio controls>
                <source src={q.audio} type="audio/mpeg"/>
              </audio>
              <div className="flex gap-6">
                <p>{q.id}</p>
                {q.options.map(word=>(
                  <button key={word} onClick={()=>handleAnswer(q.id,word)}
                    className={`bg-[#6aa0ab] w-32 h-12 rounded-full text-xl ${
                      answers[q.id]===word ? "ring-4 ring-yellow-400":""
                    }`}
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-12">
          <button onClick={handleBack} className="bg-gray-300 px-12 py-3 rounded-full">Back</button>
          <button onClick={handleSubmit} className="bg-gray-300 px-12 py-3 rounded-full">Submit</button>
        </div>
      </div>
    </div>
  );
}

export default Form4;