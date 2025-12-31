import React, { useState } from 'react';
import { generateCoachTip } from '../services/gemini';
import { MessageCircle, Send, Sparkles } from 'lucide-react';

const AiCoach: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    setLoading(true);
    const tip = await generateCoachTip(question);
    setAnswer(tip);
    setLoading(false);
  };

  const predefinedQuestions = [
    "How to start?",
    "Scared to ride",
    "Helmet fit?",
    "Best age?"
  ];

  return (
    <section id="coach" className="py-20 bg-brand-dark relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-violet/20 rounded-full blur-[100px]" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 bg-brand-gold rounded-2xl mb-4 shadow-[0_0_20px_rgba(250,204,21,0.4)]">
              <Sparkles className="w-8 h-8 text-brand-dark" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Ask the AI <span className="text-brand-gold">Coach</span>
            </h2>
            <p className="text-gray-300">
              New to balance bikes? Have a question about training your toddler? 
              <br className="hidden md:block"/> Our AI expert is here to help with instant tips!
            </p>
          </div>

          <div className="space-y-6">
            {/* Answer Display */}
            {answer && (
              <div className="bg-brand-violet/40 border border-brand-violet/50 p-6 rounded-2xl animate-fade-in text-white shadow-inner">
                <p className="font-medium text-lg flex gap-3">
                  <span className="text-2xl">💡</span>
                  {answer}
                </p>
              </div>
            )}

            {/* Input Area */}
            <form onSubmit={handleAsk} className="relative">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ex: My child is afraid to lift their feet..."
                className="w-full bg-white/10 border border-white/20 rounded-full py-4 pl-6 pr-14 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-2 bottom-2 bg-brand-gold text-brand-dark p-3 rounded-full hover:bg-yellow-400 disabled:opacity-50 transition-colors"
              >
                {loading ? <div className="w-5 h-5 border-2 border-brand-dark border-t-transparent rounded-full animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </form>

            {/* Quick Chips */}
            <div className="flex flex-wrap gap-2 justify-center">
              {predefinedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => setQuestion(q)}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiCoach;