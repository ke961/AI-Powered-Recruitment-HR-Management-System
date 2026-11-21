import sys
from main import analyze, extract_skills_from_text, extract_years_experience, AnalyzeRequest

def test_ai_microservice():
    print("🧪 Running AI Screening Microservice Test Suite...")

    # 1. Test Text Extraction Utilities
    sample_cv = """
    Alex Chen
    Senior Software Engineer with 5+ years of experience.
    Proficient in TypeScript, Next.js, React, NestJS, and PostgreSQL.
    Architected Docker microservices and Redis distributed caching.
    """

    skills = extract_skills_from_text(sample_cv)
    print(f"   -> Extracted Skills: {skills}")
    assert "TypeScript" in skills
    assert "NestJS" in skills
    assert "PostgreSQL" in skills

    years = extract_years_experience(sample_cv)
    print(f"   -> Extracted Experience Years: {years}")
    assert years == 5

    # 2. Test Analyze Logic & Scoring
    req = AnalyzeRequest(
        applicationId="test-app-123",
        jobTitle="Senior Full-Stack Engineer",
        jobDescription="Looking for a seasoned Full-Stack Engineer with TypeScript, Next.js, NestJS, and PostgreSQL experience.",
        jobSkills="TypeScript, Next.js, NestJS, PostgreSQL, Docker, Redis, Kubernetes",
        candidateSkills="TypeScript, Next.js, NestJS, PostgreSQL, Docker",
        resumeText=sample_cv,
    )

    resp = analyze(req)

    print(f"   -> Overall Match Score: {resp.overallMatchScore}%")
    print(f"   -> Skills Matched: {resp.skillsMatched}")
    print(f"   -> Skills Missing: {resp.skillsMissing}")
    print(f"   -> Strengths: {resp.strengths}")
    print(f"   -> Evidence: {resp.matchExplanation}")

    assert resp.overallMatchScore >= 80
    assert "TypeScript" in resp.skillsMatched
    assert "Kubernetes" in resp.skillsMissing
    assert len(resp.strengths) > 0
    assert "Alex Chen" not in resp.skillsMatched  # Ensure precision

    print("\n🎉 ALL AI SERVICE UNIT TESTS PASSED CLEANLY!\n")

if __name__ == "__main__":
    try:
        test_ai_microservice()
    except Exception as e:
        print(f"❌ AI test failed: {e}")
        sys.exit(1)
