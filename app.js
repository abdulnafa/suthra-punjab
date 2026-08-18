"use strict";

const UC_DATA = {
  khabeki: "UC Khabeki",
  mardwal: "UC Mardwal",
  angah: "UC Angah",
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
    icons: ["drain", "water", "shield", "bin", "team"],
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
    icons: ["home", "route", "shield", "truck", "team"],
  },
  "manual-sweeping": {
    label: "Manual Sweeping",
    title: ["MANUAL", "SWEEPING"],
    benefits: [
      ["Clean Public Areas", "Manual sweeping is carried out in streets, markets and community spaces."],
      ["Removing Dirt & Litter", "Workers remove dust, litter, plastic waste and scattered debris."],
      ["Healthy & Safe Environment", "Regular sweeping supports a clean, hygienic and safe environment."],
      ["Proper Waste Collection", "Waste collected during sweeping is gathered for proper disposal."],
      ["Dedicated Sanitation Team", "Our sanitation staff works hard for a cleaner, better community."],
    ],
    icons: ["broom", "worker", "shield", "bin", "team"],
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
    icons: ["heap", "sparkle", "truck", "bin", "team"],
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
    setStatus(state.uc ? "Now select an activity to unlock photo uploads." : "Select a UC to begin.");
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

  const selectedUc = UC_DATA[state.uc] || "UC not selected";
  const selectedActivity = ACTIVITY_DATA[state.activity]?.label || "activity not selected";
  elements.canvas.setAttribute("aria-label", `Banner preview for ${selectedUc}, ${selectedActivity}`);
}

function drawBackground() {
  context.fillStyle = "#f8f8ed";
  context.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

  context.fillStyle = "#e0edc9";
  context.beginPath();
  context.moveTo(132, 0);
  context.lineTo(186, 0);
  context.lineTo(164, 38);
  context.closePath();
  context.fill();

  context.fillStyle = "#c9dfad";
  context.beginPath();
  context.moveTo(161, 0);
  context.lineTo(207, 0);
  context.lineTo(178, 26);
  context.closePath();
  context.fill();
}

function drawPhotoMosaic() {
  const gridX = 210;
  const gridY = 29;
  const gridWidth = 325;
  const gridHeight = 576;
  const gap = 3;
  const cellWidth = (gridWidth - gap) / 2;
  const cellHeight = (gridHeight - gap * 2) / 3;

  roundedRect(context, gridX, 2, gridWidth - 3, 24, 8);
  context.fillStyle = "#07572a";
  context.fill();
  drawSmallLeaf(224, 14, 0.65, "#ffffff");
  drawSmallLeaf(514, 14, -0.65, "#ffffff");
  drawFittedText("CLEAN TODAY, HEALTHY TOMORROW", gridX + 34, 18.5, gridWidth - 68, 12, 8, 11, 800, "#ffffff", "center");

  state.photos.forEach((photo, index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const x = gridX + column * (cellWidth + gap);
    const y = gridY + row * (cellHeight + gap);

    context.save();
    roundedRect(context, x, y, cellWidth, cellHeight, 7);
    context.clip();

    if (photo?.image) {
      drawImageSmart(photo.image, x, y, cellWidth, cellHeight);
    } else {
      const gradient = context.createLinearGradient(x, y, x, y + cellHeight);
      gradient.addColorStop(0, "#dbe9d7");
      gradient.addColorStop(1, "#b9d2b5");
      context.fillStyle = gradient;
      context.fillRect(x, y, cellWidth, cellHeight);

      context.strokeStyle = "rgba(7, 83, 40, 0.18)";
      context.lineWidth = 1;
      for (let offset = -cellHeight; offset < cellWidth; offset += 17) {
        context.beginPath();
        context.moveTo(x + offset, y);
        context.lineTo(x + offset + cellHeight, y + cellHeight);
        context.stroke();
      }

      context.fillStyle = "rgba(255, 255, 255, 0.86)";
      context.beginPath();
      context.arc(x + cellWidth / 2, y + cellHeight / 2 - 7, 24, 0, Math.PI * 2);
      context.fill();
      drawCameraIcon(x + cellWidth / 2, y + cellHeight / 2 - 7);
      drawFittedText(`PHOTO ${index + 1}`, x + 10, y + cellHeight / 2 + 30, cellWidth - 20, 11, 8, 10, 800, "#42644b", "center");
    }

    context.restore();
    context.strokeStyle = "rgba(255,255,255,0.78)";
    context.lineWidth = 1;
    roundedRect(context, x + 0.5, y + 0.5, cellWidth - 1, cellHeight - 1, 6.5);
    context.stroke();
  });
}

