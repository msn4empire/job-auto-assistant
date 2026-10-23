import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def generate_tailored_resume(profile, job_description: str, base_resume_text: str = ""):
    skills_str = ", ".join(profile.skills) if profile.skills else ""
    github_langs = ", ".join(profile.github_data.get('top_languages', [])) if profile.github_data else ""
    
    base_resume_context = f"\nCandidate's Existing Base Resume:\n{base_resume_text}\n" if base_resume_text else ""
    
    prompt = f"""
    Act as an expert technical recruiter and resume writer. 
    Write a tailored resume in Markdown format for the following candidate, directly targeting the provided job description.
    
    Candidate Name: {profile.full_name}
    Email: {profile.email}
    Core Skills: {skills_str}
    GitHub Languages: {github_langs}
    {base_resume_context}
    
    Job Description:
    {job_description}
    
    Ensure the resume strongly highlights their QA automation experience (especially 2.2 years at 7-Eleven), alongside their web development and testing frameworks, to perfectly match the job requirements. Use professional, high-impact phrasing. Use the base resume provided as the foundation.
    """
    
    response = client.models.generate_content(
        model='gemini-3.8-flash',
        contents=prompt
    )
    return response.text
