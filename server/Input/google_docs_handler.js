// server/docs_controller.js
/**
 * Controller for handling Google Docs interactions.
 * This includes fetching the current paragraph text,
 * selected text, and paragraphs up to a specified length.
*/

function getDocFileName() {
  const fileName = DocumentApp.getActiveDocument().getName();
  return fileName;
}

function setInputData(inputs){
  PropertiesService.getUserProperties().setProperties(
    {
      voiceId: inputs.voiceId || '',
      voiceName: inputs.voiceName || '',
      locale: inputs.locale || '',
      speed: inputs.speed || '',
      text: inputs.text || ''}
  );
}

function getInputData(){
  const props = PropertiesService.getUserProperties().getProperties();
  return {
    voiceId: props.voiceId || '',
    voiceName: props.voiceName || '',
    locale: props.locale || '',
    speed: props.speed || '',
    text: props.text || ''
  };
}

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

function getParagraphsUpToX(maxLength = 5000) {
  
  if (typeof maxLength !== 'number' || maxLength <= 0 || maxLength > 5000) {
    throw new Error("Invalid length specified. Please provide number between 0 and 5000.");
  }  
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
  if (current.getHeading() !== DocumentApp.ParagraphHeading.NORMAL) {
    throw new Error("Please place your cursor in a normal paragraph.");
  }
  while (current && text.length < maxLength*0.95) {
    if (current.getType() !== DocumentApp.ElementType.PARAGRAPH) break;
    // Stop if we hit a heading
    if (current.getHeading() !== DocumentApp.ParagraphHeading.NORMAL) break;
    const paraText = current.getText();
    if ((text.length + paraText.length) > maxLength) break;
    text += paraText + '\n';
    current = current.getNextSibling();
  }
  return text.trim();
}