function drawInformationPanel() {
  const activity = ACTIVITY_DATA[state.activity];
  const titleLines = activity?.title || ["SELECT", "ACTIVITY"];
  const benefits = activity?.benefits || [
    ["Choose a UC", "Select one of the available Union Councils to begin."],
    ["Choose an Activity", "Select the sanitation activity for this banner."],
    ["Upload Six Photos", "Add six clear GPS-stamped activity photos."],
    ["Review the Banner", "Check every photo in the live preview."],
    ["Download & Share", "Save the completed high-resolution banner."],
  ];
  const icons = activity?.icons || ["location", "broom", "camera", "shield", "download"];

  drawLogo();

  const titleTop = 91;
  const lineHeight = titleLines.length > 1 ? 35 : 43;
  const titleSize = titleLines.length > 1 ? 36 : 41;
  titleLines.forEach((line, index) => {
    drawFittedText(line, 13, titleTop + index * lineHeight + titleSize, 185, titleSize, 25, titleSize, 900, "#07572a", "left", "Arial Narrow");
  });

  const badgeY = titleLines.length > 1 ? 169 : 145;
  roundedRect(context, 15, badgeY, 180, 26, 5);
  context.fillStyle = "#123b53";
  context.fill();
  drawFittedText("ACTIVITY", 22, badgeY + 20, 166, 20, 13, 18, 850, "#ffffff", "center");

  const ucY = badgeY + 33;
  roundedRect(context, 15, ucY, 180, 24, 5);
  context.fillStyle = "#11672f";
  context.fill();
  drawFittedText((UC_DATA[state.uc] || "SELECT UC").toUpperCase(), 21, ucY + 17, 168, 15, 10, 14, 850, "#ffffff", "center");

  drawFittedText("SUTHRA PUNJAB AGENCY", 15, ucY + 40, 180, 12, 8, 11, 850, "#17231c", "center");
  drawFittedText("DISTRICT KHUSHAB", 15, ucY + 54, 180, 11, 8, 10, 800, "#17231c", "center");

  const benefitStart = ucY + 70;
  const availableHeight = 604 - benefitStart;
  const benefitHeight = availableHeight / 5;
  benefits.forEach(([heading, copy], index) => {
    const y = benefitStart + index * benefitHeight;
    drawBenefit(y, benefitHeight, heading, copy, icons[index]);
  });
}

function drawLogo() {
  context.save();
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

  drawFittedText("SUTHRA", 57, 28, 129, 18, 12, 17, 900, "#071b10", "left");
  drawFittedText("PUNJAB", 57, 45, 129, 18, 12, 17, 900, "#071b10", "left");
  drawFittedText("CLEAN PUNJAB", 15, 65, 180, 11, 8, 10, 760, "#1f2822", "left");
  drawFittedText("GREEN PUNJAB", 15, 77, 180, 11, 8, 10, 760, "#1f2822", "left");
  drawSmallLeaf(177, 66, -0.3, "#0b6a31", 0.9);
  drawSmallLeaf(187, 61, 0.65, "#07572a", 0.75);
}

function drawBenefit(y, height, heading, copy, icon) {
  const centerY = y + Math.min(21, height * 0.36);
  context.fillStyle = "#0a642f";
  context.beginPath();
  context.arc(29, centerY, 17, 0, Math.PI * 2);
  context.fill();
  drawBenefitIcon(icon, 29, centerY);

  drawFittedText(heading.toUpperCase(), 52, y + 13, 143, 10.5, 7.4, 9.6, 850, "#17231c", "left", "Arial Narrow");
  drawWrappedText(copy, 52, y + 18, 143, 8.1, 9.2, 3, "#2f3832", 550);

  if (y + height < 604) {
    context.strokeStyle = "#9da7a0";
    context.lineWidth = 0.65;
    context.beginPath();
    context.moveTo(52, y + height - 2);
    context.lineTo(196, y + height - 2);
    context.stroke();
  }
}

