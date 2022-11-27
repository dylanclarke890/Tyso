document.addEventListener("DOMContentLoaded", addEvents);

function addEvents() {
  jQuery(function ($) {
    var open = false;

    function resizeMenu() {
      if ($(this).width() < 768) {
        if (!open) {
          $("#menu-list").hide();
        }
        $("#menubutt").show();
        $("#logo").attr("src", "image/logo_def.png");
      } else if ($(this).width() >= 768) {
        if (!open) {
          $("#menu-list").show();
        }
        $("#menubutt").hide();
        $("#title").show();
        $("#wrapper").removeClass("space");
        $("#logo").attr("src", "image/logo.png");
      }
    }

    function setupMenuButton() {
      $("#menubutt").click(function (e) {
        e.preventDefault();

        if (open) {
          $("#menu-list").slideUp();
          $("#menubutt").toggleClass("selected");

          $("#wrapper").removeClass("space");

          $("#title").show();
        } else {
          $("#menu-list").slideDown();
          $("#menubutt").toggleClass("selected");

          $("#wrapper").addClass("space");
          $("#title").hide();
        }

        open = !open;
      });

      $(".navlink").click(function () {
        if (open) {
          $("#menu-list").slideUp();

          $("#wrapper").removeClass("space");

          $("#title").show();

          open = !open;
        }
      });
    }

    $(window).resize(resizeMenu);
    resizeMenu();
    setupMenuButton();
  });
}
