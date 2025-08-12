function getSelectedText() {
  var selection = DocumentApp.getActiveDocument().getSelection();
  if (!selection) throw new Error("Nothing selected");

  var selectedText = '';

  selection.getRangeElements().forEach(rangeElement => {
    var element = rangeElement.getElement();

    if (typeof element.editAsText === 'function') {
      var textElement = element.editAsText();

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
  
  if (!selectedText) throw new Error("Failed to parse selection");
  return selectedText;
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
