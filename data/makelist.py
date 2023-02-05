def make(path: str, output: str) -> None:
    print(path)
    with open(path, "r", encoding="utf8", errors="ignore") as file:
        lines = file.readlines()
        x = [line.strip().replace("ß", "ss").replace("ä", "ae").replace("Ä", "ae").replace("ö", "oe").replace("Ö", "oe").replace("ü", "ue").replace("Ü", "ue").upper() for line in lines]
        x = ['"' + y + '",' for y in x if len(y) == 5 and y.isalpha()]
    with open(output, "w") as file:
        for line in x:
            file.write(line + "\n")

def combine(paths: str, output: str) -> None:
    l = []
    for path in paths:
        with open(path, "r") as file:
            lines = file.readlines()
            l.extend(lines)
    l = list(set(l))
    with open(output, "w") as file:
        file.write("[\n")
        file.writelines(l)
        file.write("]")

if __name__ == "__main__":
    #inputs = ["deutsch.txt", "deutsch2.txt", "at.txt", "65.txt"]
    inputs = ["deutsch.txt", "deutsch2.txt"]
    #output = "wordlist.txt"
    output = "solutions.txt"
    for i, inp in enumerate(inputs):
        make(inp, "temp" + str(i))
    combine(["temp" + str(i) for i, _ in enumerate(inputs)], output)