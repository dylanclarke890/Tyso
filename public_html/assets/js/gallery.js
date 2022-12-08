function onReady() {
  const parallaxSettings = {
    buildSlides: true,
  };

  const builderSettings = {
    slides: [],
  };

  // for (let i = 1; i <= 10; i++)
  //   builderSettings.slides.push(new ParallaxSlide({ slideSrc: `assets/images/gallery/winter/${i}.jpg` }));
  for (let i = 1; i < 22; i++)
    builderSettings.slides.push(new ParallaxSlide({ slideSrc: `assets/images/gallery/${i}.jpg` }));

  // builderSettings.slides.push(
  //   ...[
  //     new ParallaxSlide({ slideSrc: `url-to-rss-here` }),
  //     new ParallaxSlide({ slideSrc: `another-url-to-rss-here` }),
  //   ]
  // );

  new ParallaxGallery(parallaxSettings, builderSettings);
}

document.addEventListener("DOMContentLoaded", onReady);
