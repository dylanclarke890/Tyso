class DOMHelper {
  static #chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  static uniqueId = () =>
    Array.from({ length: 10 }, () => this.#chars[Math.floor(Math.random() * 52)]).join("");

  static hide = (/** @type {HTMLElement} */ element) => {
    if (element) element.style.display = "none";
  };

  static show = (/** @type {HTMLElement} */ element) => {
    if (element) element.style.removeProperty("display");
  };

  static toggle = (/** @type {HTMLElement} */ element) => {
    if (!element) return;
    if (element.style.display === "none") element.style.removeProperty("display");
    else element.style.display = "none";
  };

  static forEach = (/** @type {HTMLCollection} */ elements, cb) => {
    for (let i = 0; i < elements.length; i++) cb(elements[i], i);
  };

  static nthChild = (/** @type {HTMLCollection} */ elements, i) => elements.item(i);

  static siblings = (/** @type {HTMLElement} */ element) => {
    const siblings = [];
    DOMHelper.forEach(element.parentElement.children, (e) => {
      if (e !== element) siblings.push(e);
    });
    return siblings;
  };

  static addEvent = (/** @type {HTMLElement} */ element, event, cb) => {
    if (element.addEventListener) element.addEventListener(event, cb, false);
    else if (element.attachEvent) {
      element["e" + event + cb] = cb;
      element[event + cb] = () => element["e" + event + cb](window.event);
      element.attachEvent("on" + event, element[event + cb]);
    } else element["on" + event] = element["e" + event + cb];
  };

  static triggerEvent = (/** @type {HTMLElement} */ element, event) =>
    element.dispatchEvent(new Event(event));

  static animate(
    /** @type {HTMLElement} */ element,
    keyframes,
    speed,
    effect = "ease-in",
    times = 1,
    fill = "forwards"
  ) {
    element.animate(keyframes, { duration: speed, iterations: times, easing: effect, fill });
    keyframes.forEach((kf) => Object.keys(kf).forEach((t) => (element.style[t] = kf[t])));
  }

  static addStyles = (/** @type {HTMLElement} */ element, styles) =>
    Object.keys(styles).forEach((s) => (element.style[s] = styles[s]));

  static getFromDOMQuery = (/** @type {string} */ DOMQuery, type = "class") => {
    switch (type) {
      case "id":
        return !DOMQuery || DOMQuery[0] !== "#" ? "" : DOMQuery.substring(1);
      case "class":
        return !DOMQuery || DOMQuery[0] !== "." ? "" : DOMQuery.substring(1);
      default:
        return "";
    }
  };

  static newCanvasContext = (width, height, context) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas.getContext(context);
  };
}

class ImageWrapper {
  constructor({ src, id, className }) {
    this.src = src;
    this.id = id ?? DOMHelper.uniqueId();
    this.className = className;
  }

  load(cb = null) {
    this.image = new Image();
    if (this.cb) DOMHelper.addEvent(this.image, "load", cb);
    this.image.src = this.src;
    return this.image;
  }
}

class GalleryImage {
  constructor({ id, name, classes, alt, ext = ".jpg", rootDir = "assets/images/gallery/" } = {}) {
    this.id = id; // id
    this.name = name; // src
    this.classes = classes; // individual class(es) to apply
    this.alt = alt ?? name; // alt text if image not found
    this.ext = ext; // image extension (i.e ".jpg")
    this.rootDir = rootDir;
    this.#getAttributes();
    this.build();
  }

  #getAttributes() {
    this.id ??= DOMHelper.uniqueId();
    this.srcPath = this.name && this.ext ? `${this.rootDir}${this.name}${this.ext}` : "";
    this.attributes = {
      id: this.id ? `id="${this.id}"` : "",
      classes: this.classes && this.classes.length ? `class="${this.classes.join(" ")}"` : "",
      alt: this.alt ? `alt="${this.alt}"` : "",
      src: this.srcPath ? `src="${this.srcPath}"` : "",
    };
  }

  build() {
    this.html = `
      <img ${Object.values(this.attributes).join(" ")} />
    `;
  }
}

