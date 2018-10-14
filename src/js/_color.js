'use strict';

let colorJS = {};

colorJS.cssAngleClass = class {
  toDegree(n){
    if(typeof n == 'undefined') return 0;
    if(typeof n == 'number'){
      return n;
    }
    if(typeof n == 'string'){
      if(n.match(/deg/) || isNaN(n) === false){ // 角度が度数法で指定されていたら。もし引数にdegが含まれているか、数字のみで構成されていたら
        return Number(n.replace(/deg/, '')); // 数字をそのまま
      }
      if(n.match(/grad/)){
        return Number(n.replace(/grad/, '')) * (90 / 100);
      }
      if(n.match(/rad/)){
        return Number(n.replace(/rad/, '')) * (180 / Math.PI);
      }
      if(n.match(/turn/)){
        return Number(n.replace(/turn/, '')) * 360;
      }
    }
    return 0;
  }
  constructor(n){
    this.value = n;
  }
  get value(){
    return this._value;
  }
  set value(n){
    this._value = this.toDegree(n);
  }
  getValue360(){
    if(this.value % 360 >= 0) return this.value % 360;
    if(this.value % 360 < 0) return this.value % 360 + 360;
  }
}

colorJS.cssPercentClass = class {
  toNumber(n){
    let n2 = 0;
    if(typeof n == 'undefined') return 0;
    if(typeof n == 'number' || typeof n == 'string'){
      if(typeof n == 'number' || (typeof n == 'string' && isNaN(n) === false)){
        n2 = Number(n)
      }else if(n.match(/%/) && isNaN(n.replace(/%/, '')) === false){
        n2 = Number(n.replace(/%/, '')) / 100
      }
      if(n2 < 0) n2 = 0;
      if(n2 > 1) n2 = 1;
    }
    return n2;
  }
  constructor(n){
    this.value = n;
  }
  get value(){
    return this._value;
  }
  set value(n){
    this._value = this.toNumber(n);
  }
}

colorJS.colorValueClass = class {
  format(n){
    if(typeof n != 'number') return 0;
    if(n < 0) return 0;
    if(n > 1) return 1;
    if(n >= 0 && n <= 1) return n;
  }
  constructor(n){
    this.value = n;
  }
  get value(){
    return this._value;
  }
  set value(n){
    this._value = this.format(n);
  }
}

// RGB の値のクラス 0-255
colorJS.colorValueRGB = class extends colorJS.colorValueClass {
  format(n){
    if(typeof n == 'undefined') return 0;
    if(typeof n == 'number' || (typeof n == 'string' && !isNaN(n))){
      if(Number(n) < 0) return 0;
      if(Number(n) > 255) return 255;
      if(Number(n) >= 0 && Number(n) <= 255) return Number(n);
    }else if(typeof n == 'string' && n.match(/%/) && !isNaN(n.replace(/%/, ''))){
      let n2 = 255 * (Number(n.replace(/%/, '')) / 100);
      if(Number(n2) < 0) return 0;
      if(Number(n2) > 255) return 255;
      if(Number(n2) >= 0 && Number(n2) <= 255) return Number(n2);
    }else{
      return 0;
    }
  }
}

// hsvの H の値のクラス 0-360
colorJS.colorValueH = class extends colorJS.colorValueClass {
  format(n){
    return new colorJS.cssAngleClass(n).getValue360();
  }
}

// hsvの S の値のクラス 0-1
colorJS.colorValueS = class extends colorJS.colorValueClass {
  format(n){
    return new colorJS.cssPercentClass(n).value;
  }
}

// hsvの L(V) の値のクラス 0-1
colorJS.colorValueV = class extends colorJS.colorValueClass {
  format(n){
    return new colorJS.cssPercentClass(n).value;
  }
}

// hsvの L(V) の値のクラス 0-1
colorJS.colorValueL = class extends colorJS.colorValueClass {
  format(n){
    return new colorJS.cssPercentClass(n).value;
  }
}

// A の値のクラス (透明度) 0-1
colorJS.colorValueA = class extends colorJS.colorValueClass {
  format(n){
    if(typeof n == 'undefined') return new colorJS.cssPercentClass('100%').value;
    return new colorJS.cssPercentClass(n).value;
  }
}




