const form = document.querySelector("#flow-form");
const settingsForm = document.querySelector("#settings-form");
const printReportButton = document.querySelector("#printReportButton");
const downloadTextReportButton = document.querySelector("#downloadTextReportButton");
const reportDocument = document.querySelector("#reportDocument");
const startPage = document.querySelector("#startPage");
const viewToggle = document.querySelector(".view-toggle");
const restartButton = document.querySelector("#restartButton");
const resultsPanel = document.querySelector("#resultsPanel");
const modeButtons = document.querySelectorAll(".mode-button");
const startButtons = document.querySelectorAll(".start-button");
const viewButtons = document.querySelectorAll(".view-button");
const pageViews = document.querySelectorAll(".page-view");
const gasOnlyElements = document.querySelectorAll(".gas-only");
const liquidOnlyElements = document.querySelectorAll(".liquid-only");
const waterDensityInputElements = document.querySelectorAll(".water-density-input");
const manualDensityInputElements = document.querySelectorAll(".manual-density-input");
const calculatedGasDensityInputElements = document.querySelectorAll(".calculated-gas-density-input");
const orificeDiameterInputElements = document.querySelectorAll(".orifice-diameter-input");
const betaInputElements = document.querySelectorAll(".beta-input");
const standardPipeInputElements = document.querySelectorAll(".standard-pipe-input");
const knownFlowInputElements = document.querySelectorAll(".known-flow-input");
const knownPressureInputElements = document.querySelectorAll(".known-pressure-input");
const knownBoreInputElements = document.querySelectorAll(".known-bore-input");
const manualDischargeCoefficientInputElements = document.querySelectorAll(".manual-discharge-coefficient-input");
const warningsList = document.querySelector("#warnings");

let mode = "liquid";
let unitSystem = "imperial";

const lengthToMeters = {
  mm: 0.001,
  m: 1,
  in: 0.0254,
  ft: 0.3048
};

const pressureToPascal = {
  Pa: 1,
  kPa: 1000,
  bar: 100000,
  psi: 6894.757293,
  psia: 6894.757293,
  kPaAbs: 1000,
  barAbs: 100000,
  inH2O: 249.08891
};

const densityToKgm3 = {
  kgm3: 1,
  lbft3: 16.01846337
};

const kgm3ToLbft3 = 0.0624279606;
const kgpsToLbhr = 7936.641438;
const molarMassAir = 0.0289647;
const universalGasConstant = 8.314462618;

const standardPipes = {
  "2": { odMm: 60.3, schedules: { "10": 2.77, "40": 3.91, "80": 5.54, "160": 8.74 } },
  "2-1/2": { odMm: 73.0, schedules: { "10": 3.05, "40": 5.16, "80": 7.01, "160": 9.53 } },
  "3": { odMm: 88.9, schedules: { "10": 3.05, "40": 5.49, "80": 7.62, "160": 11.13 } },
  "3-1/2": { odMm: 101.6, schedules: { "10": 3.05, "40": 5.74, "80": 8.08 } },
  "4": { odMm: 114.3, schedules: { "10": 3.05, "40": 6.02, "80": 8.56, "120": 11.13, "160": 13.49 } },
  "5": { odMm: 141.3, schedules: { "10": 3.40, "40": 6.55, "80": 9.53, "120": 12.70, "160": 15.88 } },
  "6": { odMm: 168.3, schedules: { "10": 3.40, "40": 7.11, "80": 10.97, "120": 14.27, "160": 18.26 } },
  "8": { odMm: 219.1, schedules: { "10": 3.76, "20": 6.35, "30": 7.04, "40": 8.18, "60": 10.31, "80": 12.70, "100": 15.09, "120": 18.26, "140": 20.62, "160": 23.01 } },
  "10": { odMm: 273.0, schedules: { "10": 4.19, "20": 6.35, "30": 7.80, "40": 9.27, "60": 12.70, "80": 15.09, "100": 18.26, "120": 21.44, "140": 25.40, "160": 28.58 } },
  "12": { odMm: 323.8, schedules: { "10": 4.57, "20": 6.35, "30": 8.38, "40": 10.31, "60": 14.27, "80": 17.48, "100": 21.44, "120": 25.40, "140": 28.58, "160": 33.32 } },
  "14": { odMm: 355.6, schedules: { "10": 4.78, "20": 7.92, "30": 9.53, "40": 11.13, "60": 15.09, "80": 19.05, "100": 23.83, "120": 27.79, "140": 31.75, "160": 35.71 } },
  "16": { odMm: 406.4, schedules: { "10": 4.78, "20": 7.92, "30": 9.53, "40": 12.70, "60": 16.66, "80": 21.44, "100": 26.19, "120": 30.96, "140": 36.53, "160": 40.49 } },
  "18": { odMm: 457.2, schedules: { "10": 4.78, "20": 7.92, "30": 11.13, "40": 14.27, "60": 19.05, "80": 23.83, "100": 29.36, "120": 34.93, "140": 39.67, "160": 45.24 } },
  "20": { odMm: 508.0, schedules: { "10": 5.54, "20": 9.53, "30": 12.70, "40": 15.09, "60": 20.62, "80": 26.19, "100": 32.54, "120": 38.10, "140": 44.45, "160": 50.01 } },
  "22": { odMm: 558.8, schedules: { "10": 5.54, "20": 9.53, "30": 12.70, "60": 22.23, "80": 28.58, "100": 34.93, "120": 41.28, "140": 47.63, "160": 53.98 } },
  "24": { odMm: 609.6, schedules: { "10": 6.35, "20": 9.53, "30": 14.27, "40": 17.48, "60": 24.61, "80": 30.96, "100": 38.89, "120": 46.02, "140": 52.37, "160": 59.54 } }
};

const flowUnits = {
  m3s: {
    label: "m3/s",
    convert: ({ volumeFlow }) => volumeFlow
  },
  m3h: {
    label: "m3/h",
    convert: ({ volumeFlow }) => volumeFlow * 3600
  },
  gpm: {
    label: "gpm",
    convert: ({ volumeFlow }) => volumeFlow * 15850.323141
  },
  cfm: {
    label: "ft3/min",
    convert: ({ volumeFlow }) => volumeFlow * 2118.880003
  },
  ft3h: {
    label: "ft3/hr",
    convert: ({ volumeFlow }) => volumeFlow * 127132.8002
  },
  ft3s: {
    label: "ft3/sec",
    convert: ({ volumeFlow }) => volumeFlow * 35.31466672
  },
  scfh: {
    label: "SCFH",
    convert: ({ standardVolumeFlow }) => standardVolumeFlow * 127132.8002
  },
  scfm: {
    label: "SCFM",
    convert: ({ standardVolumeFlow }) => standardVolumeFlow * 2118.880003
  },
  mscfd: {
    label: "MSCFD",
    convert: ({ standardVolumeFlow }) => standardVolumeFlow * 3051.187205
  },
  kgps: {
    label: "kg/s",
    convert: ({ massFlow }) => massFlow
  },
  lbhr: {
    label: "lb/hr",
    convert: ({ massFlow }) => massFlow * 7936.641438
  }
};

