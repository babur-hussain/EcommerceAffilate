import os

file_path = "/Users/baburhussain/Pictures/ecommerceearn/apps/Applications/ios/Local For Vocal/Local For Vocal/Sources/Views/SDUIComponentView.swift"
new_file_path = "/Users/baburhussain/Pictures/ecommerceearn/apps/Applications/ios/Local For Vocal/Local For Vocal/Sources/Views/SDUIComponentView+Renderers.swift"

with open(file_path, "r") as f:
    lines = f.readlines()

# Line 282 in 1-based index is 281 in 0-based index.
# We want to split at "// MARK: - Renderers Extension"
split_index = -1
for i, line in enumerate(lines):
    if "MARK: - Renderers Extension" in line:
        split_index = i
        break

if split_index != -1:
    part1 = lines[:split_index]
    part2 = lines[split_index:]
    
    # Write original file (truncated)
    with open(file_path, "w") as f:
        f.writelines(part1)
        
    # Write new file
    with open(new_file_path, "w") as f:
        f.write("import SwiftUI\n\n")
        f.writelines(part2)
    print("Successfully split file.")
else:
    print("Could not find split point.")
