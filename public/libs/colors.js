let paletteName;
paletteName = "Fans";

const cga = ["#ff55ff", "#55ffff", "#ffffff", "#000000"];
const palettes = [
  {
    name: "Science",
    colors: ["#ffe819", "#000000"],
  },
  {
    name: "Mondrian",
    colors: ["#0a0a0a", "#f7f3f2", "#0077e1", "#f5d216", "#fc3503"],
  },
  {
    name: "1115",
    colors: ["#ffe03d", "#fe4830", "#d33033", "#6d358a", "#1c509e", "#00953c"],
  },
  {
    name: "Jelly",
    colors: ["#102340", "#fe01ec", "#8a07da"],
  },
  {
    name: "Paint",
    colors: ["#b30000", "#e6cf00", "#1283b3", "#fafafa", "#0a0a0a"],
  },
  {
    name: "Cheddar",
    colors: [
      "#ff7b00",
      "#ff8800",
      "#ff9500",
      "#ffa200",
      "#ffaa00",
      "#ffb700",
      "#ffc300",
      "#ffd000",
      "#ffdd00",
      "#ffea00",
    ],
  },
  {
    name: "Morning",
    colors: ["#ffd919", "#262104", "#fffbe6"],
  },
  {
    name: "Evening",
    colors: ["#ff4f19", "#15084d", "#5ce6e6"],
  },
  {
    name: "Brain",
    colors: ["#ee726b", "#ffc5c7", "#fef9c6"],
  },
  {
    name: "Stars",
    colors: ["#0a1966", "#ffef0d", "#fafafa"],
  },
  {
    name: "Marble",
    colors: ["#218ad4", "#76df55", "#0b1435", "#ffffff"],
  },
  {
    name: "Lesson",
    colors: ["#ed225d", "#3caf65", "#0d40bf", "#f5b800", "#2a2a2a"],
  },
  {
    name: "Troll",
    colors: ["#294984", "#6ca0a7", "#ffc789", "#df5f50", "#5a3034", "#fff1dd"],
  },
  {
    name: "Tropical",
    colors: [
      "#3f7373",
      "#4d8c8c",
      "#5ba6a6",
      "#69bfbf",
      "#77d9d9",
      "#f0de84",
      "#c5d419",
      "#63991f",
    ],
  },
  {
    name: "Meta",
    colors: ["#226699", "#dd2e44", "#ffcc4d"],
  },
  {
    name: "Splash",
    colors: ["#32312e", "#795330", "#c7ae82", "#f5f2e3"],
  },
  {
    name: "Sheets",
    colors: [
      "#025760",
      "#7fd0d3",
      "#b3ead7",
      "#eff7F5",
      "#fae9c1",
      "#f8ca75",
      "#e88d44",
    ],
  },
  {
    name: "Her",
    colors: ["#cd1440", "#fafafa"],
  },
  {
    name: "Fans",
    colors: ["#000000", "#83a6bc", "#faece1", "#bab1a8"],
  },
  {
    name: "Escape",
    colors: ["#f3e17e", "#dd483c", "#4b8a5f", "#0d150b", "#faf8e2"],
  },
  {
    name: "Light",
    colors: ["#00b2b4", "#fdd35b", "#3b4696", "#f4737d", "#333333"],
  },
  {
    name: "Freak",
    colors: ["#07224f", "#ed361a", "#fc8405", "#f7c72a"],
  },
  {
    name: "Arcade",
    colors: ["#021d34", "#228fca", "#dcedf0"],
  },
  {
    name: "Play",
    colors: ["#e20404", "#fcd202", "#ffffff", "#000000"],
  },
  {
    name: "Cloudy",
    colors: ["#044e9e", "#6190d3", "#fcf7ed", "#fcd494", "#f4b804"],
  },
  {
    name: "Repetition",
    colors: ["#2c2060", "#4bd3e5", "#fffbe6", "#ffd919", "#ff4f19"],
  },
  {
    name: "Cube",
    colors: ["#fde200", "#ef2626", "#5600ae", "#713df5"],
  },
  {
    name: "Commit",
    colors: ["#563d7c", "#0096d8", "#f4e361", "#f24679"],
  },
  {
    name: "North",
    colors: ["#dc060e", "#ffd400", "#0064b0", "#001a5b", "#ffffff"],
  },
  {
    name: "Flat",
    colors: ["#203051", "#4464a1", "#62b6de", "#b3dce0", "#e2f0f3"],
  },
  {
    name: "Avantgarde",
    colors: [
      "#f398c3",
      "#cf3895",
      "#a0d28d",
      "#06b4b0",
      "#fef45f",
      "#fed000",
      "#0c163f",
    ],
  },
  {
    name: "Edit",
    colors: ["#1c1c1c", "#f47a9d", "#f4ea7a", "#f2f2f2"],
  },
  {
    name: "Wheel",
    colors: ["#ffe140", "#ffa922", "#1bc0c6", "#2484ae", "#134e6e"],
  },
  {
    name: "Left",
    colors: [
      "#070213",
      "#1c0541",
      "#300560",
      "#3e137f",
      "#412287",
      "#3b3d8c",
      "#e6f41c",
    ],
  },
  {
    name: "Connection",
    colors: ["#f24358", "#f2a643", "#f2e343", "#43f278", "#43a0f2", "#c343f2"],
  },
  {
    name: "Wave",
    colors: [
      "#008cff",
      "#0099ff",
      "#00a5ff",
      "#00b2ff",
      "#00bfff",
      "#00cbff",
      "#00d8ff",
      "#00e5ff",
      "#00f2ff",
      "#00ffff",
    ],
  },
  {
    name: "Tek",
    colors: ["#fcf7ed", "#c6c3ba", "#a5a29b", "#fcde97", "#fccf64"],
  },
  {
    name: "Optical",
    colors: [
      "#f2eb8a",
      "#fed000",
      "#fc8405",
      "#ed361a",
      "#e2f0f3",
      "#b3dce0",
      "#4464a1",
      "#203051",
      "#ffc5c7",
      "#f398c3",
      "#cf3895",
      "#6d358a",
      "#06b4b0",
      "#4b8a5f",
    ],
  },
  {
    name: "Homage",
    colors: [
      "#fef9c6",
      "#ffcc4d",
      "#f5b800",
      "#56a1c4",
      "#4464a1",
      "#ee726b",
      "#df5f50",
      "#5a3034",
    ],
  },
  {
    name: "Cube",
    colors: ["#d6d1b4", "#bab397", "#44473f", "#292e2a"],
  },
  {
    name: "Base",
    colors: [
      "#f0f0f0",
      "#8c8c8c",
      "#0f0f0f",
      "#0863d3",
      "#f5d216",
      "#f43809",
      "#08b233",
      "#9913bf",
    ],
  },
  {
    name: "Ten",
    colors: [
      "#fffbe6",
      "#050505",
      "#abcd5e",
      "#29ac9f",
      "#14976b",
      "#b3dce0",
      "#62b6de",
      "#2b67af",
      "#f589a3",
      "#ef562f",
      "#fc8405",
      "#f9d531",
    ],
  },
  {
    name: "Bauhaus1",
    colors: ["#EDEDED", "#154084", "#9D2719", "#D7B418", "#222222"],
  },
  {
    name: "Bauhaus2",
    colors: ["#F2E2C4", "#0477BF", "#F2B705", "#261D11", "#A6290D"],
  },
  {
    name: "Brutalist",
    colors: ["#1A1A1A", "#404040", "#8C8C8C", "#BFBFBF", "#F2F2F2", "#FF3333"],
  },
  {
    name: "Ocean",
    colors: ["#006994", "#00A6FB", "#0582CA", "#006494", "#003554", "#051923"],
  },
  {
    name: "Galaxy",
    colors: ["#191970", "#483D8B", "#9370DB", "#8A2BE2", "#4B0082", "#FFFFFF"],
  },
];

