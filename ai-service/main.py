import os
import io
import re
from typing import List, Optional
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, Response
from pydantic import BaseModel
import pypdf
import docx

app = FastAPI(
    title="HireFlow AI Screening Microservice",
    description="Intelligent PDF/DOCX Resume Extraction, Skill Matching, and Explainability Engine",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Common Technical Skills Taxonomy for Extraction
KNOWN_SKILLS = [
    "Python", "TypeScript", "JavaScript", "React", "Next.js", "NestJS", "Node.js",
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "Docker", "Kubernetes", "AWS",
    "GCP", "Azure", "GraphQL", "REST", "FastAPI", "Django", "Flask", "PyTorch",
    "TensorFlow", "Scikit-Learn", "Git", "CI/CD", "Tailwind CSS", "Linux",
    "Microservices", "Java", "Spring Boot", "C++", "C#", ".NET", "Go", "Rust",
    "Figma", "UI/UX", "System Architecture", "Elasticsearch", "Kafka",
]

class AnalyzeRequest(BaseModel):
    applicationId: str
    jobTitle: str
    jobDescription: str
    jobSkills: Optional[str] = ""
    candidateSkills: Optional[str] = ""
    resumeUrl: Optional[str] = None
    resumeText: Optional[str] = None

class AnalyzeResponse(BaseModel):
    applicationId: str
    overallMatchScore: int
    skillsMatched: List[str]
    skillsMissing: List[str]
    experienceMatch: str
    strengths: List[str]
    redFlags: List[str]
    matchExplanation: str

def extract_skills_from_text(text: str) -> List[str]:
    """Extract known technical skills using case-insensitive word boundary matching."""
    matched = []
    text_lower = text.lower()
    for skill in KNOWN_SKILLS:
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(pattern, text_lower):
            matched.append(skill)
    return matched

def extract_years_experience(text: str) -> Optional[int]:
    """Find mentions like '5+ years' or '3 years experience'."""
    pattern = r'(\d+)\+?\s*(?:years|yrs)\b'
    matches = re.findall(pattern, text.lower())
    if matches:
        return max([int(m) for m in matches if int(m) <= 40])
    return None

def extract_text_from_bytes(file_bytes: bytes, filename: str) -> str:
    """Extract plain text from PDF or DOCX file bytes."""
    filename_lower = filename.lower()
    extracted = ""

    if filename_lower.endswith(".pdf"):
        reader = pypdf.PdfReader(io.BytesIO(file_bytes))
        for page in reader.pages:
            t = page.extract_text()
            if t:
                extracted += t + "\n"

    elif filename_lower.endswith((".docx", ".doc")):
        doc = docx.Document(io.BytesIO(file_bytes))
        for p in doc.paragraphs:
            if p.text:
                extracted += p.text + "\n"

    return extracted.strip()

@app.get("/", response_class=HTMLResponse)
def root():
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>HireFlow AI Screening Engine</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 1.5rem; box-sizing: border-box; }
            .card { background: #1e293b; border: 1px solid #334155; padding: 2.5rem; border-radius: 1rem; max-width: 600px; width: 100%; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
            .badge { display: inline-block; background: #064e3b; color: #34d399; padding: 0.35rem 0.85rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 600; margin-bottom: 1.25rem; }
            h1 { font-size: 1.6rem; margin: 0 0 0.5rem 0; font-weight: 700; color: #ffffff; }
            p { color: #94a3b8; line-height: 1.6; margin: 0 0 1.5rem 0; font-size: 0.95rem; }
            .links { display: flex; flex-direction: column; gap: 0.75rem; }
            a.btn { display: inline-block; text-align: center; background: #2563eb; color: #ffffff; text-decoration: none; padding: 0.85rem 1.25rem; border-radius: 0.5rem; font-weight: 600; transition: background 0.2s; font-size: 0.95rem; }
            a.btn:hover { background: #1d4ed8; }
            a.btn-secondary { background: #334155; color: #f8fafc; }
            a.btn-secondary:hover { background: #475569; }
            .endpoints { background: #0f172a; border: 1px solid #334155; border-radius: 0.5rem; padding: 1.2rem; margin-top: 1.5rem; font-size: 0.875rem; }
            .endpoints strong { color: #e2e8f0; display: block; margin-bottom: 0.5rem; }
            .endpoints code { color: #38bdf8; font-family: monospace; }
        </style>
    </head>
    <body>
        <div class="card">
            <span class="badge">● Online & Ready</span>
            <h1>HireFlow AI Screening Microservice</h1>
            <p>FastAPI service for resume extraction (.PDF / .DOCX), explainable skill gap matching, and candidate ranking.</p>
            <div class="links">
                <a href="/docs" class="btn">🚀 Open Interactive Swagger Documentation (/docs)</a>
                <a href="/health" class="btn btn-secondary">🔍 Check Health Status (/health)</a>
            </div>
            <div class="endpoints">
                <strong>Active Microservice Endpoints:</strong>
                • <code>GET /health</code> - Service health check<br/>
                • <code>GET /docs</code> - Interactive Swagger UI<br/>
                • <code>POST /extract-text</code> - PDF/DOCX resume text extraction<br/>
                • <code>POST /analyze</code> - Match scoring & explainable analysis
            </div>
        </div>
    </body>
    </html>
    """

@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return Response(status_code=204)

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "HireFlow AI Resume Screening Microservice",
        "version": "1.0.0",
    }

@app.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    """Upload a resume file and extract raw text and identified skills."""
    content = await file.read()
    raw_text = extract_text_from_bytes(content, file.filename)
    if not raw_text:
        raise HTTPException(status_code=400, detail="Could not extract text from uploaded document")

    skills = extract_skills_from_text(raw_text)
    years = extract_years_experience(raw_text)

    return {
        "filename": file.filename,
        "characterCount": len(raw_text),
        "extractedSkills": skills,
        "detectedExperienceYears": years,
        "preview": raw_text[:500],
    }

@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest):
    """
    Core Screening Endpoint:
    Compares resume text or candidate skills against job description and competencies.
    Generates explainable score (0-100), matched/missing skills, strengths, and evidence summary.
    """
    # 1. Parse Required Job Skills
    job_skills_list = []
    if req.jobSkills:
        job_skills_list = [s.strip() for s in req.jobSkills.split(",") if s.strip()]
    
    # Also extract implicit skills from job description text
    implicit_job_skills = extract_skills_from_text(req.jobDescription)
    for s in implicit_job_skills:
        if not any(s.lower() == js.lower() for js in job_skills_list):
            job_skills_list.append(s)

    # 2. Parse Candidate Skills
    candidate_skills_list = []
    if req.candidateSkills:
        candidate_skills_list = [s.strip() for s in req.candidateSkills.split(",") if s.strip()]

    # If raw resume text is provided, extract skills from it
    if req.resumeText:
        resume_skills = extract_skills_from_text(req.resumeText)
        for s in resume_skills:
            if not any(s.lower() == cs.lower() for cs in candidate_skills_list):
                candidate_skills_list.append(s)

    # 3. Match Calculation
    matched = []
    missing = []

    for js in job_skills_list:
        if any(js.lower() == cs.lower() or js.lower() in cs.lower() or cs.lower() in js.lower() for cs in candidate_skills_list):
            matched.append(js)
        else:
            missing.append(js)

    total_reqs = max(len(job_skills_list), 1)
    match_ratio = len(matched) / total_reqs

    # Heuristic scoring with baseline floor and title keyword check
    base_score = int(match_ratio * 70 + 20)
    if req.resumeText and req.jobTitle.lower() in req.resumeText.lower():
        base_score += 8

    final_score = min(max(base_score, 40), 98)

    # 4. Formulate Strengths & Red Flags
    strengths = []
    if len(matched) >= 3:
        strengths.append(f"Demonstrated core technical competencies in: {', '.join(matched[:4])}.")
    if match_ratio >= 0.75:
        strengths.append("High contextual overlap with stated role requirements.")
    if req.candidateSkills and "lead" in req.candidateSkills.lower():
        strengths.append("Leadership or senior responsibility keywords detected.")
    if not strengths:
        strengths.append("Basic requirements align with the vacancy.")

    red_flags = []
    if missing:
        red_flags.append(f"No direct evidence found for: {', '.join(missing[:3])}.")
    if final_score < 60:
        red_flags.append("Significant skill gap detected compared to job requirements.")

    # 5. Experience Category
    experience_level = "HIGH" if final_score >= 80 else "MEDIUM" if final_score >= 60 else "LOW"

    # 6. Evidence-Based Explanation
    explanation = (
        f"The candidate achieved an overall match rating of {final_score}% for the '{req.jobTitle}' vacancy. "
        f"They demonstrate verified competencies in {len(matched)} of {total_reqs} key skills ({', '.join(matched[:5]) or 'None'}). "
        f"{'Key gaps were noted in ' + ', '.join(missing[:3]) + '. ' if missing else 'All major prerequisites are satisfied. '}"
        f"Human recruiter review is recommended before interview scheduling."
    )

    return AnalyzeResponse(
        applicationId=req.applicationId,
        overallMatchScore=final_score,
        skillsMatched=matched,
        skillsMissing=missing,
        experienceMatch=experience_level,
        strengths=strengths,
        redFlags=red_flags,
        matchExplanation=explanation,
    )