const actualVolumeFlowUnits = new Set(["m3s", "m3h", "gpm", "cfm", "ft3s", "ft3h"]);
const massFlowUnits = new Set(["kgps", "lbhr"]);
const standardVolumeFlowUnits = new Set(["scfh", "scfm", "mscfd"]);

const fields = {
  calculationType: document.querySelector("#calculationType"),
  pipeInputMode: document.querySelector("#pipeInputMode"),
  nominalPipeSize: document.querySelector("#nominalPipeSize"),
  pipeSchedule: document.querySelector("#pipeSchedule"),
  pipeDiameter: document.querySelector("#pipeDiameter"),
  pipeDiameterUnit: document.querySelector("#pipeDiameterUnit"),
  orificeInputMode: document.querySelector("#orificeInputMode"),
  orificeDiameter: document.querySelector("#orificeDiameter"),
  orificeDiameterUnit: document.querySelector("#orificeDiameterUnit"),
  betaRatioInput: document.querySelector("#betaRatioInput"),
  gasDischargeCoefficientSource: document.querySelector("#gasDischargeCoefficientSource"),
  dischargeCoefficient: document.querySelector("#dischargeCoefficient"),
  deltaPressure: document.querySelector("#deltaPressure"),
  deltaPressureUnit: document.querySelector("#deltaPressureUnit"),
  knownFlow: document.querySelector("#knownFlow"),
  knownFlowUnit: document.querySelector("#knownFlowUnit"),
  liquidDensitySource: document.querySelector("#liquidDensitySource"),
  waterTemperature: document.querySelector("#waterTemperature"),
  waterTemperatureUnit: document.querySelector("#waterTemperatureUnit"),
  density: document.querySelector("#density"),
  densityUnit: document.querySelector("#densityUnit"),
  gasDensitySource: document.querySelector("#gasDensitySource"),
  gasTemperature: document.querySelector("#gasTemperature"),
  gasTemperatureUnit: document.querySelector("#gasTemperatureUnit"),
  gasSpecificGravity: document.querySelector("#gasSpecificGravity"),
  basePressure: document.querySelector("#basePressure"),
  basePressureUnit: document.querySelector("#basePressureUnit"),
  baseTemperature: document.querySelector("#baseTemperature"),
  baseTemperatureUnit: document.querySelector("#baseTemperatureUnit"),
  baseCompressibility: document.querySelector("#baseCompressibility"),
  upstreamPressure: document.querySelector("#upstreamPressure"),
  upstreamPressureUnit: document.querySelector("#upstreamPressureUnit"),
  specificHeatRatio: document.querySelector("#specificHeatRatio"),
  unitSystem: document.querySelector("#unitSystem"),
  volumeFlowUnit: document.querySelector("#volumeFlowUnit"),
  massFlowUnit: document.querySelector("#massFlowUnit"),
  precision: document.querySelector("#precision")
};

const output = {
  primaryResultLabel: document.querySelector("#primaryResultLabel"),
  flowValue: document.querySelector("#flowValue"),
  flowUnitLabel: document.querySelector("#flowUnitLabel"),
  betaValue: document.querySelector("#betaValue"),
  calculatedCdValue: document.querySelector("#calculatedCdValue"),
  expansionValue: document.querySelector("#expansionValue"),
  massFlowValue: document.querySelector("#massFlowValue"),
  velocityValue: document.querySelector("#velocityValue"),
  calculatedDeltaPressureValue: document.querySelector("#calculatedDeltaPressureValue"),
  calculatedBoreValue: document.querySelector("#calculatedBoreValue"),
  liquidDensityValue: document.querySelector("#liquidDensityValue"),
  waterViscosityValue: document.querySelector("#waterViscosityValue"),
  gasDensityValue: document.querySelector("#gasDensityValue"),
  baseDensityValue: document.querySelector("#baseDensityValue"),
  gasViscosityValue: document.querySelector("#gasViscosityValue"),
  reynoldsValue: document.querySelector("#reynoldsValue"),
  formulaText: document.querySelector("#formulaText")
};

let currentCalculation = {};

function isCalculationNote(message) {
  return [
    "Liquid result assumes",
    "Liquid viscosity is calculated",
    "Actual volumetric gas flow uses",
    "Flowing natural gas density uses",
    "Base density uses",
    "Gas viscosity is estimated",
    "Gas Cd is calculated"
  ].some((prefix) => message.startsWith(prefix));
}

function readNumber(field) {
  return Number.parseFloat(field.value);
}

function format(value, precision = 2) {
  if (!Number.isFinite(value)) {
    return "-";
  }

  return value.toLocaleString(undefined, {
    maximumFractionDigits: precision,
    minimumFractionDigits: precision
  });
}

function selectedText(select) {
  return select.options[select.selectedIndex]?.textContent || select.value;
}

function calculationTypeText() {
  const activeButton = Array.from(startButtons).find((button) => button.dataset.calculationType === fields.calculationType.value);
  return activeButton?.textContent || fields.calculationType.value;
}

function inputWithUnit(input, unitSelect) {
  return `${input.value} ${selectedText(unitSelect)}`;
}

function pressureDisplay(valuePa) {
  return `${format(valuePa / pressureToPascal[fields.deltaPressureUnit.value], readNumber(fields.precision) || 2)} ${selectedText(fields.deltaPressureUnit)}`;
}

function lengthDisplay(valueM) {
  return `${format(valueM / lengthToMeters[fields.orificeDiameterUnit.value], 3)} ${selectedText(fields.orificeDiameterUnit)}`;
}

function addReportRows(tableBody, rows) {
  rows.forEach(([label, value]) => {
    const row = document.createElement("tr");
    const heading = document.createElement("th");
    const cell = document.createElement("td");
    heading.textContent = label;
    cell.textContent = value;
    row.append(heading, cell);
    tableBody.append(row);
  });
}

function createReportTable(title, rows) {
  const section = document.createElement("section");
  const heading = document.createElement("h2");
  const table = document.createElement("table");
  const body = document.createElement("tbody");

  section.className = "report-section";
  table.className = "report-table";
  heading.textContent = title;
  addReportRows(body, rows);
  table.append(body);
  section.append(heading, table);
  return section;
}

