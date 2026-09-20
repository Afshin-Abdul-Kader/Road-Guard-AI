from pathlib import Path

DATASET = Path(
    r"C:\Users\admin\Desktop\LEARNING\Hackathon\ROAD GAURD AI\RESOURCES\DATASET\RDD2022\RDD2022_released_through_CRDDC2022\RDD2022\India\India"
)

SETS = {
    "train": (
        DATASET / "train" / "images",
        DATASET / "train" / "labels"
    ),
    "val": (
        DATASET / "val" / "images",
        DATASET / "val" / "labels"
    )
}

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp"}

for name, (image_dir, label_dir) in SETS.items():

    print("\n" + "=" * 60)
    print(f"CHECKING {name.upper()} DATASET")
    print("=" * 60)

    images = {
        p.stem
        for p in image_dir.iterdir()
        if p.is_file() and p.suffix.lower() in IMAGE_EXTENSIONS
    }

    labels = {
        p.stem
        for p in label_dir.iterdir()
        if p.is_file() and p.suffix.lower() == ".txt"
    }

    missing_labels = images - labels
    orphan_labels = labels - images

    print(f"Images : {len(images)}")
    print(f"Labels : {len(labels)}")

    print(f"Missing labels : {len(missing_labels)}")
    print(f"Orphan labels  : {len(orphan_labels)}") 

    if missing_labels:
        print("\nExample missing labels:")
        for item in list(missing_labels)[:10]:
            print(item)

    if orphan_labels:
        print("\nExample orphan labels:")
        for item in list(orphan_labels)[:10]:
            print(item)

    if not missing_labels and not orphan_labels:
        print("\n✓ IMAGE/LABEL PAIRS COMPLETE")

print("\n" + "=" * 60)
print("FINAL DATASET CHECK COMPLETE")
print("=" * 60)