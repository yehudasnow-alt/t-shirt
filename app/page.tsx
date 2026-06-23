"use client";

import React, { useState } from "react";
import { Sparkles, Shirt, Wand2, Package, ChevronRight, Loader2, Image as ImageIcon } from "lucide-react";

export default function App() {
  const [screen, setScreen] = useState("auth");
  const [user, setUser] = useState<{name: string, credits: number} | null>(null);
  const [color, setColor] = useState("black");
  const [style, setStyle] = useState("90s Vintage");
  const [memory, setMemory] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [finalImage, setFinalImage] = useState("");

  const handleLogin = () => {
    setUser({ name: "יהודה", credits: 3 });
    setScreen("wizard");
  };

  const generateDesign = () => {
    if (!memory) return alert("נא להזין זיכרון או Vibe כדי להמשיך");
    setScreen("loading");
    setLogs([]);
    const pipelineSteps = [
      "🚀 מאמת זהות ובודק יתרת קרדיטים...",
      "📝 מתרגם את הזיכרון לפרומפט אדריכלי...",
      "🎨 DALL-E 3 HD החל ביצירת הגרפיקה...",
      "✂️ מסיר רקע באמצעות Photoroom API...",
      "☁️ שומר קובץ PNG 300DPI לאחסון...",
      "🌍 פותח ערוץ הזמנה מול Printful US...",
      "✅ תהליך הושלם. מכין תצוגה מקדימה..."
    ];
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < pipelineSteps.length) {
        setLogs(prev => [...prev, pipelineSteps[currentStep]]);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setFinalImage("https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop");
          setUser(prev => prev ? { ...prev, credits: prev.credits - 1 } : null);
          setScreen("success");
        }, 1000);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0d0d11] text-gray-100 font-sans" dir="rtl">
      <header className="flex justify-between items-center p-6 border-b border-gray-800">
        <div className="text-2xl font-bold bg-gradient-to-l from-purple-500 to-pink-500 bg-clip-text text-transparent">SOULPRINT AI</div>
        {user && (
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span>👤 {user.name}</span>
            <span className="bg-gray-800 px-3 py-1 rounded-full text-purple-400">{user.credits} קרדיטים</span>
          </div>
        )}
      </header>
      <main className="max-w-6xl mx-auto p-6 mt-8">
        {screen === "auth" && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in">
            <Sparkles className="w-16 h-16 text-purple-500 mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">האופי והאנרגיה שלך. <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">מודפסים על פרימיום.</span></h1>
            <button onClick={handleLogin} className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg mt-8">התחברות מהירה ב-Google</button>
          </div>
        )}
        {screen === "wizard" && (
          <div className="grid md:grid-cols-2 gap-12 animate-in fade-in">
            <div className="bg-[#16161f] p-8 rounded-2xl border border-gray-800">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-2"><Wand2 className="text-pink-500"/> אפיין את ה-Vibe שלך</h2>
              <div className="mb-8">
                <label className="block text-gray-400 mb-3">צבע חולצה</label>
                <div className="flex gap-4">
                  <button onClick={() => setColor("black")} className={`p-4 border-2 rounded-xl ${color==="black" ? "border-purple-500" : "border-gray-700"}`}>שחור</button>
                  <button onClick={() => setColor("white")} className={`p-4 border-2 rounded-xl ${color==="white" ? "border-purple-500" : "border-gray-700"}`}>לבן</button>
                </div>
              </div>
              <div className="mb-8">
                <label className="block text-gray-400 mb-3">זיכרון / מילה מרכזית</label>
                <input type="text" value={memory} onChange={(e) => setMemory(e.target.value)} placeholder="e.g. Tokyo Trip 2024" className="w-full bg-[#1c1c27] border-2 border-gray-700 rounded-xl p-4 text-white"/>
              </div>
              <button onClick={generateDesign} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-4 rounded-xl font-bold text-lg">ג'נרט עיצוב <ChevronRight className="inline"/></button>
            </div>
            <div className="flex items-center justify-center bg-[#111118] rounded-2xl border border-gray-800 p-8">
              <Shirt className="w-64 h-64 text-gray-800"/>
            </div>
          </div>
        )}
        {screen === "loading" && (
          <div className="max-w-2xl mx-auto py-20 text-center animate-in fade-in">
            <Loader2 className="w-16 h-16 text-purple-500 animate-spin mx-auto mb-8" />
            <h2 className="text-3xl font-bold mb-8">המנוע עובד...</h2>
            <div className="bg-black border border-gray-800 rounded-xl p-6 text-right font-mono text-sm text-green-400 h-64 flex flex-col gap-2">
              {logs.map((log, i) => <div key={i}>{">"} {log}</div>)}
            </div>
          </div>
        )}
        {screen === "success" && (
          <div className="grid md:grid-cols-2 gap-12 animate-in fade-in">
            <div className="relative flex justify-center items-center bg-[#111118] rounded-2xl border border-gray-800 p-8 min-h-[500px]">
              <Shirt className="w-full max-w-sm text-gray-900" />
              <div className="absolute top-[35%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40">
                <img src={finalImage} alt="Design" className="w-full h-auto drop-shadow-2xl mix-blend-multiply" />
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-4xl font-bold mb-4">היצירה שלך מוכנה.</h2>
              <div className="text-3xl font-bold mb-8">$39.99</div>
              <button onClick={() => alert("Simulating checkout...")} className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg mb-4 flex items-center justify-center gap-2"><Package /> רכוש עכשיו</button>
              <button onClick={() => setScreen("wizard")} className="w-full border border-gray-700 py-4 rounded-xl font-bold text-white">נסה שוב</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}