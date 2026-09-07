from pathlib import Path
import xml.etree.ElementTree as ET

# ============================================================
# ROADGUARD AI — RDD2022 XML → YOLO CONVERTER
# ============================================================

# RDD2022 India training data
DATASET_ROOT = Path(
    r"C:\Users\admin\Desktop\LEARNING\Hackathon\ROAD GAURD AI\RESOURCES\DATASET\RDD2022\RDD2022_released_through_CRDDC2022\RDD2022\India\India\train"
)

XML_FOLDER = DATASET_ROOT / "annotations" / "xmls"
IMAGE_FOLDER = DATASET_ROOT / "images"

# Output folder for YOLO labels
OUTPUT_FOLDER = DATASET_ROOT / "labels"

# RoadGuard AI class mapping
CLASS_MAP = {
    "D00": 0,   # Longitudinal crack
    "D10": 1,   # Transverse crack
    "D20": 2,   # Alligator crack
    "D40": 3,   # Pothole
}


def convert_box(xmin, ymin, xmax, ymax, image_width, image_height):
    """
    Convert Pascal VOC bounding box coordinates
    into YOLO normalized format.
    """

    center_x = ((xmin + xmax) / 2) / image_width
    center_y = ((ymin + ymax) / 2) / image_height

    width = (xmax - xmin) / image_width
    height = (ymax - ymin) / image_height

    return center_x, center_y, width, height


def process_xml(xml_file):
    """
    Convert one XML annotation file into one YOLO .txt file.
    """

    tree = ET.parse(xml_file)
    root = tree.getroot()

    # Get image filename
    filename = root.findtext("filename")

    # Get image dimensions
    size = root.find("size")

    if size is None:
        return False

    width = int(size.findtext("width"))
    height = int(size.findtext("height"))

    yolo_labels = []

    # Process every annotated object
    for obj in root.findall("object"):

        damage_name = obj.findtext("name")

        # Ignore classes that are not part of RoadGuard MVP
        if damage_name not in CLASS_MAP:
            continue

        bbox = obj.find("bndbox")

        if bbox is None:
            continue

        xmin = float(bbox.findtext("xmin"))
        ymin = float(bbox.findtext("ymin"))
        xmax = float(bbox.findtext("xmax"))
        ymax = float(bbox.findtext("ymax"))

        class_id = CLASS_MAP[damage_name]

        center_x, center_y, box_width, box_height = convert_box(
            xmin,
            ymin,
            xmax,
            ymax,
            width,
            height
        )

        yolo_labels.append(
            f"{class_id} "
            f"{center_x:.6f} "
            f"{center_y:.6f} "
            f"{box_width:.6f} "
            f"{box_height:.6f}"
        )

    # Create corresponding TXT filename
    output_file = OUTPUT_FOLDER / f"{xml_file.stem}.txt"

    # Write YOLO annotations
    with open(output_file, "w") as file:
        file.write("\n".join(yolo_labels))

    return True


# ============================================================
# MAIN
# ============================================================

print("=" * 50)
print("ROADGUARD AI — XML → YOLO CONVERSION")
print("=" * 50)

print(f"\nXML folder:")
print(XML_FOLDER)

print(f"\nOutput folder:")
print(OUTPUT_FOLDER)

# Check dataset
if not XML_FOLDER.exists():
    print("\nERROR: XML folder not found!")
    exit()

# Create output directory
OUTPUT_FOLDER.mkdir(parents=True, exist_ok=True)

xml_files = list(XML_FOLDER.glob("*.xml"))

print(f"\nXML files found: {len(xml_files)}")

converted = 0

for xml_file in xml_files:

    if process_xml(xml_file):
        converted += 1

print("\n" + "=" * 50)
print("CONVERSION COMPLETE")
print("=" * 50)

print(f"XML files processed: {converted}")
print(f"YOLO labels created: {len(list(OUTPUT_FOLDER.glob('*.txt')))}")

print("\nRoadGuard classes:")
print("0 = Longitudinal Crack")
print("1 = Transverse Crack")
print("2 = Alligator Crack")
print("3 = Pothole")

print("\nDONE")
print("=" * 50)