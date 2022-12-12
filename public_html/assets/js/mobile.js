UI.onPageReady(() => {
  const title = document.getElementById("title");
  const menuBtn = document.getElementById("menubutt");
  const menuBtnInner = document.getElementById("menu-button-inner");
  const menuList = document.getElementById("menu-list");
  const logo = document.getElementById("logo");
  let open = false;

  UI.addEvent(window, "resize", () => {
    if (window.innerWidth < 768) {
      if (!open) UI.hide(menuList);
      UI.show(menuBtn);
      logo.src = "assets/images/mobile/newlogo.png";
    } else {
      if (!open) UI.show(menuList);
      UI.hide(menuBtn);
      UI.show(title);
      logo.src = "assets/images/icons/tyso-icon.png";
    }
  });

  UI.addEvent(menuBtn, "click", (e) => {
    e.preventDefault();
    // $("#menu-list").fadeOut();
    UI.toggle(menuList);
    menuBtn.classList.toggle("selected", "repo");
    menuBtnInner.classList.toggle("smaller", "bigger");
    document.getElementById("wrapper").classList.toggle("space");
    UI.toggle(title);
    open = !open;
  });

  UI.triggerEvent(window, "resize");
});

jQuery(function ($) {
  $(".navlink").click(function () {
    //or $("#menu").slideUp() if you want it to slide up instead of just disappearing.
    $("#menu-list").fadeOut();
    $("#menubutt").toggleClass("selected");
    $("#menu-button-inner").addClass("smaller");
    $("#menu-button-inner").removeClass("bigger");
    $("#wrapper").removeClass("space");
    $("#menubutt").removeClass("repo");
    $("#title").show();
  });
  (function () {
    Galleria.loadTheme(
      "https://cdnjs.cloudflare.com/ajax/libs/galleria/1.5.7/themes/classic/galleria.classic.min.js"
    );
    Galleria.run(".galleria");
  })();

  AddThisHelper.initGlobals();
});
