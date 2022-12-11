jQuery(function ($) {
  var open = false;

  function resizeMenu() {
    if ($(this).width() < 768) {
      if (!open) {
        $("#menu-list").hide();
      }
      $("#menubutt").show();
      $("#logo").attr("src", "assets/images/mobile/newlogo.png");
    } else if ($(this).width() >= 768) {
      if (!open) {
        $("#menu-list").show();
      }
      $("#menubutt").hide();
      $("#title").show();
      $("#wrapper").removeClass("space");
      $("#logo").attr("src", "assets/images/icons/tyso-icon.png");
    }
  }

  function setupMenuButton() {
    $("#menubutt").click(function (e) {
      e.preventDefault();

      if (open) {
        $("#menu-list").fadeOut();
        $("#menubutt").toggleClass("selected");
        $("#menu-button-inner").addClass("smaller");
        $("#menu-button-inner").removeClass("bigger");
        $("#wrapper").removeClass("space");
        $("#menubutt").removeClass("repo");
        $("#title").show();
      } else {
        $("#menu-list").fadeIn();
        $("#menubutt").toggleClass("selected");
        $("#menu-button-inner").addClass("bigger");
        $("#menu-button-inner").removeClass("smaller");
        $("#wrapper").addClass("space");
        $("#menubutt").addClass("repo");
        $("#title").hide();
      }

      open = !open;
    });
  }

  $(window).resize(resizeMenu);

  resizeMenu();
  setupMenuButton();
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
