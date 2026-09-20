def calculate_priority(severity, road_importance=10, traffic_impact=10, repeat_reports=0):
    points = {"CRITICAL":80, "HIGH":60, "MEDIUM":40, "LOW":20}
    score = min(100, points.get(severity.upper(),20)
                + max(0,min(10,int(road_importance)))
                + max(0,min(10,int(traffic_impact)))
                + max(0,min(10,int(repeat_reports))))
    level = "CRITICAL" if score >= 90 else "HIGH" if score >= 70 else "MEDIUM" if score >= 45 else "LOW"
    return {"priority_score": score, "priority_level": level}
