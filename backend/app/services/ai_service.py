import os

from .file_service import read_notes_file


def generate_local_insights(project, analysis: dict) -> dict:
    notes = read_notes_file(project.notes_path)
    notes_preview = notes[:500] if notes else "No detailed meeting notes were provided."

    risk = analysis.get("retention_risk", "Medium")
    inactive = analysis.get("inactive_customers", 0)
    complaints = analysis.get("high_complaint_customers", 0)
    city = analysis.get("top_risk_city", "Not available")

    return {
        "executive_summary": (
            f"{project.client_name} is working in the {project.industry} industry and wants to "
            f"{project.business_goal.lower()}. The uploaded data shows a {risk.lower()} business risk level."
        ),
        "client_pain_points": (
            f"The main pain points are inactive customers ({inactive}), complaint-heavy customers "
            f"({complaints}), and risk concentration in {city}."
        ),
        "data_insights": (
            f"The file contains {analysis.get('total_rows', 0)} records. Average spend is "
            f"{analysis.get('average_spend', 0)}. The current retention risk is marked as {risk}."
        ),
        "recommendations": (
            "Create customer segments, prioritize complaint recovery, contact inactive customers, "
            "and track city-wise performance every week."
        ),
        "proposal_outline": (
            "1. Client background\n2. Business problem\n3. Data findings\n4. Recommended solution\n"
            "5. Implementation roadmap\n6. Expected impact"
        ),
        "risks": (
            "The project may face risks from incomplete data, low customer response rates, and delayed "
            "team adoption."
        ),
        "next_steps": (
            "Review the insights, generate the proposal and presentation, then trigger the follow-up workflow."
        ),
        "notes_preview": notes_preview,
    }


def generate_ai_insights(project, analysis: dict) -> dict:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return generate_local_insights(project, analysis)

    try:
        from openai import OpenAI

        notes = read_notes_file(project.notes_path)
        client = OpenAI(api_key=api_key)

        prompt = f"""
Create business proposal insights in JSON format only.

Client: {project.client_name}
Industry: {project.industry}
Goal: {project.business_goal}
Project type: {project.project_type}
Analysis: {analysis}
Meeting notes: {notes[:3000]}

Use these exact keys:
executive_summary, client_pain_points, data_insights, recommendations,
proposal_outline, risks, next_steps, notes_preview
"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4,
        )

        import json

        return json.loads(response.choices[0].message.content)
    except Exception:
        return generate_local_insights(project, analysis)

