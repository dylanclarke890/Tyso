function addEvents() {
  $("#watchbutt").click(function () {
    $("#vidModal").modal("hide");
  });
}

document.addEventListener("DOMContentLoaded", addEvents);
