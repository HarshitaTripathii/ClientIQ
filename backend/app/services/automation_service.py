import os

import requests


def trigger_n8n(project) -> str:
    webhook_url = os.getenv("N8N_WEBHOOK_URL")
    if not webhook_url:
        return "Skipped: N8N_WEBHOOK_URL is not configured"

    payload = {
        "client_name": project.client_name,
        "project_name": project.project_type,
        "proposal_file": project.proposal_path,
        "ppt_file": project.ppt_path,
        "status": "completed",
        "user_email": project.user_email,
    }

    response = requests.post(webhook_url, json=payload, timeout=15)
    if response.status_code >= 400:
        return f"Failed with status {response.status_code}"

    return "Triggered successfully"

