'use strict';

let tapJS = {};
  tapJS.tapEvent = new Event('tap');
  tapJS.safeRange = 0.1;
  tapJS.isTouchDevice = false;
  tapJS.resetIsTouchDevice = function(){
    window.ontouchstart === null ? tapJS.isTouchDevice = true : tapJS.isTouchDevice = false;
  }
  tapJS.touchstartHandler = function(e){
    this.touchstartCoordinate = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    }
    this.tapJS_touchFlag = true;
  }
  tapJS.touchmoveHandler = function(e){
    let difference = Math.sqrt(Math.abs(this.touchstartCoordinate.x - e.changedTouches[0].clientX)**2 +
                                    Math.abs(this.touchstartCoordinate.y - e.changedTouches[0].clientY)**2);
    if(difference > window.innerHeight * tapJS.safeRange) this.tapJS_touchFlag = false;
  }
  tapJS.touchendHandler = function(e){
    if(this.tapJS_touchFlag == true){
      this.dispatchEvent(tapJS.tapEvent);
      this.tapJS_touchFlag = false;
    }
  }
  tapJS.clickHandler = function(e){
    if(tapJS.isTouchDevice == false) this.dispatchEvent(tapJS.tapEvent);

  }
EventTarget.prototype.tap = function(f){
  this.removeTapEventListener();
  this.addEventListener('touchstart', tapJS.touchstartHandler);
  this.addEventListener('touchmove', tapJS.touchmoveHandler);
  this.addEventListener('touchend', tapJS.touchendHandler);
  this.addEventListener('click', tapJS.clickHandler);
  if(typeof f !== 'undefined' && typeof f == 'function') this.addEventListener('tap', f);
}
EventTarget.prototype.removeTapEventListener = function(){
  this.removeEventListener('touchstart', tapJS.touchstartHandler);
  this.removeEventListener('touchmove', tapJS.touchmoveHandler);
  this.removeEventListener('touchend', tapJS.touchendHandler);
  this.removeEventListener('click', tapJS.clickHandler);
}
tapJS.resetIsTouchDevice();

export default tapJS;