function reportData() {
  calculate();
  const warnings = currentCalculation.warningMessages || [];
  const geometryRows = [
    ["Calculation type", calculationTypeText()],
    ["Pipe input", selectedText(fields.pipeInputMode)],
    ["Pipe inside diameter", inputWithUnit(fields.pipeDiameter, fields.pipeDiameterUnit)]
  ];

  if (fields.pipeInputMode.value === "ansi") {
    geometryRows.splice(1, 0, ["Nominal pipe size", selectedText(fields.nominalPipeSize)], ["Pipe schedule", selectedText(fields.pipeSchedule)]);
  }

  if (fields.calculationType.value !== "bore") {
    geometryRows.push(["Orifice input", selectedText(fields.orificeInputMode)]);
    if (fields.orificeInputMode.value === "beta") {
      geometryRows.push(["Input beta ratio", fields.betaRatioInput.value]);
    } else {
      geometryRows.push(["Orifice bore diameter", inputWithUnit(fields.orificeDiameter, fields.orificeDiameterUnit)]);
    }
  }

  if (mode === "gas") {
    geometryRows.push(["Cd source", selectedText(fields.gasDischargeCoefficientSource)]);
  } else {
    geometryRows.push(["Manual Cd", fields.dischargeCoefficient.value]);
  }

  const processRows = [
    ["Fluid mode", mode === "gas" ? "Gas" : "Liquid"]
  ];

  if (fields.calculationType.value !== "pressure") {
    processRows.push(["Differential pressure", inputWithUnit(fields.deltaPressure, fields.deltaPressureUnit)]);
  }
  if (fields.calculationType.value !== "flow") {
    processRows.push(["Flowrate", inputWithUnit(fields.knownFlow, fields.knownFlowUnit)]);
  }

  if (mode === "gas") {
    processRows.push(
      ["Gas density source", selectedText(fields.gasDensitySource)],
      ["Upstream pressure", inputWithUnit(fields.upstreamPressure, fields.upstreamPressureUnit)],
      ["Gas temperature", inputWithUnit(fields.gasTemperature, fields.gasTemperatureUnit)],
      ["Specific gravity", fields.gasSpecificGravity.value],
      ["Specific heat ratio", fields.specificHeatRatio.value]
    );
    if (fields.gasDensitySource.value === "manual") {
      processRows.push(["Manual gas density", inputWithUnit(fields.density, fields.densityUnit)]);
    }
  } else {
    processRows.push(
      ["Liquid density source", selectedText(fields.liquidDensitySource)],
      ["Water temperature", inputWithUnit(fields.waterTemperature, fields.waterTemperatureUnit)]
    );
    if (fields.liquidDensitySource.value === "manual") {
      processRows.push(["Manual liquid density", inputWithUnit(fields.density, fields.densityUnit)]);
    }
  }

  const settingsRows = [
    ["Unit system", selectedText(fields.unitSystem)],
    ["Volume flow units", selectedText(fields.volumeFlowUnit)],
    ["Mass flow units", selectedText(fields.massFlowUnit)],
    ["Decimal places", fields.precision.value],
    ["Base pressure", inputWithUnit(fields.basePressure, fields.basePressureUnit)],
    ["Base temperature", inputWithUnit(fields.baseTemperature, fields.baseTemperatureUnit)],
    ["Base compressibility", fields.baseCompressibility.value]
  ];

  const resultRows = [
    [output.primaryResultLabel.textContent, `${output.flowValue.textContent} ${output.flowUnitLabel.textContent}`],
    ["Beta ratio", output.betaValue.textContent],
    ["Differential pressure", output.calculatedDeltaPressureValue.textContent],
    ["Orifice bore", output.calculatedBoreValue.textContent],
    ["Mass flow", output.massFlowValue.textContent],
    ["Pipe velocity", output.velocityValue.textContent],
    ["Reynolds number", output.reynoldsValue.textContent]
  ];

  if (mode === "gas") {
    resultRows.push(
      ["Cd", output.calculatedCdValue.textContent],
      ["Expansion factor", output.expansionValue.textContent],
      ["Gas density", output.gasDensityValue.textContent],
      ["Base density", output.baseDensityValue.textContent],
      ["Gas viscosity", output.gasViscosityValue.textContent]
    );
  } else {
    resultRows.push(
      ["Liquid density", output.liquidDensityValue.textContent],
      ["Water viscosity", output.waterViscosityValue.textContent]
    );
  }

  return {
    generatedAt: new Date().toLocaleString(),
    geometryRows,
    processRows,
    resultRows,
    settingsRows,
    warnings,
    notes: output.formulaText.textContent
  };
}

function convertInputValue(input, fromUnit, toUnit, toBase, fromBase) {
  const value = readNumber(input);
  if (!Number.isFinite(value) || fromUnit === toUnit) {
    return;
  }
  input.value = format(fromBase(value, fromUnit) / toBase[toUnit], 6).replace(/,/g, "");
}

function convertTemperatureInput(input, fromUnit, toUnit) {
  const value = readNumber(input);
  if (!Number.isFinite(value) || fromUnit === toUnit) {
    return;
  }
  const temperatureC = convertTemperatureToCelsius(value, fromUnit);
  input.value = format(toUnit === "F" ? temperatureC * 9 / 5 + 32 : temperatureC, 4).replace(/,/g, "");
}

function initializeStandardPipeSelectors() {
  fields.nominalPipeSize.replaceChildren(
    ...Object.keys(standardPipes).map((nps) => {
      const option = document.createElement("option");
      option.value = nps;
      option.textContent = `${nps}"`;
      return option;
    })
  );
  fields.nominalPipeSize.value = "4";
  updatePipeScheduleOptions();
}

function updatePipeScheduleOptions() {
  const pipe = standardPipes[fields.nominalPipeSize.value];
  const previousSchedule = fields.pipeSchedule.value;
  const schedules = Object.keys(pipe.schedules);
  fields.pipeSchedule.replaceChildren(
    ...schedules.map((schedule) => {
      const option = document.createElement("option");
      option.value = schedule;
      option.textContent = `Sch ${schedule}`;
      return option;
    })
  );
  fields.pipeSchedule.value = schedules.includes(previousSchedule)
    ? previousSchedule
    : schedules.includes("40")
      ? "40"
      : schedules[0];
}

function updateStandardPipeDiameter() {
  if (fields.pipeInputMode.value !== "ansi") {
    fields.pipeDiameter.readOnly = false;
    return;
  }

  const pipe = standardPipes[fields.nominalPipeSize.value];
  const wallMm = pipe.schedules[fields.pipeSchedule.value];
  const insideDiameterMeters = (pipe.odMm - 2 * wallMm) / 1000;

  fields.pipeDiameter.readOnly = true;
  fields.pipeDiameter.value = (insideDiameterMeters / lengthToMeters[fields.pipeDiameterUnit.value]).toFixed(3);
}

