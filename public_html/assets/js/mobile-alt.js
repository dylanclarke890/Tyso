UI.onPageReady(() => {
  const banner = document.getElementById("banner");
  const logo = document.getElementById("logo");
  const menuBtn = document.getElementById("menu-btn");
  const menuBtnIcon = document.getElementById("menu-btn-icon");
  const menuList = document.getElementById("menu-list");
  let menuOpen = false;

  UI.addStyles(menuList, { opacity: 0, display: "none" });
  UI.addEvent(menuBtn, "click", () => {
    menuBtnIcon.classList.toggle("larger");
    if (menuOpen) {
      UI.fadeOut(menuList);
      UI.fadeIn(logo);
      UI.removeStyles(banner, ["justify-content"]);
      UI.removeStyles(menuBtn, ["transform"]);
    } else {
      UI.fadeIn(menuList);
      UI.fadeOut(logo);
      UI.addStyles(banner, { justifyContent: "center" });
      UI.addStyles(menuBtn, { transform: "rotate(180deg)" });
    }
    menuOpen = !menuOpen;
  });

  let lang;
  switch (navigator.language) {
    case "fr":
    case "fr-fr":
    case "fr-ca":
      lang = "FR";
      break;
    case "en-US":
    case "en-GB":
      lang = "EN";
      break;
    default:
      lang = "EN";
  }

  const elementsToHide = document.querySelectorAll(`[data-lang]:not([data-lang="${lang}"])`);
  elementsToHide.forEach((e) => UI.hide(e));

  const backToTopBtns = document.getElementsByClassName("back-to-top");
  UI.forEach(backToTopBtns, (btn) => UI.addEvent(btn, "click", () => UI.scrollTo(0)));

  Galleria.loadTheme(
    "https://cdnjs.cloudflare.com/ajax/libs/galleria/1.5.7/themes/classic/galleria.classic.min.js"
  );
  Galleria.run(".galleria", { responsive: true });
});