class ParallaxBuilder {
  #defaults = {
    DOMElementRefs: {
      container: ".pxs_container",
      slider: ".pxs_slider",
      sliderWrapper: ".pxs_slider_wrapper",
      thumbnails: ".pxs_thumbnails",
      prev: ".pxs_prev",
      next: ".pxs_next",
      bg: ".pxs_bg",
      loading: ".pxs_loading",
    },
    slides: {
      main: [],
      thumbnail: [],
    },
    scaleImages: true,
    slideWidth: 400,
    slideHeight: 400,
    thumbnailWidth: 50,
    thumbnailHeight: 50,
    bgLayers: 3,
    onComplete: () => null,
  };

  constructor(options = {}) {
    this.opts = Object.assign({}, this.#defaults, options);
    this.#loadingScreen();
    this.#loadImages();
  }

  #loadingScreen() {
    const loadingDiv = document.createElement("div");
    loadingDiv.className = DOMHelper.getFromDOMQuery(this.opts.DOMElementRefs.loading, "class");
    loadingDiv.innerHTML = "Loading images...";
    document.body.prepend(loadingDiv);
  }

  #loadImage(src, cb) {
    const image = new Image();
    DOMHelper.addEvent(image, "load", cb);
    image.src = src;
    return image;
  }

  #loadImages() {
    const { main, thumbnail } = this.opts.slides;
    this.thumbnails = [];
    this.mainImages = [];

    let loaded = 0;
    let total = main.length * 2;
    const cb = () => {
      if (++loaded === total) this.#buildHTML();
    };
    for (let i = 0; i < main.length; i++) {
      this.mainImages.push(this.#loadImage(main[i], cb));
      this.thumbnails.push(this.#loadImage(thumbnail[i] ?? main[i], cb));
    }
  }

  #buildHTML() {
    const { DOMElementRefs, bgLayers, onComplete } = this.opts;
    const { container, slider, sliderWrapper, thumbnails, prev, next, bg } = DOMElementRefs;
    const bgClass = DOMHelper.getFromDOMQuery(bg);
    const bgs = Array.from(
      { length: bgLayers },
      (_, i) => `<div class="${bgClass}${i + 1}"></div>`
    );

    this.html = `
      <div class="${bgClass}">
        ${bgs.join("")}
      </div>
      <div class="${DOMHelper.getFromDOMQuery(sliderWrapper)}">
        <ul class="${DOMHelper.getFromDOMQuery(slider)}">
          ${this.mainImages
            .map((v) => `<li><img style='width: 300px;' src=${v.src} /></li>`)
            .join("")}
        </ul>
        <ul class="${DOMHelper.getFromDOMQuery(thumbnails)}">
          ${this.thumbnails
            .map((v) => `<li><img style='height: 80px;' src=${v.src} /></li>`)
            .join("")}
        </ul>
        <button class="${DOMHelper.getFromDOMQuery(next)}"></button>
        <button class="${DOMHelper.getFromDOMQuery(prev)}"></button>
      </div>
    `;

    const containerDiv = document.createElement("div");
    containerDiv.className = DOMHelper.getFromDOMQuery(container);
    containerDiv.innerHTML = this.html;
    document.body.prepend(containerDiv);
    onComplete();
    this.#finishLoading();
  }

  #finishLoading() {
    const { loading } = this.opts.DOMElementRefs;
    document.body.removeChild(document.querySelector(loading));
  }
}