function setDefaultFlowUnit() {
  if (mode === "gas") {
    fields.volumeFlowUnit.value = unitSystem === "imperial" ? "ft3s" : "m3s";
    fields.massFlowUnit.value = unitSystem === "imperial" ? "lbhr" : "kgps";
    fields.knownFlowUnit.value = fields.volumeFlowUnit.value;
    return;
  }
  fields.volumeFlowUnit.value = unitSystem === "imperial" ? "gpm" : "m3h";
  fields.massFlowUnit.value = unitSystem === "imperial" ? "lbhr" : "kgps";
  fields.knownFlowUnit.value = fields.volumeFlowUnit.value;
}

function applyUnitSystem(nextSystem, convertValues = true) {
  const previousSystem = unitSystem;
  unitSystem = nextSystem;
  fields.unitSystem.value = unitSystem;

  const targets = unitSystem === "imperial"
    ? {
        length: "in",
        deltaPressure: "inH2O",
        absolutePressure: "psia",
        temperature: "F",
        density: "lbft3"
      }
    : {
        length: "mm",
        deltaPressure: "kPa",
        absolutePressure: "kPaAbs",
        temperature: "C",
        density: "kgm3"
      };

  if (convertValues && previousSystem !== unitSystem) {
    convertInputValue(fields.pipeDiameter, fields.pipeDiameterUnit.value, targets.length, lengthToMeters, (value, unit) => value * lengthToMeters[unit]);
    convertInputValue(fields.orificeDiameter, fields.orificeDiameterUnit.value, targets.length, lengthToMeters, (value, unit) => value * lengthToMeters[unit]);
    convertInputValue(fields.deltaPressure, fields.deltaPressureUnit.value, targets.deltaPressure, pressureToPascal, (value, unit) => value * pressureToPascal[unit]);
    convertInputValue(fields.density, fields.densityUnit.value, targets.density, densityToKgm3, (value, unit) => value * densityToKgm3[unit]);
    convertInputValue(fields.upstreamPressure, fields.upstreamPressureUnit.value, targets.absolutePressure, pressureToPascal, (value, unit) => value * pressureToPascal[unit]);
    convertInputValue(fields.basePressure, fields.basePressureUnit.value, targets.absolutePressure, pressureToPascal, (value, unit) => value * pressureToPascal[unit]);
    convertTemperatureInput(fields.waterTemperature, fields.waterTemperatureUnit.value, targets.temperature);
    convertTemperatureInput(fields.gasTemperature, fields.gasTemperatureUnit.value, targets.temperature);
    convertTemperatureInput(fields.baseTemperature, fields.baseTemperatureUnit.value, targets.temperature);
  }

  fields.pipeDiameterUnit.value = targets.length;
  fields.orificeDiameterUnit.value = targets.length;
  fields.deltaPressureUnit.value = targets.deltaPressure;
  fields.densityUnit.value = targets.density;
  fields.upstreamPressureUnit.value = targets.absolutePressure;
  fields.basePressureUnit.value = targets.absolutePressure;
  fields.waterTemperatureUnit.value = targets.temperature;
  fields.gasTemperatureUnit.value = targets.temperature;
  fields.baseTemperatureUnit.value = targets.temperature;
  updateStandardPipeDiameter();
  setDefaultFlowUnit();
}

function setMode(nextMode) {
  mode = nextMode;
  setDefaultFlowUnit();
  updateInputVisibility();
  calculate();
}

function setCalculationType(nextType) {
  fields.calculationType.value = nextType;
  updateInputVisibility();
  calculate();
}

function showStartPage() {
  startPage.classList.remove("hidden");
  viewToggle.classList.add("hidden");
  resultsPanel.classList.add("hidden");
  pageViews.forEach((view) => view.classList.add("hidden"));
}

function showCalculatorPage() {
  startPage.classList.add("hidden");
  viewToggle.classList.remove("hidden");
  resultsPanel.classList.remove("hidden");
  setView("calculator");
}

function setView(nextView) {
  viewButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.view === nextView);
  });
  pageViews.forEach((view) => {
    view.classList.toggle("hidden", view.dataset.page !== nextView);
  });
}

function updateInputVisibility() {
  const calculationType = fields.calculationType.value;
  const usesWaterDensity = mode === "liquid" && fields.liquidDensitySource.value === "water";
  const usesCalculatedGasDensity = mode === "gas" && fields.gasDensitySource.value === "naturalGas";
  const usesManualDensity = (mode === "liquid" && fields.liquidDensitySource.value === "manual")
    || (mode === "gas" && fields.gasDensitySource.value === "manual");
  const usesBetaInput = fields.orificeInputMode.value === "beta";
  const usesCalculatedGasCd = mode === "gas" && fields.gasDischargeCoefficientSource.value === "aga3Flange";
  const usesStandardPipe = fields.pipeInputMode.value === "ansi";
  const needsKnownFlow = calculationType !== "flow";
  const needsKnownPressure = calculationType !== "pressure";
  const needsKnownBore = calculationType !== "bore";

  modeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === mode);
  });
  gasOnlyElements.forEach((element) => {
    element.classList.toggle("hidden", mode !== "gas");
  });
  liquidOnlyElements.forEach((element) => {
    element.classList.toggle("hidden", mode !== "liquid");
  });
  waterDensityInputElements.forEach((element) => {
    element.classList.toggle("hidden", !usesWaterDensity);
  });
  manualDensityInputElements.forEach((element) => {
    element.classList.toggle("hidden", !usesManualDensity);
  });
  calculatedGasDensityInputElements.forEach((element) => {
    element.classList.toggle("hidden", !usesCalculatedGasDensity);
  });
  standardPipeInputElements.forEach((element) => {
    element.classList.toggle("hidden", !usesStandardPipe);
  });
  knownFlowInputElements.forEach((element) => {
    element.classList.toggle("hidden", !needsKnownFlow);
  });
  knownPressureInputElements.forEach((element) => {
    element.classList.toggle("hidden", !needsKnownPressure);
  });
  knownBoreInputElements.forEach((element) => {
    element.classList.toggle("hidden", !needsKnownBore);
  });
  orificeDiameterInputElements.forEach((element) => {
    element.classList.toggle("hidden", !needsKnownBore || usesBetaInput);
  });
  betaInputElements.forEach((element) => {
    element.classList.toggle("hidden", !needsKnownBore || !usesBetaInput);
  });
  manualDischargeCoefficientInputElements.forEach((element) => {
    element.classList.toggle("hidden", usesCalculatedGasCd);
  });
  updateStandardPipeDiameter();
}

function convertTemperatureToCelsius(temperature, unit) {
  return unit === "F" ? (temperature - 32) * 5 / 9 : temperature;
}

function calculateWaterDensity(temperatureC) {
  return 1000 * (1 - ((temperatureC + 288.9414) / (508929.2 * (temperatureC + 68.12963))) * Math.pow(temperatureC - 3.9863, 2));
}

