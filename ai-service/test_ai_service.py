import sys
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_ai_microservice():
    print("🧪 Running AI Screening Microservice Test Suite...")

    # 1. Test Health
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"
    print("   -> GET /health: OK")

    # 2. Test Analyze Endpoint
    payload = {
        "applicationId": "test-app-123",
        "jobTitle": "Senior Full-Stack Engineer",
        "jobDescription": "Looking for a seasoned Full-Stack Engineer with TypeScript, Next.js, NestJS, and PostgreSQL experience.",
        "jobSkills": "TypeScript, Next.js, NestJS, PostgreSQL, Docker, Redis",
        "candidateSkills": "TypeScript, Next.js, NestJS, PostgreSQL, Docker, AWS",
        "resumeText": "Experienced Full-Stack Developer with 5+ years building NestJS and Next.js scalable web applications."
    }

    res = client.post("/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()

    print(f"   -> Match Score: {data['overallMatchScore']}%")
    print(f"   -> Skills Matched: {data['skillsMatched']}")
    print(f"   -> Skills Missing: {data['skillsMissing']}")
    print(f"   -> Explanation: {data['matchExplanation']}")

    assert data["overallMatchScore"] >= 80
    assert "TypeScript" in data["skillsMatched"]
    assert "Redis" in data["skillsMissing"]
    assert len(data["strengths"]) > 0

    print("\n🎉 AI SERVICE TESTS PASSED CLEANLY!\n")

if __name__ == "__main__":
    try:
        test_ai_microservice()
    except Exception as e:
        print(f"❌ AI test failed: {e}")
        sys.exit(1)