class ParallaxSlider {
  #defaults = {
    buildSlides: true,
    DOMElementRefs: {
      container: ".pxs_container",
      slider: ".pxs_slider",
      sliderWrapper: ".pxs_slider_wrapper",
      thumbnails: ".pxs_thumbnails",
      prev: ".pxs_prev",
      next: ".pxs_next",
      bg: ".pxs_bg",
      loading: ".pxs_loading",
    },
    autoplay: 0,
    circular: true,
    speed: 850, // ms
    spaces: 70,
    thumbRotation: false,
    effect: "ease-in-out",
    bgEffect: "ease-in",
    imageWidth: 400, // in px
  };

  #getContainer() {
    const c = this.opts.container;
    let container = null;
    if (c)
      if (typeof c === "string") {
        container = document.querySelector(c);
        this.opts.DOMElementRefs.container = c;
      } else if (c instanceof Element) container = c;
    if (!c || !container) container = document.querySelector(this.opts.DOMElementRefs.container);
    if (!container) throw new Error(`opts.container was not a valid selector or HTML element.`);
    /* For a consistent and cheap way of finding the container later we can append a random ID
    to the classlist. Make sure to update the generated id in the DOMElementRefs. */
    const rand = DOMHelper.uniqueId();
    container.classList.add(rand);
    this.opts.DOMElementRefs.container = `.${rand}`;
    this.elements = { container };
  }

  #getElements() {
    const { container, slider, sliderWrapper, thumbnails, prev, next, bg, loading } =
      this.opts.DOMElementRefs;
    this.elements = Object.assign(this.elements, {
      slider: document.querySelector(`${container} ${slider}`),
      sliderWrapper: document.querySelector(`${container} ${sliderWrapper}`),
      thumbnails: document.querySelector(`${container} ${thumbnails}`),
      prev: document.querySelector(`${container} ${prev}`),
      next: document.querySelector(`${container} ${next}`),
      bg: document.querySelector(`${container} ${bg}`),
      loading: document.querySelector(`${container} ${loading}`),
    });
  }

  #preloadImages() {
    let loaded = 0;
    const total = this.slide.total * 2;
    const images = this.elements.sliderWrapper.querySelectorAll("img");
    for (let img of images) {
      const i = new Image();
      DOMHelper.addEvent(i, "load", () => {
        if (++loaded === total) this.#setup();
      });
      i.src = img.src;
    }
  }

  constructor(options = {}) {
    this.opts = Object.assign({}, this.#defaults, options);
    const setup = () => {
      this.#getContainer();
      this.#getElements();
      this.slide = { current: 0, total: this.elements.slider.children.length };
      this.#preloadImages();
    };
    if (this.opts.buildSlides) new ParallaxBuilder({ slides: options.slides, onComplete: setup });
    else setup();
  }

  #setWidths() {
    const { slider, bg } = this.elements;
    const screenWidth = window.innerWidth;
    const totalWidth = screenWidth * this.slide.total;
    slider.style.width = `${totalWidth}px`;
    DOMHelper.forEach(slider.children, (el) =>
      DOMHelper.addStyles(el, { width: `${screenWidth}px`, paddingTop: `65px` })
    );
    DOMHelper.forEach(bg.children, (el) => DOMHelper.addStyles(el, { width: `${totalWidth}px` }));
    /* both the right and left of the navigation next and previous buttons will be:
    windowWidth/2 - imgWidth/2 + some margin (not to touch the image borders) */
    const offsetNavBy = screenWidth / 3;
    const { prev, next } = this.elements;
    DOMHelper.addStyles(prev, { left: `${offsetNavBy}px` });
    DOMHelper.addStyles(next, { left: `${offsetNavBy * 2}px` });
  }

  #selectThumbnail(/** @type {HTMLElement} */ element) {
    DOMHelper.forEach(DOMHelper.siblings(element), (e) => e.classList.remove("selected"));
    element.classList.add("selected");
  }

  #slideChanged() {
    const { speed, effect, bgEffect } = this.opts;
    const { slider, bg } = this.elements;

    const offset = -window.innerWidth * this.slide.current;
    if (!slider.style.left) DOMHelper.addStyles(slider, { left: "0px" });
    DOMHelper.animate(
      slider,
      [{ left: `${slider.style.left}` }, { left: `${offset}px` }],
      speed,
      effect
    );
    DOMHelper.forEach(bg.children, (e, i) => {
      const to = offset / Math.pow(2, i + 1);
      if (!e.style.left) DOMHelper.addStyles(e, { left: "0px" });
      DOMHelper.animate(e, [{ left: `${e.style.left}` }, { left: `${to}px` }], speed, bgEffect);
    });
  }

  #addEvents() {
    const { prev, next, thumbnails } = this.elements;
    const { circular, autoplay } = this.opts;

    DOMHelper.addEvent(window, "resize", () => {
      this.#setWidths();
      this.#slideChanged();
    });
    DOMHelper.addEvent(next, "click", () => {
      if (++this.slide.current >= this.slide.total) {
        if (circular) this.slide.current = 0;
        else {
          --this.slide.current;
          return;
        }
      }
      this.#selectThumbnail(DOMHelper.nthChild(thumbnails.children, this.slide.current));
      this.#slideChanged();
    });
    DOMHelper.addEvent(prev, "click", () => {
      if (--this.slide.current < 0) {
        if (circular) this.slide.current = this.slide.total - 1;
        else {
          ++this.slide.current;
          return;
        }
      }
      this.#selectThumbnail(DOMHelper.nthChild(thumbnails.children, this.slide.current));
      this.#slideChanged();
    });
    DOMHelper.forEach(thumbnails.children, (e, i) => {
      DOMHelper.addEvent(e, "click", () => {
        this.#selectThumbnail(e);
        if (autoplay) clearInterval(this.slideshow);
        this.slide.current = i;
        this.#slideChanged();
      });
    });
    if (autoplay !== 0) {
      this.opts.circular = true;
      this.slideshow = setInterval(() => DOMHelper.triggerEvent(next, "click"), autoplay);
    }
  }

  #setup() {
    const { loading, sliderWrapper, thumbnails } = this.elements;
    const { imageWidth, spaces, thumbRotation } = this.opts;

    DOMHelper.hide(loading);
    DOMHelper.show(sliderWrapper);
    this.#setWidths();
    DOMHelper.addStyles(thumbnails, { width: imageWidth });
    DOMHelper.forEach(thumbnails.children, (tn, i) => {
      DOMHelper.addStyles(tn, { left: `${spaces + i * tn.offsetWidth}px` });
      DOMHelper.addEvent(tn, "mouseenter", () =>
        DOMHelper.animate(tn, [{ top: "0px" }, { top: "-10px" }], 100)
      );
      DOMHelper.addEvent(tn, "mouseleave", () =>
        DOMHelper.animate(tn, [{ top: "-10px" }, { top: "0px" }], 100)
      );
      if (thumbRotation) {
        const angle = Math.floor(Math.random() * 41) - 20;
        const style = `rotate(${angle}deg)`;
        DOMHelper.addStyles(tn, {
          "-moz-transform": style,
          "-webkit-transform": style,
          transform: style,
        });
      }
    });

    this.#selectThumbnail(DOMHelper.nthChild(thumbnails.children, 0));
    this.#addEvents();
  }
}

