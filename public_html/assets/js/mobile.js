UI.onPageReady(() => {
  const menuList = document.getElementById("menu-list");
  const menuBtn = document.getElementById("menubutt");
  const logo = document.getElementById("logo");
  const title = document.getElementById("title");
  const wrapper = document.getElementById("wrapper");
  const menuBtnInner = document.getElementById("menu-button-inner");
  let open = false;

  UI.addEvent(window, "resize", () => {
    if (window.innerWidth < 768) {
      if (!open) UI.hide(menuList);
      UI.show(menuBtn);
      logo.src = "assets/images/mobile/newlogo.png";
      return;
    }
    if (!open) UI.show(menuList);
    UI.hide(menuBtn);
    UI.show(title);
    wrapper.classList.remove("space");
    logo.src = "assets/images/icons/tyso-icon.png";
  });

  UI.addEvent(menuBtn, "click", (e) => {
    e.preventDefault();
    menuBtn.classList.toggle("selected");
    if (open) {
      // $("#menu-list").fadeOut();
      menuBtn.classList.add("smaller");
      menuBtn.classList.remove("bigger", "repo");
      wrapper.classList.remove("space");
      UI.show(title);
    } else {
      // $("#menu-list").fadeIn();
      menuBtn.classList.remove("smaller");
      menuBtn.classList.add("bigger", "repo");
      wrapper.classList.add("space");
      UI.hide(title);
    }
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