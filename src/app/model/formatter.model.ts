import { SettingData, getDefaultSetting } from "./commit-storage";

export type Warning = {
  lineNum: number;
  targetText?: string;
  lineRange?: [number, number];
  detail: string;
  severity: "low" | "medium" | "high";
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

  private settings: SettingData;
  private listDelimiters = /(^ *[-+*] )/;
  private orderedDelimiters = /(^ *(?:[a-zA-Z]|\d+)[.)] )/;
  private enclosedDelimeters = /(^ *\((?:[a-zA-Z]|\d+)\) )/;
  private multiLevelNumericalDelimiters = /(^ *(\d+\.){2,} )/;
  private multiLevelCharDelimiters = /(^ *([a-zA-Z]\.){2,} )/;

  constructor(settings: SettingData = getDefaultSetting()) {
    this.settings = settings;
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
    const maxLineLen = this.settings.bodyCap.range[1];

    if (indentSize === 0) currentLine = currentLine.trim();
    if (indentSize >= maxLineLen - 1) {
      pr.warnings.push({
        lineNum: pr.index,
        lineRange: [0, indentSize],
        detail: `Line contains an indent that is too long`,
        severity: "high"
      });
      indentSize = 0;
    }
    let containLongWord = false;
    while (currentLine.length >= maxLineLen) {
      const splitIndex: number = currentLine.lastIndexOf(" ", maxLineLen);
      if (splitIndex === -1 || splitIndex <= indentSize) {
        if (!containLongWord) {
          const nextSpaceIndex = currentLine.indexOf(" ", maxLineLen);
          pr.warnings.push({
            lineNum: pr.index,
            targetText: currentLine.substring(indentSize, nextSpaceIndex === -1 ? currentLine.length : nextSpaceIndex),
            detail: `Line contains a word that is too long to fit into 1 line`,
            severity: "high"
          });
          containLongWord = true;
        }
        pr.partialResult.push(currentLine.substring(0, maxLineLen));
        currentLine = currentLine.substring(maxLineLen + 1);
      } else {
        pr.partialResult.push(currentLine.substring(0, splitIndex));
        currentLine = currentLine.substring(splitIndex + 1);
      }
      currentLine = " ".repeat(indentSize) + currentLine.trim();
    }
    pr.partialResult.push(currentLine);
  }

  evaluateHeader(line: string, pr: PartialResult) {
    const maxLineLen = this.settings.headerCap.range[1];
    const warningLineLen = this.settings.headerCap.range[0];
    const allowWarning = this.settings.headerCap.isRange;

    if (line.length > maxLineLen) {
      pr.warnings.push({
        lineNum: pr.index,
        lineRange: [0, line.length],
        detail: `Subject line exceeded maximum length of ${maxLineLen} characters by ${line.length - maxLineLen} characters`,
        severity: "high"
      });
    } else if (allowWarning && line.length > warningLineLen) {
      pr.warnings.push({
        lineNum: pr.index,
        lineRange: [0, line.length],
        detail: `Try to limit the subject line to ${warningLineLen} characters (exceeded by ${line.length - warningLineLen} characters)`,
        severity: "medium"
      });
    }

    if (line[line.length - 1] === ".") {
      pr.warnings.push({
        lineNum: pr.index,
        lineRange: [line.length - 1, line.length],
        detail: "Commit message subject should not end with a period.",
        severity: "low"
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
    if (this.settings.removeDoubleSpace) {
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