class ParallaxGallery {
  constructor({ images, dimensions = {} } = {}) {
    this.images = images;
    const { thumbnail, mainImage } = dimensions;
    this.thumbnailDimensions = thumbnail ?? { w: 120, h: 120 };
    this.mainImageDimensions = mainImage ?? { w: 400, h: 400 };
    this.tempDivId = DOMHelper.uniqueId();
    this.#insertIntoTempDiv();
    this.#scaleImgs();
  }

  // area to focus on.
  #insertIntoTempDiv() {
    this.target = document.createElement("div");
    this.target.id = this.tempDivId;
    DOMHelper.addStyles(this.target, { opacity: 0, position: "absolute" });
    this.target.innerHTML = this.images.map((i) => i.html).join("");
    document.body.appendChild(this.target);
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
          // this.#onLoadComplete();
          if (this.target) {
            document.body.removeChild(this.target);
            this.target = null;
          }
        }
      };
  }
}

function onReady() {
  const now = performance.now();
  //#region TIMED CODE
  const settings = {
    buildSlides: true,
    slides: {
      main: [],
      thumbnail: [],
    },
  };
  for (let i = 1; i < 22; i++)
    settings.slides.main.push(`assets/images/gallery/${i.toString()}.jpg`);
  new ParallaxSlider(settings);
  //#endregion END OF TIMED CODE
  const after = performance.now();
  console.log(after - now);
}

document.addEventListener("DOMContentLoaded", onReady);
