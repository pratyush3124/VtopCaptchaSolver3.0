function softmax(a){
  var n = [...a];
  let s = 0;
  n.forEach((f) => {
    s += Math.exp(f);
  });
  for (let i = 0; i < a.length; i++) {
    n[i] = Math.exp(a[i]) / s;
  }
  return n;
};

function matrixMultiplication(a, b){
  if (!Array.isArray(a) || !Array.isArray(b) || !a.length || !b.length) {
    throw new Error("arguments should be in 2-dimensional array format");
  }
  let x = a.length,
    z = a[0].length,
    y = b[0].length;
  if (b.length !== z) {
    // XxZ & ZxY => XxY
    console.log(no);
  }
  let productRow = Array.apply(null, new Array(y)).map(
    Number.prototype.valueOf,
    0
  );
  let product = new Array(x);
  for (let p = 0; p < x; p++) {
    product[p] = productRow.slice();
  }
  for (let i = 0; i < x; i++) {
    for (let j = 0; j < y; j++) {
      for (let k = 0; k < z; k++) {
        product[i][j] += a[i][k] * b[k][j];
      }
    }
  }
  return product;
};

function matrixAddition(a, b){
  let x = a.length;
  let c = new Array(x);
  for (let i = 0; i < x; i++) {
    c[i] = a[i] + b[i];
  }
  return c;
};

function saturation(d){
  sat = new Array(d.length / 4);
  for (let i = 0; i < d.length; i += 4) {
    min = Math.min(d[i], d[i + 1], d[i + 2]);
    max = Math.max(d[i], d[i + 1], d[i + 2]);
    sat[i / 4] = Math.round(((max - min) * 255) / max);
  }
  return sat;
};

function flatten(ar){
  var ne = new Array(ar.length * ar[0].length);
  for (let i = 0; i < ar.length; i += 1) {
    for (let j = 0; j < ar[0].length; j += 1) {
      ne[i * ar[0].length + j] = ar[i][j];
    }
  }
  return ne;
};

function deflatten(ar, shape){
  var img = new Array(shape[0]);
  for (let i = 0; i < shape[0]; i += 1) {
    img[i] = new Array(shape[1]);
    for (let j = 0; j < shape[1]; j += 1) {
      img[i][j] = ar[i * shape[1] + j];
    }
  }
  return img;
};

function vellorePreProcess(im){
  let avg = 0;
  im.forEach((e) => e.forEach((f) => (avg += f)));
  avg /= 24 * 22;
  var ne = new Array(im.length);
  for (let i = 0; i < im.length; i += 1) {
    ne[i] = new Array(im[0].length);
    for (let j = 0; j < im[0].length; j += 1) {
      if (im[i][j] > avg) {
        ne[i][j] = 1;
      } else {
        ne[i][j] = 0;
      }
    }
  }
  return ne;
};

function chennaiPreProcess(im){
  // binarized with cleanEdges and invertedColors
  // console.log("pr", im);
  for (let i=0; i<im.length; i+=1){
    for (let j=0; j<im[0].length; j+=1){
      if (i==0 || j==0 || i==im.length-1 || j==im[0].length-1){
        // console.log(im[i][j]);
        im[i][j] = 0;
        // console.log(im[i][j]);
      } else {
        if (im[i][j]/255 > 0.3){
          im[i][j] = 0;
        } else {
          im[i][j] = 1;
        }
      }
    }
  }
  // denoized
  dn = im.map(elem=>elem.slice())
  for (let i=1; i<im.length-1; i+=1){
    for (let j=1; j<im[0].length-1; j+=1){
      s = 0
      for (let k=-1; k<2; k++){
        for (let l=-1; l<2; l++){
          if (k==0 && l==0){
            continue;
          } else {
            s += im[i+k][j+l]
          }
        }
      }
      if (im[i,j] == 1 && s<4){
        dn[i,j] = 0
      } else if (im[i,j] == 0 && s>4){
        dn[i,j] = 1
      }
    }
  }
  return dn;
}

function VelloreBlocks(im){
  blocksList = new Array(6);
  for (let a = 0; a < 6; a += 1) {
    x1 = (a + 1) * 25 + 2;
    y1 = 7 + 5 * (a % 2) + 1;
    x2 = (a + 2) * 25 + 1;
    y2 = 35 - 5 * ((a + 1) % 2);
    blocksList[a] = im.slice(y1, y2).map((i) => i.slice(x1, x2));
  }
  return blocksList;
};

function chennaiBlocks(im){
  blocksList = new Array(6);
  for (let a=0; a<6; a+=1){
    x1 = (a)*30
    y1 = 10
    x2 = (a)*30+25
    y2 = 45
    blocksList[a] = im.slice(y1,y2).map(i => i.slice(x1,x2));
  }
  return blocksList;
}

const addCredits = function (string = "Solved by Vtop Captcha Solver") {
  var box = document.getElementsByClassName("col-sm-offset-1")[0];
  var para = document.createElement("p");
  para.innerHTML = string;
  para.style.cssText = "font-size: 12px; text-align: center;";
  para.setAttribute("id", "Credits");
  box.appendChild(para);
};

