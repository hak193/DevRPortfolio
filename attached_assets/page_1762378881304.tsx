import React, { useState } from "react";

const examplePrompts = [
    "A task management app for remote teams",
    "A personal finance tracker with charts",
    "A booking system for a local gym",
];

export default function AIBuilder() {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");
    const [error, setError] = useState("");

    const handleGenerate = async () => {
        setLoading(true);
        setError("");
        setResult("");
        try {
            const res = await fetch("/api/generate-app", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });
            const data = await res.json();
            if (data.error) setError(data.error);
            else setResult(data.result);
        } catch (e) {
            setError(`Failed to generate application. ${e instanceof Error ? e.message : ""}`);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-[#18192b] text-white">
            <section className="w-full max-w-2xl mx-auto text-center">
                <h1 className="text-3xl sm:text-4xl font-bold mb-8 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    AI Builder
                </h1>
                <div className="mb-4 flex flex-wrap gap-2 justify-center">
                    {examplePrompts.map((ex) => (
                        <button
                            key={ex}
                            className="px-4 py-2 rounded bg-gradient-to-r from-indigo-500 to-pink-500 text-white text-sm hover:scale-105 transition"
                            onClick={() => setPrompt(ex)}
                        >
                            {ex}
                        </button>
                    ))}
                </div>
                <div className="bg-[#23234a] rounded-xl shadow-lg p-8 flex flex-col gap-6">
                    <textarea
                        className="w-full h-32 p-4 rounded-lg bg-[#18192b] text-white border border-indigo-500 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none mb-4"
                        placeholder="Describe your application..."
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                    />
                    <button
                        className="w-full py-3 rounded-lg font-semibold text-lg bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-lg hover:scale-105 transition flex items-center justify-center gap-2"
                        onClick={handleGenerate}
                        disabled={loading || !prompt}
                    >
                        {loading ? (
                            <span className="animate-spin inline-block w-5 h-5 border-2 border-t-2 border-indigo-500 border-t-pink-500 rounded-full mr-2"></span>
                        ) : (
                            <span>Generate Application</span>
                        )}
                        <span className="ml-2">→</span>
                    </button>
                    {error && <div className="text-red-400 mt-2">{error}</div>}
                    {result && (
                        <div className="mt-6 p-4 bg-[#18192b] rounded-lg border border-indigo-500 text-left">
                            <h2 className="font-bold mb-2 text-indigo-400">Generated App Preview:</h2>
                            <pre className="whitespace-pre-wrap text-sm text-gray-200">{result}</pre>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
}
