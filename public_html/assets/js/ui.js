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

class ParallaxSlide {
  constructor({ slideSrc, thumbnailSrc } = {}) {
    this.slideSrc = slideSrc;
    this.thumbnailSrc = thumbnailSrc ?? slideSrc;
  }
}

const DOMElementRefs = {
  container: ".pxs_container",
  slider: ".pxs_slider",
  sliderWrapper: ".pxs_slider_wrapper",
  thumbnails: ".pxs_thumbnails",
  prev: ".pxs_prev",
  next: ".pxs_next",
  bg: ".pxs_bg",
  loading: ".pxs_loading",
  pause: ".pxs_pause",
  play: ".pxs_play",
};

class ParallaxBuilder {
  static #defaults = {
    bgLayers: 3,
    DOMElementRefs,
    onComplete: () => null,
    slides: [],
    slideHeight: 550,
    thumbnailHeight: 110,
  };

  constructor(options = {}) {
    this.opts = Object.assign({}, ParallaxBuilder.#defaults, options);
    this.#loadingScreen();
    this.#loadImages();
  }

  #loadingScreen() {
    const loadingDiv = document.createElement("div");
    loadingDiv.className = UI.getFromDOMQuery(this.opts.DOMElementRefs.loading);
    loadingDiv.innerHTML = "Loading images...";
    document.body.prepend(loadingDiv);
  }

  #getLoadingImage(src, cb) {
    const image = new Image();
    UI.addEvent(image, "load", cb);
    image.src = src;
    return image;
  }

  #loadImages() {
    const slides = this.opts.slides;
    this.thumbnails = [];
    this.mainImages = [];

    let loaded = 0;
    let total = slides.length * 2;
    const cb = () => {
      if (++loaded === total) this.#buildHTML();
    };

    for (let i = 0; i < slides.length; i++) {
      this.mainImages.push(this.#getLoadingImage(slides[i].slideSrc, cb));
      this.thumbnails.push(this.#getLoadingImage(slides[i].thumbnailSrc, cb));
    }
  }

  #buildImage = (src, height) => `<li><img style='height: ${height}px;' src=${src} /></li>`;

  #buildHTML() {
    const { DOMElementRefs, bgLayers, onComplete, slideHeight, thumbnailHeight } = this.opts;
    const { container, slider, sliderWrapper, thumbnails, prev, next, bg, pause, play } =
      DOMElementRefs;

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
          ${this.mainImages.map((v) => this.#buildImage(v.src, slideHeight)).join("")}
        </ul>
        <ul class="${UI.getFromDOMQuery(thumbnails)}">
          ${this.thumbnails.map((v) => this.#buildImage(v.src, thumbnailHeight)).join("")}
        </ul>
        <button class="${UI.getFromDOMQuery(next)}"></button>
        <button class="${UI.getFromDOMQuery(prev)}"></button>
        <button class="${UI.getFromDOMQuery(pause)}" style='display:none;' ></button>
        <button class="${UI.getFromDOMQuery(play)}"></button>
      </div>
    `;

    const containerDiv = document.createElement("div");
    containerDiv.className = UI.getFromDOMQuery(container);
    containerDiv.innerHTML = this.html;
    document.body.prepend(containerDiv);
    onComplete();
  }
}

class ParallaxGallery {
  static #defaults = {
    addKeyboardEvents: true,
    autoplay: false,
    autoplayIntervalSec: 2,
    buildSlides: true,
    centerThumbnails: true,
    circular: true,
    DOMElementRefs,
    effects: {
      bg: "cubic-bezier(0.66, 0.29, 0.31, 0.95)",
      slide: "cubic-bezier(0.66, 0.29, 0.31, 0.95)",
    },
    fitWithinScreen: true,
    overlapInPixels: 0,
    speed: 1000, // ms
    thumbRotation: false,
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
    const { container, slider, sliderWrapper, thumbnails, prev, next, bg, loading, play, pause } =
      this.opts.DOMElementRefs;

    this.elements = Object.assign(this.elements, {
      slider: document.querySelector(`${container} ${slider}`),
      sliderWrapper: document.querySelector(`${container} ${sliderWrapper}`),
      thumbnails: document.querySelector(`${container} ${thumbnails}`),
      prev: document.querySelector(`${container} ${prev}`),
      next: document.querySelector(`${container} ${next}`),
      bg: document.querySelector(`${container} ${bg}`),
      loading: document.querySelector(`${loading}`),
      play: document.querySelector(`${container} ${play}`),
      pause: document.querySelector(`${container} ${pause}`),
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

  constructor(options = {}, builderOptions = {}) {
    this.opts = Object.assign({}, ParallaxGallery.#defaults, options);
    const setup = () => {
      this.#getContainer();
      this.#getElements();
      this.slide = { current: 0, total: this.elements.slider.children.length };
      this.#preloadImages();
    };
    if (this.opts.buildSlides) new ParallaxBuilder({ ...builderOptions, onComplete: setup });
    else setup();
  }

  #setWidths() {
    const { slider, bg } = this.elements;
    const screenWidth = window.innerWidth;
    const totalWidth = screenWidth * this.slide.total;
    slider.style.width = `${totalWidth}px`;
    UI.forEach(slider.children, (el) =>
      UI.addStyles(el, { width: `${screenWidth}px`, paddingTop: `120px` })
    );
    UI.forEach(bg.children, (el) => UI.addStyles(el, { width: `${totalWidth}px` }));
    const offsetNavBy = screenWidth / 6;
    const { prev, next } = this.elements;
    UI.addStyles(prev, { left: `${offsetNavBy}px` });
    UI.addStyles(next, { left: `${offsetNavBy * 5}px` });
  }

  #setupThumbnails() {
    const { thumbnails } = this.elements;
    const { overlapInPixels, thumbRotation, centerThumbnails, fitWithinScreen } = this.opts;

    const screenWidth = window.innerWidth;
    const totalOffset = UI.reduce(
      thumbnails.children,
      (total, curr) => total + curr.offsetWidth - overlapInPixels,
      0
    );
    const thumbnailsAreWiderThanScreen = totalOffset > screenWidth;

    let internalOverlapInPixels = 0;
    if (fitWithinScreen) {
      if (thumbnailsAreWiderThanScreen) {
        const totalSlides = thumbnails.children.length;
        let offsetPerSlide = (totalOffset - screenWidth) / totalSlides;
        // accounting for skipping the offset for the first item.
        offsetPerSlide += offsetPerSlide / totalSlides;
        internalOverlapInPixels = offsetPerSlide;
      } else internalOverlapInPixels = 0;
    }

    let currentOffset = 0;
    if (centerThumbnails && !thumbnailsAreWiderThanScreen) {
      const remainingSpace = screenWidth - totalOffset;
      currentOffset = remainingSpace / 2;
    }

    UI.forEach(thumbnails.children, (tn, i) => {
      const overlap = overlapInPixels + internalOverlapInPixels;
      if (overlap && i > 0) currentOffset -= overlap;
      UI.addStyles(tn, { left: `${currentOffset}px` });
      currentOffset += tn.offsetWidth;

      if (thumbRotation) {
        const style = `rotate(${Math.floor(Math.random() * 41) - 20}deg)`;
        UI.addStyles(tn, {
          "-moz-transform": style,
          "-webkit-transform": style,
          transform: style,
        });
      }
    });
  }

  #selectThumbnail(/** @type {HTMLElement} */ element) {
    UI.forEach(UI.siblings(element), (e) => e.classList.remove("selected"));
    element.classList.add("selected");
  }

  #slideChanged() {
    const { speed, effects } = this.opts;
    const { slider, bg } = this.elements;

    const offset = -window.innerWidth * this.slide.current;
    if (!slider.style.left) UI.addStyles(slider, { left: "0px" });
    UI.animate(slider, [{ left: `${offset}px` }], speed, effects.slide);

    const bgLen = bg.children.length;
    UI.forEach(bg.children, (e, i) => {
      const to = offset / Math.pow(2, bgLen - i);
      if (!e.style.left) UI.addStyles(e, { left: "0px" });
      UI.animate(e, [{ left: `${to}px` }], speed, effects.bg);
    });
  }

  #toggleAutoplay() {
    const { next, play, pause } = this.elements;
    const { autoplay, autoplayIntervalSec } = this.opts;

    if (autoplay) {
      this.opts.circular = true;
      this.slideshow = setInterval(
        () => UI.triggerEvent(next, "click"),
        autoplayIntervalSec * 1000
      );
      UI.hide(play);
      UI.show(pause);
    } else {
      clearInterval(this.slideshow);
      UI.show(play);
      UI.hide(pause);
    }
  }

  #addEvents() {
    const { prev, next, thumbnails, play, pause } = this.elements;
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

    const onAutoplayToggle = (/** @type {boolean}*/ on) => {
      this.opts.autoplay = on;
      this.#toggleAutoplay();
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
      this.#setupThumbnails();
      this.#slideChanged();
    });
    UI.addEvent(next, "click", () => onSlideChange(true));
    UI.addEvent(prev, "click", () => onSlideChange(false));
    UI.forEach(thumbnails.children, (tn, i) => {
      UI.addEvent(tn, "click", () => {
        this.#selectThumbnail(tn);
        if (autoplay) clearInterval(this.slideshow);
        this.slide.current = i;
        this.#slideChanged();
      });
      UI.addEvent(tn, "mouseenter", () => UI.animate(tn, [{ top: "0px" }, { top: "-10px" }], 100));
      UI.addEvent(tn, "mouseleave", () => UI.animate(tn, [{ top: "-10px" }, { top: "0px" }], 100));
    });
    UI.addEvent(play, "click", () => onAutoplayToggle(true));
    UI.addEvent(pause, "click", () => onAutoplayToggle(false));
  }

  #setup() {
    const { loading, sliderWrapper, thumbnails } = this.elements;

    this.#setWidths();
    this.#setupThumbnails();

    this.#selectThumbnail(UI.nthChild(thumbnails.children, 0));
    this.#toggleAutoplay();
    this.#addEvents();

    UI.hide(loading);
    UI.show(sliderWrapper);
  }
}

class Modal {
  static #defaults = {};

  constructor(options = {}) {
    this.opts = Object.assign({}, Modal.#defaults, options);
    this.#build();
  }

  #build() {
    this.html = `
      <div class="container">
        <button data-modal="modal-one">Open Modal</button>
      </div>

      <div class="modal" id="modal-one">
        <div class="modal-bg modal-exit"></div>
        <div class="modal-container">
          <h1>Test Content</h1>
          <button class="modal-close modal-exit">X</button>
        </div>
      </div>
    `;
  }

  addEvents() {
    const openModalButtons = document.querySelectorAll("[data-modal]");
    openModalButtons.forEach((btn) => {
      UI.addEvent(btn, "click", (e) => {
        e.preventDefault();

        const modal = document.getElementById(btn.getAttribute("data-modal"));
        modal.classList.add("open");

        const closeModalButtons = modal.querySelectorAll(".modal-exit");
        closeModalButtons.forEach((btn) => {
          UI.addEvent(btn, "click", (e) => {
            e.preventDefault();
            modal.classList.remove("open");
          });
        });
      });
    });
  }
}