function drawBottomSummary() {
  const y = 610;
  const h = 73;
  const ucLabel = (UC_DATA[state.uc] || "SELECT UC").toUpperCase();
  const activityLabel = (ACTIVITY_DATA[state.activity]?.label || "SELECT ACTIVITY").toUpperCase();

  roundedRect(context, 7, y, 205, h, 7);
  context.fillStyle = "#f7f8ee";
  context.fill();
  context.strokeStyle = "#183326";
  context.lineWidth = 1.5;
  context.stroke();

  context.fillStyle = "#09642f";
  roundedRect(context, 10, y + 3, 55, h - 6, 5);
  context.fill();
  drawLocationPin(37.5, y + 35);
  drawWrappedCenteredText(ucLabel, 72, y + 24, 132, 20, 21, 2, "#07572a", 900, "Arial Narrow");

  roundedRect(context, 216, y, 155, h, 7);
  context.fillStyle = "#07572a";
  context.fill();
  context.strokeStyle = "#193a25";
  context.stroke();
  drawFittedText("ACTIVITY", 225, y + 20, 137, 15, 10, 13, 850, "#e7df72", "center");
  drawWrappedCenteredText(activityLabel, 225, y + 41, 137, 14.5, 15.5, 2, "#ffffff", 850, "Arial Narrow");

  roundedRect(context, 375, y, 153, h, 7);
  context.fillStyle = "#f7f8ee";
  context.fill();
  context.strokeStyle = "#183326";
  context.stroke();
  const outcomes = ["Clean Streets", "Healthy Community", "Better Punjab"];
  outcomes.forEach((outcome, index) => {
    const lineY = y + 16 + index * 19;
    context.fillStyle = "#0a642f";
    context.beginPath();
    context.arc(390, lineY - 2.5, 7.5, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#ffffff";
    context.beginPath();
    context.arc(390, lineY - 2.5, 2.3, 0, Math.PI * 2);
    context.fill();
    drawFittedText(outcome, 402, lineY + 1, 118, 10.5, 7.2, 9.6, 750, "#17231c", "left");
  });
}

function drawFooter() {
  context.fillStyle = "#07572a";
  context.fillRect(0, 689, LOGICAL_WIDTH, 25);
  drawFittedText("SUTHRA PUNJAB AGENCY, DISTRICT KHUSHAB", 20, 707, 495, 15, 10, 14, 850, "#ffffff", "center");

  context.fillStyle = "#d8e7b9";
  context.fillRect(0, 714, LOGICAL_WIDTH, 11);
  drawFittedText("Let's Keep Our Environment Clean & Green", 25, 723, 485, 8.7, 6.5, 8, 700, "#183626", "center");
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

  // Very tall GPS-camera photos lose most of their scene with a normal crop.
  // Keep the whole photo visible and use a softly blurred copy to fill the sides.
  if (sourceAspect < targetAspect * 0.78) {
    context.save();
    context.filter = "blur(5px) brightness(0.58)";
    drawImageCoverBottom(image, x - 6, y - 6, width + 12, height + 12);
    context.restore();

    const scale = Math.min(width / sourceWidth, height / sourceHeight);
    const fittedWidth = sourceWidth * scale;
    const fittedHeight = sourceHeight * scale;
    const fittedX = x + (width - fittedWidth) / 2;
    const fittedY = y + height - fittedHeight;
    context.drawImage(image, fittedX, fittedY, fittedWidth, fittedHeight);
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
  family = "Arial",
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

function drawWrappedText(text, x, y, maxWidth, fontSize, lineHeight, maxLines, color, weight = 500) {
  context.font = `${weight} ${fontSize}px Arial, sans-serif`;
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
  context.fillStyle = "#09642f";
  context.beginPath();
  context.arc(0, 0, 5, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawBenefitIcon(type, x, y) {
  context.save();
  context.translate(x, y);
  context.strokeStyle = "#ffffff";
  context.fillStyle = "#ffffff";
  context.lineWidth = 1.7;
  context.lineCap = "round";
  context.lineJoin = "round";

  if (["shield"].includes(type)) {
    context.beginPath();
    context.moveTo(0, -10);
    context.lineTo(8, -7);
    context.lineTo(7, 2);
    context.quadraticCurveTo(5, 8, 0, 11);
    context.quadraticCurveTo(-5, 8, -7, 2);
    context.lineTo(-8, -7);
    context.closePath();
    context.stroke();
    context.beginPath();
    context.moveTo(-4, 0);
    context.lineTo(-1, 3);
    context.lineTo(5, -4);
    context.stroke();
  } else if (["bin", "heap"].includes(type)) {
    context.strokeRect(-6, -5, 12, 14);
    context.beginPath();
    context.moveTo(-8, -8);
    context.lineTo(8, -8);
    context.moveTo(-3, -11);
    context.lineTo(3, -11);
    context.moveTo(-2, -2);
    context.lineTo(-2, 6);
    context.moveTo(2, -2);
    context.lineTo(2, 6);
    context.stroke();
  } else if (["team", "worker"].includes(type)) {
    context.beginPath();
    context.arc(-5, -4, 3.5, 0, Math.PI * 2);
    context.arc(5, -4, 3.5, 0, Math.PI * 2);
    context.stroke();
    context.beginPath();
    context.arc(0, -7, 4, 0, Math.PI * 2);
    context.stroke();
    context.beginPath();
    context.arc(0, 6, 9, Math.PI, 0);
    context.stroke();
  } else if (["truck"].includes(type)) {
    context.strokeRect(-10, -7, 12, 11);
    context.beginPath();
    context.moveTo(2, -3);
    context.lineTo(7, -3);
    context.lineTo(10, 1);
    context.lineTo(10, 4);
    context.lineTo(2, 4);
    context.stroke();
    context.beginPath();
    context.arc(-5, 6, 2.5, 0, Math.PI * 2);
    context.arc(7, 6, 2.5, 0, Math.PI * 2);
    context.stroke();
  } else if (["home"].includes(type)) {
    context.beginPath();
    context.moveTo(-10, -1);
    context.lineTo(0, -10);
    context.lineTo(10, -1);
    context.moveTo(-7, -3);
    context.lineTo(-7, 9);
    context.lineTo(7, 9);
    context.lineTo(7, -3);
    context.moveTo(-2, 9);
    context.lineTo(-2, 2);
    context.lineTo(3, 2);
    context.lineTo(3, 9);
    context.stroke();
  } else if (["water", "drain"].includes(type)) {
    context.beginPath();
    context.moveTo(0, -11);
    context.bezierCurveTo(-7, -3, -8, 1, -8, 4);
    context.arc(0, 4, 8, Math.PI, 0, true);
    context.bezierCurveTo(8, 1, 7, -3, 0, -11);
    context.stroke();
  } else if (["route"].includes(type)) {
    context.beginPath();
    context.arc(-7, 7, 2.5, 0, Math.PI * 2);
    context.arc(7, -7, 2.5, 0, Math.PI * 2);
    context.moveTo(-5, 6);
    context.bezierCurveTo(5, 5, -4, -5, 5, -6);
    context.stroke();
  } else if (["camera"].includes(type)) {
    roundedRect(context, -10, -7, 20, 15, 2);
    context.stroke();
    context.beginPath();
    context.arc(0, 0, 4, 0, Math.PI * 2);
    context.stroke();
  } else if (["download"].includes(type)) {
    context.beginPath();
    context.moveTo(0, -10);
    context.lineTo(0, 4);
    context.moveTo(-5, 0);
    context.lineTo(0, 5);
    context.lineTo(5, 0);
    context.moveTo(-8, 9);
    context.lineTo(8, 9);
    context.stroke();
  } else if (["sparkle"].includes(type)) {
    context.beginPath();
    context.moveTo(0, -11);
    context.lineTo(2, -3);
    context.lineTo(9, 0);
    context.lineTo(2, 2);
    context.lineTo(0, 10);
    context.lineTo(-2, 2);
    context.lineTo(-9, 0);
    context.lineTo(-2, -3);
    context.closePath();
    context.stroke();
  } else {
    context.beginPath();
    context.moveTo(-8, -8);
    context.lineTo(7, 7);
    context.moveTo(3, -10);
    context.lineTo(-5, 10);
    context.stroke();
  }

  context.restore();
}

window.addEventListener("beforeunload", () => state.photos.forEach(releasePhoto));

if (document.fonts?.ready) {
  document.fonts.ready.then(scheduleRender);
}
updateInterface();