colorJS.color = class {
  getParameterByColorCode(colorCode){
    let parameter = {};
    if(typeof colorCode == 'object'){
      // if(typeof colorCode.parameter.format != 'undefined') parameter.format = colorCode.parameter.format;
      if(typeof colorCode.format != 'undefined'){
        let loop = 0;
        while(loop < this.formatList.length){
           if(colorCode.format == this.formatList[loop]){
             if(colorCode.format == 'rgb'){
               parameter.format = colorCode.format;
               parameter.r = new colorJS.colorValueRGB(colorCode.r);
               parameter.g = new colorJS.colorValueRGB(colorCode.g);
               parameter.b = new colorJS.colorValueRGB(colorCode.b);
               parameter.a = new colorJS.colorValueA(colorCode.a);
             }
             if(colorCode.format == 'hsv'){
               parameter.format = colorCode.format;
               parameter.h = new colorJS.colorValueH(colorCode.h);
               parameter.s = new colorJS.colorValueS(colorCode.s);
               parameter.v = new colorJS.colorValueL(colorCode.v);
               parameter.a = new colorJS.colorValueA(colorCode.a);
             }
             if(colorCode.format == 'hsl'){
               parameter.format = colorCode.format;
               parameter.h = new colorJS.colorValueH(colorCode.h);
               parameter.s = new colorJS.colorValueS(colorCode.s);
               parameter.l = new colorJS.colorValueL(colorCode.l);
               parameter.a = new colorJS.colorValueA(colorCode.a);
             }
              return parameter;
            }
          loop++;
        }
      }
    }
    if(typeof colorCode == 'string'){
      if(colorCode.match(/#/)){ // #が含まれるカラーコードだったら
        let onlyParameter = colorCode.replace(/#/, ''); // パラメータ部分だけ抜き出す (#を消す)
        if(onlyParameter.length == 3){ // パラメータ部分が長さ3のものだったら、#RGB
          parameter.format = 'rgb';
          parameter.r = new colorJS.colorValueRGB(parseInt(onlyParameter.substr(0, 1).repeat(2), 16));
          parameter.g = new colorJS.colorValueRGB(parseInt(onlyParameter.substr(1, 1).repeat(2), 16));
          parameter.b = new colorJS.colorValueRGB(parseInt(onlyParameter.substr(2, 1).repeat(2), 16));
          parameter.a = new colorJS.colorValueA(1);
          return parameter;
        }
        if(onlyParameter.length == 4){ // パラメータ部分が長さ3のものだったら、#RGB
          parameter.format = 'rgb';
          parameter.r = new colorJS.colorValueRGB(parseInt(onlyParameter.substr(0, 1).repeat(2), 16));
          parameter.g = new colorJS.colorValueRGB(parseInt(onlyParameter.substr(1, 1).repeat(2), 16));
          parameter.b = new colorJS.colorValueRGB(parseInt(onlyParameter.substr(2, 1).repeat(2), 16));
          parameter.a = new colorJS.colorValueA(parseInt(onlyParameter.substr(3, 1).repeat(2), 16) / 255);
          return parameter;
        }
        if(onlyParameter.length == 6){ // パラメータ部分が長さ6のものだったら、#RRGGBB
          parameter.format = 'rgb';
          parameter.r = new colorJS.colorValueRGB(parseInt(onlyParameter.substr(0, 2), 16));
          parameter.g = new colorJS.colorValueRGB(parseInt(onlyParameter.substr(2, 2), 16));
          parameter.b = new colorJS.colorValueRGB(parseInt(onlyParameter.substr(4, 2), 16));
          parameter.a = new colorJS.colorValueA(1);
          return parameter;
        }
        if(onlyParameter.length == 8){ // パラメータ部分が長さ8のものだったら、#RRGGBBAA
          parameter.format = 'rgb';
          parameter.r = new colorJS.colorValueRGB(parseInt(onlyParameter.substr(0, 2), 16));
          parameter.g = new colorJS.colorValueRGB(parseInt(onlyParameter.substr(2, 2), 16));
          parameter.b = new colorJS.colorValueRGB(parseInt(onlyParameter.substr(4, 2), 16));
          parameter.a = new colorJS.colorValueA(parseInt(onlyParameter.substr(6, 2), 16) / 255);
          return parameter;
        }
      }
      if(colorCode.match(/rgb/) || colorCode.match(/rgba/)){ // カラーコーデにrgbかrgbaと含まれていたら
        // let parameterArray = colorCode.substring(colorCode.search(/\(/) + 1, colorCode.search(/\)/)).split(',');
        let parameterArray, parameterString = colorCode.substring(colorCode.search(/\(/) + 1, colorCode.search(/\)/));
        if(parameterString.match(/,/)) parameterArray = parameterString.replace(/ /, '').split(',');
        if(!parameterString.match(/,/) && parameterString.match(/ /)) parameterArray = parameterString.split(' ');
        if(parameterArray.length == 3){ // rgb(r, g, b)
          parameter.format = 'rgb';
          parameter.r = new colorJS.colorValueRGB(parameterArray[0]);
          parameter.g = new colorJS.colorValueRGB(parameterArray[1]);
          parameter.b = new colorJS.colorValueRGB(parameterArray[2]);
          parameter.a = new colorJS.colorValueA(1);
          return parameter;
        }
        if(parameterArray.length == 4){ // rgba(r, g, b, a)
          parameter.format = 'rgb';
          parameter.r = new colorJS.colorValueRGB(parameterArray[0]);
          parameter.g = new colorJS.colorValueRGB(parameterArray[1]);
          parameter.b = new colorJS.colorValueRGB(parameterArray[2]);
          parameter.a = new colorJS.colorValueA(parameterArray[3]);
          return parameter;
        }
      }
      if(colorCode.match(/hsv/) || colorCode.match(/hsva/)){ //カラーコーデにhsvかhsvaと含まれていたら
        let parameterArray, parameterString = colorCode.substring(colorCode.search(/\(/) + 1, colorCode.search(/\)/));
        if(parameterString.match(/,/)) parameterArray = parameterString.replace(/ /, '').split(',');
        if(!parameterString.match(/,/) && parameterString.match(/ /)) parameterArray = parameterString.split(' ');
        if(parameterArray.length == 3){ // hsv(h, s%, l%)
          parameter.format = 'hsv';
          parameter.h = new colorJS.colorValueH(parameterArray[0]);
          parameter.s = new colorJS.colorValueS(parameterArray[1]);
          parameter.v = new colorJS.colorValueV(parameterArray[2]);
          parameter.a = new colorJS.colorValueA(1);
          return parameter;
        }
        if(parameterArray.length == 4){ // hsva(h, s%, l%, a)
          parameter.format = 'hsv';
          parameter.h = new colorJS.colorValueH(parameterArray[0]);
          parameter.s = new colorJS.colorValueS(parameterArray[1]);
          parameter.v = new colorJS.colorValueV(parameterArray[2]);
          parameter.a = new colorJS.colorValueA(parameterArray[3]);
          return parameter;
        }
      }
      if(colorCode.match(/hsl/) || colorCode.match(/hsla/)){ //カラーコーデにhslかhslaと含まれていたら
        let parameterArray, parameterString = colorCode.substring(colorCode.search(/\(/) + 1, colorCode.search(/\)/));
        if(parameterString.match(/,/)) parameterArray = parameterString.replace(/ /, '').split(',');
        if(!parameterString.match(/,/) && parameterString.match(/ /)) parameterArray = parameterString.split(' ');
        if(parameterArray.length == 3){ // hsv(h, s%, l%)
          parameter.format = 'hsl';
          parameter.h = new colorJS.colorValueH(parameterArray[0]);
          parameter.s = new colorJS.colorValueS(parameterArray[1]);
          parameter.l = new colorJS.colorValueL(parameterArray[2]);
          parameter.a = new colorJS.colorValueA(1);
          return parameter;
        }
        if(parameterArray.length == 4){ // hsva(h, s%, l%, a)
          parameter.format = 'hsl';
          parameter.h = new colorJS.colorValueH(parameterArray[0]);
          parameter.s = new colorJS.colorValueS(parameterArray[1]);
          parameter.l = new colorJS.colorValueL(parameterArray[2]);
          parameter.a = new colorJS.colorValueA(parameterArray[3]);
          return parameter;
        }
      }
    }
    return parameter;
  }
  constructor(colorCode){
    this.formatList = [
      'rgb',
      'hsv',
      'hsl'
    ]
    this.parameter = this.getParameterByColorCode(colorCode);
  }



  to(destination){

    // RGB <=> 各フォーマットの変換だけ実装
    // RGB以外のフォーマット同士の変換はRGBを経由して変換

    if(typeof destination != 'string') return new colorJS.color('#000000'); // destinationがstring型じゃなかったら#000を返す

    // console.log(`${this.parameter.format} to ${destination}`);
    let parameterBuffer = {};

    if(this.parameter.format == destination) return this; // 変換元と変換先が同じだったらそのまま返す

    if(this.parameter.format == 'rgb'){ // 変換元がRGBだったら

      if(destination == 'hsv'){ // 変換先がHSVだったら
        parameterBuffer.format = 'hsv' // 変換先データのバッファーにformatを指定
        parameterBuffer.a = this.parameter.a.value; // 透明度はそのまま
        let rgbArray       = [this.parameter.r.value, this.parameter.g.value, this.parameter.b.value]; // RGBを入れる
        let rgbSortedArray = rgbArray.sort(function(a, b){ // 大>>小の順に並べ替えたものを入れる
          if(a < b) return 1;
          if(a > b) return -1;
          if(a == b) return 0;
        });
        let RGBMAX = rgbSortedArray[0], RGBMIN = rgbSortedArray[2];
        // 色相(H)を求める
        if(RGBMAX == this.parameter.r.value){ // RGBの内Rが最大だったら ### 60 * ((G - B) / (MAX - MIN))
          parameterBuffer.h = 60 * ((this.parameter.g.value - this.parameter.b.value) / (RGBMAX - RGBMIN)); }
        if(RGBMAX == this.parameter.g.value){ // RGBの内Gが最大だったら ### 60 * ((B - R) / (MAX - MIN)) + 120
          parameterBuffer.h = 60 * ((this.parameter.b.value - this.parameter.r.value) / (RGBMAX - RGBMIN)) + 120; }
        if(RGBMAX == this.parameter.b.value){ // RGBの内Bが最大だったら ### 60 * ((R - G) / (MAX - MIN)) + 240
          parameterBuffer.h = 60 * ((this.parameter.r.value - this.parameter.g.value) / (RGBMAX - RGBMIN)) + 240; }
        if(RGBMAX == RGBMIN) parameterBuffer.h = 0; // RGBの内の最小と最大が等しかったら、0
        // 彩度(S)を求める
        parameterBuffer.s = (RGBMAX - RGBMIN) / RGBMAX; // パーセントで (0-1)
        // 明度(V)を求める
        parameterBuffer.v = RGBMAX / 255; // パーセントで (0-1)

        return new colorJS.color(parameterBuffer);

      }

      if(destination == 'hsl'){ // もし変換先がHSL(円柱モデル)だったら
        parameterBuffer.format = 'hsl' // 変換先データのバッファーにformatを指定
        parameterBuffer.a = this.parameter.a.value; // 透明度はそのまま
        let rgbArray       = [this.parameter.r.value, this.parameter.g.value, this.parameter.b.value]; // RGBを入れる
        let rgbSortedArray = rgbArray.sort(function(a, b){ // 大>>小の順に並べ替えたものを入れる
          if(a < b) return 1;
          if(a > b) return -1;
          if(a == b) return 0;
        });
        let RGBMAX = rgbSortedArray[0], RGBMIN = rgbSortedArray[2];
        // 色相(H)を求める
        if(RGBMAX == this.parameter.r.value){ // RGBの内Rが最大だったら ### 60 * ((G - B) / (MAX - MIN))
          parameterBuffer.h = 60 * ((this.parameter.g.value - this.parameter.b.value) / (RGBMAX - RGBMIN)); }
        if(RGBMAX == this.parameter.g.value){ // RGBの内Gが最大だったら ### 60 * ((B - R) / (MAX - MIN)) + 120
          parameterBuffer.h = 60 * ((this.parameter.b.value - this.parameter.r.value) / (RGBMAX - RGBMIN)) + 120; }
        if(RGBMAX == this.parameter.b.value){ // RGBの内Bが最大だったら ### 60 * ((R - G) / (MAX - MIN)) + 240
          parameterBuffer.h = 60 * ((this.parameter.r.value - this.parameter.g.value) / (RGBMAX - RGBMIN)) + 240; }
        if(RGBMAX == RGBMIN) parameterBuffer.h = 0; // RGBの内の最小と最大が等しかったら、0
        // 彩度(S)を求める 円柱モデル
        parameterBuffer.s = ((RGBMAX / 255) - (RGBMIN / 255)) / (1 - Math.abs((RGBMAX / 255) + (RGBMIN / 255) - 1));
        // 光度(L)を求める
        parameterBuffer.l = ((RGBMAX / 255) + (RGBMIN / 255)) / 2;

        return new colorJS.color(parameterBuffer);

      }

    }


    if(this.parameter.format == 'hsv'){ // 変換元がHSVだったら

      if(destination == 'rgb'){ // 変換先がRGBAだったら
        parameterBuffer.format = 'rgb' // 変換先データのバッファーにformatを指定
        parameterBuffer.a = this.parameter.a.value; // 透明度はそのまま
        // RGBのうちの最大値と最小値を逆算したものを代入
        let RGBMAX = 255 * this.parameter.v.value,
            RGBMIN = -255 * this.parameter.v.value * (this.parameter.s.value - 1);
        if(this.parameter.h.value >= 0 && this.parameter.h.value < 60){
          parameterBuffer.r = RGBMAX;
          parameterBuffer.g = (this.parameter.h.value + 0) / 60 * (RGBMAX - RGBMIN) + RGBMIN;
          parameterBuffer.b = RGBMIN;
          return new colorJS.color(parameterBuffer);
        }
        if(this.parameter.h.value >= 60 && this.parameter.h.value < 120){
          parameterBuffer.r = (-1 * this.parameter.h.value + 120) / 60 * (RGBMAX - RGBMIN) + RGBMIN;
          parameterBuffer.g = RGBMAX;
          parameterBuffer.b = RGBMIN;
          return new colorJS.color(parameterBuffer);
        }
        if(this.parameter.h.value >= 120 && this.parameter.h.value < 180){
          parameterBuffer.r = RGBMIN;
          parameterBuffer.g = RGBMAX;
          parameterBuffer.b = (this.parameter.h.value + (-120)) / 60 * (RGBMAX - RGBMIN) + RGBMIN;
          return new colorJS.color(parameterBuffer);
        }
        if(this.parameter.h.value >= 180 && this.parameter.h.value < 240){
          parameterBuffer.r = RGBMIN;
          parameterBuffer.g = (-1 * this.parameter.h.value + 240) / 60 * (RGBMAX - RGBMIN) + RGBMIN;
          parameterBuffer.b = RGBMAX;
          return new colorJS.color(parameterBuffer);
        }
        if(this.parameter.h.value >= 240 && this.parameter.h.value < 300){
          parameterBuffer.r = (this.parameter.h.value + (-240)) / 60 * (RGBMAX - RGBMIN) + RGBMIN;
          parameterBuffer.g = RGBMIN;
          parameterBuffer.b = RGBMAX;
          return new colorJS.color(parameterBuffer);
        }
        if(this.parameter.h.value >= 300 && this.parameter.h.value < 360){
          parameterBuffer.r = RGBMAX;
          parameterBuffer.g = RGBMIN;
          parameterBuffer.b = (-1 * this.parameter.h.value + 360) / 60 * (RGBMAX - RGBMIN) + RGBMIN;
          return new colorJS.color(parameterBuffer);
        }
        parameterBuffer.r = 0;
        parameterBuffer.g = 0;
        parameterBuffer.b = 0;
        return new colorJS.color(parameterBuffer);
      }
    }

    if(this.parameter.format == 'hsl'){ // 変換元がHSLだったら

      if(destination == 'rgb'){ // 変換先がRGBAだったら
        parameterBuffer.format = 'rgb' // 変換先データのバッファーにformatを指定
        parameterBuffer.a = this.parameter.a.value; // 透明度はそのまま
        // RGBのうちの最大値と最小値を逆算したものを代入
        let RGBMAX = (this.parameter.l.value + (this.parameter.s.value * (1 - Math.abs(2 * this.parameter.l.value - 1))) / 2) * 255,
            RGBMIN = (this.parameter.l.value - (this.parameter.s.value * (1 - Math.abs(2 * this.parameter.l.value - 1))) / 2) * 255;
        if(this.parameter.h.value >= 0 && this.parameter.h.value < 60){
          parameterBuffer.r = RGBMAX;
          parameterBuffer.g = (this.parameter.h.value + 0) / 60 * (RGBMAX - RGBMIN) + RGBMIN;
          parameterBuffer.b = RGBMIN;
          return new colorJS.color(parameterBuffer);
        }
        if(this.parameter.h.value >= 60 && this.parameter.h.value < 120){
          parameterBuffer.r = (-1 * this.parameter.h.value + 120) / 60 * (RGBMAX - RGBMIN) + RGBMIN;
          parameterBuffer.g = RGBMAX;
          parameterBuffer.b = RGBMIN;
          return new colorJS.color(parameterBuffer);
        }
        if(this.parameter.h.value >= 120 && this.parameter.h.value < 180){
          parameterBuffer.r = RGBMIN;
          parameterBuffer.g = RGBMAX;
          parameterBuffer.b = (this.parameter.h.value + (-120)) / 60 * (RGBMAX - RGBMIN) + RGBMIN;
          return new colorJS.color(parameterBuffer);
        }
        if(this.parameter.h.value >= 180 && this.parameter.h.value < 240){
          parameterBuffer.r = RGBMIN;
          parameterBuffer.g = (-1 * this.parameter.h.value + 240) / 60 * (RGBMAX - RGBMIN) + RGBMIN;
          parameterBuffer.b = RGBMAX;
          return new colorJS.color(parameterBuffer);
        }
        if(this.parameter.h.value >= 240 && this.parameter.h.value < 300){
          parameterBuffer.r = (this.parameter.h.value + (-240)) / 60 * (RGBMAX - RGBMIN) + RGBMIN;
          parameterBuffer.g = RGBMIN;
          parameterBuffer.b = RGBMAX;
          return new colorJS.color(parameterBuffer);
        }
        if(this.parameter.h.value >= 300 && this.parameter.h.value < 360){
          parameterBuffer.r = RGBMAX;
          parameterBuffer.g = RGBMIN;
          parameterBuffer.b = (-1 * this.parameter.h.value + 360) / 60 * (RGBMAX - RGBMIN) + RGBMIN;
          return new colorJS.color(parameterBuffer);
        }
        parameterBuffer.r = 0;
        parameterBuffer.g = 0;
        parameterBuffer.b = 0;
        return new colorJS.color(parameterBuffer);
      }
    }

    if(this.parameter.format != 'rgb' && destination != 'rgb'){ // 変換元がRGB以外のフォーマットで、変換先をRGB以外のフォーマットだったら
      return this.to('rgb').to(destination);
    }
  }
  set(valueObj){
    if(typeof valueObj == 'undefined') return this;
    let parameterBuffer = {};
    let usedParameterList = {
      'rgb': ['r', 'g', 'b', 'a'],
      'hsv': ['h', 's', 'v', 'a'],
      'hsl': ['h', 's', 'l', 'a']
    };
    let loop = 0;
    while(loop < this.formatList.length){
      if(this.parameter.format == this.formatList[loop]){
        parameterBuffer.format = this.parameter.format;
        let usedParameter = usedParameterList[this.formatList[loop]]
        let loop2 = 0;
        while(loop2 < usedParameter.length){
          if(typeof valueObj[usedParameter[loop2]] != 'undefined'){
            parameterBuffer[usedParameter[loop2]] = valueObj[usedParameter[loop2]];
          }else{
            parameterBuffer[usedParameter[loop2]] = this.parameter[usedParameter[loop2]].value;
          }
          loop2++;
        }
      }
      loop++;
    }
    return new colorJS.color(parameterBuffer);
  }
  getColorCode(type, compact){
    let defaultColorCodeFormat = { // 呼び出し元の色の形式: typeが未指定だった時のtype
      'rgb': 'rgb',
      'hsv': 'hsv',
      'hsl': 'hsl'
    }
    let colorCodeOriginalFormat = { // カラーコードの形式: 求める時に元になる色の形式
      'hex': 'rgb',
      'rgb': 'rgb',
      'hsv': 'hsv',
      'hsl': 'hsl'
    };
    if(typeof compact != 'boolean') compact = true; // compactがブーリアン型以外だったらfalseに
    if(typeof type != 'string') type = defaultColorCodeFormat[this.parameter.format]; // typeがundefinedだったら、呼び出し元の色の形式から適切なカラーコードの形式を指定

    let convertedColor;
    if(type == 'hex'){ // typeがhexだったら、#RRGGBBAAの形式にして返す。compactがtrueだったら場合によって#RRGGBBを返す
      convertedColor = this.to(colorCodeOriginalFormat['hex']);
      let hexValueObject = {
        r: ('00' + Math.round(convertedColor.parameter.r.value).toString(16)).slice(-2), // ゼロ埋め 00FF > FF, 000E > 0E
        g: ('00' + Math.round(convertedColor.parameter.g.value).toString(16)).slice(-2),
        b: ('00' + Math.round(convertedColor.parameter.b.value).toString(16)).slice(-2),
        a: ('00' + Math.round(convertedColor.parameter.a.value * 255).toString(16)).slice(-2)
      }
      if(compact && convertedColor.parameter.a.value == 1) return `#${hexValueObject.r}${hexValueObject.g}${hexValueObject.b}`;
      return `#${hexValueObject.r}${hexValueObject.g}${hexValueObject.b}${hexValueObject.a}`;
    }

    if(type == 'rgb'){ // typeがrgbだったら、rgba(r, g, b, a%)の形式にして返す。compactがtrueだったら場合によってrgb(r, g, b)を返す
      convertedColor = this.to(colorCodeOriginalFormat['rgb']);
      if(compact && convertedColor.parameter.a.value == 1) return `rgb(${Math.round(convertedColor.parameter.r.value)}, ${Math.round(convertedColor.parameter.g.value)}, ${Math.round(convertedColor.parameter.b.value)})`;
      return `rgba(${Math.round(convertedColor.parameter.r.value)}, ${Math.round(convertedColor.parameter.g.value)}, ${Math.round(convertedColor.parameter.b.value)}, ${convertedColor.parameter.a.value * 100}%)`;
    }

    if(type == 'hsv'){ // typeがhsvだったら、hsva(h, s%, v%, a%)の形式にして返す。compactがtrueだったら場合によってhsv()を返す
      convertedColor = this.to(colorCodeOriginalFormat['hsv']);
      if(compact && convertedColor.parameter.a.value == 1) return `hsv(${convertedColor.parameter.h.value}, ${convertedColor.parameter.s.value * 100}%, ${convertedColor.parameter.v.value * 100}%)`;
      return `hsva(${convertedColor.parameter.h.value}, ${convertedColor.parameter.s.value * 100}%, ${convertedColor.parameter.v.value * 100}%, ${convertedColor.parameter.a.value * 100}%)`;
    }

    if(type == 'hsl'){ // typeがhsvだったら、hsva(h, s%, v%, a%)の形式にして返す。compactがtrueだったら場合によってhsv()を返す
      convertedColor = this.to(colorCodeOriginalFormat['hsl']);
      if(compact && convertedColor.parameter.a.value == 1) return `hsl(${convertedColor.parameter.h.value}, ${convertedColor.parameter.s.value * 100}%, ${convertedColor.parameter.l.value * 100}%)`;
      return `hsla(${convertedColor.parameter.h.value}, ${convertedColor.parameter.s.value * 100}%, ${convertedColor.parameter.l.value * 100}%, ${convertedColor.parameter.a.value * 100}%)`;
    }

    return '#000000'; // ここまで何も当てはまらなかったら
  }
}

export default colorJS;
