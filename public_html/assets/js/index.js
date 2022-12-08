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

  UI.addEvent(window, "resize", () => {
    const width = window.innerWidth;
    if (width <= 480)
      document.getElementById("emailButt").classList.remove("addthis_inline_follow_toolbox");
  });

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

document.addEventListener("DOMContentLoaded", addEvents);
