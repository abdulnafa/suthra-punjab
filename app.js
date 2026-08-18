"use strict";

const UC_DATA = {
  khabeki: "UC Khabeki",
  mardwal: "UC Mardwal",
  angah: "UC Angah",
  kufri: "UC Kufri",
  uchaali: "UC Uchaali",
  khura: "UC Khura",
  "mc-naushera": "MC Naushera",
};

const UC_POSTER_DATA = {
  khabeki: { top: "UC KHABEKI - NAUSHERA", lines: ["UC KHABEKI -", "NAUSHERA"] },
  mardwal: { top: "UC MARDWAL - NAUSHERA", lines: ["UC MARDWAL -", "NAUSHERA"] },
  angah: { top: "UC ANGAH - NAUSHERA", lines: ["UC ANGAH -", "NAUSHERA"] },
  kufri: { top: "UC KUFRI - NAUSHERA", lines: ["UC KUFRI -", "NAUSHERA"] },
  uchaali: { top: "UC UCHAALI - NAUSHERA", lines: ["UC UCHAALI -", "NAUSHERA"] },
  khura: { top: "UC KHURA - NAUSHERA", lines: ["UC KHURA -", "NAUSHERA"] },
  "mc-naushera": { top: "MC NAUSHERA", lines: ["MC NAUSHERA"] },
};

const ACTIVITY_DATA = {
  desilting: {
    label: "Desilting",
    title: ["DESILTING"],
    benefits: [
      ["Clear Drains & Channels", "Silt and blockages are removed from drains and channels to keep them clear."],
      ["Restore Water Flow", "Desilting restores smooth water flow through streets and local drainage lines."],
      ["Prevent Waterlogging", "Clear drains help reduce standing water and keep public areas accessible."],
      ["Safe Silt Removal", "Removed silt is collected carefully and transferred for proper disposal."],
      ["Dedicated Sanitation Team", "Our sanitation staff works hard for a cleaner, safer community."],
    ],
    icons: ["drain-shovel", "water-flow", "shield-check", "silt-cart", "team-five"],
  },
  "door-to-door": {
    label: "Door to Door",
    title: ["DOOR TO", "DOOR"],
    benefits: [
      ["Household Waste Collection", "Waste is collected directly from homes for cleaner streets and neighbourhoods."],
      ["Regular Collection Routes", "Planned routes help provide reliable collection across the community."],
      ["Safe & Hygienic Handling", "Waste is handled carefully to support a healthier local environment."],
      ["Proper Waste Transfer", "Collected waste is moved onwards for appropriate handling and disposal."],
      ["Dedicated Collection Team", "Our collection team serves residents with care and responsibility."],
    ],
    icons: ["house-bin", "route", "shield-check", "collection-truck", "team-five"],
  },
  "manual-sweeping": {
    label: "Manual Sweeping",
    title: ["MANUAL", "SWEEPING"],
    benefits: [
      ["Clean Public Areas", "Manual sweeping is being carried out in markets, streets and community spots to maintain cleanliness."],
      ["Removing Dirt & Litter", "Our workers remove dust, litter, plastic waste and scattered debris from public places."],
      ["Healthy & Safe Environment", "Regular sweeping helps in preventing diseases and ensures a clean, hygienic and safe environment."],
      ["Proper Waste Collection", "Waste collected during sweeping is gathered properly for further disposal."],
      ["Dedicated Sanitation Team", "Our dedicated staff is working hard for a cleaner and better community."],
    ],
    icons: ["broom", "worker-sweeping", "shield-check", "waste-bin", "team-five"],
  },
  "heap-collection": {
    label: "Heap Collection",
    title: ["HEAP", "COLLECTION"],
    benefits: [
      ["Remove Open Waste Heaps", "Accumulated waste heaps are lifted from streets and public spaces."],
      ["Clean Streets & Open Spaces", "Prompt removal keeps shared places tidy, clear and welcoming."],
      ["Prompt Loading & Lifting", "Waste is loaded efficiently to prevent further scattering."],
      ["Safe Disposal", "Collected material is transported onwards for appropriate disposal."],
      ["Dedicated Sanitation Team", "Our sanitation staff works hard for a cleaner, safer community."],
    ],
    icons: ["waste-heap", "clean-street", "heap-truck", "bin-check", "team-five"],
  },
  "road-washing": {
    label: "Road Washing",
    title: ["ROAD", "WASHING"],
    benefits: [
      ["Road Surface Washing", "Roads are washed to remove dust, mud and settled dirt from the surface."],
      ["Dust & Mud Removal", "Water washing clears stubborn dust and mud from public streets."],
      ["Clean & Safe Streets", "Regular washing supports cleaner, safer and healthier surroundings."],
      ["Controlled Water Use", "Water is applied carefully to clean roads without unnecessary waste."],
      ["Dedicated Sanitation Team", "Our trained staff works for cleaner roads and a healthier community."],
    ],
    icons: ["road-wash", "water-flow", "shield-check", "water-truck", "team-five"],
  },
  "school-cleaning": {
    label: "School Cleaning",
    title: ["SCHOOL", "CLEANING"],
    benefits: [
      ["Clean School Premises", "Classrooms, corridors and school grounds are cleaned thoroughly."],
      ["Sweeping & Litter Removal", "Dust, paper and scattered litter are removed from learning spaces."],
      ["Hygienic Learning Environment", "Regular cleaning supports a healthier environment for students and staff."],
      ["Proper Waste Collection", "School waste is gathered in bins and transferred for proper disposal."],
      ["Dedicated Sanitation Team", "Our sanitation staff works for cleaner and healthier schools."],
    ],
    icons: ["school", "broom", "shield-check", "waste-bin", "team-five"],
  },
  "dustbin-washing": {
    label: "Dustbin Washing",
    title: ["DUSTBIN", "WASHING"],
    benefits: [
      ["Thorough Bin Washing", "Dustbins are washed carefully to remove accumulated grime and residue."],
      ["Dirt & Residue Removal", "Stuck waste and dirt are cleared from inside and outside each bin."],
      ["Disinfection & Odour Control", "Clean washing helps control germs, unpleasant smells and contamination."],
      ["Clean Bin Placement", "Washed bins are returned neatly for safe and convenient public use."],
      ["Dedicated Sanitation Team", "Our trained staff maintains clean and hygienic waste containers."],
    ],
    icons: ["bin-wash", "water-flow", "shield-check", "bin-check", "team-five"],
  },
  "hospital-cleaning": {
    label: "Hospital Cleaning",
    title: ["HOSPITAL", "CLEANING"],
    benefits: [
      ["Clean Hospital Premises", "Public areas, entrances and surrounding spaces are cleaned thoroughly."],
      ["Safe Waste Collection", "Waste is collected carefully and kept away from public access areas."],
      ["Hygienic Public Areas", "Regular cleaning supports safer surroundings for patients and visitors."],
      ["Disinfection Support", "Frequently used areas receive focused cleaning for improved hygiene."],
      ["Dedicated Sanitation Team", "Our sanitation staff works responsibly in sensitive public spaces."],
    ],
    icons: ["hospital", "medical-bin", "shield-check", "disinfect", "team-five"],
  },
  awareness: {
    label: "Awareness",
    title: ["AWARENESS"],
    benefits: [
      ["Cleanliness Awareness", "Citizens are guided about keeping streets and public places clean."],
      ["Community Participation", "Residents are encouraged to take part in local cleanliness efforts."],
      ["Proper Waste Disposal", "People are advised to use dustbins and avoid littering in open areas."],
      ["Healthy Daily Habits", "Simple hygiene habits help create a cleaner and healthier community."],
      ["Dedicated Awareness Team", "Our team shares practical messages for a cleaner environment."],
    ],
    icons: ["megaphone", "community", "waste-bin", "shield-check", "team-five"],
  },
  "masjid-cleaning": {
    label: "Masjid Cleaning",
    title: ["MASJID", "CLEANING"],
    benefits: [
      ["Clean Prayer Areas", "Floors and shared prayer areas are cleaned carefully and respectfully."],
      ["Entrance & Courtyard Cleaning", "Entrances, courtyards and surrounding spaces are swept and cleaned."],
      ["Hygienic Ablution Areas", "Ablution surroundings are maintained for a cleaner and safer environment."],
      ["Proper Waste Collection", "Litter is gathered in bins and transferred for appropriate disposal."],
      ["Dedicated Sanitation Team", "Our staff serves these community spaces with care and respect."],
    ],
    icons: ["mosque", "broom", "water-flow", "waste-bin", "team-five"],
  },
  "graveyard-cleaning": {
    label: "Graveyard Cleaning",
    title: ["GRAVEYARD", "CLEANING"],
    benefits: [
      ["Clean Graveyard Grounds", "Litter and unwanted debris are carefully removed from shared grounds."],
      ["Weed & Overgrowth Removal", "Excess weeds and overgrowth are cleared from accessible public areas."],
      ["Clear Walking Paths", "Walking paths are kept clean and accessible for visitors."],
      ["Respectful Waste Collection", "Collected material is removed carefully and transferred for disposal."],
      ["Dedicated Sanitation Team", "Our staff performs cleaning duties with care and respect."],
    ],
    icons: ["graveyard", "weed-removal", "clean-street", "waste-bin", "team-five"],
  },
};

