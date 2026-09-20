from pathlib import Path
MODEL_PATH = Path(__file__).parent / "best.pt"
_model = None
_attempted = False

def _load_model():
    global _model, _attempted
    if _attempted: return _model
    _attempted = True
    if not MODEL_PATH.exists(): return None
    try:
        from ultralytics import YOLO
        _model = YOLO(str(MODEL_PATH))
    except Exception:
        _model = None
    return _model

def _severity(confidence):
    if confidence >= .80: return "HIGH"
    if confidence >= .50: return "MEDIUM"
    return "LOW"

def detect_image(image_path):
    model = _load_model()
    if model:
        try:
            result = model.predict(source=image_path, conf=.15, verbose=False)[0]
            if result.boxes is not None and len(result.boxes):
                i = max(range(len(result.boxes)), key=lambda j: float(result.boxes.conf[j]))
                confidence = float(result.boxes.conf[i])
                class_id = int(result.boxes.cls[i])
                defect = result.names.get(class_id, str(class_id))
                return {"defect": defect, "confidence": round(confidence,3),
                        "severity": _severity(confidence), "mode": "YOLO"}
        except Exception:
            pass
    return {"defect":"Pothole","confidence":0.87,"severity":"HIGH","mode":"DEMO_FALLBACK"}