function calculateWaterViscosity(temperatureC) {
  return 2.414e-5 * Math.pow(10, 247.8 / (temperatureC + 133.15));
}

function calculateNaturalGasDensity(pressure, temperatureC, specificGravity, compressibility = 1) {
  const temperatureK = temperatureC + 273.15;
  return specificGravity * molarMassAir * pressure / (compressibility * universalGasConstant * temperatureK);
}

function calculateNaturalGasViscosity(temperatureC, specificGravity, density) {
  const temperatureR = (temperatureC + 273.15) * 9 / 5;
  const molecularWeight = 28.967 * specificGravity;
  const densityGcm3 = density / 1000;
  const k = ((9.379 + 0.01607 * molecularWeight) * Math.pow(temperatureR, 1.5))
    / (209.2 + 19.26 * molecularWeight + temperatureR);
  const x = 3.448 + 986.4 / temperatureR + 0.01009 * molecularWeight;
  const y = 2.447 - 0.2224 * x;
  return 0.0001 * k * Math.exp(x * Math.pow(densityGcm3, y));
}

function calculateExpansionFactor(beta, deltaPressure, upstreamPressure, specificHeatRatio) {
  const beta4 = Math.pow(beta, 4);
  const beta8 = Math.pow(beta, 8);
  const pressureRatio = deltaPressure / (specificHeatRatio * upstreamPressure);
  return 1 - (0.351 + 0.256 * beta4 + 0.93 * beta8) * pressureRatio;
}

function calculateAga3FlangeDischargeCoefficient(beta, reynoldsNumber, pipeDiameter) {
  const pipeDiameterMm = pipeDiameter * 1000;
  const l1 = 25.4 / pipeDiameterMm;
  const l2Prime = 25.4 / pipeDiameterMm;
  const a = Math.pow(19000 * beta / reynoldsNumber, 0.8);
  const m2Prime = 2 * l2Prime / (1 - beta);
  const smallPipeTerm = pipeDiameterMm < 71.12
    ? 0.011 * (0.75 - beta) * (2.8 - pipeDiameterMm / 25.4)
    : 0;

  return 0.5961
    + 0.0261 * Math.pow(beta, 2)
    - 0.216 * Math.pow(beta, 8)
    + 0.000521 * Math.pow(1000000 * beta / reynoldsNumber, 0.7)
    + (0.0188 + 0.0063 * a) * Math.pow(beta, 3.5) * Math.pow(1000000 / reynoldsNumber, 0.3)
    + (0.043 + 0.080 * Math.exp(-10 * l1) - 0.123 * Math.exp(-7 * l1))
      * (1 - 0.11 * a) * Math.pow(beta, 4) / (1 - Math.pow(beta, 4))
    - 0.031 * (m2Prime - 0.8 * Math.pow(m2Prime, 1.1)) * Math.pow(beta, 1.3)
    + smallPipeTerm;
}

function flowInputToInternal(value, unit, density, baseDensity, warnings) {
  if (!Number.isFinite(value)) {
    return { volumeFlow: Number.NaN, massFlow: Number.NaN, standardVolumeFlow: Number.NaN };
  }

  if (actualVolumeFlowUnits.has(unit)) {
    const volumeFlow = value / flowUnits[unit].convert({ volumeFlow: 1 });
    return {
      volumeFlow,
      massFlow: volumeFlow * density,
      standardVolumeFlow: mode === "gas" && baseDensity > 0 ? volumeFlow * density / baseDensity : Number.NaN
    };
  }

  if (massFlowUnits.has(unit)) {
    const massFlow = unit === "kgps" ? value : value / kgpsToLbhr;
    return {
      volumeFlow: density > 0 ? massFlow / density : Number.NaN,
      massFlow,
      standardVolumeFlow: mode === "gas" && baseDensity > 0 ? massFlow / baseDensity : Number.NaN
    };
  }

  if (standardVolumeFlowUnits.has(unit)) {
    const standardVolumeFlow = value / flowUnits[unit].convert({ standardVolumeFlow: 1 });
    if (mode !== "gas") {
      warnings.push("Standard volume flow units are intended for gas calculations.");
    }
    const massFlow = baseDensity > 0 ? standardVolumeFlow * baseDensity : Number.NaN;
    return {
      volumeFlow: density > 0 ? massFlow / density : Number.NaN,
      massFlow,
      standardVolumeFlow
    };
  }

  return { volumeFlow: Number.NaN, massFlow: Number.NaN, standardVolumeFlow: Number.NaN };
}

function solvePressureForFlow(targetVolumeFlow, orificeDiameter, pipeDiameter, density, viscosity, expansionInputs, usesCalculatedGasCd, manualCd) {
  const beta = orificeDiameter / pipeDiameter;
  const betaFactor = 1 - Math.pow(beta, 4);
  const orificeArea = Math.PI * Math.pow(orificeDiameter, 2) / 4;
  const pipeArea = Math.PI * Math.pow(pipeDiameter, 2) / 4;
  const reynoldsNumber = density * (targetVolumeFlow / pipeArea) * pipeDiameter / viscosity;
  const calculatedCd = usesCalculatedGasCd
    ? calculateAga3FlangeDischargeCoefficient(beta, reynoldsNumber, pipeDiameter)
    : manualCd;
  let expansionFactor = 1;
  let deltaPressure = Math.pow(targetVolumeFlow / (calculatedCd * orificeArea), 2) * density * betaFactor / 2;

  if (mode === "gas") {
    for (let i = 0; i < 30; i += 1) {
      expansionFactor = calculateExpansionFactor(beta, deltaPressure, expansionInputs.upstreamPressure, expansionInputs.specificHeatRatio);
      const nextDeltaPressure = Math.pow(targetVolumeFlow / (calculatedCd * expansionFactor * orificeArea), 2) * density * betaFactor / 2;
      if (Math.abs(nextDeltaPressure - deltaPressure) < 0.01) {
        deltaPressure = nextDeltaPressure;
        break;
      }
      deltaPressure = nextDeltaPressure;
    }
  }

  return { calculatedCd, deltaPressure, expansionFactor, reynoldsNumber };
}