const state = {
  uc: "",
  activity: "",
  photos: Array(6).fill(null),
};

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const MAX_IMAGE_SIDE = 1200;
const SUPPORTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const LOGICAL_WIDTH = 535;
const LOGICAL_HEIGHT = 725;
const OUTPUT_SCALE = 2;
const POSTER_FONT = '"Suthra Condensed"';
const POSTER_COLORS = {
  paper: "#f9faf4",
  green: "#094813",
  title: "#094813",
  navy: "#0b273f",
  lime: "#c7d298",
  ink: "#111713",
};
const PHOTO_CELLS = [
  { x: 211, y: 27, width: 172, height: 193, radius: 7 },
  { x: 384, y: 27, width: 150, height: 193, radius: 7 },
  { x: 211, y: 221, width: 172, height: 227, radius: 7 },
  { x: 384, y: 221, width: 150, height: 227, radius: 7 },
  { x: 211, y: 449, width: 172, height: 160, radius: 7 },
  { x: 384, y: 449, width: 150, height: 160, radius: 7 },
];

const elements = {
  ucSelect: document.querySelector("#ucSelect"),
  activitySelect: document.querySelector("#activitySelect"),
  uploadSection: document.querySelector("#uploadSection"),
  uploadCards: [...document.querySelectorAll(".upload-card")],
  photoProgress: document.querySelector("#photoProgress"),
  photoProgressTrack: document.querySelector("#photoProgressTrack"),
  photoProgressFill: document.querySelector("#photoProgressFill"),
  bulkPhotos: document.querySelector("#bulkPhotos"),
  statusMessage: document.querySelector("#statusMessage"),
  resetButton: document.querySelector("#resetButton"),
  downloadButton: document.querySelector("#downloadButton"),
  canvas: document.querySelector("#bannerCanvas"),
};

const context = elements.canvas.getContext("2d", { alpha: false });
const photoLoadTokens = Array(6).fill(0);
let renderQueued = false;
let isExporting = false;
let isBulkLoading = false;

function setStatus(message = "", isError = false) {
  elements.statusMessage.textContent = message;
  elements.statusMessage.classList.toggle("is-error", isError);
}

function updateInterface() {
  const detailsReady = Boolean(state.uc && state.activity);
  const uploadedCount = state.photos.filter(Boolean).length;

  elements.ucSelect.disabled = isExporting;
  elements.activitySelect.disabled = !state.uc || isExporting;
  elements.uploadSection.classList.toggle("is-disabled", !detailsReady);
  elements.photoProgress.textContent = `${uploadedCount} / 6`;
  elements.photoProgressTrack.setAttribute("aria-valuenow", String(uploadedCount));
  elements.photoProgressFill.style.width = `${(uploadedCount / 6) * 100}%`;
  elements.bulkPhotos.disabled = !detailsReady || uploadedCount === 6 || isExporting || isBulkLoading;

  elements.uploadCards.forEach((card) => {
    const input = card.querySelector("input[type='file']");
    const removeButton = card.querySelector(".remove-photo");
    input.disabled = !detailsReady || isExporting || card.classList.contains("is-loading");
    removeButton.disabled = isExporting;
  });

  const complete = detailsReady && uploadedCount === 6;
  elements.downloadButton.disabled = !complete || isExporting;
  elements.resetButton.disabled = isExporting;
  document.body.classList.toggle("details-ready", detailsReady);
  document.body.classList.toggle("banner-ready", complete);

  if (isExporting) {
    elements.downloadButton.textContent = "Preparing banner…";
  } else if (complete) {
    elements.downloadButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-4-4 4 4 4-4M5 19h14"></path></svg>Download banner';
  } else if (detailsReady) {
    const remaining = 6 - uploadedCount;
    elements.downloadButton.textContent = `${remaining} photo${remaining === 1 ? "" : "s"} remaining`;
  } else {
    elements.downloadButton.textContent = "Download banner";
  }

  if (!detailsReady) {
    setStatus(state.uc ? "Now select an activity to unlock photo uploads." : "Select a UC / MC to begin.");
  } else if (uploadedCount < 6) {
    setStatus(`${6 - uploadedCount} photo${6 - uploadedCount === 1 ? "" : "s"} remaining.`);
  } else {
    setStatus("Your banner is ready. Preview it below or download now.");
  }

  scheduleRender();
}

elements.ucSelect.addEventListener("change", (event) => {
  state.uc = event.target.value;
  if (!state.uc) {
    state.activity = "";
    elements.activitySelect.value = "";
  }
  updateInterface();
});

elements.activitySelect.addEventListener("change", (event) => {
  state.activity = event.target.value;
  updateInterface();

  if (state.activity && window.matchMedia("(max-width: 560px)").matches) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.requestAnimationFrame(() => {
      elements.uploadSection.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  }
});

elements.bulkPhotos.addEventListener("change", async (event) => {
  const files = [...event.target.files];
  const emptySlots = state.photos
    .map((photo, index) => (photo ? -1 : index))
    .filter((index) => index >= 0);

  isBulkLoading = true;
  updateInterface();
  try {
    for (let index = 0; index < Math.min(files.length, emptySlots.length); index += 1) {
      await setPhoto(emptySlots[index], files[index]);
    }
  } finally {
    isBulkLoading = false;
    elements.bulkPhotos.value = "";
    updateInterface();
  }
});

elements.uploadCards.forEach((card, index) => {
  const input = card.querySelector("input[type='file']");
  const removeButton = card.querySelector(".remove-photo");
  const dropzone = card.querySelector(".dropzone");

  input.addEventListener("change", async (event) => {
    const [file] = event.target.files;
    if (file) await setPhoto(index, file);
  });

  input.addEventListener("click", () => {
    // Let a user deliberately choose the same file again when replacing a photo.
    input.value = "";
  });

  removeButton.addEventListener("click", () => removePhoto(index));

  ["dragenter", "dragover"].forEach((eventName) => {
    dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      if (!input.disabled) card.classList.add("is-dragging");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      card.classList.remove("is-dragging");
    });
  });

  dropzone.addEventListener("drop", async (event) => {
    if (input.disabled) return;
    const [file] = event.dataTransfer.files;
    if (file) await setPhoto(index, file);
  });
});

