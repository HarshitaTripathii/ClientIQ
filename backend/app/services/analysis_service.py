import json
from datetime import datetime, timedelta

import pandas as pd


def analyze_data_file(path: str | None) -> dict:
    if not path:
        return {"message": "No data file uploaded yet."}

    if path.endswith(".csv"):
        df = pd.read_csv(path)
    else:
        df = pd.read_excel(path)

    row_count = len(df)
    column_names = list(df.columns)

    result = {
        "total_rows": row_count,
        "columns_found": column_names,
        "numeric_summary": {},
        "retention_risk": "Medium",
        "top_risk_city": "Not available",
        "inactive_customers": 0,
        "high_complaint_customers": 0,
        "average_spend": 0,
    }

    numeric_columns = df.select_dtypes(include="number").columns
    for column in numeric_columns:
        result["numeric_summary"][column] = {
            "average": round(float(df[column].mean()), 2),
            "minimum": round(float(df[column].min()), 2),
            "maximum": round(float(df[column].max()), 2),
        }

    if "total_spent" in df.columns:
        result["average_spend"] = round(float(df["total_spent"].mean()), 2)

    if "complaints" in df.columns:
        result["high_complaint_customers"] = int((df["complaints"] >= 3).sum())

    if "last_purchase_date" in df.columns:
        dates = pd.to_datetime(df["last_purchase_date"], errors="coerce")
        cutoff_date = datetime.now() - timedelta(days=180)
        result["inactive_customers"] = int((dates < cutoff_date).sum())

    if "city" in df.columns and "complaints" in df.columns:
        city_complaints = df.groupby("city")["complaints"].sum().sort_values(ascending=False)
        if not city_complaints.empty:
            result["top_risk_city"] = str(city_complaints.index[0])

    risk_points = 0
    if row_count > 0 and result["inactive_customers"] / row_count > 0.25:
        risk_points += 1
    if row_count > 0 and result["high_complaint_customers"] / row_count > 0.15:
        risk_points += 1

    if risk_points == 0:
        result["retention_risk"] = "Low"
    elif risk_points == 1:
        result["retention_risk"] = "Medium"
    else:
        result["retention_risk"] = "High"

    return result


def to_json(data: dict) -> str:
    return json.dumps(data, indent=2)


def from_json(text: str | None) -> dict:
    if not text:
        return {}
    return json.loads(text)

