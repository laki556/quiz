import {useState, type ChangeEvent, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useQuiz} from "./QuizStore";

function Form1() {
  const navigate = useNavigate();
  const {quiz, setQuiz} = useQuiz();

  const [startTime, setStartTime] = useState(Date.now());

  const [formData, setFormData] = useState({
    name: quiz.form1?.name || "",
    year: quiz.form1?.year || "",
    jlpt: quiz.form1?.jlpt || "",
    studyJapanese: quiz.form1?.studyJapanese || "",
    ame: quiz.form1?.ame || "",
    hashi: quiz.form1?.hashi || "",
    kami: quiz.form1?.kami || "",
    hana: quiz.form1?.hana || "",
    similarWords: quiz.form1?.similarWords || "",
    // pitchAffectsMeaning: quiz.form1?.pitchAffectsMeaning || "",
    reasonForAnswer: quiz.form1?.reasonForAnswer || "",
    canIdentifyExamples: quiz.form1?.canIdentifyExamples || "",
    reasonForNoQ6: quiz.form1?.reasonForNoQ6 || "",
    hasNoticedJapanesePitch: quiz.form1?.hasNoticedJapanesePitch || "",
    heardPitchAccentFromSocialMedia: quiz.form1?.heardPitchAccentFromSocialMedia || "",
    japaneseVowelCountKnowledge: quiz.form1?.japaneseVowelCountKnowledge || "",
    pitchKnowledge: quiz.form1?.pitchKnowledge || "",
    // pitchDifficulty: quiz.form1?.pitchDifficulty || "",
    reasons: quiz.form1?.reasons || [] as string[],
    otherReason: quiz.form1?.otherReason || "",
    trainingInterest: quiz.form1?.trainingInterest || ""
  });

  useEffect(() => setStartTime(Date.now()), []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleCheckbox = (value: string) => {
    setFormData(prev => {
      const exists = prev.reasons.includes(value);
      return {
        ...prev,
        reasons: exists
          ? prev.reasons.filter((r: string) => r !== value)
          : [...prev.reasons, value]
      };
    });
  };

  const handleNext = () => {
    if (!formData.name || !formData.year) {
      alert("Fill name and academic year");
      return;
    }

    const timeSpent = Date.now() - startTime;

    setQuiz((prev: any) => ({
      ...prev,
      form1: formData,
      timeSpent: {...prev.timeSpent, form1: timeSpent}
    }));

    navigate("/form2");
  };

  const reasonsList = [
    " JLPT/NAT විභාග පමණක් අරමුණු කරමින් ඉගැන්වීම",
    " පාසලේ දී අවධානය ලබා නොදීම",
    " විශ්ව විද්‍යාලයේ දී අවධානය ලබා නොදීම",
    " අක්ෂර ලිවීමට පමණක් අවධානය යොමු කිරීම",
    " ගුරුවරුන් නිවැරදිව ඉගැන්වීම් සිදු නොකිරීම",
    " Pitch Accent සඳහා විශේෂ ඉගැන්වීමක් සිදු නොකිරීම"
  ];

  return (
    <div className="min-h-screen bg-teal-700 flex items-center justify-center 
                    px-3 sm:px-6 lg:px-10 py-6">

      {/* CARD */}
      <div className="
        bg-white 
        w-full 
        max-w-3xl 
        lg:max-w-4xl
        rounded-2xl 
        shadow-xl 
        p-4 sm:p-6 md:p-8
        space-y-6
      ">

        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center">
          QUESTIONNAIRE
        </h1>

        {/* Name + Year */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="නම"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
          />

          <input
            name="year"
            placeholder="අධ්‍යයන වර්ෂය"
            value={formData.year}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>

        {/* JLPT */}
        <div className="space-y-2">
          <p className="font-medium text-sm sm:text-base">1. JLPT මට්ටම</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[" N5", " N4", " N3", " N2", " තවම සමත් වී නැත."].map(lvl => (
              <label key={lvl} className="flex items-center gap-2">
                <input type="radio" name="jlpt"
                       value={lvl}
                       checked={formData.jlpt === lvl}
                       onChange={handleChange}/>
                {lvl}
              </label>
            ))}
          </div>
        </div>

        {/* Study Japanese */}
        <div className="space-y-2">
          <p>2. ඔබ ජපන් වාග්විද්‍යාව හදාරා හෝ හදාරමින් සිටිනවාද?</p>
          <div className="flex flex-wrap gap-6">
            {[" ඔව්", " නැත"].map(opt => (
              <label key={opt} className="flex items-center gap-2">
                <input type="radio" name="studyJapanese"
                       value={opt}
                       checked={formData.studyJapanese === opt}
                       onChange={handleChange}/>
                {opt}
              </label>
            ))}
          </div>
        </div>

        {/* Japanese Words */}
        <div>
          <p className="mb-3">
            3. පහත සඳහන් ජපන් වචන වල ඔබ දන්නා තේරුම් ලියන්න. (එක වචනයකට තේරුම් දෙකක් හෝ කිහිපයක් තිබිය හැකියි.)
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {key: "ame", label: "あめ"},
              {key: "hashi", label: "はし"},
              {key: "kami", label: "かみ"},
              {key: "hana", label: "はな"}
            ].map(({key, label}) => (
              <div key={key}>
                <label className="block font-medium mb-1">{label}</label>
                <input
                  name={key}
                  value={formData[key as keyof typeof formData]}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Pitch Affects Meaning */}
        <div>
          <p>4. ඇතැම් ජපන් වචන උච්චාරණය එකම වගේ වුණත් අර්ථය වෙනස් වන අවස්ථා ඇත.<br/>
            (උදා; කුමො - වලාකුළු, මකුළුවා) ඔබට මෙවැනි වචන හමුවී තිබෙනවාද?</p>
          <div className="flex gap-6 mt-2">
            {[" ඔව්", " නැත"].map(opt => (
              <label key={opt} className="flex items-center gap-2">
                <input type="radio" name="similarWords"
                       value={opt}
                       checked={formData.similarWords === opt}
                       onChange={handleChange}/>
                {opt}
              </label>
            ))}
          </div>
        </div>

        {/* Reason for answer */}
        <div>
          <p className="mb-2">5. ඔබ ඒවායෙහි අර්ථය හඳුනාගන්නේ කෙසේද?</p>

          <input
            type="text"
            name="reasonForAnswer"
            placeholder="ඔබගේ පිළිතුර ලියන්න..."
            value={formData.reasonForAnswer}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        {/* Can Identify Examples */}
        <div>
          <p>6. මෙවැනි අර්ථ රැසක් ඇතැම් වචන වලට පැවතීම නිසා අවුල් සහගත තත්වයකට පත් වී තිබේද?</p>
          <div className="flex gap-6 mt-2">
            {[" ඔව්", " නැත"].map(opt => (
              <label key={opt} className="flex items-center gap-2">
                <input type="radio" name="canIdentifyExamples"
                       value={opt}
                       checked={formData.canIdentifyExamples === opt}
                       onChange={handleChange}/>
                {opt}
              </label>
            ))}
          </div>
        </div>

        {/* Reason for No Q6 */}
        {formData.canIdentifyExamples.trim() === "නැත" && ( <div>
          <p className="mb-2">7. ප්‍රශ්න අංක 6ට "නැත" ලෙස පිළිතුරු දැක්වූවන් පමණක් පිළිතුරු සපයන්න.
            එසේ අවුල් සහගත තත්වයකට පත් වී නැතිනම් එයට හේතුව කුමක්ද?</p>

          <input
            type="text"
            name="reasonForNoQ6"
            placeholder="ඔබගේ පිළිතුර ලියන්න..."
            value={formData.reasonForNoQ6}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />
        </div>)}

        {/* Has Noticed Japanese Pitch */}
        <div>
          <p className="mb-2">8. ජපන් ජාතිකයෙකු කතා කරන විට ඔවුන්ගේ හඬ උස් පහත් වීම පිළිබඳ අවධානය ලබා දී තිබෙනවාද?
          </p>

          <div className="space-y-2">
            {[
              "හැමවිටම",
              "සාමාන්‍යයෙන්",
              "කලාතුරකින්",
              "කොහෙත්ම නැහැ"
            ].map(opt => (
              <label key={opt} className="flex gap-2">
                <input type="radio"
                       name="hasNoticedJapanesePitch"
                       value={opt}
                       checked={formData.hasNoticedJapanesePitch === opt}
                       onChange={handleChange}/>
                {opt}
              </label>
            ))}
          </div>
        </div>

        {/* Heard PitchAccent From Social Media */}
        <div>
          <p>9. ජපන් භාෂාවේ ස්වර උස් පහත් වීම (Pitch Accent) පිළිබඳ අසා තිබේද? අවම වශයෙන් Social Media (youtube,
            facebook..) reels වල හෝ අසා, දැක තිබේද?</p>
          <div className="flex gap-6 mt-2">
            {[" ඔව්", " නැත"].map(opt => (
              <label key={opt} className="flex items-center gap-2">
                <input type="radio" name="heardPitchAccentFromSocialMedia"
                       value={opt}
                       checked={formData.heardPitchAccentFromSocialMedia === opt}
                       onChange={handleChange}/>
                {opt}
              </label>
            ))}
          </div>
        </div>

        {/* Japanese Vowel Count Knowledge */}
        <div>
          <p className="mb-2">10. ජපන් භාෂාවේ ස්වර උච්චාරණ ආකාර කීයද? </p>

          <div className="space-y-2">
            {[
              "1",
              "2",
              "3",
              "4",
              "නොදනී"
            ].map(opt => (
              <label key={opt} className="flex gap-2">
                <input type="radio"
                       name="japaneseVowelCountKnowledge"
                       value={opt}
                       checked={formData.japaneseVowelCountKnowledge === opt}
                       onChange={handleChange}/>
                {opt}
              </label>
            ))}
          </div>
        </div>

        {/*/!* Similar Words *!/*/}
        {/*<div>*/}
        {/*  <p>4. ඔබට මෙවැනි වචන හමුවී තිබෙනවාද?</p>*/}
        {/*  <div className="flex gap-6 mt-2">*/}
        {/*    {[" ඔව්"," නැත"].map(opt => (*/}
        {/*      <label key={opt} className="flex items-center gap-2">*/}
        {/*        <input type="radio" name="similarWords"*/}
        {/*               value={opt}*/}
        {/*               checked={formData.similarWords === opt}*/}
        {/*               onChange={handleChange}/>*/}
        {/*        {opt}*/}
        {/*      </label>*/}
        {/*    ))}*/}
        {/*  </div>*/}
        {/*</div>*/}

        {/* Pitch Knowledge */}
        <div>
          <p>11. ඔබට ජපන් භාෂාවේ පවතින ස්වර උච්චාරණ මඟහැරී ඇති බව සිතනවාද?</p>
          <div className="flex gap-6 mt-2">
            {[" ඔව්", " නැත"].map(opt => (
              <label key={opt} className="flex items-center gap-2">
                <input type="radio" name="pitchKnowledge"
                       value={opt}
                       checked={formData.pitchKnowledge === opt}
                       onChange={handleChange}/>
                {opt}
              </label>
            ))}
          </div>
        </div>

        {/* Reasons */}
        {formData.pitchKnowledge.trim() === "ඔව්" && (<div>
          <p className="mb-2">
            12. එයට හේතුව කුමක්දැයි ඔබ සිතනවාද? <br/>
            ප්‍රශ්ණ අංක (11) සඳහා “ඔව්“ ලෙස ප්‍රතිචාර දැක්වූවන් පමණක්, ප්‍රතිචාර දක්වන්න. කිහිපයකට
            ප්‍රතිචාර දැක්විය හැකියි.
          </p>

          <div className="space-y-2">
            {reasonsList.map(reason => (
              <label key={reason} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={formData.reasons.includes(reason)}
                  onChange={() => handleCheckbox(reason)}
                />
                {reason}
              </label>
            ))}
          </div>

          <input
            placeholder="වෙනත් (කරුණාකර සඳහන් කරන්න)"
            name="otherReason"
            value={formData.otherReason}
            onChange={handleChange}
            className="w-full border p-3 mt-3 rounded-lg"
          />
        </div>)}

        {/* Training Interest */}
        <div>
          <p className="mb-2">13. "උච්චාරණය එක හා සමාන වුවත් අර්ථය වෙනස් වචන" - නිවැරදිව උච්චාරණය කිරීමට,
            ඇහුම්කන්දීමට පුහුණුවීම මඟින් ජපන් භාෂා දැනුම වැඩි දියුණු කරගැනීමට
          </p>

          <div className="space-y-2">
            {[
              "කැමතියි",
              "අකමැතියි",
              "ඒ පිළිබඳ දැනුම පවතින බැවින් මා හට පුහුණුවක් අවශ්‍ය නැත."
            ].map(opt => (
              <label key={opt} className="flex gap-2">
                <input type="radio"
                       name="trainingInterest"
                       value={opt}
                       checked={formData.trainingInterest === opt}
                       onChange={handleChange}/>
                {opt}
              </label>
            ))}
          </div>
        </div>

        {/* Next Button */}
        <div className="flex justify-center sm:justify-end pt-4">
          <button
            onClick={handleNext}
            className="
              w-full sm:w-auto
              bg-blue-600 hover:bg-blue-700
              text-white
              px-8 py-3
              rounded-lg
              transition
            ">
            Next
          </button>
        </div>

      </div>
    </div>
  );
}

export default Form1;