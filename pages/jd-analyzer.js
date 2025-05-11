import { useState } from "react";

export default function JDAnalyzer() {
  const [skills, setSkills] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeJD = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/analyze-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills, job_description: jobDescription }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: "Failed to connect to backend." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">
        Job Description Analyzer
      </h1>

      <form onSubmit={analyzeJD} className="max-w-3xl mx-auto bg-white p-6 rounded shadow space-y-4">
        <textarea
          className="w-full p-2 border rounded"
          rows={3}
          placeholder="Enter your resume skills (comma-separated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />
        <textarea
          className="w-full p-4 border rounded"
          rows={8}
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Analyzing..." : "Analyze JD"}
        </button>
      </form>

      {result && (
        <div className="max-w-3xl mx-auto mt-8 bg-white p-6 rounded shadow space-y-2">
          {result.error ? (
            <p className="text-red-600">{result.error}</p>
          ) : (
            <>
              <p><strong>Match Score:</strong> {result.match_score}/100</p>
              <p><strong>Overlapping Skills:</strong> {result.overlapping_skills.join(", ")}</p>
              <p><strong>Missing Skills:</strong> {result.missing_skills.join(", ")}</p>
            </>
          )}
        </div>
      )}
    </main>
  );
}
