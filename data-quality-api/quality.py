def analyze_data(rows):
    values = [r["value"] for r in rows]

    total = len(values)
    missing = sum(1 for v in values if v is None)
    negatives = sum(1 for v in values if v is not None and v < 0)
    duplicates = len(values) - len(set(values))

    return {
        "total_records": total,
        "missing_values": missing,
        "negative_values": negatives,
        "duplicates": duplicates,
        "quality_score": max(0, 100 - (missing*10 + negatives*5 + duplicates*2))
    }