async function setPhoto(index, file) {
  const input = elements.uploadCards[index].querySelector("input[type='file']");
  const loadToken = ++photoLoadTokens[index];
  const hasSupportedExtension = /\.(jpe?g|png|webp)$/i.test(file.name);

  if (!SUPPORTED_TYPES.has(file.type) && !hasSupportedExtension) {
    input.value = "";
    elements.uploadCards[index].classList.remove("is-loading");
    setStatus("Please choose a JPG, PNG or WebP image. HEIC files must be converted first.", true);
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    input.value = "";
    elements.uploadCards[index].classList.remove("is-loading");
    setStatus("That photo is larger than 25 MB. Please choose a smaller file.", true);
    return;
  }

  const card = elements.uploadCards[index];
  card.classList.add("is-loading");
  card.setAttribute("aria-busy", "true");
  input.disabled = true;
  setStatus(`Preparing photo ${index + 1}…`);

  let finalMessage = null;

  try {
    const prepared = await prepareImage(file);
    if (loadToken !== photoLoadTokens[index]) {
      releasePhoto(prepared);
      return;
    }
    releasePhoto(state.photos[index]);
    state.photos[index] = prepared;

    const preview = card.querySelector("img");
    preview.src = prepared.url;
    input.setAttribute("aria-label", `Replace photo ${index + 1}`);
    card.classList.add("has-photo");
  } catch (error) {
    if (loadToken === photoLoadTokens[index]) {
      input.value = "";
      finalMessage = "This image could not be opened. Please try another JPG, PNG or WebP file.";
      console.error(error);
    }
  } finally {
    if (loadToken === photoLoadTokens[index]) {
      card.classList.remove("is-loading");
      card.setAttribute("aria-busy", "false");
      updateInterface();
      if (finalMessage) setStatus(finalMessage, true);
    }
  }
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Image decode failed"));
    image.src = url;
  });
}

async function prepareImage(file) {
  const sourceUrl = URL.createObjectURL(file);
  let sourceImage;

  try {
    sourceImage = await loadImage(sourceUrl);
  } catch (error) {
    URL.revokeObjectURL(sourceUrl);
    throw error;
  }

  const longestSide = Math.max(sourceImage.naturalWidth, sourceImage.naturalHeight);
  if (longestSide <= MAX_IMAGE_SIDE) {
    return { fileName: file.name, url: sourceUrl, image: sourceImage };
  }

  let resizedBlob;
  try {
    const scale = MAX_IMAGE_SIDE / longestSide;
    const resizeCanvas = document.createElement("canvas");
    resizeCanvas.width = Math.max(1, Math.round(sourceImage.naturalWidth * scale));
    resizeCanvas.height = Math.max(1, Math.round(sourceImage.naturalHeight * scale));
    const resizeContext = resizeCanvas.getContext("2d");
    resizeContext.imageSmoothingEnabled = true;
    resizeContext.imageSmoothingQuality = "high";
    resizeContext.drawImage(sourceImage, 0, 0, resizeCanvas.width, resizeCanvas.height);

    resizedBlob = await new Promise((resolve, reject) => {
      resizeCanvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Image resize failed"))),
        "image/jpeg",
        0.93,
      );
    });
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }

  const resizedUrl = URL.createObjectURL(resizedBlob);
  try {
    const resizedImage = await loadImage(resizedUrl);
    return { fileName: file.name, url: resizedUrl, image: resizedImage };
  } catch (error) {
    URL.revokeObjectURL(resizedUrl);
    throw error;
  }
}

function releasePhoto(photo) {
  if (photo?.url) URL.revokeObjectURL(photo.url);
}

function removePhoto(index) {
  if (isExporting) return;
  photoLoadTokens[index] += 1;
  releasePhoto(state.photos[index]);
  state.photos[index] = null;

  const card = elements.uploadCards[index];
  const input = card.querySelector("input[type='file']");
  const preview = card.querySelector("img");
  input.value = "";
  input.setAttribute("aria-label", `Upload photo ${index + 1}`);
  preview.removeAttribute("src");
  card.classList.remove("has-photo", "is-loading", "is-dragging");
  card.setAttribute("aria-busy", "false");
  updateInterface();
}

elements.resetButton.addEventListener("click", () => {
  if (isExporting) return;
  photoLoadTokens.forEach((_, index) => {
    photoLoadTokens[index] += 1;
  });
  state.photos.forEach(releasePhoto);
  state.uc = "";
  state.activity = "";
  state.photos = Array(6).fill(null);

  elements.ucSelect.value = "";
  elements.activitySelect.value = "";
  elements.bulkPhotos.value = "";
  elements.uploadCards.forEach((card, index) => {
    card.classList.remove("has-photo", "is-dragging", "is-loading");
    const input = card.querySelector("input[type='file']");
    input.value = "";
    input.setAttribute("aria-label", `Upload photo ${index + 1}`);
    card.querySelector("img").removeAttribute("src");
  });
  updateInterface();
  elements.ucSelect.focus();
});

