function saturation(d){
  sat = new Array(d.length / 4);
  for (let i = 0; i < d.length; i += 4) {
    min = Math.min(d[i], d[i + 1], d[i + 2]);
    max = Math.max(d[i], d[i + 1], d[i + 2]);
    sat[i / 4] = Math.round(((max - min) * 255) / max);
  }
  return sat;
};

function preProcess(im){
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
  n = shape[0];
  m = shape[1];
  var img = new Array(n);
  for (let i = 0; i < n; i += 1) {
    img[i] = new Array(m);
    for (let j = 0; j < m; j += 1) {
      img[i][j] = ar[i * m + j];
    }
  }
  return img;
};

function VelloreBlocks(im){
  blocksList = new Array(6);
  for (let a = 0; a < 6; a += 1) {
    c = 0;
    d = 0;
    x1 = (a + 1) * 25 + 2;
    y1 = 7 + 5 * (a % 2) + 1;
    x2 = (a + 2) * 25 + 1;
    y2 = 35 - 5 * ((a + 1) % 2);
    blocksList[a] = im.slice(y1, y2).map((i) => i.slice(x1, x2));
  }
  return blocksList;
};

function matMul(a, b){
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

function matAdd(a, b){
  let x = a.length;
  let c = new Array(x);
  for (let i = 0; i < x; i++) {
    c[i] = a[i] + b[i];
  }
  return c;
};

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

const addCredits = function (string = "Solved by Vtop Captcha Solver") {
  var box = document.getElementsByClassName("col-sm-offset-1")[0];
  var para = document.createElement("p");
  para.innerHTML = string;
  para.style.cssText = "font-size: 12px; text-align: center;";
  para.setAttribute("id", "Credits");

  box.appendChild(para);
};

const HEIGHT=40;
const WIDTH=200;

const solve = (img, textBox) => {
  // fetch("chrome-extension://plmmafgaagooagiemlikkajepfgalfdo/weights.json")
  fetch("chrome-extension://balpfhmdaaahhppiijcgaemeoeojejam/weights.json")
    .then((response) => response.json())
    .then((data) => {
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
        blocksList[i] = preProcess(blocksList[i]);
        blocksList[i] = [flatten(blocksList[i])];
        blocksList[i] = matMul(blocksList[i], weights);
        blocksList[i] = matAdd(...blocksList[i], biases);
        blocksList[i] = softmax(blocksList[i]);
        blocksList[i] = blocksList[i].indexOf(Math.max(...blocksList[i]));
        out += label_txt[blocksList[i]];
      }
      console.log(out);
      textBox.value = out;
      // addCredits();
    });
};

try {
  if (document.URL.match("vtop.vit.ac.in")) {
    // student and employee login
    var img = document.getElementsByClassName("form-control img-fluid bg-light border-0")[0];
    if (!img) {
      // parent login
      var img = document.getElementsByClassName("form-control bg-light border-0")[0];
    }
    img.style.height="40px!important";
    img.style.width="200px!important";
    var textBox = document.getElementById("captchaStr");
    var submitButton = document.getElementById("submitBtn");

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
  
  } else if(document.URL.match("vconnect.vit.ac.in")){
    var a = document.getElementById("captchaRefresh");
    if (a!==null){
      var b = document.getElementsByClassName('col-md-offset-1')[0].children[1].click()
    }
  }

  solve(img, textBox);
  // submitButton.focus();
} catch (e) {
  console.log(e);
}
