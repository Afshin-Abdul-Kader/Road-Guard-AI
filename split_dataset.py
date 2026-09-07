from pathlib import Path
import random
import shutil

# ==============================
# DATASET PATH
# ==============================

DATASET = Path(
    r"C:\Users\admin\Desktop\LEARNING\Hackathon\ROAD GAURD AI\RESOURCES\DATASET\RDD2022\RDD2022_released_through_CRDDC2022\RDD2022\India\India"
)

TRAIN_IMAGES = DATASET / "train" / "images"
TRAIN_LABELS = DATASET / "train" / "labels"

VAL_IMAGES = DATASET / "val" / "images"
VAL_LABELS = DATASET / "val" / "labels"

# ==============================
# SETTINGS
# ==============================

VAL_RATIO = 0.20
SEED = 42

# ==============================
# CHECK PATHS
# ==============================

if not TRAIN_IMAGES.exists():
    print("ERROR: train/images not found!")
    exit()

if not TRAIN_LABELS.exists():
    print("ERROR: train/labels not found!")
    exit()

# Create validation folders
VAL_IMAGES.mkdir(parents=True, exist_ok=True)
VAL_LABELS.mkdir(parents=True, exist_ok=True)

# ==============================
# GET IMAGES
# ==============================

image_extensions = {".jpg", ".jpeg", ".png", ".bmp"}

images = [
    p for p in TRAIN_IMAGES.iterdir()
    if p.is_file() and p.suffix.lower() in image_extensions
]

print("=" * 60)
print("RDD2022 TRAIN / VALIDATION SPLIT")
print("=" * 60)

print(f"Total training images found: {len(images)}")

# ==============================
# SHUFFLE
# ==============================

random.seed(SEED)
random.shuffle(images)

val_count = int(len(images) * VAL_RATIO)

val_images = images[:val_count]

print(f"Validation images: {len(val_images)}")
print(f"Training images remaining: {len(images) - len(val_images)}")

# ==============================
# MOVE VALIDATION FILES
# ==============================

moved = 0

for image_path in val_images:

    # Move image
    destination_image = VAL_IMAGES / image_path.name
    shutil.move(str(image_path), str(destination_image))

    # Find matching label
    label_path = TRAIN_LABELS / f"{image_path.stem}.txt"

    if label_path.exists():
        destination_label = VAL_LABELS / label_path.name
        shutil.move(str(label_path), str(destination_label))

    moved += 1

    if moved % 500 == 0:
        print(f"Moved {moved}/{len(val_images)} validation images...")

# ==============================
# FINAL CHECK
# ==============================

remaining_train = len([
    p for p in TRAIN_IMAGES.iterdir()
    if p.is_file() and p.suffix.lower() in image_extensions
])

validation_count = len([
    p for p in VAL_IMAGES.iterdir()
    if p.is_file() and p.suffix.lower() in image_extensions
])

print()
print("=" * 60)
print("SPLIT COMPLETE")
print("=" * 60)

print(f"Train images : {remaining_train}")
print(f"Val images   : {validation_count}")
print(f"Total        : {remaining_train + validation_count}")

print("=" * 60)