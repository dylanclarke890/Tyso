UI.onPageReady(() => {
  AddThisHelper.initGlobals();
  let thanks = "Thank You!";
  let returnTo = "Return to";
  let homePage = "Homepage";

  switch (navigator.language) {
    case "fr":
    case "fr-fr":
    case "fr-ca":
      thanks = "Merci!";
      returnTo = "Retour a la";
      homePage = "Page d'accueil";
      break;
    case "en-US":
    case "en-GB":
    default:
      break;
  }

  const contentHTML = `
      <h1>${thanks}</h1>
      <p>${returnTo} <a href="http://tysoyoga.com/">${homePage}</a></p>
      `;

  const content = document.querySelector(".content");
  if (content) content.innerHTML = contentHTML;
});
