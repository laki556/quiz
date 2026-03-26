import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../../constants/api.ts";

interface ResponseData {
  _id: string;
  name: string;
  responses: Record<string, any>;
  timeSpent?: {
    form1?: number;
    form2?: number;
    form3?: number;
  };
  totalTime?: number;
  answerType?: string;
  trainingInterest?: string;
  createdAt?: string;
}

const ResponseView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOne = async () => {
      try {
        const res = await API.get(`/api/responses/${id}`);
        setData(res.data);
      } catch (err: any) {
        console.error("Fetch error:", err);

        if (err.response?.status === 401) {
          localStorage.removeItem("admin_auth");
          localStorage.removeItem("admin_token");
          window.location.href = "/admin";
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOne();
  }, [id]);

  const formatTime = (ms?: number) => {
    if (!ms) return "-";
    return (ms / 1000).toFixed(2) + " sec";
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("en-LK", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const formatLabel = (key: string) =>
    key
      .replace(/\./g, " ")
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase());

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500">Loading...</div>
    );

  if (!data)
    return (
      <div className="p-6 text-center text-gray-500">
        No data found
      </div>
    );

  const r = data.responses;
  const t = data.timeSpent || {};

  // 🔥 Dynamic grouping
  const pitchKeys = Object.keys(r || {}).filter((key) =>
    key.includes(".")
  );

  const excludedKeys = [
    "name",
    "year",
    "jlpt",
    "studyJapanese",
    "similarWords",
    "pitchKnowledge",
    "pitchDifficulty",
    "reasons",
    "otherReason",
    "trainingInterest",
    "reasonForAnswer",
    "canIdentifyExamples",
    "reasonForNoQ6",
    "hasNoticedJapanesePitch",
    "heardPitchAccentFromSocialMedia",
    "japaneseVowelCountKnowledge",
  ];

  const wordKeys = Object.keys(r || {}).filter(
    (key) => !key.includes(".") && !excludedKeys.includes(key)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">

        {/* Top bar */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate("/admin")}
            className="bg-white border px-4 py-2 rounded-lg shadow-sm text-sm hover:bg-gray-100 transition"
          >
            ⬅ Back
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("admin_auth");
              localStorage.removeItem("admin_token");
              window.location.href = "/admin";
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            Logout
          </button>
        </div>

        {/* Header */}
        <h2 className="text-2xl font-bold mb-2">{data.name}</h2>
        <p className="text-sm text-gray-500 mb-4">
          Submitted: {formatDate(data.createdAt)}
        </p>

        {/* Basic */}
        <Section title="Basic Info">
          <Item label="Name" value={data.name} />
          <Item label="Year" value={r?.year} />
          <Item label="JLPT" value={r?.jlpt} />
          <Item label="Study Japanese" value={r?.studyJapanese} />
        </Section>

        {/* Words */}
        <Section title="Q3. පහත සඳහන් ජපන් වචන වල ඔබ දන්නා තේරුම් ලියන්න. ">
          {wordKeys.map((key) => (
            <Item
              key={key}
              label={formatLabel(key)}
              value={r?.[key]}
            />
          ))}
        </Section>

        {/* Pitch */}
        <Section title="Pitch Answers">
          {pitchKeys.map((key) => (
            <Item key={key} label={key} value={r?.[key]} />
          ))}
        </Section>

        {/* Understanding */}
        <Section title="Understanding">
          <Item label="Q5. ඔබ ඒවායෙහි අර්ථය හඳුනාගන්නේ කෙසේද?" value={r?.reasonForAnswer} />
          <Item
            label="Q6. මෙවැනි අර්ථ රැසක් ඇතැම් වචන වලට පැවතීම නිසා අවුල් සහගත තත්වයකට පත් වී තිබේද?"
            value={r?.canIdentifyExamples}
          />
          <Item label={`ප්‍රශ්න අංක 6ට "නැත" ලෙස පිළිතුරු දැක්වූවන් පමණක් පිළිතුරු සපයන්න.`} value={r?.reasonForNoQ6} />
        </Section>

        {/* Awareness */}
        <Section title="Awareness">
          <Item
            label="Q8. ජපන් ජාතිකයෙකු කතා කරන විට ඔවුන්ගේ හඬ උස් පහත් වීම පිළිබඳ අවධානය ලබා දී තිබෙනවාද?"
            value={r?.hasNoticedJapanesePitch}
          />
          <Item
            label="Q9. ජපන් භාෂාවේ ස්වර උස් පහත් වීම (Pitch Accent) පිළිබඳ අසා තිබේද?"
            value={r?.heardPitchAccentFromSocialMedia}
          />
          <Item
            label="Q10. ජපන් භාෂාවේ ස්වර උච්චාරණ ආකාර කීයද?"
            value={r?.japaneseVowelCountKnowledge}
          />
        </Section>

        {/* Other */}
        <Section title="Other">
          <Item label="Q4. ඇතැම් ජපන් වචන උච්චාරණය එකම වගේ වුණත් අර්ථය වෙනස් වන අවස්ථා ඇත." value={r?.similarWords} />
          <Item label="Q11. ඔබට ජපන් භාෂාවේ පවතින ස්වර උච්චාරණ මඟහැරී ඇති බව සිතනවාද?" value={r?.pitchKnowledge} />
          {/*<Item label="Pitch Difficulty" value={r?.pitchDifficulty} />*/}
          <Item
            label={`Q13. "උච්චාරණය එක හා සමාන වුවත් අර්ථය වෙනස් වචන" - නිවැරදිව උච්චාරණය කිරීමට,
            ඇහුම්කන්දීමට පුහුණුවීම මඟින් ජපන් භාෂා දැනුම වැඩි දියුණු කරගැනීමට`}
            value={r?.trainingInterest}
          />
          <Item label="Answer Type" value={data.answerType} />
        </Section>

        {/* Reasons */}
        {Array.isArray(r?.reasons) && r.reasons.length > 0 && (<Section title="Reasons">
          {Array.isArray(r?.reasons) && r.reasons.length > 0 ? (
            r.reasons.map((reason: string, index: number) => (
              <Item
                key={index}
                label={`Reason ${index + 1}`}
                value={reason}
              />
            ))
          ) : (
            <Item label="Reasons" value="-" />
          )}

          <Item label="Other Reason" value={r?.otherReason} />
        </Section>)}

        {/* Time */}
        <Section title="Time Analysis">
          <Item label="Form 1 Time" value={formatTime(t.form1)} />
          <Item label="Form 2 Time" value={formatTime(t.form2)} />
          <Item label="Form 3 Time" value={formatTime(t.form3)} />
          <Item label="Total Time" value={formatTime(data.totalTime)} />
        </Section>

      </div>
    </div>
  );
};

export default ResponseView;

// 🔹 Reusable components

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
                                                                           title,
                                                                           children,
                                                                         }) => (
  <div className="mb-4">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <div className="bg-white rounded-xl shadow-sm border p-4 space-y-2">
      {children}
    </div>
  </div>
);

const Item: React.FC<{ label: string; value: any }> = ({
                                                         label,
                                                         value,
                                                       }) => (
  <div className="flex justify-between text-sm border-b last:border-none py-1">
    <span className="text-gray-600">{label}</span>
    <span className="font-medium text-right break-words max-w-[60%]">
      {value || "-"}
    </span>
  </div>
);