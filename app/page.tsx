import React, { useState, useEffect } from 'react';
import { Sparkles, Shirt, Wand2, Package, CheckCircle2, ChevronRight, Loader2, Image as ImageIcon } from 'lucide-react';

export default function App() {
  const [screen, setScreen] = useState('auth');
  const [user, setUser] = useState<{ name: string; credits: number } | null>(null);
  
  // Selections
  const [color, setColor] = useState('black');
  const [fit, setFit] = useState('Oversized');
  const [style, setStyle] = useState('90s Vintage');
  const [memory, setMemory] = useState('');
  
  // Generation State
  const [logs, setLogs] = useState<string[]>([]);
  const [finalImage, setFinalImage] = useState('');

  // Mock Login
  const handleLogin = () => {
    setUser({ name: 'יהודה', credits: 3 });
    setScreen('wizard');
  };

  // Mock Generation Engine
  const generateDesign = () => {
    if (!memory) return alert('נא להזין זיכרון או Vibe כדי להמשיך');
    
    setScreen('loading');
    setLogs([]);
    
    const pipelineSteps = [
      "🚀 מאמת זהות ובודק יתרת קרדיטים...",
      `📝 מתרגם את הזיכרון "${memory}" לפרומפט אדריכלי...`,
      "🎨 DALL-E 3 HD החל ביצירת הגרפיקה על בסיס סגנון " + style + "...",
      "✂️ מסיר רקע באמצעות Photoroom API...",
      "☁️ שומר קובץ PNG 300DPI שקוף לאחסון ב-AWS S3...",
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
          // Set mock image based on style choice
          const mockImages: Record<string, string> = {
            '90s Vintage': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop',
            'Minimalist': 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=400&auto=format&fit=crop',
            'Cyberpunk': 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop'
          };
          setFinalImage(mockImages[style] || mockImages['90s Vintage']);
          setUser(prev => prev ? { ...prev, credits: prev.credits - 1 } : null);
          setScreen('success');
        }, 1000);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0d0d11] text-gray-100 font-sans" dir="rtl">
      {/* Header */}
      <header className="flex justify-between items-center p-6 border-b border-gray-800">
        <div className="text-2xl font-bold bg-gradient-to-l from-purple-500 to-pink-500 bg-clip-text text-transparent">
          SOULPRINT AI
        </div>
        {user && (
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span>👤 {user.name}</span>
            <span className="bg-gray-800 px-3 py-1 rounded-full text-purple-400">
              {user.credits} קרדיטים
            </span>
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto p-6 mt-8">
        
        {/* SCREEN 1: AUTH */}
        {screen === 'auth' && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-16 h-16 text-purple-500 mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              האופי והאנרגיה שלך. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                מודפסים על פרימיום.
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mb-12">
              אנחנו מתרגמים את הזיכרונות והוויב שלך לפריט לבוש יחיד במינו בעולם, המיוצר בארה"ב עם טכנולוגיית AI.
            </p>
            <button 
              onClick={handleLogin}
              className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3 hover:scale-105 transition-transform"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
              התחברות מהירה ב-Google
            </button>
          </div>
        )}

        {/* SCREEN 2: WIZARD */}
        {screen === 'wizard' && (
          <div className="grid md:grid-cols-2 gap-12 animate-in fade-in duration-500">
            {/* Control Panel */}
            <div className="bg-[#16161f] p-8 rounded-2xl border border-gray-800">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <Wand2 className="text-pink-500" /> אפיין את ה-Vibe שלך
              </h2>

              {/* Step 1 */}
              <div className="mb-8">
                <label className="block text-gray-400 mb-3 font-semibold">1. צבע חולצה (Printful Premium)</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'black', label: 'שחור', hex: '#111' },
                    { id: 'white', label: 'לבן', hex: '#f9f9f9' },
                    { id: 'cream', label: 'שמנת', hex: '#f4edd4' }
                  ].map(c => (
                    <button 
                      key={c.id}
                      onClick={() => setColor(c.id)}
                      className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${color === c.id ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700 hover:border-gray-500'}`}
                    >
                      <div className="w-6 h-6 rounded-full border border-gray-600 shadow-inner" style={{ backgroundColor: c.hex }} />
                      <span className="text-sm">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2 */}
              <div className="mb-8">
                <label className="block text-gray-400 mb-3 font-semibold">2. סגנון אמנותי</label>
                <div className="grid grid-cols-1 gap-3">
                  {['90s Vintage', 'Minimalist', 'Cyberpunk'].map(s => (
                    <button 
                      key={s}
                      onClick={() => setStyle(s)}
                      className={`p-4 rounded-xl border-2 text-right transition-all ${style === s ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700 bg-[#1c1c27] hover:border-gray-500'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3 */}
              <div className="mb-8">
                <label className="block text-gray-400 mb-3 font-semibold">3. זיכרון / מילה מרכזית (אנגלית מומלצת)</label>
                <input 
                  type="text" 
                  value={memory}
                  onChange={(e) => setMemory(e.target.value)}
                  placeholder="e.g. Tokyo Trip 2024, Born to Fly..."
                  className="w-full bg-[#1c1c27] border-2 border-gray-700 rounded-xl p-4 text-white focus:border-pink-500 outline-none"
                />
              </div>

              <button 
                onClick={generateDesign}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex justify-center items-center gap-2"
              >
                ג'נרט עיצוב מטורף <ChevronRight />
              </button>
            </div>

            {/* Preview Panel */}
            <div className="flex flex-col items-center justify-center bg-[#111118] rounded-2xl border border-gray-800 p-8">
              <Shirt className={`w-64 h-64 transition-colors duration-500 ${color === 'black' ? 'text-gray-900' : color === 'white' ? 'text-gray-100' : 'text-[#f4edd4]'}`} />
              <div className="text-gray-500 mt-8 flex items-center gap-2">
                <ImageIcon /> התצוגה תתעדכן לאחר הגי'נרוט
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 3: LOADING */}
        {screen === 'loading' && (
          <div className="max-w-2xl mx-auto py-20 text-center animate-in fade-in">
            <Loader2 className="w-16 h-16 text-purple-500 animate-spin mx-auto mb-8" />
            <h2 className="text-3xl font-bold mb-4">המנוע עובד...</h2>
            <p className="text-gray-400 mb-8">יוצר עבורך חולצה יחידה מסוגה בעולם</p>
            
            <div className="bg-black border border-gray-800 rounded-xl p-6 text-right font-mono text-sm text-green-400 h-64 overflow-hidden flex flex-col gap-2">
              {logs.map((log, i) => (
                <div key={i} className="animate-in slide-in-from-right-4">{'>'} {log}</div>
              ))}
            </div>
          </div>
        )}

        {/* SCREEN 4: SUCCESS */}
        {screen === 'success' && (
          <div className="grid md:grid-cols-2 gap-12 animate-in fade-in zoom-in-95 duration-500">
            {/* Visual Result */}
            <div className="relative flex justify-center items-center bg-[#111118] rounded-2xl border border-gray-800 p-8 min-h-[500px]">
              <Shirt className={`w-full max-w-sm transition-colors duration-500 ${color === 'black' ? 'text-gray-900' : color === 'white' ? 'text-gray-100' : 'text-[#f4edd4]'}`} />
              {/* Overlaid Image to simulate print */}
              <div className="absolute top-[35%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 flex items-center justify-center">
                 <img src={finalImage} alt="Design" className="w-full h-auto drop-shadow-2xl mix-blend-multiply" />
              </div>
            </div>

            {/* Checkout Options */}
            <div className="flex flex-col justify-center">
              <div className="inline-block bg-pink-500/20 text-pink-400 px-4 py-1 rounded-full text-sm font-bold mb-6 w-max">
                מוכן להדפסה - 300DPI
              </div>
              <h2 className="text-4xl font-bold mb-4">היצירה שלך מוכנה.</h2>
              <p className="text-gray-400 mb-8 text-lg">
                העיצוב עבר אופטימיזציה אוטומטית והרקע הוסר. החולצה תודפס במפעלי Printful בארה"ב ותישלח ישירות אליך.
              </p>

              <div className="text-3xl font-bold mb-2">$39.99</div>
              <div className="text-gray-500 mb-8">+ $4.99 משלוח עד הבית בארה"ב</div>

              <button 
                onClick={() => alert('מפעיל סימולציית סליקה של Stripe... לאחר מכן ההזמנה תישלח לפרינטפול!')}
                className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-colors mb-4 flex items-center justify-center gap-2"
              >
                <Package /> רכוש עכשיו (Stripe)
              </button>
              
              <button 
                onClick={() => setScreen('wizard')}
                className="w-full bg-transparent border border-gray-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors"
              >
                נסה שוב (נותרו {user?.credits} קרדיטים)
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}