elements.downloadButton.addEventListener("click", async () => {
  if (elements.downloadButton.disabled) return;

  const exportUcLabel = UC_DATA[state.uc];
  const exportActivityLabel = ACTIVITY_DATA[state.activity].label;
  const exportFileName = `${slugify(exportUcLabel)}-${slugify(exportActivityLabel)}-banner.jpg`;
  isExporting = true;
  updateInterface();
  renderBanner();
  let outcome = null;

  try {
    const blob = await new Promise((resolve, reject) => {
      elements.canvas.toBlob(
        (result) => (result ? resolve(result) : reject(new Error("Export failed"))),
        "image/jpeg",
        0.94,
      );
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = exportFileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
    outcome = ["Banner downloaded successfully.", false];
  } catch (error) {
    outcome = ["The banner could not be downloaded. Please try again.", true];
    console.error(error);
  } finally {
    isExporting = false;
    updateInterface();
    if (outcome) setStatus(outcome[0], outcome[1]);
  }
});

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function scheduleRender() {
  if (renderQueued) return;
  renderQueued = true;
  window.requestAnimationFrame(() => {
    renderQueued = false;
    renderBanner();
  });
}

function renderBanner() {
  context.save();
  context.setTransform(OUTPUT_SCALE, 0, 0, OUTPUT_SCALE, 0, 0);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  drawBackground();
  drawPhotoMosaic();
  drawInformationPanel();
  drawBottomSummary();
  drawFooter();

  context.restore();

  const selectedUc = UC_DATA[state.uc] || "area not selected";
  const selectedActivity = ACTIVITY_DATA[state.activity]?.label || "activity not selected";
  elements.canvas.setAttribute("aria-label", `Banner preview for ${selectedUc}, ${selectedActivity}`);
}

function drawBackground() {
  context.fillStyle = POSTER_COLORS.paper;
  context.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

  context.fillStyle = "#d9e1b8";
  context.beginPath();
  context.moveTo(149, 0);
  context.lineTo(229, 0);
  context.lineTo(177, 37);
  context.closePath();
  context.fill();
}

function drawPhotoMosaic() {
  roundedRect(context, 239, 1, 296, 24, 12);
  context.fillStyle = POSTER_COLORS.green;
  context.fill();
  drawSmallLeaf(254, 15, 0.65, "#ffffff", 0.62);
  drawSmallLeaf(260, 14, -0.75, "#ffffff", 0.38);
  drawSmallLeaf(522, 15, -0.65, "#ffffff", 0.62);
  drawSmallLeaf(516, 14, 0.75, "#ffffff", 0.38);
  drawFittedText("CLEAN TODAY, HEALTHY TOMORROW", 268, 19, 239, 15, 10, 15, 850, "#ffffff", "center", POSTER_FONT);

  state.photos.forEach((photo, index) => {
    const cell = PHOTO_CELLS[index];
    const { x, y, width, height, radius } = cell;

    // Clear the full rectangular window before clipping so no prior image can
    // remain visible around anti-aliased rounded corners.
    context.fillStyle = "#eef2e9";
    context.fillRect(x, y, width, height);

    context.save();
    roundedRect(context, x, y, width, height, radius);
    context.clip();

    if (photo?.image) {
      drawImageSmart(photo.image, x, y, width, height);
    } else {
      const gradient = context.createLinearGradient(x, y, x, y + height);
      gradient.addColorStop(0, "#dbe9d7");
      gradient.addColorStop(1, "#b9d2b5");
      context.fillStyle = gradient;
      context.fillRect(x, y, width, height);

      context.strokeStyle = "rgba(7, 83, 40, 0.18)";
      context.lineWidth = 1;
      for (let offset = -height; offset < width; offset += 17) {
        context.beginPath();
        context.moveTo(x + offset, y);
        context.lineTo(x + offset + height, y + height);
        context.stroke();
      }

      context.fillStyle = "rgba(255, 255, 255, 0.86)";
      context.beginPath();
      context.arc(x + width / 2, y + height / 2 - 7, 24, 0, Math.PI * 2);
      context.fill();
      drawCameraIcon(x + width / 2, y + height / 2 - 7);
      drawFittedText(`PHOTO ${index + 1}`, x + 10, y + height / 2 + 30, width - 20, 11, 8, 10, 800, "#42644b", "center", POSTER_FONT);
    }

    context.restore();
    context.strokeStyle = "rgba(255,255,255,0.78)";
    context.lineWidth = 1;
    roundedRect(context, x + 0.5, y + 0.5, width - 1, height - 1, radius - 0.5);
    context.stroke();
  });
}

function drawInformationPanel() {
  const activity = ACTIVITY_DATA[state.activity];
  const titleLines = activity?.title || ["SELECT", "ACTIVITY"];
  const benefits = (activity?.benefits || [
    ["Choose a UC / MC", "Select one of the available areas to begin."],
    ["Choose an Activity", "Select the sanitation activity for this banner."],
    ["Upload Six Photos", "Add six clear GPS-stamped activity photos."],
    ["Review the Banner", "Check every photo in the live preview."],
    ["Download & Share", "Save the completed high-resolution banner."],
  ]).map((benefit) => [...benefit]);
  const icons = activity?.icons || ["location", "broom", "camera", "shield-check", "download"];

  if (state.activity === "manual-sweeping" && activity) {
    const place = (UC_POSTER_DATA[state.uc]?.top || "the selected area")
      .replace(/^(?:UC|MC)\s+/i, "")
      .replace(/^NAUSHERA\s*-\s*NAUSHERA$/i, "NAUSHERA");
    benefits[4][1] = `Our dedicated staff is working hard for a cleaner, greener and better ${titleCasePlace(place)}.`;
  }

  drawLogo();

  const titleBaselines = titleLines.length > 1 ? [166, 209] : [187];
  titleLines.forEach((line, index) => {
    drawFittedText(line, 18, titleBaselines[index], 178, 52, 28, 52, 900, POSTER_COLORS.title, "left", POSTER_FONT);
  });

  const badgeY = 216;
  roundedRect(context, 18, badgeY, 178, 31, 4);
  context.fillStyle = POSTER_COLORS.navy;
  context.fill();
  drawFittedText("ACTIVITY", 25, badgeY + 25, 164, 29, 20, 29, 850, "#ffffff", "center", POSTER_FONT);

  const ucY = 252;
  roundedRect(context, 14, ucY, 185, 25, 5);
  context.fillStyle = POSTER_COLORS.green;
  context.fill();
  const posterUc = UC_POSTER_DATA[state.uc]?.top || "SELECT UC / MC";
  drawFittedText(posterUc, 20, ucY + 18, 173, 16.5, 9, 16.5, 850, "#ffffff", "center", POSTER_FONT);

  drawFittedText("SUTHRA PUNJAB AGENCY", 15, 294, 184, 15, 10, 15, 850, POSTER_COLORS.ink, "center", POSTER_FONT);
  drawFittedText("DISTRICT KHUSHAB", 15, 310, 184, 15, 10, 15, 850, POSTER_COLORS.ink, "center", POSTER_FONT);

  const benefitRows = [
    { y: 320, centerY: 338, separatorY: 376 },
    { y: 379, centerY: 396, separatorY: 434 },
    { y: 438, centerY: 454, separatorY: 493 },
    { y: 497, centerY: 511, separatorY: 551 },
    { y: 555, centerY: 568, separatorY: null },
  ];
  benefits.forEach(([heading, copy], index) => {
    drawBenefit(benefitRows[index], heading, copy, icons[index]);
  });
}

function titleCasePlace(value) {
  return value
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace(/\bMc\b/g, "MC")
    .replace(/\bUc\b/g, "UC")
    .replace(/\s+-\s+/g, " - ");
}

function drawLogo() {
  context.save();
  context.translate(4, 5);
  context.scale(0.88, 0.88);
  context.strokeStyle = "#061f12";
  context.lineWidth = 2.2;
  context.lineCap = "round";
  context.beginPath();
  context.arc(31, 34, 20, 0.3, Math.PI * 1.85);
  context.stroke();

  drawSmallLeaf(30, 23, -0.95, "#0a6a31", 1.15);
  drawSmallLeaf(39, 16, 0.45, "#07572a", 1.1);
  drawSmallLeaf(22, 14, -0.55, "#1a8040", 0.95);
  context.restore();

  drawFittedText("SUTHRA", 59, 30, 125, 14.5, 11, 14.5, 900, "#071b10", "left", '"Arial Black"');
  drawFittedText("PUNJAB", 59, 44, 125, 14.5, 11, 14.5, 900, "#071b10", "left", '"Arial Black"');
  drawFittedText("CLEAN PUNJAB", 19, 66, 172, 11.5, 8, 11.5, 700, "#1f2822", "left", POSTER_FONT);
  drawFittedText("GREEN PUNJAB", 19, 78, 172, 11.5, 8, 11.5, 700, "#1f2822", "left", POSTER_FONT);
  drawSmallLeaf(177, 66, -0.3, "#0b6a31", 0.9);
  drawSmallLeaf(187, 61, 0.65, "#07572a", 0.75);
}

function drawBenefit(row, heading, copy, icon) {
  const { y, centerY, separatorY } = row;
  context.fillStyle = POSTER_COLORS.green;
  context.beginPath();
  context.arc(33, centerY, 19, 0, Math.PI * 2);
  context.fill();
  drawBenefitIcon(icon, 33, centerY, 25);

  drawFittedText(heading.toUpperCase(), 62, y + 13, 136, 11, 8, 11, 850, POSTER_COLORS.ink, "left", POSTER_FONT);
  drawWrappedText(copy, 62, y + 17, 136, 8.5, 9.4, 4, "#202720", 520, POSTER_FONT);

  if (separatorY) {
    context.strokeStyle = "#151b16";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(62, separatorY);
    context.lineTo(198, separatorY);
    context.stroke();
  }
}

function drawBottomSummary() {
  const y = 609;
  const h = 72;
  const ucLines = UC_POSTER_DATA[state.uc]?.lines || ["SELECT UC / MC"];
  const activityLabel = (ACTIVITY_DATA[state.activity]?.label || "SELECT ACTIVITY").toUpperCase();

  roundedRect(context, 9, y, 201, h, 7);
  context.fillStyle = "#d5dbb7";
  context.fill();
  context.strokeStyle = "#101a12";
  context.lineWidth = 1.7;
  context.stroke();

  context.fillStyle = POSTER_COLORS.green;
  roundedRect(context, 14, y + 4, 51, h - 8, 5);
  context.fill();
  drawLocationPin(38.5, y + 34);
  if (ucLines.length > 1) {
    drawFittedText(ucLines[0], 70, y + 29, 134, 21, 13, 20, 900, POSTER_COLORS.title, "center", POSTER_FONT);
    drawFittedText(ucLines[1], 70, y + 54, 134, 23, 14, 22, 900, POSTER_COLORS.title, "center", POSTER_FONT);
  } else {
    drawFittedText(ucLines[0], 70, y + 43, 134, 23, 14, 22, 900, POSTER_COLORS.title, "center", POSTER_FONT);
  }

  roundedRect(context, 217, y, 313, h, 7);
  context.fillStyle = "#f2f0e3";
  context.fill();

  roundedRect(context, 220, y + 4, 151, h - 8, 4);
  context.fillStyle = POSTER_COLORS.green;
  context.fill();

  context.strokeStyle = "#101a12";
  context.lineWidth = 1.7;
  roundedRect(context, 217, y, 313, h, 7);
  context.stroke();

  context.beginPath();
  context.moveTo(372, y + 1);
  context.lineTo(372, y + h - 1);
  context.stroke();

  drawFittedText("ACTIVITY", 258, y + 20, 105, 15.5, 10, 14, 850, "#dce36c", "center", POSTER_FONT);
  drawActivitySummaryIcon(state.activity, 240, y + 43, 27);
  drawWrappedCenteredText(activityLabel, 258, y + 42, 105, 15, 15.5, 2, "#ffffff", 850, POSTER_FONT);

  const outcomes = [
    ["Clean Streets", "leaf-broom"],
    ["Healthy Community", "community"],
    ["Better Punjab", "shield-check"],
  ];
  outcomes.forEach(([outcome, icon], index) => {
    const iconY = [624, 646, 667][index];
    drawOutcomeIcon(icon, 392, iconY, 10);
    drawFittedText(outcome, 414, iconY + 4, 108, 10.5, 7.2, 10.5, 700, POSTER_COLORS.ink, "left", POSTER_FONT);
  });
}

function drawFooter() {
  context.fillStyle = POSTER_COLORS.green;
  context.fillRect(0, 687, LOGICAL_WIDTH, 25);
  drawFittedText("SUTHRA PUNJAB AGENCY, DISTRICT KHUSHAB", 20, 707, 495, 20, 13, 20, 850, "#ffffff", "center", POSTER_FONT);
  drawFooterFoliage();

  context.fillStyle = POSTER_COLORS.lime;
  context.fillRect(0, 712, LOGICAL_WIDTH, 13);

  context.fillStyle = "#183626";
  context.font = 'italic 11px Georgia, "Times New Roman", serif';
  context.textAlign = "center";
  context.textBaseline = "alphabetic";
  context.fillText("Let's Keep Our Environment Clean & Green", LOGICAL_WIDTH / 2, 723, 285);
  drawTaglineOrnament(122, 718, -1);
  drawTaglineOrnament(413, 718, 1);
}

function drawFooterFoliage() {
  context.save();
  context.translate(505, 700);
  context.strokeStyle = "#b9c88b";
  context.fillStyle = "#b9c88b";
  context.lineWidth = 1.2;
  context.beginPath();
  context.moveTo(-13, 10);
  context.quadraticCurveTo(-5, 1, 8, -10);
  context.stroke();
  [[-8, 5, -0.8], [-2, 0, 0.75], [3, -5, -0.65]].forEach(([x, y, rotation]) => {
    context.save();
    context.translate(x, y);
    context.rotate(rotation);
    context.beginPath();
    context.ellipse(0, 0, 5, 2.5, 0, 0, Math.PI * 2);
    context.fill();
    context.restore();
  });
  context.restore();
}

function drawTaglineOrnament(x, y, direction) {
  context.save();
  context.translate(x, y);
  context.scale(direction, 1);
  context.strokeStyle = POSTER_COLORS.green;
  context.fillStyle = POSTER_COLORS.green;
  context.lineWidth = 0.9;
  context.beginPath();
  context.moveTo(0, 4);
  context.quadraticCurveTo(7, -1, 14, -3);
  context.stroke();
  context.beginPath();
  context.ellipse(6, 0, 4, 1.8, -0.55, 0, Math.PI * 2);
  context.ellipse(11, -2.5, 3.5, 1.6, 0.45, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawImageCoverBottom(image, x, y, width, height) {
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  const scale = Math.max(width / sourceWidth, height / sourceHeight);
  const sourceCropWidth = width / scale;
  const sourceCropHeight = height / scale;
  const sourceX = Math.max(0, (sourceWidth - sourceCropWidth) / 2);
  const sourceY = Math.max(0, sourceHeight - sourceCropHeight);
  context.drawImage(
    image,
    sourceX,
    sourceY,
    Math.min(sourceCropWidth, sourceWidth),
    Math.min(sourceCropHeight, sourceHeight),
    x,
    y,
    width,
    height,
  );
}

function drawImageSmart(image, x, y, width, height) {
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  const sourceAspect = sourceWidth / sourceHeight;
  const targetAspect = width / height;

  // Keep every frame full-bleed like the reference. For an unusually tall phone
  // photo, cap the top crop at 25% so the worker and bottom GPS card both remain
  // visible; the small remaining aspect difference is fitted into the frame.
  if (sourceAspect < targetAspect * 0.78) {
    const idealCropHeight = sourceWidth / targetAspect;
    const cropHeight = Math.min(sourceHeight, Math.max(idealCropHeight, sourceHeight * 0.75));
    const sourceY = sourceHeight - cropHeight;
    context.drawImage(image, 0, sourceY, sourceWidth, cropHeight, x, y, width, height);
    return;
  }

  drawImageCoverBottom(image, x, y, width, height);
}

function drawFittedText(
  text,
  x,
  baseline,
  maxWidth,
  preferredSize,
  minimumSize,
  maximumSize,
  weight,
  color,
  align = "left",
  family = POSTER_FONT,
) {
  let size = Math.min(preferredSize, maximumSize);
  context.textAlign = align;
  context.textBaseline = "alphabetic";
  context.fillStyle = color;

  while (size > minimumSize) {
    context.font = `${weight} ${size}px ${family}, Arial, sans-serif`;
    if (context.measureText(text).width <= maxWidth) break;
    size -= 0.5;
  }

  const drawX = align === "center" ? x + maxWidth / 2 : align === "right" ? x + maxWidth : x;
  context.fillText(text, drawX, baseline, maxWidth);
  return size;
}

function drawWrappedText(text, x, y, maxWidth, fontSize, lineHeight, maxLines, color, weight = 500, family = POSTER_FONT) {
  context.font = `${weight} ${fontSize}px ${family}, Arial, sans-serif`;
  context.textAlign = "left";
  context.textBaseline = "top";
  context.fillStyle = color;
  const lines = wrapLines(text, maxWidth, maxLines);
  lines.forEach((line, index) => context.fillText(line, x, y + index * lineHeight, maxWidth));
}

function drawWrappedCenteredText(text, x, y, width, fontSize, lineHeight, maxLines, color, weight = 800, family = "Arial") {
  context.font = `${weight} ${fontSize}px ${family}, Arial, sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = color;
  const lines = wrapLines(text, width, maxLines);
  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, index) => context.fillText(line, x + width / 2, startY + index * lineHeight, width));
}

function wrapLines(text, maxWidth, maxLines) {
  const words = text.split(/\s+/);
  const lines = [];
  let current = "";

  words.forEach((word) => {
    const test = current ? `${current} ${word}` : word;
    if (context.measureText(test).width <= maxWidth || !current) {
      current = test;
    } else {
      lines.push(current);
      current = word;
    }
  });
  if (current) lines.push(current);

  if (lines.length > maxLines) {
    const result = lines.slice(0, maxLines);
    let last = result[maxLines - 1];
    while (context.measureText(`${last}…`).width > maxWidth && last.length > 1) {
      last = last.slice(0, -1);
    }
    result[maxLines - 1] = `${last.trim()}…`;
    return result;
  }
  return lines;
}

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawSmallLeaf(x, y, rotation, color, scale = 1) {
  context.save();
  context.translate(x, y);
  context.rotate(rotation);
  context.scale(scale, scale);
  context.fillStyle = color;
  context.beginPath();
  context.moveTo(0, 0);
  context.bezierCurveTo(-9, -5, -11, -14, -9, -18);
  context.bezierCurveTo(0, -18, 8, -12, 0, 0);
  context.fill();
  context.strokeStyle = color;
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(-5, -13);
  context.stroke();
  context.restore();
}

function drawCameraIcon(x, y) {
  context.save();
  context.translate(x, y);
  context.strokeStyle = "#0a642f";
  context.lineWidth = 2;
  context.lineCap = "round";
  context.lineJoin = "round";
  roundedRect(context, -12, -8, 24, 17, 3);
  context.stroke();
  context.beginPath();
  context.moveTo(-6, -8);
  context.lineTo(-3, -12);
  context.lineTo(4, -12);
  context.lineTo(7, -8);
  context.stroke();
  context.beginPath();
  context.arc(0, 0, 5, 0, Math.PI * 2);
  context.stroke();
  context.restore();
}

function drawLocationPin(x, y) {
  context.save();
  context.translate(x, y - 7);
  context.fillStyle = "#ffffff";
  context.beginPath();
  context.arc(0, 0, 13, Math.PI, 0);
  context.bezierCurveTo(13, 10, 0, 25, 0, 25);
  context.bezierCurveTo(0, 25, -13, 10, -13, 0);
  context.closePath();
  context.fill();
  context.fillStyle = POSTER_COLORS.green;
  context.beginPath();
  context.arc(0, 0, 5, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawBenefitIcon(type, x, y, size = 24) {
  context.save();
  context.translate(x, y);
  context.scale(size / 24, size / 24);
  context.strokeStyle = "#ffffff";
  context.fillStyle = "#ffffff";
  context.lineWidth = 1.8;
  context.lineCap = "round";
  context.lineJoin = "round";

  switch (type) {
    case "broom":
    case "clean-street": {
      context.beginPath();
      context.moveTo(-7, -10);
      context.lineTo(2, 3);
      context.stroke();
      context.beginPath();
      context.moveTo(1, 1);
      context.lineTo(9, 7);
      context.quadraticCurveTo(4, 11, -3, 7);
      context.closePath();
      context.fill();
      context.beginPath();
      context.moveTo(-10, 9);
      context.quadraticCurveTo(-5, 11, 0, 10);
      context.moveTo(5, -8);
      context.lineTo(5, -4);
      context.moveTo(3, -6);
      context.lineTo(7, -6);
      context.stroke();
      break;
    }
    case "worker-sweeping": {
      context.beginPath();
      context.arc(-3, -8, 3, 0, Math.PI * 2);
      context.fill();
      context.beginPath();
      context.moveTo(-3, -4);
      context.lineTo(-2, 3);
      context.lineTo(-7, 10);
      context.moveTo(-2, 3);
      context.lineTo(3, 9);
      context.moveTo(-2, -2);
      context.lineTo(4, 1);
      context.lineTo(8, -4);
      context.moveTo(8, -7);
      context.lineTo(3, 9);
      context.stroke();
      context.beginPath();
      context.moveTo(1, 8);
      context.lineTo(7, 11);
      context.lineTo(10, 7);
      context.closePath();
      context.fill();
      break;
    }
    case "shield-check":
    case "bin-check": {
      if (type === "bin-check") {
        context.strokeRect(-6, -4, 12, 13);
        context.beginPath();
        context.moveTo(-8, -7);
        context.lineTo(8, -7);
        context.moveTo(-3, -10);
        context.lineTo(3, -10);
        context.stroke();
      } else {
        context.beginPath();
        context.moveTo(0, -10);
        context.lineTo(8, -7);
        context.lineTo(7, 2);
        context.quadraticCurveTo(5, 8, 0, 11);
        context.quadraticCurveTo(-5, 8, -7, 2);
        context.lineTo(-8, -7);
        context.closePath();
        context.stroke();
      }
      context.beginPath();
      context.moveTo(-4, 1);
      context.lineTo(-1, 4);
      context.lineTo(5, -3);
      context.stroke();
      break;
    }
    case "waste-bin": {
      context.strokeRect(-6, -4, 12, 13);
      context.beginPath();
      context.moveTo(-8, -7);
      context.lineTo(8, -7);
      context.moveTo(-3, -10);
      context.lineTo(3, -10);
      context.moveTo(-2, -1);
      context.lineTo(-2, 6);
      context.moveTo(2, -1);
      context.lineTo(2, 6);
      context.stroke();
      break;
    }
    case "bin-wash": {
      context.strokeRect(-8, -3, 11, 12);
      context.beginPath();
      context.moveTo(-10, -6);
      context.lineTo(5, -6);
      context.moveTo(-5, -9);
      context.lineTo(0, -9);
      context.moveTo(6, -8);
      context.quadraticCurveTo(10, -6, 11, -2);
      context.moveTo(7, -3);
      context.quadraticCurveTo(10, -1, 10, 3);
      context.stroke();
      context.beginPath();
      context.arc(7, 5, 1.2, 0, Math.PI * 2);
      context.fill();
      break;
    }
    case "medical-bin": {
      context.strokeRect(-7, -3, 14, 12);
      context.beginPath();
      context.moveTo(-9, -6);
      context.lineTo(9, -6);
      context.moveTo(-3, -9);
      context.lineTo(3, -9);
      context.moveTo(0, -1);
      context.lineTo(0, 6);
      context.moveTo(-3.5, 2.5);
      context.lineTo(3.5, 2.5);
      context.stroke();
      break;
    }
    case "team-five":
    case "community": {
      const people = type === "team-five"
        ? [[0, -7, 3], [-7, -4, 2.4], [7, -4, 2.4], [-10, 1, 1.9], [10, 1, 1.9]]
        : [[0, -7, 3.2], [-7, -4, 2.5], [7, -4, 2.5]];
      people.forEach(([cx, cy, radius]) => {
        context.beginPath();
        context.arc(cx, cy, radius, 0, Math.PI * 2);
        context.stroke();
      });
      context.beginPath();
      context.arc(0, 7, 8, Math.PI, 0);
      context.stroke();
      context.beginPath();
      context.arc(-7, 8, 4, Math.PI, 0);
      context.stroke();
      context.beginPath();
      context.arc(7, 8, 4, Math.PI, 0);
      context.stroke();
      if (type === "team-five") {
        context.beginPath();
        context.arc(-10, 9, 3, Math.PI, 0);
        context.stroke();
        context.beginPath();
        context.arc(10, 9, 3, Math.PI, 0);
        context.stroke();
      }
      break;
    }
    case "collection-truck":
    case "heap-truck":
    case "water-truck": {
      if (type === "water-truck") {
        roundedRect(context, -11, -7, 13, 11, 5);
        context.stroke();
        context.beginPath();
        context.moveTo(-8, 0);
        context.quadraticCurveTo(-5, -3, -2, 0);
        context.stroke();
      } else {
        context.strokeRect(-11, -7, 13, 11);
      }
      context.beginPath();
      context.moveTo(2, -3);
      context.lineTo(7, -3);
      context.lineTo(11, 1);
      context.lineTo(11, 4);
      context.lineTo(2, 4);
      context.stroke();
      context.beginPath();
      context.arc(-6, 7, 2.5, 0, Math.PI * 2);
      context.stroke();
      context.beginPath();
      context.arc(7, 7, 2.5, 0, Math.PI * 2);
      context.stroke();
      if (type === "heap-truck") {
        context.beginPath();
        context.moveTo(-9, -2);
        context.quadraticCurveTo(-4, -9, 0, -2);
        context.stroke();
      }
      break;
    }
    case "house-bin": {
      context.beginPath();
      context.moveTo(-11, -2);
      context.lineTo(-3, -10);
      context.lineTo(5, -2);
      context.moveTo(-8, -4);
      context.lineTo(-8, 8);
      context.lineTo(2, 8);
      context.lineTo(2, -4);
      context.stroke();
      context.strokeRect(5, 1, 5, 8);
      context.beginPath();
      context.moveTo(4, -1);
      context.lineTo(11, -1);
      context.stroke();
      break;
    }
    case "school": {
      context.beginPath();
      context.moveTo(-11, -3);
      context.lineTo(0, -10);
      context.lineTo(11, -3);
      context.moveTo(-9, -4);
      context.lineTo(-9, 10);
      context.lineTo(9, 10);
      context.lineTo(9, -4);
      context.stroke();
      context.strokeRect(-2.5, 3, 5, 7);
      context.strokeRect(-7, 0, 3, 3);
      context.strokeRect(4, 0, 3, 3);
      break;
    }
    case "hospital": {
      context.strokeRect(-9, -8, 18, 18);
      context.beginPath();
      context.moveTo(0, -6);
      context.lineTo(0, 1);
      context.moveTo(-3.5, -2.5);
      context.lineTo(3.5, -2.5);
      context.stroke();
      context.strokeRect(-2.5, 4, 5, 6);
      context.beginPath();
      context.moveTo(-7, 2);
      context.lineTo(-5, 2);
      context.moveTo(5, 2);
      context.lineTo(7, 2);
      context.stroke();
      break;
    }
    case "mosque": {
      context.beginPath();
      context.moveTo(-7, 10);
      context.lineTo(-7, 0);
      context.bezierCurveTo(-7, -5, -3, -7, 0, -10);
      context.bezierCurveTo(3, -7, 7, -5, 7, 0);
      context.lineTo(7, 10);
      context.moveTo(-11, 10);
      context.lineTo(11, 10);
      context.moveTo(-10, 9);
      context.lineTo(-10, -4);
      context.quadraticCurveTo(-10, -7, -8, -4);
      context.moveTo(10, 9);
      context.lineTo(10, -4);
      context.quadraticCurveTo(10, -7, 8, -4);
      context.stroke();
      context.beginPath();
      context.arc(0, 6, 2.7, Math.PI, 0);
      context.lineTo(2.7, 10);
      context.moveTo(-2.7, 6);
      context.lineTo(-2.7, 10);
      context.stroke();
      break;
    }
    case "graveyard": {
      context.beginPath();
      context.moveTo(-7, 9);
      context.lineTo(-7, -2);
      context.quadraticCurveTo(-7, -9, 0, -10);
      context.quadraticCurveTo(7, -9, 7, -2);
      context.lineTo(7, 9);
      context.closePath();
      context.stroke();
      context.beginPath();
      context.arc(-1, -2, 2.7, 0.6 * Math.PI, 1.8 * Math.PI);
      context.stroke();
      context.beginPath();
      context.moveTo(-11, 10);
      context.lineTo(11, 10);
      context.moveTo(7, 7);
      context.quadraticCurveTo(10, 5, 11, 2);
      context.moveTo(9, 5);
      context.lineTo(11, 6);
      context.stroke();
      break;
    }
    case "weed-removal": {
      context.beginPath();
      context.moveTo(-2, 9);
      context.quadraticCurveTo(-2, 2, -6, -3);
      context.moveTo(-2, 6);
      context.quadraticCurveTo(2, 1, 5, -4);
      context.moveTo(-4, 1);
      context.quadraticCurveTo(-9, 0, -9, -4);
      context.moveTo(2, 1);
      context.quadraticCurveTo(7, 1, 8, -3);
      context.moveTo(-10, -9);
      context.lineTo(6, 9);
      context.moveTo(4, 7);
      context.lineTo(10, 4);
      context.stroke();
      break;
    }
    case "road-wash": {
      context.beginPath();
      context.moveTo(-11, -8);
      context.quadraticCurveTo(-9, -1, -4, 0);
      context.stroke();
      context.strokeRect(-4, -2, 6, 4);
      context.beginPath();
      context.moveTo(2, -1);
      context.quadraticCurveTo(6, 0, 10, 3);
      context.moveTo(2, 2);
      context.quadraticCurveTo(6, 3, 9, 6);
      context.moveTo(-10, 9);
      context.lineTo(11, 9);
      context.moveTo(-6, 6);
      context.lineTo(-3, 3);
      context.moveTo(6, 6);
      context.lineTo(3, 3);
      context.stroke();
      break;
    }
    case "disinfect": {
      roundedRect(context, -5, 0, 10, 10, 2);
      context.stroke();
      context.beginPath();
      context.moveTo(-2, 0);
      context.lineTo(-2, -5);
      context.lineTo(4, -5);
      context.moveTo(1, -8);
      context.lineTo(7, -8);
      context.lineTo(9, -6);
      context.moveTo(8, -2);
      context.lineTo(8, 2);
      context.moveTo(6, 0);
      context.lineTo(10, 0);
      context.stroke();
      break;
    }
    case "megaphone": {
      context.beginPath();
      context.moveTo(-9, -4);
      context.lineTo(5, -10);
      context.lineTo(5, 6);
      context.lineTo(-9, 2);
      context.closePath();
      context.stroke();
      context.beginPath();
      context.moveTo(-5, 3);
      context.lineTo(-2, 10);
      context.lineTo(3, 9);
      context.lineTo(1, 5);
      context.moveTo(8, -7);
      context.quadraticCurveTo(12, -3, 9, 1);
      context.stroke();
      break;
    }
    case "water-flow": {
      context.beginPath();
      context.moveTo(0, -11);
      context.bezierCurveTo(-6, -4, -8, 0, -8, 4);
      context.arc(0, 4, 8, Math.PI, 0, true);
      context.bezierCurveTo(8, 0, 6, -4, 0, -11);
      context.stroke();
      context.beginPath();
      context.moveTo(-10, 9);
      context.quadraticCurveTo(-6, 6, -2, 9);
      context.quadraticCurveTo(2, 12, 6, 9);
      context.stroke();
      break;
    }
    case "drain-shovel": {
      context.beginPath();
      context.moveTo(-11, 5);
      context.lineTo(9, 5);
      context.moveTo(-9, 9);
      context.lineTo(8, 9);
      context.moveTo(-7, 5);
      context.lineTo(-5, 9);
      context.moveTo(-2, 5);
      context.lineTo(0, 9);
      context.moveTo(3, 5);
      context.lineTo(5, 9);
      context.moveTo(-7, -10);
      context.lineTo(3, 3);
      context.stroke();
      context.beginPath();
      context.moveTo(1, 1);
      context.lineTo(7, -1);
      context.lineTo(8, 5);
      context.closePath();
      context.stroke();
      break;
    }
    case "silt-cart": {
      context.beginPath();
      context.moveTo(-10, -1);
      context.lineTo(6, -1);
      context.lineTo(3, 6);
      context.lineTo(-7, 6);
      context.closePath();
      context.moveTo(6, 0);
      context.lineTo(11, -4);
      context.stroke();
      context.beginPath();
      context.arc(-4, 9, 2.5, 0, Math.PI * 2);
      context.stroke();
      context.beginPath();
      context.moveTo(-8, -2);
      context.quadraticCurveTo(-2, -10, 4, -2);
      context.stroke();
      break;
    }
    case "route": {
      context.beginPath();
      context.arc(-7, 7, 2.5, 0, Math.PI * 2);
      context.stroke();
      context.beginPath();
      context.arc(7, -7, 2.5, 0, Math.PI * 2);
      context.stroke();
      context.beginPath();
      context.moveTo(-5, 6);
      context.bezierCurveTo(6, 5, -5, -5, 5, -6);
      context.stroke();
      break;
    }
    case "waste-heap": {
      context.beginPath();
      context.moveTo(-11, 8);
      context.quadraticCurveTo(-7, 2, -4, 4);
      context.quadraticCurveTo(-1, -7, 3, 1);
      context.quadraticCurveTo(7, -3, 11, 8);
      context.closePath();
      context.stroke();
      context.beginPath();
      context.arc(-7, -5, 1.2, 0, Math.PI * 2);
      context.moveTo(7, -8);
      context.lineTo(9, -4);
      context.stroke();
      break;
    }
    case "camera": {
      roundedRect(context, -10, -7, 20, 15, 2);
      context.stroke();
      context.beginPath();
      context.arc(0, 0, 4, 0, Math.PI * 2);
      context.stroke();
      break;
    }
    case "download": {
      context.beginPath();
      context.moveTo(0, -10);
      context.lineTo(0, 4);
      context.moveTo(-5, 0);
      context.lineTo(0, 5);
      context.lineTo(5, 0);
      context.moveTo(-8, 9);
      context.lineTo(8, 9);
      context.stroke();
      break;
    }
    case "location": {
      context.beginPath();
      context.arc(0, -3, 7, 0, Math.PI * 2);
      context.moveTo(-6, 1);
      context.lineTo(0, 10);
      context.lineTo(6, 1);
      context.stroke();
      break;
    }
    case "leaf-broom": {
      context.beginPath();
      context.moveTo(-8, 6);
      context.bezierCurveTo(-7, -4, 0, -9, 7, -8);
      context.bezierCurveTo(7, 0, 2, 6, -8, 6);
      context.fill();
      context.beginPath();
      context.moveTo(-7, 7);
      context.lineTo(7, -8);
      context.moveTo(4, 7);
      context.lineTo(9, 3);
      context.lineTo(10, 9);
      context.closePath();
      context.stroke();
      break;
    }
    case "leaf": {
      context.beginPath();
      context.moveTo(-8, 7);
      context.bezierCurveTo(-8, -5, 1, -10, 9, -9);
      context.bezierCurveTo(9, 1, 4, 8, -8, 7);
      context.fill();
      context.strokeStyle = POSTER_COLORS.green;
      context.beginPath();
      context.moveTo(-6, 5);
      context.lineTo(6, -6);
      context.stroke();
      break;
    }
    default: {
      context.beginPath();
      context.moveTo(0, -10);
      context.lineTo(2, -2);
      context.lineTo(9, 0);
      context.lineTo(2, 2);
      context.lineTo(0, 10);
      context.lineTo(-2, 2);
      context.lineTo(-9, 0);
      context.lineTo(-2, -2);
      context.closePath();
      context.stroke();
    }
  }

  context.restore();
}

function drawActivitySummaryIcon(activityKey, x, y, size) {
  if (activityKey === "manual-sweeping") {
    drawBenefitIcon("waste-bin", x - 8, y + 2, size * 0.55);
    drawBenefitIcon("worker-sweeping", x + 6, y, size * 0.72);
    return;
  }

  const iconByActivity = {
    desilting: "drain-shovel",
    "door-to-door": "house-bin",
    "heap-collection": "heap-truck",
    "road-washing": "water-truck",
    "school-cleaning": "school",
    "dustbin-washing": "bin-wash",
    "hospital-cleaning": "hospital",
    awareness: "megaphone",
    "masjid-cleaning": "mosque",
    "graveyard-cleaning": "graveyard",
  };
  drawBenefitIcon(iconByActivity[activityKey] || "broom", x, y, size);
}

function drawOutcomeIcon(type, x, y, radius) {
  context.save();
  context.fillStyle = POSTER_COLORS.green;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();
  drawBenefitIcon(type, x, y, radius * 1.25);
  context.restore();
}

window.addEventListener("beforeunload", () => state.photos.forEach(releasePhoto));

if (document.fonts?.load) {
  document.fonts
    .load(`900 42px ${POSTER_FONT}`)
    .then(scheduleRender)
    .catch(() => scheduleRender());
} else if (document.fonts?.ready) {
  document.fonts.ready.then(scheduleRender);
}
updateInterface();
