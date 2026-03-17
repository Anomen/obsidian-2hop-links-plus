// is there a better way to get link text?
export function filePathToLinkText(path: string): string {
  return path.replace(/\.md$/, "").replace(/.*\//, "");
}

// Remove block reference. e.g. `[[somefile#^7e8e5f]]`
export function removeBlockReference(src: string): string {
  return src.replace(/#.*$/, "");
}

function globToRegex(pattern: string): RegExp {
  const matchBasename = !pattern.includes("/");

  let regexStr = "";
  let i = 0;
  while (i < pattern.length) {
    const c = pattern[i];
    if (c === "*") {
      if (i + 1 < pattern.length && pattern[i + 1] === "*") {
        if (i + 2 < pattern.length && pattern[i + 2] === "/") {
          regexStr += "(?:.+/)?";
          i += 3;
        } else {
          regexStr += ".*";
          i += 2;
        }
      } else {
        regexStr += "[^/]*";
        i += 1;
      }
    } else if (c === "?") {
      regexStr += "[^/]";
      i += 1;
    } else if (".+^${}()|[]\\".indexOf(c) !== -1) {
      regexStr += "\\" + c;
      i += 1;
    } else {
      regexStr += c;
      i += 1;
    }
  }

  if (matchBasename) {
    return new RegExp("(?:^|/)" + regexStr + "$");
  }
  return new RegExp("^" + regexStr + "$");
}

export function shouldExcludePath(
  path: string,
  excludePaths: string[]
): boolean {
  return excludePaths.some((excludePath: string) => {
    if (!excludePath) return false;

    if (excludePath.includes("*") || excludePath.includes("?")) {
      return globToRegex(excludePath).test(path);
    }

    if (excludePath.endsWith("/")) {
      return path.startsWith(excludePath);
    } else {
      return path === excludePath;
    }
  });
}
