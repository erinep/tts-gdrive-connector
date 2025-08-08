function getSelectedText() {
  var selection = DocumentApp.getActiveDocument().getSelection();
  if (!selection) return '(No text selected)';

  var selectedText = '';
  var rangeElements = selection.getRangeElements();

  for (var i = 0; i < rangeElements.length; i++) {
    var element = rangeElements[i];
    var elem = element.getElement();

    if (elem.editAsText) {
      var textElement = elem.editAsText();

      if (element.isPartial()) {
        selectedText += textElement.getText().substring(
          element.getStartOffset(),
          element.getEndOffsetInclusive() + 1
        );
      } else {
        selectedText += textElement.getText();
      }
    }
  }
  return selectedText || '(No text selected)';
}


function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

function toBase64(blob) {
  if (blob.getContentType() !== "audio/mpeg") throw new Error ("CONTENT TYPE ERROR: "+ res.getContentText())
  
  const base64 = Utilities.base64Encode(blob.getBytes());
  const contentType = blob.getContentType();
  return {
    base64,
    contentType
  };
}

function generateFilenameMp3() {
  const now = new Date();
  const timezone = Session.getScriptTimeZone(); // Use your script's timezone
  const timestamp = Utilities.formatDate(now, timezone, 'yyyyMMddHHmmss');
  const filename = `${timestamp}.mp3`;
  return filename;
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
