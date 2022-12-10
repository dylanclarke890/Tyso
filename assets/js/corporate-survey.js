UI.onPageReady(() => {
  AddThisHelper.initGlobals();
  $("#gallery").unitegallery({
    slider_scale_mode: "fit",
    thumb_fixed_size: false,
    strip_thumbs_align: "center",
    strippanel_padding_right: 300,
    gallery_height: 480,
  });
});
