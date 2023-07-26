## Commit Message Formatter
![image](https://github.com/Eclipse-Dominator/CommitMessageFormatter/assets/4567895/738a8cae-2742-4b36-8ece-f5080613d4d4)

Items that will be formatted:
- Auto capitalization of Commit subject
- Commit body will be separated commit subject by a single blank line
- breaking sentences by spaces (default to break by character if a word exceeds content length)
- multi spaces will be formatted to single space (e.g. `a    b c` => `a b c`)
- multi-line breaks will be formatted into single-line breaks
- All paragraphs (not ordered/unordered list) will be separated by a blank line
- formatting of indented text
- Supports unordered indentation for `+ `, `* `, `- `
- Supports ordered indentation for `1) `, `1. `, `a) `, `b) `, `(1) `, `(a) `
- Supports multi-leveled indentation like `1.1. `, `a.a.b. `

---
Currently, supported setting changes:

![image](https://github.com/Eclipse-Dominator/CommitMessageFormatter/assets/4567895/f7a69211-40a0-44af-afab-a10548ca21dc)

- Changing of displayed commit message font size
- Changing of the maximum subject limit
- Changing of the maximum body length limit
- Toggling whether to format double spaces to single spaces

---
'Unformattable' errors will be listed in the corner, users can click on them to view the related errors. 

Like so:

![image](https://github.com/Eclipse-Dominator/CommitMessageFormatter/assets/4567895/336a0e32-0bcb-4ebe-8923-2d5ac197798a)

Clicking it will highlight the relevant lines/text in the editor.

![image](https://github.com/Eclipse-Dominator/CommitMessageFormatter/assets/4567895/48360b18-962d-419c-a49f-a682d2085ac9)

---
As of now 'unformattable' errors include:

- Commit subject exceeding the set length => highlight the commit subject line
- Commit subject ending with a full stop => highlight the last full stop in the commit subject
- A line containing a word that is longer than the available body length => highlight the relevant word
- Indentation for ordered/unordered list exceeds max body length => highlight the indentation