const displayImage = (img) => {
  const height = img.length;
  const width = img[0].length;
  img = flatten(img)
  var buffer = new Uint8ClampedArray(width * height * 4);
  for (let pos=0; pos<buffer.length; pos=pos+4){
    buffer[pos  ] = img[pos/4]*255;
    buffer[pos+1] = img[pos/4]*255;
    buffer[pos+2] = img[pos/4]*255;
    buffer[pos+3] = 255;
  }
  // create off-screen canvas element
  var image = new Image(width, height);
  var canvas = document.createElement('canvas'),
  ctx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
  // create imageData object
  var idata = ctx.createImageData(width, height);
  // set our buffer as source
  idata.data.set(buffer);
  // update canvas with new data
  ctx.putImageData(idata, 0, 0);

  image.src = canvas.toDataURL();
  document.body.appendChild(image);
}

const solveChennai = (img, textBox) => {
  fetch("chrome-extension://kghehdhpjbiankmldeiballgdcemchjo/chennaiWeights.json")
  // fetch("chrome-extension://balpfhmdaaahhppiijcgaemeoeojejam/chennaiWeights.json")
    .then((response) => response.json())
    .then((data) => {

      const HEIGHT=45;
      const WIDTH=180;

      const weights = data.weights;
      const biases = data.biases;
      
      const label_txt = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const pd = ctx.getImageData(0, 0, WIDTH, HEIGHT);
      
      var dat = new Array(pd.data.length/4);
      for (let a=0; a<pd.data.length; a+=4){
        dat[a/4] = pd.data[a];
      }

      def = deflatten(dat, [HEIGHT, WIDTH])
      blocksList = chennaiBlocks(def);
      out = "";
      for (let i=0; i<6; i++){
        block = chennaiPreProcess(blocksList[i]);
        // console.log(block)
        block = [flatten(block)]
        block = matrixMultiplication(block, weights);
        block = matrixAddition(...block, biases);
        block = softmax(block);
        block = block.indexOf(Math.max(...block));
        out += label_txt[block];  
      }
      console.log(out);
      textBox.value = out;
      // addCredits();
    })
}

const solveVellore = (img, textBox) => {
  fetch("chrome-extension://kghehdhpjbiankmldeiballgdcemchjo/velloreWeights.json")
  // fetch("chrome-extension://balpfhmdaaahhppiijcgaemeoeojejam/velloreWeights.json")
    .then((response) => response.json())
    .then((data) => {

      const HEIGHT=40;
      const WIDTH=200;

      const weights = data.weights;
      const biases = data.biases;

      const label_txt = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const pd = ctx.getImageData(0, 0, WIDTH, HEIGHT);

      sat = saturation(pd.data);
      def = deflatten(sat, [HEIGHT, WIDTH]);
      blocksList = VelloreBlocks(def);
      out = "";
      for (let i = 0; i < 6; i += 1) {
        block = vellorePreProcess(blocksList[i]);
        block = [flatten(block)];
        block = matrixMultiplication(block, weights);
        block = matrixAddition(...block, biases);
        block = softmax(block);
        block = block.indexOf(Math.max(...block));
        out += label_txt[block];
      }
      console.log(out);
      textBox.value = out;
      // addCredits();
    });
};

try {
  console.log(document.URL)
  if (document.URL.match("vtop.vit.ac.in")) {
    // student and employee login
    var img = document.getElementsByClassName("form-control img-fluid bg-light border-0")[0];
    if (!img) { // parent login
      var img = document.getElementsByClassName("form-control bg-light border-0")[0];
    }
    img.style.height="40px!important";
    img.style.width="200px!important";
    var textBox = document.getElementById("captchaStr");
    var submitButton = document.getElementById("submitBtn");
    solveVellore(img, textBox);

    var container = document.getElementById("bodyContent");
    container.addEventListener('DOMSubtreeModified', ()=>{
      var img = document.getElementsByClassName("form-control img-fluid bg-light border-0")[0];
      if (!img) { // parent login
        var img = document.getElementsByClassName("form-control bg-light border-0")[0];
      }
      img.style.height="40px!important";
      img.style.width="200px!important";
      var textBox = document.getElementById("captchaStr");
      var submitButton = document.getElementById("submitBtn");
      solveVellore(img, textBox);
    })

  } else if(document.URL.match("vtopcc.vit.ac.in") || document.URL.match(".vitap.ac.in") || document.URL.match(".vitbhopal.ac.in")){
    console.log("other")
    var container = document.getElementById("page_outline");
    container.addEventListener('DOMSubtreeModified', ()=>{
      var captchaDiv = document.getElementById("captchaRefresh").children[0];
      if (captchaDiv.children.length == 1){
        captchaDiv = captchaDiv.children[0]
      }
      var img = captchaDiv.children[0];
      img.style.height="45px!important";
      img.style.width="180px!important";
      var textBox = document.getElementById("captchaCheck");
      var submitButton = document.getElementById("captcha");
      solveChennai(img, textBox);
    })

  } else if (document.URL.match("vtopreg.vit.ac.in")) {
    var img = document.getElementById("captcha_id");
    var textBox = document.getElementById("captchaString");
    var submitButton = document.getElementById("loginButton");

    img.style.height="40px!important";
    img.style.width="200px!important";
    const base64 = img.src.split(",")[1];
    // fetch("https://first-355012.el.r.appspot.com/api/ocr/", {
    //   // fetch("http://127.0.0.1:5000/api/ocr/", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     img: base64,
    //   }),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data.ans);
    //     textBox.value = data.ans;
    //     submitButton.focus();
    //   })
    //   .catch((e) => console.log(e));
    // throw "done";

  }
  // submitButton.focus();
} catch (e) {
  console.log(e);
}
