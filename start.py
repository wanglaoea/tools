import re
import os

data_file = "article/data.txt"
link_file = "backlink/canonical.txt"
go_file = "golang/main.go"
placeholder = ["###", "#####", "replacehere", "domainhere"]

if not os.path.exists(data_file):
    print(f"Error: File {data_file} does not exist.")
    exit()

if not os.path.exists(link_file):
    open(link_file, "w").close()

with open(data_file, "r") as df:
    data_content = df.read()

canonical_urls = re.findall(r"_@_CANONICAL_@_:\s*(https?://[^\s]+)", data_content)

if not canonical_urls:
    print("No canonical URLs found in data.txt.")
    exit()

with open(link_file, "r") as lf:
    existing_urls = set(line.strip() for line in lf if line.strip())

added_count = 0
with open(link_file, "a") as lf:
    for url in canonical_urls:
        if url not in existing_urls:
            lf.write(url + "\n")
            added_count += 1

print(f"✔ {added_count} domains successfully added to {link_file}")

with open(link_file, "r") as file:
    canonical_content = [line.strip() for line in file if line.strip()]

if not canonical_content:
    print("No new domains found in canonical.txt.")
    exit()

if not os.path.exists(go_file):
    print(f"Error: File {go_file} not found.")
    exit()

with open(go_file, "r") as file:
    go_content = file.read()

replaced_count = 0
for domain in canonical_content:
    for ph in placeholder:
        if ph in go_content:
            go_content = go_content.replace(ph, domain, 1)
            replaced_count += 1
            break
    else:
        break

with open(go_file, "w") as file:
    file.write(go_content)

print(f"✔ {replaced_count} successfully replaced in {go_file}")