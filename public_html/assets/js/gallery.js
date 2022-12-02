class GalleryImage {
  constructor({ id, name, classes, alt, ext = ".jpg", isThumbNail = false } = {}) {
    this.id = id; // id
    this.name = name; // src
    this.classes = classes; // individual class(es) to apply
    this.alt = alt ?? name; // alt text if image not found
    this.ext = ext; // image extension (i.e ".jpg")
    this.isThumbNail = isThumbNail;
    this.build();
  }

  static CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  static randomID() {
    let ID = "";
    for (let i = 0; i < 12; i++) {
      ID += GalleryImage.CHARS.charAt(Math.floor(Math.random() * 36));
    }
    return ID;
  }

  build(rootDir = "assets/images/gallery/", thumbSuffix = "-thumb") {
    rootDir ??= "";
    thumbSuffix ??= "";
    this.id ??= GalleryImage.randomID();
    this.srcPath =
      this.name && this.ext
        ? `${rootDir}${this.name}${this.isThumbNail ? thumbSuffix : ""}${this.ext}`
        : "";
    this.attributes = {
      id: this.id ? `id="${this.id}"` : "",
      classes: this.classes && this.classes.length ? `class="${this.classes.join(" ")}"` : "",
      alt: this.alt ? `alt="${this.alt}"` : "",
      src: this.srcPath ? `src="${this.srcPath}"` : "",
    };

    this.html = `
      <img ${Object.values(this.attributes).join(" ")} />
    `;
  }
}

class ParallaxGallery {
  constructor({ images, dimensions = {}, onLoadComplete } = {}) {
    this.images = images;
    const { thumbnail, mainImage } = dimensions;
    this.thumbnailDimensions = thumbnail ?? { w: 120, h: 120 };
    this.mainImageDimensions = mainImage ?? { w: 400, h: 400 };
    this.onLoadComplete = onLoadComplete ?? (() => null);
    this.tempDivId = GalleryImage.randomID();
    this.#insertIntoTempDiv();
    this.#scaleImgs();
  }

  #insertIntoTempDiv() {
    const target = document.createElement("div");
    target.id = this.tempDivId;
    target.style.opacity = 0;
    target.style.position = "absolute";
    target.innerHTML = this.images.map((i) => i.html).join("");
    this.target = target;
    document.body.appendChild(target);
  }

  #drawImgToScale(img, ctx) {
    const cw = ctx.canvas.width,
      ch = ctx.canvas.height,
      iw = img.width,
      ih = img.height;
    const hRatio = cw / iw;
    const vRatio = ch / ih;
    const ratio = Math.min(hRatio, vRatio);
    const centerShift_x = (cw - iw * ratio) / 2;
    const centerShift_y = (ch - ih * ratio) / 2;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, 0, 0, iw, ih, centerShift_x, centerShift_y, iw * ratio, ih * ratio);
  }

  #insertContent() {
    const container = document.createElement("div");
    container.id = "pxs_container";
    container.classList.add("pxs_container");
    container.innerHTML = this.html;
    document.body.prepend(container);
  }

  #build() {
    this.html = `
      <div class="pxs_bg">
        <div class="pxs_bg1"></div>
        <div class="pxs_bg2"></div>
        <div class="pxs_bg3"></div>
      </div>
      <div class="pxs_loading">Loading images...</div>
      <div class="container-fluid wall">
        <div class="pxs_slider_wrapper">
          <div id="wmf">
            <ul class="pxs_slider">
              ${this.mainImages.join(" ")}
            </ul>
          </div>
          <div class="pxs_navigation go">
            <span class="pxs_next"></span>
            <span class="pxs_prev"></span>
          </div>
          <ul class="pxs_thumbnails away">
            ${this.thumbnails.join(" ")}
          </ul>
        </div>
      </div>
    `;
    this.#insertContent();
  }

  #buildGalleryImg(dataURL) {
    return `
      <li>
        <img src="${dataURL}" />
      </li>
    `;
  }

  #scaleImgs() {
    this.thumbnails = [];
    this.mainImages = [];

    const container = document.getElementById(this.tempDivId);
    const images = container.children;

    const thumbCanvas = document.createElement("canvas");
    thumbCanvas.width = this.thumbnailDimensions.w;
    thumbCanvas.height = this.thumbnailDimensions.h;
    const thumbCtx = thumbCanvas.getContext("2d");

    const mainCanvas = document.createElement("canvas");
    mainCanvas.width = this.mainImageDimensions.w;
    mainCanvas.height = this.mainImageDimensions.h;
    const mainCtx = mainCanvas.getContext("2d");

    let loaded = 0;
    const totalToLoad = images.length;
    for (let img of images)
      img.onload = () => {
        this.#drawImgToScale(img, thumbCtx);
        this.#drawImgToScale(img, mainCtx);

        this.thumbnails.push(this.#buildGalleryImg(thumbCanvas.toDataURL(img.type)));
        this.mainImages.push(this.#buildGalleryImg(mainCanvas.toDataURL(img.type)));

        container.removeChild(img);
        loaded++;

        if (loaded === totalToLoad) {
          this.#build();
          onLoadComplete();
          if (this.target) {
            document.body.removeChild(this.target);
            this.target = null;
          }
        }
      };
  }
}

