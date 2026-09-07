from pathlib import Path

# ============================================================
# ROADGUARD AI — YOLO LABEL VALIDATOR
# ============================================================

LABEL_FOLDER = Path(
    r"C:\Users\admin\Desktop\LEARNING\Hackathon\ROAD GAURD AI\RESOURCES\DATASET\RDD2022\RDD2022_released_through_CRDDC2022\RDD2022\India\India\train\labels"
)

VALID_CLASSES = {0, 1, 2, 3}

print("=" * 50)
print("ROADGUARD AI — YOLO LABEL VALIDATION")
print("=" * 50)

if not LABEL_FOLDER.exists():
    print("\nERROR: Label folder not found!")
    print(LABEL_FOLDER)
    exit()

label_files = list(LABEL_FOLDER.glob("*.txt"))

print(f"\nLabel files found: {len(label_files)}")

invalid_files = []
invalid_lines = 0
total_objects = 0

class_counts = {
    0: 0,
    1: 0,
    2: 0,
    3: 0
}

for label_file in label_files:

    try:
        with open(label_file, "r") as file:
            lines = file.readlines()

        for line_number, line in enumerate(lines, start=1):

            line = line.strip()

            # Empty file is allowed
            if not line:
                continue

            parts = line.split()

            # YOLO format must contain exactly 5 values
            if len(parts) != 5:
                invalid_files.append(label_file.name)
                invalid_lines += 1
                continue

            class_id = int(parts[0])

            x_center = float(parts[1])
            y_center = float(parts[2])
            width = float(parts[3])
            height = float(parts[4])

            # Check class
            if class_id not in VALID_CLASSES:
                invalid_files.append(label_file.name)
                invalid_lines += 1
                continue

            # Check normalized coordinates
            values = [x_center, y_center, width, height]

            if not all(0 <= value <= 1 for value in values):
                invalid_files.append(label_file.name)
                invalid_lines += 1
                continue

            # Bounding box must have positive dimensions
            if width <= 0 or height <= 0:
                invalid_files.append(label_file.name)
                invalid_lines += 1
                continue

            class_counts[class_id] += 1
            total_objects += 1

    except Exception:
        invalid_files.append(label_file.name)
        invalid_lines += 1


# Remove duplicate filenames
invalid_files = sorted(set(invalid_files))

print("\n" + "=" * 50)
print("VALIDATION RESULTS")
print("=" * 50)

print(f"\nTotal label files: {len(label_files)}")
print(f"Total valid objects: {total_objects}")
print(f"Invalid files: {len(invalid_files)}")
print(f"Invalid lines: {invalid_lines}")

print("\nRoadGuard class distribution:")

print(f"0 = Longitudinal Crack : {class_counts[0]}")
print(f"1 = Transverse Crack   : {class_counts[1]}")
print(f"2 = Alligator Crack    : {class_counts[2]}")
print(f"3 = Pothole            : {class_counts[3]}")

if invalid_files:
    print("\nWARNING — Invalid files found:")

    for filename in invalid_files[:20]:
        print(filename)

    if len(invalid_files) > 20:
        print(f"...and {len(invalid_files) - 20} more.")

else:
    print("\nALL LABELS ARE VALID!")

print("\n" + "=" * 50)
print("DONE")
print("=" * 50)