function forwardFlow(deltaPressure, orificeDiameter, pipeDiameter, density, viscosity, expansionInputs, usesCalculatedGasCd, manualCd) {
  const beta = orificeDiameter / pipeDiameter;
  const betaFactor = 1 - Math.pow(beta, 4);
  const orificeArea = Math.PI * Math.pow(orificeDiameter, 2) / 4;
  const pipeArea = Math.PI * Math.pow(pipeDiameter, 2) / 4;
  let expansionFactor = mode === "gas"
    ? calculateExpansionFactor(beta, deltaPressure, expansionInputs.upstreamPressure, expansionInputs.specificHeatRatio)
    : 1;
  let calculatedCd = manualCd;
  let volumeFlow = Number.NaN;
  let reynoldsNumber = Number.NaN;

  if (usesCalculatedGasCd) {
    calculatedCd = 0.6;
    for (let i = 0; i < 20; i += 1) {
      volumeFlow = calculatedCd * expansionFactor * orificeArea * Math.sqrt((2 * deltaPressure) / (density * betaFactor));
      reynoldsNumber = density * (volumeFlow / pipeArea) * pipeDiameter / viscosity;
      const nextCd = calculateAga3FlangeDischargeCoefficient(beta, reynoldsNumber, pipeDiameter);
      if (!Number.isFinite(nextCd) || Math.abs(nextCd - calculatedCd) < 0.000001) {
        calculatedCd = Number.isFinite(nextCd) ? nextCd : calculatedCd;
        break;
      }
      calculatedCd = nextCd;
    }
  }

  volumeFlow = calculatedCd * expansionFactor * orificeArea * Math.sqrt((2 * deltaPressure) / (density * betaFactor));
  reynoldsNumber = density * (volumeFlow / pipeArea) * pipeDiameter / viscosity;
  return { calculatedCd, expansionFactor, reynoldsNumber, volumeFlow };
}

