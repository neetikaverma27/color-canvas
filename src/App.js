import React, { useRef, useEffect } from "react";

const STEPS = 32;

const colorComponents = Array.from({ length: STEPS }, (_, i) => i * 8);

const COLORS = [];

for (let red of colorComponents) {
  for (let green of colorComponents) {
    for (let blue of colorComponents) {
      // colors are in decreasing order of similarity
      COLORS.push(`rgb(${red}, ${green}, ${blue})`);
    }
  }
}

const lengthOfColors = COLORS.length;

const usedColorsIndex = {};
const similarityFactor = Math.ceil(Math.random() * 5);
let generatedImage = [];

function getUniqueRandomNumber() {
  let randomNumber = Math.floor(Math.random() * lengthOfColors);

  while (usedColorsIndex[randomNumber]) {
    randomNumber = Math.floor(Math.random() * lengthOfColors);
  }

  usedColorsIndex[randomNumber] = true;
  return randomNumber;
}

const getSimilarColors = (initialIndex, similarColorsNeeded) => {
  let similarColors = [];
  let i = initialIndex + 1;
  let remainingColors = lengthOfColors - Object.keys(usedColorsIndex).length;

  similarColorsNeeded = Math.min(similarColorsNeeded, remainingColors);

  while (similarColors.length !== similarColorsNeeded) {
    if (usedColorsIndex[i] === undefined && i < lengthOfColors) {
      usedColorsIndex[i] = true;
      similarColors.push(i);
    }
    ++i;

    if (i >= lengthOfColors) {
      i = 0;
    }
  }

  return similarColors;
};

for (let i = 0; i < COLORS.length; i += similarityFactor) {
  let colorIndex = getUniqueRandomNumber();
  // Extract similar colors
  let otherSimilarColors = [colorIndex].concat(
    getSimilarColors(colorIndex, similarityFactor - 1)
  );

  generatedImage = generatedImage.concat(
    otherSimilarColors.map((index) => COLORS[index])
  );
}

const getColors = (x, y) => {
  return generatedImage[x * 128 + y];
};

const Rainbow = () => {
  const canvasRef = useRef();
  useEffect(() => {
    let ctx = canvasRef.current.getContext("2d");
    for (let x = 0; x < 256; x++) {
      for (let y = 0; y < 128; y++) {
        ctx.fillStyle = getColors(x, y);
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }, []);

  return <canvas ref={canvasRef} />;
};
export default Rainbow;
