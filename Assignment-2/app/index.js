import Animation from "textify.js";

import Scroll from "./components/Scroll";
import InfiniteSlider from "./components/Slider";
import TestSlider from "./components/TestSlider";

const { Textify, TextifyTitle } = Animation;

class App {
  constructor() {
    this.texts = null;

    this.scroll = null;

    this.createScroll();
    this.createTextAnimations();
    this.createSlider();
    this.createTestimonialsSlider();
  }

  createScroll() {
    this.scroll = new Scroll();
  }

  createTextAnimations() {
    this.texts = new Textify();
    this.titles = new TextifyTitle();
  }

  createSlider() {
    this.slider = new InfiniteSlider({
      slider: document.querySelector(".slider"),
      slides: document.querySelectorAll(".slide"),
      direction: "horizontal",
      gap: 0
    });
  }

  createTestimonialsSlider() {
    this.testSlider = new TestSlider({
      slider: document.querySelector(".test-slider"),
      slides: document.querySelectorAll(".test-slide"),
      direction: "horizontal",
      gap: 20
    });
  }
}

new App();
