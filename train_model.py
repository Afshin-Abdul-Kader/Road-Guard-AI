from ultralytics import YOLO
import torch

# ==========================================
# ROADGUARD AI - MODEL TRAINING
# ==========================================

MODEL_PATH = "yolo11n.pt"
DATASET_PATH = "dataset.yaml"

print("=" * 60)
print("ROADGUARD AI - TRAINING")
print("=" * 60)

# Check device
if torch.cuda.is_available():
    device = 0
    print("GPU detected:", torch.cuda.get_device_name(0))
    print("Training on NVIDIA GPU")
else:
    device = "cpu"
    print("No CUDA GPU detected")
    print("Training on CPU")

print("=" * 60)

# Load YOLO11 Nano
model = YOLO(MODEL_PATH)

# Train
results = model.train(
    data=DATASET_PATH,

    # Training
    epochs=50,
    imgsz=640,
    batch=4,

    # Device
    device=device,

    # Windows-safe
    workers=0,

    # Project output
    project="runs/roadguard",
    name="yolo11n_rdd2022",

    # Save checkpoints
    save=True,
    save_period=10,

    # Validation
    val=True,

    # Training settings
    patience=15,

    # Reproducibility
    seed=42
)

print("\n" + "=" * 60)
print("ROADGUARD AI TRAINING COMPLETE")
print("=" * 60)

print("\nBest model should be saved at:")
print("runs/roadguard/yolo11n_rdd2022/weights/best.pt")

print("\nLast model should be saved at:")
print("runs/roadguard/yolo11n_rdd2022/weights/last.pt")

print("=" * 60)