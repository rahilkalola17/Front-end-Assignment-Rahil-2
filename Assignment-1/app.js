// class Parallax {
//   constructor({ element }) {
//     this.element = element;
//     this.speed = 1.5;
//     this.scale = 1.2;
//     this.parallax = null;

//     this.init();
//   }

//   init() {
//     this.parallax = new Ukiyo(this.element, {
//       scale: this.speed, // 1~2 is recommended
//       speed: this.scale, // 1~2 is recommended
//       willChange: true, // This may not be valid in all cases
//       wrapperClass: "parallax-wrapper", // This is the class name of the wrapper
//       externalRAF: false
//     });
//   }

//   destroy() {
//     this.parallax.destroy();
//   }
// }

class Scroll {
  constructor() {
    this.scroll = null;
    this.config = {
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false
    };

    this.init();
    window.requestAnimationFrame(this.raf.bind(this));
  }

  init() {
    this.scroll = new Lenis(this.config);
  }

  raf(time) {
    this.scroll.raf(time);
    requestAnimationFrame(this.raf.bind(this));
  }
}

class Slider {
  // constructor
  constructor({
    slider,
    slides,
    direction = "horizontal",
    gap = 0,
    reverse = false,
    autoplay = false,
    autoplaySpeed = 1,
    dom = true
  }) {
    // slider element
    this.slider = slider;
    // slides element
    this.slides = [...slides];
    // direction
    this.direction = direction;
    // gap
    this.gap = gap;
    // reverse
    this.reverse = reverse;
    // autoplay
    this.autoplay = autoplay;
    // autoplay speed
    this.autoplaySpeed = autoplaySpeed;
    this.speed = this.autoplaySpeed;
    // dom
    this.dom = dom; // if dom is true, all events will be added to slider element, if false, all events will be added to window

    // get bounds of slider
    this.sliderBounds =
      this.direction === "horizontal"
        ? this.slider.clientWidth
        : this.slider.clientHeight;

    // get bounds of slides (first slide only because all slides are the same size in this case - if not, slider not working)
    this.slideBounds =
      this.direction === "horizontal"
        ? this.slides[0].clientWidth + this.gap
        : this.slides[0].clientHeight + this.gap;

    // set slider size
    this.sliderSize = this.slideBounds * this.slides.length;

    // scroll object
    this.scroll = {
      ease: 0.05, // smoothness of scroll (0.05 - 0.1 recommended)
      current: 0, // current scroll position
      target: 0, // target scroll position
      last: 0, // last scroll position
      position: 0, // scroll position
      limit: this.sliderSize - this.slideBounds // scroll limit
    };

    // set touch object
    this.touch = {
      start: 0, // touch start position
      current: 0 // touch current position
    };

    // set dragging to false
    this.isDragging = false;

    // start slider
    this.setScroll();
    this.addEvents();
  }

  //   lerp formula
  lerp(start, end, t) {
    return start * (1 - t) + end * t;
  }

  //   create slider
  createSlides(scroll) {
    // set slider's all slides positions using gsap
    gsap.set(this.slides, {
      //   for horizontal slider
      x: (i) => {
        if (this.direction === "vertical") return 0;
        return i * this.slideBounds + scroll;
      },
      //   for vertical slider
      y: (i) => {
        if (this.direction === "horizontal") return;
        return i * this.slideBounds + scroll;
      },
      //   for infinite slider
      modifiers: {
        //  for horizontal slider
        x: (x) => {
          if (this.direction === "vertical") return 0;
          const s = gsap.utils.wrap(
            -this.slideBounds, // -this.sliderSize + this.slideBounds,
            this.sliderSize - this.slideBounds, // this.slideBounds,
            parseInt(x) // parseInt(x) - this.slideBounds
          );
          return `${s}px`; // return `${s + this.slideBounds}px`;
        },

        // for vertical slider
        y: (y) => {
          if (this.direction === "horizontal") return 0;
          const s = gsap.utils.wrap(
            -this.slideBounds, // -this.sliderSize + this.slideBounds,
            this.sliderSize - this.slideBounds, // this.slideBounds,
            parseInt(y) // parseInt(y) - this.slideBounds
          );
          return `${s}px`; // return `${s + this.slideBounds}px`;
        }
      }
    });
  }

  //   resize slider
  resize() {
    // get bounds of slider
    this.sliderBounds =
      this.direction === "horizontal"
        ? this.slider.clientWidth
        : this.slider.clientHeight;

    // get bounds of slides (first slide only because all slides are the same size in this case - if not, slider not working)
    this.slideBounds =
      this.direction === "horizontal"
        ? this.slides[0].clientWidth + this.gap
        : this.slides[0].clientHeight + this.gap;

    // set slider size
    this.sliderSize = this.slideBounds * this.slides.length;
  }

  //   events
  //   mouse wheel event
  mouseWheel(e) {
    //   set scroll target
    this.scroll.target += e.deltaY;
  }

  //   touch events
  //  touch start event
  handleTouchStart(event) {
    this.isDragging = true; // set dragging to true
    this.slider.classList.add("is-dragging"); // add dragging class
    this.scroll.position = this.scroll.current; // set scroll position
    if (this.direction === "horizontal") {
      this.touch.start = event.touches
        ? event.touches[0].clientX
        : event.clientX; // set touch start position
    }
    if (this.direction === "vertical") {
      this.touch.start = event.touches
        ? event.touches[0].clientY
        : event.clientY; // set touch start position
    }
  }

