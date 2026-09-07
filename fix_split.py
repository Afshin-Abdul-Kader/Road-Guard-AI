from pathlib import Path
import shutil

DATASET = Path(
    r"C:\Users\admin\Desktop\LEARNING\Hackathon\ROAD GAURD AI\RESOURCES\DATASET\RDD2022\RDD2022_released_through_CRDDC2022\RDD2022\India\India"
)

TRAIN_IMAGES = DATASET / "train" / "images"
TRAIN_LABELS = DATASET / "train" / "labels"

VAL_IMAGES = DATASET / "val" / "images"
VAL_LABELS = DATASET / "val" / "labels"

TARGET_VAL = 1541

images = [
    p for p in VAL_IMAGES.iterdir()
    if p.is_file() and p.suffix.lower() in {".jpg", ".jpeg", ".png", ".bmp"}
]

current_val = len(images)

print("=" * 60)
print("FIXING DATASET SPLIT")
print("=" * 60)

print(f"Current validation images: {current_val}")
print(f"Target validation images : {TARGET_VAL}")

if current_val <= TARGET_VAL:
    print("Nothing to fix.")
    exit()

move_back_count = current_val - TARGET_VAL

print(f"Moving back to train: {move_back_count}")

# Move the extra validation images back to train
for i, image_path in enumerate(images[:move_back_count], start=1):

    destination_image = TRAIN_IMAGES / image_path.name
    shutil.move(str(image_path), str(destination_image))

    label_path = VAL_LABELS / f"{image_path.stem}.txt"

    if label_path.exists():
        destination_label = TRAIN_LABELS / label_path.name
        shutil.move(str(label_path), str(destination_label))

    if i % 200 == 0:
        print(f"Moved back {i}/{move_back_count}")

# Final counts
train_count = len([
    p for p in TRAIN_IMAGES.iterdir()
    if p.is_file() and p.suffix.lower() in {".jpg", ".jpeg", ".png", ".bmp"}
])

val_count = len([
    p for p in VAL_IMAGES.iterdir()
    if p.is_file() and p.suffix.lower() in {".jpg", ".jpeg", ".png", ".bmp"}
])

print()
print("=" * 60)
print("FIX COMPLETE")
print("=" * 60)

print(f"Train images : {train_count}")
print(f"Val images   : {val_count}")
print(f"Total        : {train_count + val_count}")

print("=" * 60)