const scales = {
  100: 0.95,
  130: 0.912,
  160: 0.859,
  200: 0.8,
  230: 0.743,
  260: 0.678,
  300: 0.6,
  330: 0.482,
  345: 0.404,
  360: 0.36,
  400: 0.2,
  430: 0.146,
  460: 0.08,
  500: 0,
  530: -0.09,
  560: -0.19,
  600: -0.32,
  630: -0.411,
  645: -0.481,
  660: -0.545,
  700: -0.6,
  730: -0.622,
  760: -0.655,
  800: -0.7,
  830: -0.768,
  860: -0.85,
  900: -0.95,
};

function handleFileInputChange(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      const colorThief = new ColorThief();
      const dominantColor = colorThief.getColor(img);
      const hexColor = rgbToHex(dominantColor[0], dominantColor[1], dominantColor[2]);

      updateColors(hexColor);
    };

    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
}


function generateColors() {
  const hexColor = document.getElementById('hexColorInput').value;
  updateColors(hexColor);
  updateThemeLink(hexColor);
}


function rgbToHex(r, g, b) {
  const componentToHex = (c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function updateRootVariables(hexColor) {
  const root = document.documentElement;

  for (const scale in scales) {
    const variableName = `--m3-color-${scale}`;
    const scaleValue = scales[scale];
    const scaledColor = scaleColor(hexColor, scaleValue);

    root.style.setProperty(variableName, scaledColor);
  }
}


function scaleColor(color, scale) {
  const r = parseInt(color.substring(1, 3), 16);
  const g = parseInt(color.substring(3, 5), 16);
  const b = parseInt(color.substring(5, 7), 16);

  const scaledR = Math.round(r * (1 + scale));
  const scaledG = Math.round(g * (1 + scale));
  const scaledB = Math.round(b * (1 + scale));

  return rgbToHex(scaledR, scaledG, scaledB);
}


function updateFontColor(backgroundColor) {
  const root = document.documentElement;
  const r = parseInt(backgroundColor.substring(1, 3), 16);
  const g = parseInt(backgroundColor.substring(3, 5), 16);
  const b = parseInt(backgroundColor.substring(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  if (brightness > 128) {
    root.style.setProperty('--text-color', '#000000'); 
  } else {
    root.style.setProperty('--text-color', '#ffffff'); 
  }
}


function updateColors(hexColor) {
  if (hexColor) {
    updateRootVariables(hexColor);
    updateFontColor(hexColor);
    document.getElementById('hexColorInput').value = hexColor; 
  }
}


function updateThemeLink(hexColor) {
  const client = document.getElementById('clients').value;
  const encodedColor = encodeURIComponent(hexColor).replace('#', '%23');
  const apiLink = `https://materialdetta.ushie.dev/api?baseColor=${encodedColor}&client=${client}`;
  document.getElementById('gen-theme-link').value = apiLink;
}


document.getElementById('fileInput').addEventListener('change', handleFileInputChange);


document.getElementById('generate').addEventListener('click', generateColors);