const palettes2 = [
  {
    name: "Midnight",
    colors: ["#191970", "#000080", "#00008B", "#0000CD", "#4169E1", "#1E90FF"],
  },
  {
    name: "Sunrise",
    colors: ["#FF7B00", "#FF8800", "#FF9500", "#FFB700", "#FFC300", "#FFD000"],
  },
  {
    name: "Sunset",
    colors: ["#FF7F50", "#FF6B6B", "#FFA07A", "#FA8072", "#E9967A", "#FFE4E1"],
  },
  {
    name: "Beach",
    colors: ["#FFD700", "#FFB700", "#FFA500", "#FF8C00", "#FF7F00", "#FF6B00"],
  },
];

const monochromePalettes = [
  palettes.find((p) => p.name === "Cube"),
  palettes.find((p) => p.name === "Wave"),
  palettes.find((p) => p.name === "Flat"),
  palettes.find((p) => p.name === "Her"),
  palettes.find((p) => p.name === "Cheddar"),
];

let PALETTE;
function randomPalette() {
  let p = palettes[Math.floor(Math.random() * palettes.length)];
  PALETTE = p.colors;
  console.log("PALETTE", p.name);
  return p.colors;
}

function randomMonochromePalette() {
  let p =
    monochromePalettes[Math.floor(Math.random() * monochromePalettes.length)];
  PALETTE = p.colors;
  console.log("PALETTE", p.name);
}

function randomPalette2() {
  let p = palettes2[Math.floor(Math.random() * palettes2.length)];
  PALETTE = p.colors;
  console.log("PALETTE", p.name);
  return p.colors;
}

function setPalette(name) {
  paletteName = name;
  PALETTE = palettes.find((p) => p.name === name).colors;
  console.log("PALETTE", paletteName);
}
if (paletteName) {
  PALETTE = palettes.find((p) => p.name == paletteName).colors;
} else {
  randomPalette();
}

function setPalette2(name) {
  PALETTE = palettes2.find((p) => p.name == name).colors;
  console.log("PALETTE", name);
}

function randomColorForSeed(obj) {
  if (!obj._randomColorSeed) {
    obj._randomColorSeed = floor(random(1000000));
  }

  randomSeed(obj._randomColorSeed);
  const index = floor(random(PALETTE.length));
  return PALETTE[index];
}

randomPalette();
