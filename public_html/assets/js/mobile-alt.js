UI.onPageReady(() => {
  const banner = document.getElementById("banner");
  const logo = document.getElementById("logo");
  const menuBtn = document.getElementById("menu-btn");
  const menuBtnIcon = document.getElementById("menu-btn-icon");
  const menuList = document.getElementById("menu-list");
  let menuOpen = false;

  UI.addStyles(menuList, { opacity: 0, display: "none" });

  const toggleMenu = () => {
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
  };
  UI.addEvent(menuBtn, "click", toggleMenu);

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
  UI.forEach(
    document.getElementsByClassName("current-year"),
    (el) => (el.innerText = new Date().getFullYear())
  );

  const goToLinks = document.querySelectorAll("[data-target]");
  UI.forEach(goToLinks, (link) =>
    UI.addEvent(link, "click", (e) => {
      e.preventDefault();
      toggleMenu();

      let y;
      const sections = document.querySelectorAll(`.${link.getAttribute("data-target")}`);
      if (sections.length === 0) return;
      if (sections.length === 1) y = sections[0].offsetTop; // just one section, no translations.
      else {
        // section must have multiple translations.
        const translated = UI.filter(sections, (el) => el.getAttribute("data-lang") === lang);
        y = translated[0].offsetTop;
      }
      UI.scrollTo(y);
    })
  );

  Galleria.loadTheme(
    "https://cdnjs.cloudflare.com/ajax/libs/galleria/1.5.7/themes/classic/galleria.classic.min.js"
  );
  Galleria.run(".galleria", { responsive: true });
});
