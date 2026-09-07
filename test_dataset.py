from ultralytics import YOLO

print("=" * 60)
print("ROADGUARD AI - DATASET SANITY TEST")
print("=" * 60)

model = YOLO("yolo11n.pt")

print("\nLoading dataset configuration...")

results = model.val(
    data="dataset.yaml",
    imgsz=640,
    batch=4,
    device="cpu",
    workers=0
)

print("\n" + "=" * 60)
print("DATASET SANITY TEST COMPLETE")
print("=" * 60)

print("mAP50:", results.box.map50)
print("mAP50-95:", results.box.map)