export type Warning = {
  lineNum: number;
  targetText?: string;
  lineRange?: [number, number];
  detail: string;
};  // warnings are unformattable issues*

export type FormatResult = {
  result: string;
  warnings?: Warning[];
}

type PartialResult = {
  index: number;
  partialResult: string[];
  warnings: Warning[];
}

export class Formatter {
  maxHeaderLen: number;
  maxLineLen: number;
  removeDoubleSpaces: boolean;
  listDelimiters = /(^ *[-+*] )/;
  orderedDelimiters = /(^ *(?:[a-zA-Z]|\d+)[.)] )/;
  enclosedDelimeters = /(^ *\((?:[a-zA-Z]|\d+)\) )/;
  multiLevelNumericalDelimiters = /(^ *(\d+\.){2,} )/;
  multiLevelCharDelimiters = /(^ *([a-zA-Z]\.){2,} )/;

  constructor(maxHeaderLen: number, maxLineLen: number, removeDoubleSpaces: boolean = true) {
    this.maxHeaderLen = maxHeaderLen;
    this.maxLineLen = maxLineLen;
    this.removeDoubleSpaces = removeDoubleSpaces;
  }

  detectIndentation(line: string): number {
    let res = this.listDelimiters.exec(line)
      ?? this.orderedDelimiters.exec(line)
      ?? this.enclosedDelimeters.exec(line)
      ?? this.multiLevelNumericalDelimiters.exec(line)
      ?? this.multiLevelCharDelimiters.exec(line);
    if (!res) return 0;

    return res[0].length;
  }

  static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  static toResult(partialResult: PartialResult): FormatResult {
    return { result: partialResult.partialResult.join("\n"), warnings: partialResult.warnings };
  }

  handleLine(currentLine: string, pr: PartialResult, indentSize: number) {
    if (indentSize === 0) currentLine = currentLine.trim();
    if (indentSize >= this.maxLineLen - 1) {
      pr.warnings.push({
        lineNum: pr.index,
        lineRange: [0, indentSize],
        detail: `Line contains an indent that is too long`
      });
      indentSize = 0;
    }
    let containLongWord = false;
    while (currentLine.length >= this.maxLineLen) {
      const splitIndex: number = currentLine.lastIndexOf(" ", this.maxLineLen);
      if (splitIndex === -1 || splitIndex <= indentSize) {
        if (!containLongWord) {
          const nextSpaceIndex = currentLine.indexOf(" ", this.maxLineLen);
          pr.warnings.push({
            lineNum: pr.index,
            targetText: currentLine.substring(indentSize, nextSpaceIndex === -1 ? currentLine.length : nextSpaceIndex),
            detail: `line contains a word that is too long to fit into 1 line (> ${this.maxLineLen} characters))`
          });
          containLongWord = true;
        }
        pr.partialResult.push(currentLine.substring(0, this.maxLineLen));
        currentLine = currentLine.substring(this.maxLineLen + 1);
      } else {
        pr.partialResult.push(currentLine.substring(0, splitIndex));
        currentLine = currentLine.substring(splitIndex + 1);
      }
      currentLine = " ".repeat(indentSize) + currentLine.trim();
    }
    pr.partialResult.push(currentLine);
  }

  evaluateHeader(line: string, pr: PartialResult) {
    if (line.length > this.maxHeaderLen) {
      pr.warnings.push({
        lineNum: pr.index,
        lineRange: [0, line.length],
        detail: `Header exceeded maximum length of ${this.maxHeaderLen} characters by ${line.length - this.maxHeaderLen} characters`
      });
    }

    if (line[line.length - 1] === ".") {
      pr.warnings.push({
        lineNum: pr.index,
        lineRange: [line.length - 1, line.length],
        detail: "Commit message subject should not end with a period."
      });
    }
  }

  formatHeader(lines: string[], pr: PartialResult = { index: 0, partialResult: [], warnings: [] }): PartialResult {
    if (lines.length === 0) return pr; // no content

    while (pr.index < lines.length && lines[pr.index].trim().length === 0) {
      pr.index++; // forward to first line of content
    }
    if (pr.index === lines.length) return pr // end of content

    const header: string = Formatter.capitalize(lines[pr.index].trim());

    this.evaluateHeader(header, pr);

    pr.partialResult.push(header + "\n");
    while (++pr.index < lines.length && lines[pr.index].trim().length === 0);
    return pr;
  }

  formatCommitMessage(commitMessage: string): FormatResult {
    commitMessage = commitMessage.replaceAll("\r\n", "\n");
    // commitMessage = commitMessage.replaceAll(/\n{3,}/g, "\n\n");
    if (this.removeDoubleSpaces) {
      // replace all double spaces with single spaces except for start of line
      commitMessage = commitMessage.replaceAll(/([^\n ] ) +/g, (match, p1) => p1);
    }

    const paragraphs: string[] = commitMessage.split("\n");
    const totalLines: number = paragraphs.length;
    let pr = this.formatHeader(paragraphs);

    let isLastLineEmpty: boolean = true;

    for (; pr.index < totalLines; pr.index++) {
      const currLine = paragraphs[pr.index].trimEnd();
      if (currLine.length === 0) {
        if (!isLastLineEmpty) {
          pr.partialResult.push("");
          isLastLineEmpty = true;
        }
        continue;
      }

      let indentSize = this.detectIndentation(currLine);
      if (indentSize === 0 && !isLastLineEmpty) {
        pr.partialResult.push("");
      }
      isLastLineEmpty = false;
      this.handleLine(currLine, pr, indentSize);
    }
    return Formatter.toResult(pr);
  }
}
