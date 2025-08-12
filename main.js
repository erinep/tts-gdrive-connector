
function showHomepageCard() {

  launchSidebar();
  
  // Dynamic timestamp to show when menu was cached
  const timestamp = new Date().toLocaleString();
  const timeWidget = CardService.newTextParagraph()
    .setText(timestamp);

  // fallback button to load sidebar
  const fallbackButton = CardService.newTextButton()
    .setText("Launch Sidebar")
    .setOnClickAction(CardService.newAction().setFunctionName("launchSidebar"));

  // build card
  const card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle("Sidebar Starter"))
    .addSection(
      CardService.newCardSection()
      .addWidget(timeWidget)
      .addWidget(fallbackButton)
    ).build();
  return card;
}

function launchSidebar() {
  const html = HtmlService.createTemplateFromFile('client/sidebar').evaluate()
    .setTitle('My Control Panel')
    .setWidth(300);
  DocumentApp.getUi().showSidebar(html);
}