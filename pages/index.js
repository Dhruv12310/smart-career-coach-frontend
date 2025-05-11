export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-4 text-center">
        Smart Career Coach 🚀
      </h1>
      <p className="text-lg text-gray-700 mb-6 text-center max-w-xl">
        Your AI-powered job search companion. Generate tailored resumes,
        analyze job descriptions, practice mock interviews, and track applications — all in one place.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
          Get Started
        </button>
        <button className="bg-white border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-50 transition">
          Learn More
        </button>
      </div>
    </main>
  );
}
