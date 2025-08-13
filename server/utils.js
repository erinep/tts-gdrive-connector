function getCurrentParagraphText() {
  const doc = DocumentApp.getActiveDocument();
  const cursor = doc.getCursor();
  if (!cursor) throw new Error("Please place your cursor in a paragraph.");
  let el = cursor.getElement();
  while (el && el.getType() !== DocumentApp.ElementType.PARAGRAPH) {
    el = el.getParent();
  }
  return el ? el.getText() : '';
}

function getSelectedText() {
  const selection = DocumentApp.getActiveDocument().getSelection();
  if (!selection) throw new Error("Please select some text.");
  let selectedText = '';
  selection.getRangeElements().forEach(rangeElement => {
    const element = rangeElement.getElement();
    if (typeof element.editAsText === 'function') {
      const textElement = element.editAsText();
      if (rangeElement.isPartial()) {
        selectedText += textElement.getText().substring(
          rangeElement.getStartOffset(),
          rangeElement.getEndOffsetInclusive() + 1
        );
      } else {
        selectedText += textElement.getText();
      }
    }
  });
  if (!selectedText) throw new Error("No text found in selection.");
  return selectedText;
}

function getParagraphsUpTo1000() {
  const doc = DocumentApp.getActiveDocument();
  const cursor = doc.getCursor();
  if (!cursor) throw new Error("Please place your cursor in a paragraph.");
  let el = cursor.getElement();
  while (el && el.getType() !== DocumentApp.ElementType.PARAGRAPH) {
    el = el.getParent();
  }
  if (!el) throw new Error("No paragraph found at cursor.");

  let text = '';
  let current = el;
  while (current && text.length < 950) { // stop before 1000 for speed
    if (current.getType() !== DocumentApp.ElementType.PARAGRAPH) break;
    // Stop if we hit a heading
    if (current.getHeading() !== DocumentApp.ParagraphHeading.NORMAL) break;
    const paraText = current.getText();
    if ((text.length + paraText.length) > 1000) break;
    text += paraText + '\n';
    current = current.getNextSibling();
  }
  return text.trim();
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

function toBase64Obj(blob) {
  if (blob.getContentType() !== "audio/mpeg") {
    Logger.log(blob);
    throw new Error ("CONTENT TYPE ERROR: "+ blob.getContentType())
  }
  
  const base64 = Utilities.base64Encode(blob.getBytes());
  const contentType = blob.getContentType();
  return {
    base64,
    contentType
  };
}

function getTimeString() {
  const now = new Date();
  const timezone = Session.getScriptTimeZone(); // Use your script's timezone
  return Utilities.formatDate(now, timezone, 'HH:mm:ss');
}

function getHeadingText() {
  const sel = DocumentApp.getActiveDocument().getSelection();
  if (!sel) return null;

  let el = sel.getRangeElements()[0].getElement();
  while (el && el.getType() !== DocumentApp.ElementType.PARAGRAPH) {
    el = el.getParent();
  }

  while (el) {
    if (el.getHeading() !== DocumentApp.ParagraphHeading.NORMAL) {
      return el.getText();
    }
    el = el.getPreviousSibling();
  }

  return null;
}

function getTextBetweenHeadings() {
  const doc = DocumentApp.getActiveDocument();
  const cursor = doc.getCursor();
  if (!cursor) throw new Error("Please place your cursor in a paragraph.");

  // Find the paragraph at the cursor
  let el = cursor.getElement();
  while (el && el.getType() !== DocumentApp.ElementType.PARAGRAPH) {
    el = el.getParent();
  }
  if (!el) throw new Error("No paragraph found at cursor.");

  // Find the previous heading (or start of document)
  let start = el;
  while (start) {
    if (start.getHeading() !== DocumentApp.ParagraphHeading.NORMAL) {
      break;
    }
    const prev = start.getPreviousSibling();
    if (!prev || prev.getType() !== DocumentApp.ElementType.PARAGRAPH) {
      break;
    }
    start = prev;
  }

  // If start is a heading, move to the next paragraph after the heading
  if (start.getHeading() !== DocumentApp.ParagraphHeading.NORMAL) {
    start = start.getNextSibling();
    if (!start || start.getType() !== DocumentApp.ElementType.PARAGRAPH) {
      throw new Error("No paragraph found after heading.");
    }
  }

  // Collect paragraphs until the next heading or end of document
  let text = '';
  let current = start;
  while (current) {
    if (current.getHeading() !== DocumentApp.ParagraphHeading.NORMAL) {
      break;
    }
    text += current.getText() + '\n';
    current = current.getNextSibling();
    if (!current || current.getType() !== DocumentApp.ElementType.PARAGRAPH) {
      break;
    }
  }
  return text.trim();
}
