// pages/dashboard.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../lib/AuthContext";
import AuthButton from "../components/AuthButton";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // 🔐 Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);
  const [resumeForm, setResumeForm] = useState({
    name: "",
    job_title: "",
    skills: "",
    experience: "",
  });
  const [resume, setResume] = useState("");
  const [loadingResume, setLoadingResume] = useState(false);

  const [jdSkills, setJDSkills] = useState("");
  const [jdText, setJDText] = useState("");
  const [jdResult, setJDResult] = useState(null);
  const [loadingJD, setLoadingJD] = useState(false);

  const [interviewForm, setInterviewForm] = useState({ job_title: "", skills: "" });
  const [interviewQs, setInterviewQs] = useState("");
  const [loadingQs, setLoadingQs] = useState(false);

  const [answers, setAnswers] = useState({});
  const [loadingAnswerIndex, setLoadingAnswerIndex] = useState(null);
  const [activeTab, setActiveTab] = useState("resume");

  if (loading || !user) {
    return <div className="p-6">Loading...</div>;
  }

  // ————————————————————————————
  // Your existing dashboard state & logic

  const generateResume = async (e) => {
    e.preventDefault();
    setLoadingResume(true);
    setResume("");

    try {
      const res = await fetch("https://smart-career-coach-backend.onrender.com/api/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resumeForm),
      });
      const data = await res.json();
      setResume(data.resume || data.error || "Something went wrong.");
    } catch {
      setResume("Failed to connect to backend.");
    } finally {
      setLoadingResume(false);
    }
  };

  const analyzeJD = async (e) => {
    e.preventDefault();
    setLoadingJD(true);
    setJDResult(null);

    try {
      const res = await fetch("https://smart-career-coach-backend.onrender.com/api/analyze-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: jdSkills, job_description: jdText }),
      });
      const data = await res.json();
      setJDResult(data);
    } catch {
      setJDResult({ error: "Failed to connect to backend." });
    } finally {
      setLoadingJD(false);
    }
  };

  // ————————————————————————————
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <AuthButton />
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Smart Career Coach 🚀
      </h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab("resume")}
          className={`px-4 py-2 rounded ${
            activeTab === "resume" ? "bg-blue-600 text-white" : "bg-white border"
          }`}
        >
          Resume Generator
        </button>
        <button
          onClick={() => setActiveTab("jd")}
          className={`px-4 py-2 rounded ${
            activeTab === "jd" ? "bg-blue-600 text-white" : "bg-white border"
          }`}
        >
          JD Analyzer
        </button>
        <button
          onClick={() => setActiveTab("interview")}
          className={`px-4 py-2 rounded ${
            activeTab === "interview" ? "bg-blue-600 text-white" : "bg-white border"
          }`}
        >
          Mock Interview
        </button>
      </div>

      {/* Resume Generator */}
      {activeTab === "resume" && (
        <section className="max-w-3xl mx-auto bg-white p-6 rounded shadow space-y-4">
          <form onSubmit={generateResume} className="space-y-4">
            <input
              placeholder="Your Name"
              className="w-full p-2 border rounded"
              onChange={(e) =>
                setResumeForm({ ...resumeForm, name: e.target.value })
              }
            />
            <input
              placeholder="Job Title"
              className="w-full p-2 border rounded"
              onChange={(e) =>
                setResumeForm({ ...resumeForm, job_title: e.target.value })
              }
            />
            <textarea
              placeholder="Skills (comma-separated)"
              className="w-full p-2 border rounded"
              onChange={(e) =>
                setResumeForm({ ...resumeForm, skills: e.target.value })
              }
            />
            <textarea
              placeholder="Experience summary"
              className="w-full p-2 border rounded"
              onChange={(e) =>
                setResumeForm({ ...resumeForm, experience: e.target.value })
              }
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {loadingResume ? "Generating..." : "Generate Resume"}
            </button>
          </form>
    {resume && (
      <>
      <div id="resume-content" className="mt-6 whitespace-pre-wrap bg-gray-50 p-4 rounded border">
      <h2 className="font-semibold text-lg mb-2">Generated Resume:</h2>
      <p>{resume}</p>
      </div>

    <button
      onClick={() => {
        const element = document.getElementById("resume-content");
        import("html2pdf.js").then((html2pdf) => {
          html2pdf.default().from(element).save("resume.pdf");
        });
      }}
      className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      Download as PDF
    </button>
  </>
)}

        </section>
      )}

      {/* JD Analyzer */}
      {activeTab === "jd" && (
        <section className="max-w-3xl mx-auto bg-white p-6 rounded shadow space-y-4">
          <form onSubmit={analyzeJD} className="space-y-4">
            <textarea
              placeholder="Your Resume Skills (comma-separated)"
              className="w-full p-2 border rounded"
              rows={2}
              value={jdSkills}
              onChange={(e) => setJDSkills(e.target.value)}
            />
            <textarea
              placeholder="Paste Job Description here..."
              className="w-full p-4 border rounded"
              rows={6}
              value={jdText}
              onChange={(e) => setJDText(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {loadingJD ? "Analyzing..." : "Analyze JD"}
            </button>
          </form>
          {jdResult && (
            <div className="space-y-2 border-t pt-4">
              {jdResult.error ? (
                <p className="text-red-600">{jdResult.error}</p>
              ) : (
                <>
                  <p>
                    <strong>Match Score:</strong> {jdResult.match_score}/100
                  </p>
                  <p>
                    <strong>Overlapping Skills:</strong>{" "}
                    {jdResult.overlapping_skills.join(", ")}
                  </p>
                  <p>
                    <strong>Missing Skills:</strong>{" "}
                    {jdResult.missing_skills.join(", ")}
                  </p>
                </>
              )}
            </div>
          )}
        </section>
      )}

      {/* Mock Interview */}
      {activeTab === "interview" && (
        <section className="max-w-3xl mx-auto bg-white p-6 rounded shadow space-y-4">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setLoadingQs(true);
              setInterviewQs("");

              try {
                const res = await fetch(
                  "https://smart-career-coach-backend.onrender.com/api/mock-interview",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(interviewForm),
                  }
                );
                const data = await res.json();
                setInterviewQs(data.questions || data.error);
              } catch {
                setInterviewQs("Failed to connect to backend.");
              } finally {
                setLoadingQs(false);
              }
            }}
            className="space-y-4"
          >
            <input
              placeholder="Job Title"
              className="w-full p-2 border rounded"
              onChange={(e) =>
                setInterviewForm({ ...interviewForm, job_title: e.target.value })
              }
            />
            <textarea
              placeholder="Relevant Skills (comma-separated)"
              className="w-full p-2 border rounded"
              onChange={(e) =>
                setInterviewForm({ ...interviewForm, skills: e.target.value })
              }
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              {loadingQs ? "Generating..." : "Generate Questions"}
            </button>
          </form>

          <ul className="space-y-4 list-decimal list-inside">
            {interviewQs
              .split("\n")
              .filter((q) => q.trim())
              .map((q, idx) => {
                const question = q.replace(/^\d+[\).\s]*/, "");

                const handleGetAnswer = async () => {
                  setLoadingAnswerIndex(idx);
                  try {
                    const res = await fetch(
                      "https://smart-career-coach-backend.onrender.com/api/mock-answer",
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ question }),
                      }
                    );
                    const data = await res.json();
                    setAnswers((prev) => ({ ...prev, [idx]: data.answer }));
                  } catch {
                    setAnswers((prev) => ({
                      ...prev,
                      [idx]: "Error loading answer.",
                    }));
                  } finally {
                    setLoadingAnswerIndex(null);
                  }
                };

                return (
                  <li key={idx} className="text-gray-800">
                    <p className="font-medium">{question}</p>
                    {!answers[idx] && (
                      <button
                        onClick={handleGetAnswer}
                        className="mt-1 text-sm text-blue-600 underline hover:text-blue-800"
                      >
                        {loadingAnswerIndex === idx
                          ? "Loading..."
                          : "Show Sample Answer"}
                      </button>
                    )}
                    {answers[idx] && (
                      <div className="mt-2 bg-gray-50 border p-3 rounded text-sm text-gray-700 whitespace-pre-wrap">
                        {answers[idx]}
                      </div>
                    )}
                  </li>
                );
              })}
          </ul>
        </section>
      )}
    </main>
  );
}
