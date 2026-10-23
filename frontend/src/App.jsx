import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Briefcase, RefreshCw, FileText, Sparkles, CloudUpload, Link, ExternalLink } from 'lucide-react';

const API_PROFILE = 'https://job-auto-assistant.onrender.com/api/profile';
const API_RESUME = 'https://job-auto-assistant.onrender.com/api/resume/generate';

export default function App() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '', email: '', target_roles: '', github_username: ''
  });
  
  const [jobDescription, setJobDescription] = useState('');
  const [generatedResume, setGeneratedResume] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [baseResumeFile, setBaseResumeFile] = useState(null);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(API_PROFILE);
      setProfile(res.data);
      setFormData({
        full_name: res.data.full_name || '',
        email: res.data.email || '',
        target_roles: res.data.target_roles ? res.data.target_roles.join(', ') : '',
        github_username: res.data.github_username || ''
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

  const applyNaukri = () => {
    const role = formData.target_roles.split(',')[0] || 'qa-automation';
    const query = role.trim().replace(/\s+/g, '-').toLowerCase();
    window.open(`https://www.naukri.com/${query}-jobs`, '_blank');
  };

  const applyLinkedIn = () => {
    const role = formData.target_roles.split(',')[0] || 'QA Automation';
    const query = encodeURIComponent(role.trim());
    window.open(`https://www.linkedin.com/jobs/search/?keywords=${query}`, '_blank');
  };

  const generateResume = async () => {
    if (!jobDescription.trim()) return alert("Please paste a job description first.");
    setIsGenerating(true);
    
    const formDataToSend = new FormData();
    formDataToSend.append('description', jobDescription);
    if (baseResumeFile) {
      formDataToSend.append('base_resume', baseResumeFile);
    }

    try {
      const res = await axios.post(API_RESUME, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
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
            <span className="bg-red-600 p-2 rounded-lg text-white"><Briefcase size={24} /></span>
            <span>Auto<span className="text-red-600">Assistant</span></span>
          </h1>
          <div className="flex gap-4">
            <button onClick={applyNaukri} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all">
              <ExternalLink size={16} /> Naukri Auto-Search
            </button>
            <button onClick={applyLinkedIn} className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all">
              <Link size={16} /> LinkedIn Auto-Search
            </button>
          </div>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-900"></div>
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
                <User className="text-red-500" size={20} /> Core Details
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
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Base Resume (PDF)</label>
                  <div className="w-full bg-zinc-900 border border-zinc-800 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-zinc-400 hover:border-red-500 transition-colors cursor-pointer relative">
                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => setBaseResumeFile(e.target.files[0])} accept=".pdf" />
                    <CloudUpload size={24} className="mb-2" />
                    <span className="text-sm font-medium">{baseResumeFile ? baseResumeFile.name : "Click or drag to upload PDF"}</span>
                  </div>
                </div>
                <button type="submit" className="w-full bg-zinc-800 text-white p-2 rounded-lg font-bold hover:bg-zinc-700 transition-all">Save Config</button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-8">
            <div className="bg-zinc-950 p-8 rounded-2xl border border-zinc-800 shadow-2xl flex flex-col h-full">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
                <Sparkles className="text-red-500" size={20} /> AI Tailoring Engine
              </h2>
              
              <div className="mb-6 flex-grow flex flex-col">
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Paste Job Description</label>
                <textarea 
                  className="w-full flex-grow min-h-[150px] bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-zinc-300 focus:outline-none focus:border-red-500 resize-none text-sm font-mono" 
                  placeholder="Paste the target job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              <button onClick={generateResume} disabled={isGenerating} className="w-full bg-red-600 text-white p-4 rounded-xl font-bold hover:bg-red-700 flex justify-center items-center gap-2 transition-all active:scale-[0.98] text-lg disabled:opacity-70 disabled:cursor-not-allowed">
                {isGenerating ? <><RefreshCw size={20} className="animate-spin" /> Tailoring Resume...</> : <><FileText size={20} /> Tailor Resume to Job</>}
              </button>

              {generatedResume && (
                <div className="mt-8 animate-in fade-in duration-500">
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
