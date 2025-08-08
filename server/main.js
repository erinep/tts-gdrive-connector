
function showHomepageCard() {
  const card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle("Sidebar Starter"))
    .addSection(
      CardService.newCardSection()
        .addWidget(CardService.newTextButton()
          .setText("Launch Sidebar")
          .setOnClickAction(CardService.newAction().setFunctionName("launchSidebar")))
    )
    .build();
  return card;
}

function launchSidebar() {
  const html = HtmlService.createTemplateFromFile('F-sidebar').evaluate()
    .setTitle('Sidebar')
    .setWidth(300);
  DocumentApp.getUi().showSidebar(html);
}