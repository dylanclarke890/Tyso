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

var videoSRC = $("#vidModal video").attr("src");

$("#vidModal").on("show.bs.modal", function () {
  $("video#vidIntro").get(0).play();
  $("video").prop("volume", 0.2);
  addthis.toolbox(".addthis_toolbox");
});
