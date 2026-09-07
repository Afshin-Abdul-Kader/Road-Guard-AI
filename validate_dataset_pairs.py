from pathlib import Path

# ============================================================
# ROADGUARD AI — IMAGE/LABEL PAIR VALIDATION
# ============================================================

DATASET_ROOT = Path(
    r"C:\Users\admin\Desktop\LEARNING\Hackathon\ROAD GAURD AI\RESOURCES\DATASET\RDD2022\RDD2022_released_through_CRDDC2022\RDD2022\India\India"
)

TRAIN_IMAGES = DATASET_ROOT / "train" / "images"
TRAIN_LABELS = DATASET_ROOT / "train" / "labels"

TEST_IMAGES = DATASET_ROOT / "test" / "images"
TEST_LABELS = DATASET_ROOT / "test" / "labels"


def check_pairs(image_folder, label_folder, split_name):

    print("\n" + "=" * 60)
    print(f"CHECKING {split_name.upper()} DATASET")
    print("=" * 60)

    if not image_folder.exists():
        print(f"ERROR: Image folder not found:")
        print(image_folder)
        return

    if not label_folder.exists():
        print(f"ERROR: Label folder not found:")
        print(label_folder)
        return

    # Supported image formats
    image_extensions = {".jpg", ".jpeg", ".png"}

    images = {
        file.stem
        for file in image_folder.iterdir()
        if file.is_file() and file.suffix.lower() in image_extensions
    }

    labels = {
        file.stem
        for file in label_folder.iterdir()
        if file.is_file() and file.suffix.lower() == ".txt"
    }

    missing_labels = images - labels
    missing_images = labels - images

    print(f"Images found : {len(images)}")
    print(f"Labels found : {len(labels)}")

    print(f"\nImages without labels : {len(missing_labels)}")
    print(f"Labels without images : {len(missing_images)}")

    if missing_labels:
        print("\nFirst missing labels:")
        for name in sorted(missing_labels)[:20]:
            print(f"  {name}")

    if missing_images:
        print("\nFirst missing images:")
        for name in sorted(missing_images)[:20]:
            print(f"  {name}")

    # Check empty label files
    empty_labels = []

    for label_file in label_folder.glob("*.txt"):
        if label_file.stat().st_size == 0:
            empty_labels.append(label_file.stem)

    print(f"\nEmpty label files : {len(empty_labels)}")

    if empty_labels:
        print("\nFirst empty labels:")
        for name in sorted(empty_labels)[:20]:
            print(f"  {name}")

    # Final result
    if not missing_labels and not missing_images:
        print(f"\n{split_name.upper()} IMAGE/LABEL PAIRS ARE COMPLETE!")

    if not empty_labels:
        print(f"{split_name.upper()} HAS NO EMPTY LABEL FILES!")

    return len(images), len(labels)


# ============================================================
# RUN VALIDATION
# ============================================================

print("\n")
print("=" * 60)
print("ROADGUARD AI DATASET PAIR VALIDATION")
print("=" * 60)

train_result = check_pairs(
    TRAIN_IMAGES,
    TRAIN_LABELS,
    "train"
)

test_result = check_pairs(
    TEST_IMAGES,
    TEST_LABELS,
    "test"
)

print("\n" + "=" * 60)
print("VALIDATION COMPLETE")
print("=" * 60)