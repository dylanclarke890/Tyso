document.addEventListener("DOMContentLoaded", addEvents);

function addEvents() {
  window.twttr = (function (d, s, id) {
    var t,
      js,
      fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js, fjs);
    return (
      window.twttr ||
      (t = {
        _e: [],
        ready: function (f) {
          t._e.push(f);
        },
      })
    );
  })(document, "script", "twitter-wjs");

  var addthis_share = addthis_share || {};
  addthis_share = {
    passthrough: {
      twitter: { via: "anthonykamanos #TYSO #yoga" },
    },
  };

  function onResize() {
    const width = window.innerWidth;
    const emailButt = document.getElementById("emailButt");
    if (width <= 480) emailButt.classList.remove("addthis_inline_follow_toolbox");
  }

  UI;

  $(window)
    .resize(function () {
      console.log("resize called");
      var width = $(window).width();
      if (width <= 480) {
        $("#emailbutt").removeClass("addthis_inline_follow_toolbox");
      }
    })
    .resize(); //trigger the resize event on page load.

  $("#vidModal").on("hidden.bs.modal", function (e) {
    $("#vidModal video").attr("src", $("#vidModal video").attr("src"));
  });
  $("#watchbutt").click(function () {
    $("#vidModal").modal("hide");
  });
  $("#vidModal video").attr("src");

  $("#vidModal").on("show.bs.modal", function () {
    $("video#vidIntro").get(0).play();
    $("video").prop("volume", 0.2);
    addthis.toolbox(".addthis_toolbox");
  });
}
