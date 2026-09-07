from pathlib import Path
import xml.etree.ElementTree as ET
from collections import Counter

XML_FOLDER = Path(
    r"C:\Users\admin\Desktop\LEARNING\Hackathon\ROAD GAURD AI\RESOURCES\DATASET\RDD2022\RDD2022_released_through_CRDDC2022\RDD2022\India\India\train\annotations\xmls"
)

print("Checking dataset folder...")
print(XML_FOLDER)

if not XML_FOLDER.exists():
    print("\nERROR: Folder not found!")
    print("Check the dataset path.")
    exit()

xml_files = list(XML_FOLDER.glob("*.xml"))

print(f"\nXML files found: {len(xml_files)}")

if len(xml_files) == 0:
    print("No XML files found in this folder.")
    exit()

counts = Counter()
empty_files = 0
total_files = len(xml_files)

for xml_file in xml_files:

    try:
        root = ET.parse(xml_file).getroot()
        objects = root.findall("object")

        if not objects:
            empty_files += 1
            continue

        for obj in objects:
            name = obj.findtext("name")

            if name:
                counts[name] += 1

    except Exception as e:
        print(f"Could not read {xml_file.name}: {e}")

print("\n==============================")
print("ROADGUARD AI DATASET ANALYSIS")
print("==============================")

print(f"\nTotal XML files: {total_files}")
print(f"Images with no annotations: {empty_files}")

print("\nDamage annotations:")

for damage_class, count in sorted(counts.items()):
    print(f"{damage_class}: {count}")

print("\n==============================")
print("DONE")
print("==============================")