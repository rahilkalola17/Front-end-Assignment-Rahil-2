import Slider from "./components/Slider";
import CircleType from "circletype";
import Scroll from "./components/Scroll";

import Animation from "textify.js";

const { Textify, TextifyTitle } = Animation;

class App {
  constructor() {
    this.scroll = null;
    this.slider = null;

    this.createSmoothScroll();
    this.createTextAnimations();
    this.createSlider();
    this.createCircleType();
  }

  createTextAnimations() {
    this.text = new Textify();
    this.title = new TextifyTitle();
  }

  createSmoothScroll() {
    this.scroll = new Scroll();
  }

  createSlider() {
    this.slider = new Slider({
      slider: document.querySelector(".slider"),
      slides: document.querySelectorAll(".slide"),
      direction: "horizontal",
      gap: 0,
      reverse: false,
      autoplay: true,
      autoplaySpeed: 1
    });
  }

  createCircleType() {
    this.title = new CircleType(document.querySelector(".circle-text"));
  }
}

new App();
