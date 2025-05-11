import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";

let html2pdf = null;
if (typeof window !== "undefined") {
  html2pdf = require("html2pdf.js");
}


export default function ResumeForm() {
  const [formData, setFormData] = useState({
    name: "",
    skills: "",
    experience: "",
    job_title: "",
  });

  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState("");
  const pdfRef = useRef();

const handleDownload = () => {
  if (!pdfRef.current || !html2pdf) return;

  html2pdf().from(pdfRef.current).save("resume.pdf");
};



  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResume("");

    try {
      const res = await fetch("http://127.0.0.1:5000/api/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResume(data.resume || data.error || "Something went wrong.");
    } catch (err) {
      setResume("Failed to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        AI Resume Generator
      </h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white p-6 rounded shadow space-y-4"
      >
        <input
          name="name"
          placeholder="Your Name"
          className="w-full p-2 border rounded"
          onChange={handleChange}
        />
        <input
          name="job_title"
          placeholder="Job Title"
          className="w-full p-2 border rounded"
          onChange={handleChange}
        />
        <textarea
          name="skills"
          placeholder="Skills (comma-separated)"
          className="w-full p-2 border rounded"
          rows="2"
          onChange={handleChange}
        />
        <textarea
          name="experience"
          placeholder="Experience summary"
          className="w-full p-2 border rounded"
          rows="3"
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Generating..." : "Generate Resume"}
        </button>
      </form>

      {resume && (
        <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded shadow whitespace-pre-wrap">
          <h2 className="text-xl font-semibold mb-4">Generated Resume:</h2>
          <div className="space-y-4">
{resume && (
  <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded shadow">
    <div ref={pdfRef}>
      <h2 className="text-xl font-semibold mb-4">Generated Resume:</h2>
      <div className="space-y-4">
        {resume.split("\n\n").map((section, index) => (
          <div key={index} className="text-gray-800 whitespace-pre-line">
            {section.includes(":") ? (
              <>
                <h3 className="text-lg font-semibold text-blue-700 mb-1">
                  {section.split(":")[0]}
                </h3>
                <p>{section.split(":").slice(1).join(":").trim()}</p>
              </>
            ) : (
              <p>{section}</p>
            )}
          </div>
        ))}
      </div>
    </div>

    <button
      onClick={handleDownload}
      className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      Download as PDF
    </button>
  </div>
)}
</div>
</div>
      )}
    </main>
  );
}