  //   touch move event
  handleTouchMove(event) {
    if (!this.isDragging) return; // if not dragging, return (stop function)
    let position;
    if (this.direction === "horizontal") {
      position = event.touches ? event.touches[0].clientX : event.clientX; // get touch current position
    }
    if (this.direction === "vertical") {
      position = event.touches ? event.touches[0].clientY : event.clientY; // get touch current position
    }
    const distance = (this.touch.start - position) * 3; // get distance
    this.scroll.target = this.scroll.position + distance; // set scroll target
  }

  //   touch end event
  handleTouchEnd() {
    this.isDragging = false; // set dragging to false
    this.slider.classList.remove("is-dragging"); // remove dragging class
  }

  //   add events
  addEvents() {
    if (this.dom) {
      //   mouse wheel event
      this.slider.addEventListener("wheel", this.mouseWheel.bind(this), {
        passive: true
      });

      //   touch events
      this.slider.addEventListener(
        "touchstart",
        this.handleTouchStart.bind(this),
        {
          passive: true
        }
      );
      this.slider.addEventListener(
        "touchmove",
        this.handleTouchMove.bind(this),
        {
          passive: true
        }
      );
      this.slider.addEventListener("touchend", this.handleTouchEnd.bind(this), {
        passive: true
      });

      //   mouse events
      this.slider.addEventListener(
        "mousedown",
        this.handleTouchStart.bind(this),
        {
          passive: true
        }
      );
      this.slider.addEventListener(
        "mousemove",
        this.handleTouchMove.bind(this),
        {
          passive: true
        }
      );
      this.slider.addEventListener("mouseup", this.handleTouchEnd.bind(this), {
        passive: true
      });

      // select event
      this.slider.addEventListener("selectstart", () => {
        return false;
      });
    } else {
      //   mouse wheel event
      window.addEventListener("wheel", this.mouseWheel.bind(this), {
        passive: true
      });

      //   touch events
      window.addEventListener("touchstart", this.handleTouchStart.bind(this), {
        passive: true
      });
      window.addEventListener("touchmove", this.handleTouchMove.bind(this), {
        passive: true
      });
      window.addEventListener("touchend", this.handleTouchEnd.bind(this), {
        passive: true
      });

      //   mouse events
      window.addEventListener("mousedown", this.handleTouchStart.bind(this), {
        passive: true
      });
      window.addEventListener("mousemove", this.handleTouchMove.bind(this), {
        passive: true
      });
      window.addEventListener("mouseup", this.handleTouchEnd.bind(this), {
        passive: true
      });
    }
    //   resize event
    window.addEventListener("resize", this.resize.bind(this));
  }

  //   set scroll
  setScroll() {
    // set autoplay
    if (this.autoplay) {
      this.scroll.target += this.speed;
    }
    // set scroll current
    this.scroll.current = this.lerp(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease
    );

    // set scroll of slider
    this.createSlides(
      this.reverse ? this.scroll.current : -this.scroll.current
    );

    // set scroll speed
    this.scroll.speed = this.scroll.current - this.scroll.last;
    // set scroll last
    this.scroll.last = this.scroll.current;

    // set autoplay direction
    if (this.scroll.speed > 0) {
      this.speed = this.autoplaySpeed;
    } else {
      this.speed = -this.autoplaySpeed;
    }

    // get current slide index
    this.currentSlide =
      Math.round(Math.abs(this.scroll.current) / this.slideBounds) %
      this.slides.length;

    // request animation frame
    requestAnimationFrame(this.setScroll.bind(this));
  }
}

// class Text {
//   constructor() {
//     this.textsAnimation = null;
//     this.titlesAnimation = null;

//     this.init();
//   }

//   init() {
//     this.textsAnimation = new Textify();
//     this.titlesAnimation = new TextifyTitle({
//       threshold: 0.5
//     });
//   }

//   show() {
//     this.textsAnimation.show();
//     this.titlesAnimation.show();
//   }

//   hide() {
//     this.textsAnimation.hide();
//     this.titlesAnimation.hide();
//   }
// }

class App {
  constructor() {
    this.navigation = document.querySelector(".navigation");
    this.parallax = document.querySelectorAll(".parallax");
  }

  init() {
    this.createSmoothScroll();
    this.createStickyNavigation();
    this.createText();
    this.createParallax();
    this.createSliders();
  }

  createSmoothScroll() {
    this.scroll = new Scroll();
  }

  createText() {
    this.text = new Text();
  }

  createStickyNavigation() {
    this.scroll.scroll.on("scroll", ({ direction }) => {
      if (direction === 1) {
        this.navigation.classList.add("sticky");
      } else {
        this.navigation.classList.remove("sticky");
      }
    });
  }

  createParallax() {
    this.parallax.forEach((parallax) => {
      new Parallax({
        element: parallax
      });
    });
  }

  createSliders() {
    this.slider = new Slider({
      slider: document.querySelector(".slider"),
      slides: document.querySelectorAll(".slide"),
      direction: "horizontal",
      gap: 50,
      reverse: false,
      autoplay: false,
      autoplaySpeed: 1,
      dom: false
    });
    this.sliderSmall = new Slider({
      slider: document.querySelector(".slider-small"),
      slides: document.querySelectorAll(".slide-small"),
      direction: "horizontal",
      gap: 50,
      reverse: true,
      autoplay: true,
      autoplaySpeed: 1,
      dom: false
    });
  }
}

const app = new App();

app.init();

// Hamburger Menu

function openNav() {
    document.getElementById("myNav").style.width = "100%";
}

function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}