function onLoadComplete() {
  (function ($) {
    $.fn.parallaxSlider = function (options) {
      var opts = $.extend({}, $.fn.parallaxSlider.defaults, options);
      return this.each(function () {
        var $pxs_container = $(this),
          o = $.meta ? $.extend({}, opts, $pxs_container.data()) : opts;
        //the main slider
        var $pxs_slider = $(".pxs_slider", $pxs_container),
          //the elements in the slider
          $elems = $pxs_slider.children(),
          //total number of elements
          total_elems = $elems.length,
          //the navigation buttons
          $pxs_next = $(".pxs_next", $pxs_container),
          $pxs_prev = $(".pxs_prev", $pxs_container),
          //the bg images
          $pxs_bg1 = $(".pxs_bg1", $pxs_container),
          $pxs_bg2 = $(".pxs_bg2", $pxs_container),
          $pxs_bg3 = $(".pxs_bg3", $pxs_container),
          //current image
          current = 0,
          //the thumbs container
          $pxs_thumbnails = $(".pxs_thumbnails", $pxs_container),
          //the thumbs
          $thumbs = $pxs_thumbnails.children(),
          //the interval for the autoplay mode
          slideshow,
          //the loading image
          $pxs_loading = $(".pxs_loading", $pxs_container),
          $pxs_slider_wrapper = $(".pxs_slider_wrapper", $pxs_container);

        //first preload all the images
        var loaded = 0,
          $images = $pxs_slider_wrapper.find("img");

        $images.each(function () {
          var $img = $(this);
          $("<img/>")
            .load(function () {
              ++loaded;
              if (loaded == total_elems * 2) {
                $pxs_loading.hide();
                $pxs_slider_wrapper.show();

                var one_image_w = $pxs_slider.find("img:first").width();

                setWidths(
                  $pxs_slider,
                  $elems,
                  total_elems,
                  $pxs_bg1,
                  $pxs_bg2,
                  $pxs_bg3,
                  one_image_w,
                  $pxs_next,
                  $pxs_prev
                );

                //CHANGE THUMBNAIL WIDTHS HERE//
                $pxs_thumbnails.css({
                  width: one_image_w + "px",
                  "margin-left": -one_image_w + 60, //move thumbnail row left or right//
                });
                var spaces = 70; //Adjust overlap//
                $thumbs.each(function (i) {
                  var $this = $(this);
                  var left = spaces * (i - 5) + $this.width();
                  $this.css("left", left + "px");

                  if (o.thumbRotation) {
                    var angle = Math.floor(Math.random() * 41) - 20;
                    $this.css({
                      "-moz-transform": "rotate(" + angle + "deg)",
                      "-webkit-transform": "rotate(" + angle + "deg)",
                      transform: "rotate(" + angle + "deg)",
                    });
                  }
                  //hovering the thumbs animates them up and down
                  $this
                    .bind("mouseenter", function () {
                      $(this).stop().animate({ top: "-10px" }, 100);
                    })
                    .bind("mouseleave", function () {
                      $(this).stop().animate({ top: "0px" }, 100);
                    });
                });

                highlight($thumbs.eq(0));

                $pxs_next.bind("click", function () {
                  ++current;
                  if (current >= total_elems)
                    if (o.circular) current = 0;
                    else {
                      --current;
                      return false;
                    }
                  highlight($thumbs.eq(current));
                  slide(
                    current,
                    $pxs_slider,
                    $pxs_bg3,
                    $pxs_bg2,
                    $pxs_bg1,
                    o.speed,
                    o.easing,
                    o.easingBg
                  );
                });
                $pxs_prev.bind("click", function () {
                  --current;
                  if (current < 0)
                    if (o.circular) current = total_elems - 1;
                    else {
                      ++current;
                      return false;
                    }
                  highlight($thumbs.eq(current));
                  slide(
                    current,
                    $pxs_slider,
                    $pxs_bg3,
                    $pxs_bg2,
                    $pxs_bg1,
                    o.speed,
                    o.easing,
                    o.easingBg
                  );
                });

                $thumbs.bind("click", function () {
                  var $thumb = $(this);
                  highlight($thumb);
                  if (o.auto) clearInterval(slideshow);
                  current = $thumb.index();
                  slide(
                    current,
                    $pxs_slider,
                    $pxs_bg3,
                    $pxs_bg2,
                    $pxs_bg1,
                    o.speed,
                    o.easing,
                    o.easingBg
                  );
                });

                if (o.auto != 0) {
                  o.circular = true;
                  slideshow = setInterval(function () {
                    $pxs_next.trigger("click");
                  }, o.auto);
                }

                $(window).resize(function () {
                  w_w = $(window).width();
                  setWidths(
                    $pxs_slider,
                    $elems,
                    total_elems,
                    $pxs_bg1,
                    $pxs_bg2,
                    $pxs_bg3,
                    one_image_w,
                    $pxs_next,
                    $pxs_prev
                  );
                  slide(
                    current,
                    $pxs_slider,
                    $pxs_bg3,
                    $pxs_bg2,
                    $pxs_bg1,
                    1,
                    o.easing,
                    o.easingBg
                  );
                });
              }
            })
            .error(function () {
              console.log("Error occured while loading parallaxSlider");
            })
            .attr("src", $img.attr("src"));
        });
      });
    };

    //the current windows width
    var w_w = $(window).width();

    var slide = function (
      current,
      $pxs_slider,
      $pxs_bg3,
      $pxs_bg2,
      $pxs_bg1,
      speed,
      easing,
      easingBg
    ) {
      var slide_to = parseInt(-w_w * current);
      $pxs_slider.stop().animate(
        {
          left: slide_to + "px",
        },
        speed,
        easing
      );
      $pxs_bg3.stop().animate(
        {
          left: slide_to / 2 + "px",
        },
        speed,
        easingBg
      );
      $pxs_bg2.stop().animate(
        {
          left: slide_to / 4 + "px",
        },
        speed,
        easingBg
      );
      $pxs_bg1.stop().animate(
        {
          left: slide_to / 8 + "px",
        },
        speed,
        easingBg
      );
    };

    var highlight = function ($elem) {
      $elem.siblings().removeClass("selected");
      $elem.addClass("selected");
    };

    var setWidths = function (
      $pxs_slider,
      $elems,
      total_elems,
      $pxs_bg1,
      $pxs_bg2,
      $pxs_bg3,
      one_image_w,
      $pxs_next,
      $pxs_prev
    ) {
      var pxs_slider_w = w_w * total_elems;
      $pxs_slider.width(pxs_slider_w + "px");

      //each element will have a width = windows width Can also adjust height
      $elems.width(w_w + "px");
      //$elems.height(400 + 'px');
      $elems.css({ paddingTop: 65 });
      $pxs_bg1.width(pxs_slider_w + "px");
      $pxs_bg2.width(pxs_slider_w + "px");
      $pxs_bg3.width(pxs_slider_w + "px");

      /* both the right and left of the navigation next and previous buttons will be:
    windowWidth/2 - imgWidth/2 + some margin (not to touch the image borders) */
      var position_nav = w_w / 2 - one_image_w / 2 - 150;
      $pxs_next.css("right", position_nav + "px");
      $pxs_prev.css("left", position_nav + "px");
    };

    $.fn.parallaxSlider.defaults = {
      auto: 0, // how many seconds to periodically slide the content. If set to 0 then autoplay is turned off.
      speed: 850, //speed of each slide animation
      easing: "jswing", //easing effect for the slide animation
      easingBg: "jswing", //easing effect for the background animation
      circular: true, //circular slider
      thumbRotation: false, //the thumbs will be randomly rotated
    };
    //easeInOutExpo,easeInBack
  })(jQuery);

  $("#pxs_container").parallaxSlider();
  const cufonReplacements = [
    ["h1", { textShadow: "1px 1px #000" }],
    ["h2", { textShadow: "1px 1px #000" }],
    [".footer", { textShadow: "1px 1px #000" }],
    [".pxs_loading", { textShadow: "1px 1px #000" }],
  ];
  for (let [target, styles] of cufonReplacements) Cufon.replace(target, styles);
}

function onReady() {
  const settings = {
    images: [],
    sharedClassThumbnails: "resize_vertical", // applied to all thumbnail images
    sharedClassImages: "", // applied to all "main" images
    onLoadComplete,
  };

  const now = performance.now();

  // TIMED CODE
  for (let i = 1; i < 22; i++) settings.images.push(new GalleryImage({ name: i.toString() }));
  new ParallaxGallery(settings);
  // END OF TIMED CODE

  const after = performance.now();
  console.log(after - now);
}

document.addEventListener("DOMContentLoaded", onReady);
