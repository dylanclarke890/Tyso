class UI {
  static #chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  static uniqueId = () =>
    Array.from({ length: 10 }, () => this.#chars[Math.floor(Math.random() * 52)]).join("");

  static getHTML = (/** @type {HTMLElement} */ element) => {
    if (!element || !(element instanceof HTMLElement)) return "";
    const container = document.createElement("div");
    container.append(element);
    return container.innerHTML;
  };

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

  static fade = (/** @type {HTMLElement} */ element, type, durationInMs) => {
    const isIn = type === "in",
      interval = 50,
      gap = interval / durationInMs;
    let opacity = isIn ? 0 : 1;

    if (isIn) {
      element.style.display = "inline";
      element.style.opacity = opacity;
    }

    const fading = setInterval(() => {
      opacity = isIn ? opacity + gap : opacity - gap;
      element.style.opacity = opacity;

      if (opacity <= 0) UI.hide(element);
      if (opacity <= 0 || opacity >= 1) clearInterval(fading);
    }, interval);
  };

  static fadeOut = (/** @type {HTMLElement} */ element, durationInMs = 500) =>
    UI.fade(element, "out", durationInMs);

  static fadeIn = (/** @type {HTMLElement} */ element, durationInMs = 500) =>
    UI.fade(element, "in", durationInMs);

  static addStyles = (/** @type {HTMLElement} */ element, styles) =>
    Object.keys(styles).forEach((s) => (element.style[s] = styles[s]));

  static removeStyles = (/** @type {HTMLElement} */ element, styles) =>
    styles.forEach((s) => element.style.removeProperty(s));

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

  static removeFromDOM = (/** @type {HTMLElement} */ element) => {
    if (!element) return;
    element.parentElement.removeChild(element);
  };

  static fullscreen = (/** @type {HTMLElement} */ element, open = true) => {
    if (open) {
      if (element.requestFullscreen) element.requestFullscreen();
      else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
      else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
      else if (element.msRequestFullscreen) element.msRequestFullscreen();
      else return false;
    } else {
      if (element.exitFullscreen) element.exitFullscreen();
      else if (element.mozExitFullScreen) element.moxExitFullScreen();
      else if (element.webkitExitFullscreen) element.webkitExitFullscreen();
      else if (element.msExitFullscreen) element.msExitFullscreen();
      else return false;
    }
    return true;
  };

  static scrollPercent = () =>
    (document.body.scrollTop + document.documentElement.scrollTop) /
    (document.documentElement.scrollHeight - document.documentElement.clientHeight);

  static scrollTo = (y, behavior = "smooth") => window.scroll({ top: y, behavior });

  static onPageReady = (cb) => UI.addEvent(document, "DOMContentLoaded", cb);

  static repaintDOM = () => document.body.getBoundingClientRect();

  static makeFormAJAX = (/** @type {HTMLFormElement} */ form, cb, parse = true) => {
    UI.addEvent(form, "submit", function (e) {
      e.preventDefault();
      const d = this;
      fetch(d.getAttribute("action"), {
        method: d.getAttribute("method"),
        body: new FormData(d),
      })
        .then((res) => res.text())
        .then((data) => {
          if (parse) {
            try {
              data = JSON.parse(data);
            } catch {
              cb(data);
            }
          }
          cb(data);
        });
    });
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
  static #defaults = {
    container: document.body,
    id: "modal1",
    closeButton: false,
    dismissOnExternalClick: true,
    openOnCreation: false,
    onOpen: () => null,
    onClose: () => null,
  };

  constructor(options = {}) {
    this.opts = Object.assign({}, Modal.#defaults, options);
    this.#build();
    this.#append();
    this.#getElements();
    this.#addEvents();
    if (this.opts.openOnCreation) this.open();
  }

  #build() {
    const { id, closeButton, dismissOnExternalClick } = this.opts;
    const content = document.querySelector(`[data-modal=${id}]`);
    if (content) UI.removeFromDOM(content);

    this.html = `
      <div class="modal-bg ${dismissOnExternalClick ? "modal-exit" : ""}"></div>
      <div class="modal-container">
        ${UI.getHTML(content)}
        ${closeButton ? `<button class="modal-close modal-exit">X</button>` : ""}
      </div>
    `;
  }

  #append() {
    let { container, id } = this.opts;
    if (!container || !(container instanceof HTMLElement)) container = document.body;

    const modal = document.createElement("div");
    modal.className = "modal";
    modal.id = id;
    modal.innerHTML = this.html;

    container.prepend(modal);
  }

  #getElements() {
    const { id } = this.opts;

    const modal = document.getElementById(id);
    this.elements = {
      modal,
      openModalButtons: document.querySelectorAll(`[data-modal-open=${id}]`),
      closeModalButtons: modal.querySelectorAll(".modal-exit"),
    };
  }

  #addEvents() {
    const { openModalButtons, closeModalButtons } = this.elements;

    openModalButtons.forEach((btn) => {
      UI.addEvent(btn, "click", (e) => {
        e.preventDefault();
        this.open();
      });
    });

    closeModalButtons.forEach((btn) => {
      UI.addEvent(btn, "click", (e) => {
        e.preventDefault();
        this.close();
      });
    });

    // TO CHECK
    // UI.addEvent(document, "keyup", (e) => {
    //   if (e.code === "ESC") this.close();
    // })
  }

  open() {
    const { onOpen } = this.opts;
    const { modal } = this.elements;
    modal.classList.add("open");
    onOpen();
  }

  close() {
    const { onClose } = this.opts;
    const { modal } = this.elements;
    modal.classList.remove("open");
    onClose();
  }
}

class AddThisHelper {
  static initGlobals() {
    globalThis.addthis_share = globalThis.addthis_share || {
      passthrough: {
        twitter: {
          via: "anthonykamanos #tysoyoga",
          text: "This is what ppl r saying about thier TYSO journey",
        },
      },
    };
  }
}

class Message {
  constructor({ message, type, autoShow = true, duration = 3000, removeOnHide = true } = {}) {
    this.message = message;
    this.type = type;
    this.autoShow = autoShow;
    this.duration = duration;
    this.removeOnHide = removeOnHide;
    this.#construct();
    if (this.autoShow) {
      UI.repaintDOM();
      this.show();
    }
  }

  #construct() {
    const infoMsg = document.createElement("div");
    infoMsg.id = UI.uniqueId();
    infoMsg.className = `message ${this.type} hidden center-content`;
    infoMsg.innerText = this.message;
    this.msg = infoMsg;
    document.body.append(infoMsg);
  }

  show() {
    if (!this.msg) {
      this.#construct();
      UI.repaintDOM();
    }
    this.msg.classList.remove("hidden");
    if (this.duration > 0) setTimeout(() => this.hide(), this.duration);
  }

  hide() {
    this.msg.classList.add("hidden");
    if (this.removeOnHide)
      setTimeout(() => {
        document.body.removeChild(this.msg);
        this.msg = null;
      }, 300);
  }

  static success(message = "Success!", opts = {}) {
    return new Message({ message, type: "success", ...opts });
  }

  static error(message = "Error, please try again.", opts = {}) {
    return new Message({ message, type: "error", duration: 6000, ...opts });
  }

  static warning(message = "Warning", opts = {}) {
    return new Message({ message, type: "warning", ...opts });
  }

  static info(message = "Info", opts = {}) {
    return new Message({ message, type: "info", ...opts });
  }
}