function solveBoreForFlow(targetVolumeFlow, deltaPressure, pipeDiameter, density, viscosity, expansionInputs, usesCalculatedGasCd, manualCd) {
  let low = pipeDiameter * 0.01;
  let high = pipeDiameter * 0.99;
  let best = Number.NaN;
  let highFlow = forwardFlow(deltaPressure, high, pipeDiameter, density, viscosity, expansionInputs, usesCalculatedGasCd, manualCd).volumeFlow;

  if (!Number.isFinite(highFlow) || highFlow < targetVolumeFlow) {
    return { orificeDiameter: Number.NaN, solved: false };
  }

  for (let i = 0; i < 60; i += 1) {
    const mid = (low + high) / 2;
    const result = forwardFlow(deltaPressure, mid, pipeDiameter, density, viscosity, expansionInputs, usesCalculatedGasCd, manualCd);
    best = mid;
    if (Math.abs(result.volumeFlow - targetVolumeFlow) / targetVolumeFlow < 0.000001) {
      break;
    }
    if (result.volumeFlow > targetVolumeFlow) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return { orificeDiameter: best, solved: Number.isFinite(best) };
}

function calculate() {
  const precision = Math.max(0, Math.min(6, Math.round(readNumber(fields.precision) || 0)));
  const calculationType = fields.calculationType.value;
  const pipeDiameter = readNumber(fields.pipeDiameter) * lengthToMeters[fields.pipeDiameterUnit.value];
  const betaInput = readNumber(fields.betaRatioInput);
  const usesBetaInput = fields.orificeInputMode.value === "beta";
  const inputOrificeDiameter = usesBetaInput
    ? betaInput * pipeDiameter
    : readNumber(fields.orificeDiameter) * lengthToMeters[fields.orificeDiameterUnit.value];
  const dischargeCoefficient = readNumber(fields.dischargeCoefficient);
  let deltaPressure = readNumber(fields.deltaPressure) * pressureToPascal[fields.deltaPressureUnit.value];
  const waterTemperatureC = convertTemperatureToCelsius(readNumber(fields.waterTemperature), fields.waterTemperatureUnit.value);
  const upstreamPressure = readNumber(fields.upstreamPressure) * pressureToPascal[fields.upstreamPressureUnit.value];
  const gasTemperatureC = convertTemperatureToCelsius(readNumber(fields.gasTemperature), fields.gasTemperatureUnit.value);
  const gasSpecificGravity = readNumber(fields.gasSpecificGravity);
  const basePressure = readNumber(fields.basePressure) * pressureToPascal[fields.basePressureUnit.value];
  const baseTemperatureC = convertTemperatureToCelsius(readNumber(fields.baseTemperature), fields.baseTemperatureUnit.value);
  const baseCompressibility = readNumber(fields.baseCompressibility);
  const usesWaterDensity = mode === "liquid" && fields.liquidDensitySource.value === "water";
  const usesCalculatedGasDensity = mode === "gas" && fields.gasDensitySource.value === "naturalGas";
  const usesCalculatedGasCd = mode === "gas" && fields.gasDischargeCoefficientSource.value === "aga3Flange";
  const expansionInputs = { specificHeatRatio: readNumber(fields.specificHeatRatio), upstreamPressure };
  const warnings = [];
  const baseDensity = mode === "gas"
    ? calculateNaturalGasDensity(basePressure, baseTemperatureC, gasSpecificGravity, baseCompressibility)
    : Number.NaN;
  let density = readNumber(fields.density) * densityToKgm3[fields.densityUnit.value];
  if (usesWaterDensity) {
    density = calculateWaterDensity(waterTemperatureC);
  }
  if (usesCalculatedGasDensity) {
    density = calculateNaturalGasDensity(upstreamPressure, gasTemperatureC, gasSpecificGravity);
  }
  const gasViscosityCp = mode === "gas"
    ? calculateNaturalGasViscosity(gasTemperatureC, gasSpecificGravity, density)
    : Number.NaN;
  const waterViscosity = mode === "liquid"
    ? calculateWaterViscosity(waterTemperatureC)
    : Number.NaN;
  const viscosity = mode === "gas" ? gasViscosityCp * 0.001 : waterViscosity;
  let orificeDiameter = inputOrificeDiameter;
  let volumeFlow = Number.NaN;
  let massFlow = Number.NaN;
  let standardVolumeFlow = Number.NaN;
  let reynoldsNumber = Number.NaN;
  let pipeVelocity = Number.NaN;
  let expansionFactor = 1;
  let calculatedCd = dischargeCoefficient;

  if (calculationType !== "flow") {
    const knownFlow = flowInputToInternal(readNumber(fields.knownFlow), fields.knownFlowUnit.value, density, baseDensity, warnings);
    volumeFlow = knownFlow.volumeFlow;
    massFlow = knownFlow.massFlow;
    standardVolumeFlow = knownFlow.standardVolumeFlow;
  }

  if (calculationType === "bore" && pipeDiameter > 0 && deltaPressure > 0 && volumeFlow > 0) {
    const solution = solveBoreForFlow(volumeFlow, deltaPressure, pipeDiameter, density, viscosity, expansionInputs, usesCalculatedGasCd, dischargeCoefficient);
    if (solution.solved) {
      orificeDiameter = solution.orificeDiameter;
    } else {
      warnings.push("Could not solve bore diameter for the requested flow and differential pressure within the pipe diameter.");
    }
  }

  const beta = orificeDiameter / pipeDiameter;
  const pipeArea = Math.PI * Math.pow(pipeDiameter, 2) / 4;
  const betaFactor = 1 - Math.pow(beta, 4);

  if (mode === "gas") {
    if (usesCalculatedGasDensity && gasTemperatureC <= -273.15) warnings.push("Gas temperature must be above absolute zero.");
    if (baseTemperatureC <= -273.15) warnings.push("Base temperature must be above absolute zero.");
    if (gasTemperatureC <= -273.15) warnings.push("Gas flowing temperature must be above absolute zero.");
    if (gasSpecificGravity <= 0) warnings.push("Specific gravity must be greater than zero.");
    if (basePressure <= 0) warnings.push("Base pressure must be greater than zero.");
    if (baseCompressibility <= 0) warnings.push("Base compressibility must be greater than zero.");
  }

  if (pipeDiameter <= 0 || orificeDiameter <= 0 || dischargeCoefficient <= 0 || density <= 0 || viscosity <= 0 || betaFactor <= 0) {
    warnings.push("Enter positive geometry, density, Cd, and pressure values.");
  } else if (calculationType === "pressure") {
    const solved = solvePressureForFlow(volumeFlow, orificeDiameter, pipeDiameter, density, viscosity, expansionInputs, usesCalculatedGasCd, dischargeCoefficient);
    deltaPressure = solved.deltaPressure;
    calculatedCd = solved.calculatedCd;
    expansionFactor = solved.expansionFactor;
    reynoldsNumber = solved.reynoldsNumber;
  } else {
    const forward = forwardFlow(deltaPressure, orificeDiameter, pipeDiameter, density, viscosity, expansionInputs, usesCalculatedGasCd, dischargeCoefficient);
    volumeFlow = forward.volumeFlow;
    calculatedCd = forward.calculatedCd;
    expansionFactor = forward.expansionFactor;
    reynoldsNumber = forward.reynoldsNumber;
  }

  pipeVelocity = Number.isFinite(volumeFlow) && pipeArea > 0 ? volumeFlow / pipeArea : Number.NaN;
  massFlow = Number.isFinite(massFlow) ? massFlow : volumeFlow * density;
  standardVolumeFlow = Number.isFinite(standardVolumeFlow)
    ? standardVolumeFlow
    : mode === "gas" && baseDensity > 0 ? massFlow / baseDensity : Number.NaN;

  if (mode === "gas" && deltaPressure / upstreamPressure > 0.25) {
    warnings.push("Differential pressure is more than 25% of upstream pressure; use a full compressible-flow standard for critical work.");
  }

  if (mode === "gas" && (expansionFactor <= 0 || expansionFactor > 1)) {
    warnings.push("Expansion factor is outside the expected range. Check upstream pressure, density, and differential pressure.");
  }

  if (mode === "gas" && expansionFactor > 0 && expansionFactor < 0.95) {
    warnings.push("Expansion factor is below 0.95.  Measurement will have additional uncertainties.  Increase line pressure or decrease differential pressure.");
  }

  if (beta < 0.2 || beta > 0.75) {
    warnings.push("Typical orifice plate beta ratios are roughly 0.20 to 0.75.  Measurement will have additional uncertainties");
  }

  if (usesBetaInput && (betaInput <= 0 || betaInput >= 1)) {
    warnings.push("Beta ratio must be greater than 0 and less than 1.");
  }

  if (usesWaterDensity && (waterTemperatureC < 0 || waterTemperatureC > 100)) {
    warnings.push("Water density correlation is intended for liquid water from about 0 to 100 deg C.");
  }

  if (mode === "liquid" && deltaPressure > 0 && density > 0) {
    warnings.push("Liquid result assumes single-phase, incompressible flow with no cavitation or flashing.");
    warnings.push("Liquid viscosity is calculated as water viscosity from the entered water temperature.");
  }

  if (mode === "gas") {
    warnings.push("Actual volumetric gas flow uses upstream density; standard units use the selected base pressure and temperature.");
    if (usesCalculatedGasDensity) {
      warnings.push("Flowing natural gas density uses an ideal-gas estimate with compressibility factor Z = 1.");
    }
    warnings.push("Base density uses the pressure, temperature, and compressibility from Settings.");
    warnings.push("Gas viscosity is estimated from flowing temperature, specific gravity, and flowing density.");
    if (usesCalculatedGasCd) {
      warnings.push("Gas Cd is calculated iteratively for AGA3/API flange taps.");
    }
  }

  const selectedVolumeFlowUnit = flowUnits[fields.volumeFlowUnit.value];
  const selectedMassFlowUnit = flowUnits[fields.massFlowUnit.value];
  const displayedFlow = selectedVolumeFlowUnit.convert({ volumeFlow, massFlow, standardVolumeFlow });
  const displayedMassFlow = selectedMassFlowUnit.convert({ volumeFlow, massFlow, standardVolumeFlow });
  const primaryValue = calculationType === "pressure"
    ? deltaPressure / pressureToPascal[fields.deltaPressureUnit.value]
    : calculationType === "bore"
      ? orificeDiameter / lengthToMeters[fields.orificeDiameterUnit.value]
      : displayedFlow;
  const primaryUnit = calculationType === "pressure"
    ? selectedText(fields.deltaPressureUnit)
    : calculationType === "bore"
      ? selectedText(fields.orificeDiameterUnit)
      : selectedVolumeFlowUnit.label;

  output.primaryResultLabel.textContent = calculationType === "pressure"
    ? "Calculated differential pressure"
    : calculationType === "bore"
      ? "Calculated bore diameter"
      : "Calculated flow";
  output.flowValue.textContent = format(primaryValue, calculationType === "bore" ? 3 : precision);
  output.flowUnitLabel.textContent = primaryUnit;
  output.betaValue.textContent = format(beta, 3);
  output.calculatedCdValue.textContent = format(mode === "gas" ? calculatedCd : Number.NaN, 5);
  output.expansionValue.textContent = format(expansionFactor, 4);
  output.calculatedDeltaPressureValue.textContent = pressureDisplay(deltaPressure);
  output.calculatedBoreValue.textContent = lengthDisplay(orificeDiameter);
  output.massFlowValue.textContent = `${format(displayedMassFlow, precision)} ${selectedMassFlowUnit.label}`;
  output.velocityValue.textContent = unitSystem === "imperial"
    ? `${format(pipeVelocity / lengthToMeters.ft, precision)} ft/sec`
    : `${format(pipeVelocity, precision)} m/s`;
  output.liquidDensityValue.textContent = unitSystem === "imperial"
    ? `${format(mode === "liquid" ? density * kgm3ToLbft3 : Number.NaN, 3)} lb/ft3`
    : `${format(mode === "liquid" ? density : Number.NaN, 2)} kg/m3`;
  output.waterViscosityValue.textContent = unitSystem === "imperial"
    ? `${format(mode === "liquid" ? waterViscosity * 1000 : Number.NaN, 4)} cP`
    : `${format(mode === "liquid" ? waterViscosity : Number.NaN, 6)} Pa s`;
  output.gasDensityValue.textContent = unitSystem === "imperial"
    ? `${format(mode === "gas" ? density * kgm3ToLbft3 : Number.NaN, 4)} lb/ft3`
    : `${format(mode === "gas" ? density : Number.NaN, 4)} kg/m3`;
  output.baseDensityValue.textContent = unitSystem === "imperial"
    ? `${format(mode === "gas" ? baseDensity * kgm3ToLbft3 : Number.NaN, 4)} lb/ft3`
    : `${format(mode === "gas" ? baseDensity : Number.NaN, 4)} kg/m3`;
  output.gasViscosityValue.textContent = unitSystem === "imperial"
    ? `${format(mode === "gas" ? gasViscosityCp : Number.NaN, 4)} cP`
    : `${format(mode === "gas" ? gasViscosityCp * 0.001 : Number.NaN, 7)} Pa s`;
  output.reynoldsValue.textContent = format(reynoldsNumber, 0);
  output.formulaText.textContent = mode === "gas"
    ? `${usesCalculatedGasDensity ? "Natural gas density is calculated from absolute pressure, temperature, and specific gravity." : "Gas density is entered manually."} ${usesCalculatedGasCd ? "Cd is calculated using the AGA3/API flange-tap equation." : "Cd is entered manually."} Gas viscosity is calculated from flowing temperature, specific gravity, and flowing density. The selected calculation type determines whether flowrate, differential pressure, or bore diameter is solved; inverse cases are solved iteratively as needed.`
    : `${usesWaterDensity ? "Water density is calculated from temperature." : "Liquid density is entered manually."} Water viscosity is calculated from temperature. The selected calculation type determines whether flowrate, differential pressure, or bore diameter is solved; inverse cases are solved iteratively as needed.`;

  currentCalculation = {
    calculatedCd,
    density,
    baseDensity,
    beta,
    expansionFactor,
    gasViscosityCp,
    massFlow,
    mode,
    pipeVelocity,
    reynoldsNumber,
    selectedVolumeFlowUnit: selectedVolumeFlowUnit.label,
    selectedMassFlowUnit: selectedMassFlowUnit.label,
    displayedFlow,
    displayedMassFlow,
    deltaPressure,
    orificeDiameter,
    calculationType,
    standardVolumeFlow,
    unitSystem,
    volumeFlow,
    waterViscosity,
    warningMessages: warnings
  };

  const visibleWarnings = warnings.filter((warning) => !isCalculationNote(warning));
  warningsList.replaceChildren(
    ...(visibleWarnings.length > 0 ? visibleWarnings : ["No warnings"]).map((warning) => {
      const item = document.createElement("li");
      item.className = warning === "No warnings" ? "warning-note" : "warning-danger";
      item.textContent = warning;
      return item;
    })
  );
}

function buildReport() {
  const data = reportData();
  const { generatedAt, geometryRows, processRows, resultRows, settingsRows, warnings } = data;

  const heading = document.createElement("h1");
  const logo = document.createElement("img");
  const meta = document.createElement("p");
  const notes = document.createElement("section");
  const notesHeading = document.createElement("h2");
  const notesText = document.createElement("p");
  const warningSection = document.createElement("section");
  const warningHeading = document.createElement("h2");
  const warningList = document.createElement("ul");

  logo.className = "report-logo";
  logo.src = "assets/steves-orifice-calculator.png";
  logo.alt = "Steve's Orifice Calculator logo";
  heading.textContent = "Orifice Plate Flow Calculation Report";
  meta.className = "report-meta";
  meta.textContent = `Generated ${generatedAt}`;

  notes.className = "report-section";
  notesHeading.textContent = "Calculation Notes";
  notesText.className = "report-notes";
  notesText.textContent = output.formulaText.textContent;
  notes.append(notesHeading, notesText);

  warningSection.className = "report-section";
  warningHeading.textContent = "Warnings and Assumptions";
  warningList.className = "report-list";
  warnings.forEach((warning) => {
    const item = document.createElement("li");
    item.className = isCalculationNote(warning) ? "warning-note" : "warning-danger";
    item.textContent = warning;
    warningList.append(item);
  });
  if (warnings.length === 0) {
    const item = document.createElement("li");
    item.className = "warning-note";
    item.textContent = "No warnings generated.";
    warningList.append(item);
  }
  warningSection.append(warningHeading, warningList);

  const topGrid = document.createElement("div");
  const lowerGrid = document.createElement("div");
  topGrid.className = "report-grid";
  lowerGrid.className = "report-grid";
  topGrid.append(createReportTable("Results", resultRows), createReportTable("Settings", settingsRows));
  lowerGrid.append(createReportTable("Geometry", geometryRows), createReportTable("Process Inputs", processRows));

  reportDocument.replaceChildren(logo, heading, meta, topGrid, lowerGrid, notes, warningSection);
}

function printReport() {
  buildReport();
  window.print();
}

function rowsToText(title, rows) {
  return [
    title,
    ...rows.map(([label, value]) => `${label}: ${value}`)
  ].join("\n");
}

function downloadTextReport() {
  const data = reportData();
  const warnings = data.warnings.length > 0 ? data.warnings : ["No warnings generated."];
  const content = [
    "Orifice Plate Flow Calculation Report",
    `Generated: ${data.generatedAt}`,
    "",
    rowsToText("Results", data.resultRows),
    "",
    rowsToText("Geometry", data.geometryRows),
    "",
    rowsToText("Process Inputs", data.processRows),
    "",
    rowsToText("Settings", data.settingsRows),
    "",
    "Calculation Notes",
    data.notes,
    "",
    "Warnings and Assumptions",
    ...warnings.map((warning) => `- ${warning}`),
    ""
  ].join("\n");

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");

  link.href = url;
  link.download = `orifice-flow-report-${timestamp}.txt`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => setMode(button.dataset.mode));
});

startButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setCalculationType(button.dataset.calculationType);
    showCalculatorPage();
  });
});

viewButtons.forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

printReportButton.addEventListener("click", printReport);
downloadTextReportButton.addEventListener("click", downloadTextReport);
restartButton.addEventListener("click", showStartPage);

form.addEventListener("input", calculate);
form.addEventListener("change", () => {
  updatePipeScheduleOptions();
  if (fields.unitSystem.value !== unitSystem) {
    applyUnitSystem(fields.unitSystem.value);
  }
  updateInputVisibility();
  calculate();
});

settingsForm.addEventListener("input", calculate);
settingsForm.addEventListener("change", () => {
  if (fields.unitSystem.value !== unitSystem) {
    applyUnitSystem(fields.unitSystem.value);
  }
  updateInputVisibility();
  calculate();
});

initializeStandardPipeSelectors();
applyUnitSystem(unitSystem, false);
updateInputVisibility();
showStartPage();
calculate();
