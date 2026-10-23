import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Code, Save, Briefcase, RefreshCw, ChevronRight, FileText, Sparkles } from 'lucide-react';

const API_PROFILE = 'http://127.0.0.1:8000/api/profile';
const API_RESUME = 'http://127.0.0.1:8000/api/resume/generate';

export default function App() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '', email: '', phone: '', location: '', github_username: '', skills: '', target_roles: ''
  });
  
  // AI Resume States
  const [jobDescription, setJobDescription] = useState('');
  const [generatedResume, setGeneratedResume] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(API_PROFILE);
      setProfile(res.data);
      setFormData({
        ...res.data,
        skills: res.data.skills ? res.data.skills.join(', ') : '',
        target_roles: res.data.target_roles ? res.data.target_roles.join(', ') : ''
      });
    } catch (error) {
      console.log("No profile yet.");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()),
        target_roles: formData.target_roles.split(',').map(s => s.trim())
      };
      await axios.post(API_PROFILE, payload);
      await fetchProfile();
      alert("Profile Saved Successfully!");
    } catch (error) {
      alert("Error saving profile");
    }
    setLoading(false);
  };

  const syncGithub = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_PROFILE}/github/sync`);
      await fetchProfile();
      alert("GitHub Synced Successfully!");
    } catch (error) {
      alert("Error syncing GitHub");
    }
    setLoading(false);
  };

  const generateResume = async () => {
    if (!jobDescription.trim()) return alert("Please paste a job description first.");
    setIsGenerating(true);
    try {
      const res = await axios.post(API_RESUME, { description: jobDescription });
      setGeneratedResume(res.data.resume);
    } catch (error) {
      alert(error.response?.data?.detail || "Error generating resume");
    }
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-black p-8 font-sans text-gray-100 selection:bg-red-500 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="border-b border-zinc-800 pb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <span className="bg-red-600 p-2 rounded-lg text-white">
              <Briefcase size={24} />
            </span>
            <span>Auto<span className="text-red-600">Assistant</span></span>
          </h1>
          <div className="text-sm text-zinc-500 tracking-widest uppercase">System MVP v1.0</div>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Profile & GitHub */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-900"></div>
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
                <User className="text-red-500" size={20} /> Master Profile
              </h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Full Name</label>
                    <input type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-red-500" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Email</label>
                    <input type="email" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-red-500" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Target Roles</label>
                  <input type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-red-500" value={formData.target_roles} onChange={e => setFormData({...formData, target_roles: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Technical Skills</label>
                  <textarea className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-red-500 resize-none" rows="2" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">GitHub Username</label>
                  <input type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-red-500" value={formData.github_username} onChange={e => setFormData({...formData, github_username: e.target.value})} />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-red-600 text-white p-2 rounded-lg font-bold hover:bg-red-700 flex justify-center items-center gap-2 transition-all active:scale-[0.98]">
                  <Save size={16} /> {loading ? 'Saving...' : 'Save Config'}
                </button>
              </form>
            </div>

            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
                <Code className="text-red-500" size={20} /> Repo Intelligence
              </h2>
              {profile?.github_data?.top_languages ? (
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {profile.github_data.top_languages.map(lang => (
                      <span key={lang} className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs font-medium">{lang}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-zinc-500 text-sm mb-4">No data synced.</p>
              )}
              <button onClick={syncGithub} disabled={loading} className="w-full bg-zinc-900 border border-zinc-800 text-white p-2 rounded-lg font-bold hover:bg-zinc-800 flex justify-center items-center gap-2 transition-all active:scale-[0.98]">
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Sync GitHub
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: AI Resume Generator */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-zinc-950 p-8 rounded-2xl border border-zinc-800 shadow-2xl flex flex-col h-full">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
                <Sparkles className="text-red-500" size={20} /> AI Tailoring Engine
              </h2>
              
              <div className="mb-6 flex-grow flex flex-col">
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Paste Job Description</label>
                <textarea 
                  className="w-full flex-grow min-h-[150px] bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-zinc-300 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all resize-none font-mono text-sm leading-relaxed" 
                  placeholder="Paste the target job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              <button 
                onClick={generateResume} 
                disabled={isGenerating} 
                className="w-full bg-red-600 text-white p-4 rounded-xl font-bold hover:bg-red-700 flex justify-center items-center gap-2 transition-all active:scale-[0.98] text-lg shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <><RefreshCw size={20} className="animate-spin" /> Analyzing Requirements & Writing...</>
                ) : (
                  <><FileText size={20} /> Generate Tailored Resume</>
                )}
              </button>

              {generatedResume && (
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Output</h3>
                    <button onClick={() => navigator.clipboard.writeText(generatedResume)} className="text-xs bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded text-zinc-300 transition-colors">Copy to Clipboard</button>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-h-[400px] overflow-y-auto custom-scrollbar">
                    <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed">
                      {generatedResume}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
