class UI {
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

  static map = (/** @type {HTMLCollection} */ elements, cb) => {
    const mapped = [];
    for (let i = 0; i < elements.length; i++) {
      const result = cb(elements[i], i, elements);
      mapped.push(result);
    }
    return mapped;
  };

  static filter = (/** @type {HTMLCollection} */ elements, cb) => {
    const filtered = [];
    for (let i = 0; i < elements.length; i++) {
      const result = cb(elements[i], i, elements);
      if (result) filtered.push(elements[i]);
    }
    return filtered;
  };

  static reduce = (/** @type {HTMLCollection} */ elements, reducer, initialValue) => {
    let accumulator = initialValue === undefined ? 0 : initialValue;
    for (let i = 0; i < elements.length; i++)
      accumulator = reducer(accumulator, elements[i], i, elements);
    return accumulator;
  };

  static forEach = (/** @type {HTMLCollection} */ elements, cb) => {
    for (let i = 0; i < elements.length; i++) cb(elements[i], i);
  };

  static nthChild = (/** @type {HTMLCollection} */ elements, i) => elements.item(i);

  static siblings = (/** @type {HTMLElement} */ element) => {
    const siblings = [];
    UI.forEach(element.parentElement.children, (e) => {
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

  static animate = (
    /** @type {HTMLElement} */ element,
    keyframes,
    speed,
    effect = "ease-in",
    times = 1,
    fill = "forwards"
  ) => element.animate(keyframes, { duration: speed, iterations: times, easing: effect, fill });

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
    loadingDiv.className = UI.getFromDOMQuery(this.opts.DOMElementRefs.loading, "class");
    loadingDiv.innerHTML = "Loading images...";
    document.body.prepend(loadingDiv);
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

  #buildGalleryImg() {}

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
        loaded++;
        if (loaded === totalToLoad) {
        }
      };
  }

  #loadImage(src, cb) {
    const image = new Image();
    UI.addEvent(image, "load", cb);
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
    const bgClass = UI.getFromDOMQuery(bg);
    const bgs = Array.from(
      { length: bgLayers },
      (_, i) => `<div class="${bgClass}${i + 1}"></div>`
    );

    this.html = `
      <div class="${bgClass}">
        ${bgs.join("")}
      </div>
      <div class="${UI.getFromDOMQuery(sliderWrapper)}">
        <ul class="${UI.getFromDOMQuery(slider)}">
          ${this.mainImages
            .map((v) => `<li><img style='height: 550px;' src=${v.src} /></li>`)
            .join("")}
        </ul>
        <ul class="${UI.getFromDOMQuery(thumbnails)}">
          ${this.thumbnails
            .map((v) => `<li><img style='height: 110px;' src=${v.src} /></li>`)
            .join("")}
        </ul>
        <button class="${UI.getFromDOMQuery(next)}"></button>
        <button class="${UI.getFromDOMQuery(prev)}"></button>
      </div>
    `;

    const containerDiv = document.createElement("div");
    containerDiv.className = UI.getFromDOMQuery(container);
    containerDiv.innerHTML = this.html;
    document.body.prepend(containerDiv);
    onComplete();
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
    addKeyboardEvents: true,
    autoplay: 0,
    circular: true,
    speed: 850, // ms
    overlapInPixels: 0,
    fitWithinScreen: true,
    thumbRotation: false,
    effect: "cubic-bezier(0.66, 0.29, 0.31, 0.95)",
    bgEffect: "cubic-bezier(0.66, 0.29, 0.31, 0.95)",
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
    const rand = UI.uniqueId();
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
      loading: document.querySelector(`${loading}`),
    });
  }

  #preloadImages() {
    let loaded = 0;
    const total = this.slide.total * 2;
    const images = this.elements.sliderWrapper.querySelectorAll("img");
    for (let img of images) {
      const i = new Image();
      UI.addEvent(i, "load", () => {
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
    UI.forEach(slider.children, (el) =>
      UI.addStyles(el, { width: `${screenWidth}px`, paddingTop: `100px` })
    );
    UI.forEach(bg.children, (el) => UI.addStyles(el, { width: `${totalWidth}px` }));
    const offsetNavBy = screenWidth / 3;
    const { prev, next } = this.elements;
    UI.addStyles(prev, { left: `${offsetNavBy}px` });
    UI.addStyles(next, { left: `${offsetNavBy * 2}px` });
  }

  #selectThumbnail(/** @type {HTMLElement} */ element) {
    UI.forEach(UI.siblings(element), (e) => e.classList.remove("selected"));
    element.classList.add("selected");
  }

  #slideChanged() {
    const { speed, effect, bgEffect } = this.opts;
    const { slider, bg } = this.elements;

    const offset = -window.innerWidth * this.slide.current;
    if (!slider.style.left) UI.addStyles(slider, { left: "0px" });
    UI.animate(slider, [{ left: `${offset}px` }], speed, effect);

    const bgLen = bg.children.length;
    UI.forEach(bg.children, (e, i) => {
      const to = offset / Math.pow(2, bgLen - i);
      if (!e.style.left) UI.addStyles(e, { left: "0px" });
      UI.animate(e, [{ left: `${to}px` }], speed, bgEffect);
    });
  }

  #addEvents() {
    const { prev, next, thumbnails } = this.elements;
    const { circular, autoplay, addKeyboardEvents } = this.opts;

    const onSlideChange = (/** @type {boolean}*/ increment) => {
      if (increment) {
        if (++this.slide.current >= this.slide.total) {
          if (circular) this.slide.current = 0;
          else {
            --this.slide.current;
            return;
          }
        }
      } else {
        if (--this.slide.current < 0) {
          if (circular) this.slide.current = this.slide.total - 1;
          else {
            ++this.slide.current;
            return;
          }
        }
      }
      this.#selectThumbnail(UI.nthChild(thumbnails.children, this.slide.current));
      this.#slideChanged();
    };

    if (addKeyboardEvents) {
      UI.addEvent(window, "keyup", (e) => {
        switch (e.key) {
          case "ArrowRight":
            onSlideChange(true);
            break;
          case "ArrowLeft":
            onSlideChange(false);
            break;
          default:
            break;
        }
      });
    }

    UI.addEvent(window, "resize", () => {
      this.#setWidths();
      this.#slideChanged();
    });
    UI.addEvent(next, "click", () => onSlideChange(true));
    UI.addEvent(prev, "click", () => onSlideChange(false));
    UI.forEach(thumbnails.children, (e, i) => {
      UI.addEvent(e, "click", () => {
        this.#selectThumbnail(e);
        if (autoplay) clearInterval(this.slideshow);
        this.slide.current = i;
        this.#slideChanged();
      });
    });
    if (autoplay !== 0) {
      this.opts.circular = true;
      this.slideshow = setInterval(() => UI.triggerEvent(next, "click"), autoplay);
    }
  }

  #setup() {
    const { loading, sliderWrapper, thumbnails } = this.elements;
    const { imageWidth, fitWithinScreen, thumbRotation } = this.opts;

    this.#setWidths();
    UI.addStyles(thumbnails, { width: imageWidth });

    let currentOffset = 0;
    if (fitWithinScreen) {
      const totalOffset = UI.reduce(
        thumbnails.children,
        (total, curr) => total + curr.offsetWidth,
        0
      );
      const totalSlides = thumbnails.children.length;
      let offsetPerSlide = (totalOffset - window.innerWidth) / totalSlides;
      // accounting for skipping the offset for the first item.
      offsetPerSlide += offsetPerSlide / totalSlides;
      this.opts.overlapInPixels = offsetPerSlide;
    }
    const { overlapInPixels } = this.opts;
    UI.forEach(thumbnails.children, (tn, i) => {
      if (overlapInPixels && i > 0) currentOffset -= overlapInPixels;
      UI.addStyles(tn, { left: `${currentOffset}px` });
      currentOffset += tn.offsetWidth;

      UI.addEvent(tn, "mouseenter", () => UI.animate(tn, [{ top: "0px" }, { top: "-10px" }], 100));
      UI.addEvent(tn, "mouseleave", () => UI.animate(tn, [{ top: "-10px" }, { top: "0px" }], 100));

      if (thumbRotation) {
        const angle = Math.floor(Math.random() * 41) - 20;
        const style = `rotate(${angle}deg)`;
        UI.addStyles(tn, {
          "-moz-transform": style,
          "-webkit-transform": style,
          transform: style,
        });
      }
    });

    this.#selectThumbnail(UI.nthChild(thumbnails.children, 0));
    this.#addEvents();

    UI.hide(loading);
    UI.show(sliderWrapper);
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
  for (let i = 1; i < 22; i++) settings.slides.main.push(`assets/images/gallery/${i}.jpg`);
  new ParallaxSlider(settings);
  //#endregion END OF TIMED CODE

  const after = performance.now();
  // console.log(after - now);
}

document.addEventListener("DOMContentLoaded", onReady);
