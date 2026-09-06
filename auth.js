"use strict";

(() => {
  const AUTH_CONFIG = Object.freeze({
    clientId: "501721622823-oocufe77mi810v82kcgeeskg5b9d8rms.apps.googleusercontent.com",
    allowedEmail: "shafatiwana44@gmail.com",
  });

  const GOOGLE_IDENTITY_SRC = "https://accounts.google.com/gsi/client";
  const VALID_ISSUERS = new Set(["accounts.google.com", "https://accounts.google.com"]);
  const elements = {
    gate: document.querySelector("#authGate"),
    title: document.querySelector("#authTitle"),
    protectedApp: document.querySelector("#protectedApp"),
    signInButton: document.querySelector("#googleSignInButton"),
    status: document.querySelector("#authStatus"),
    retryButton: document.querySelector("#authRetryButton"),
    accountControl: document.querySelector("#accountControl"),
    signedInEmail: document.querySelector("#signedInEmail"),
    signOutButton: document.querySelector("#signOutButton"),
  };

  let googleIdentityReady = false;
  let googleIdentityInitialized = false;
  let sdkLoadPromise = null;

  function setAuthStatus(message, type = "info", language = "en") {
    elements.status.textContent = message;
    elements.status.classList.toggle("is-error", type === "error");
    elements.status.classList.toggle("is-success", type === "success");
    elements.status.lang = language;
    elements.status.dir = language === "ur" ? "rtl" : "ltr";
  }

  function decodeJwtPayload(credential) {
    if (typeof credential !== "string") throw new Error("Missing Google credential");
    const parts = credential.split(".");
    if (parts.length !== 3) throw new Error("Malformed Google credential");

    const normalized = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const binary = window.atob(padded);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  }

  function audienceMatches(audience) {
    if (Array.isArray(audience)) return audience.includes(AUTH_CONFIG.clientId);
    return audience === AUTH_CONFIG.clientId;
  }

  function isAllowedCredential(payload) {
    const now = Math.floor(Date.now() / 1000);
    const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";

    return (
      Boolean(payload.sub) &&
      email === AUTH_CONFIG.allowedEmail &&
      payload.email_verified === true &&
      audienceMatches(payload.aud) &&
      (!payload.azp || payload.azp === AUTH_CONFIG.clientId) &&
      VALID_ISSUERS.has(payload.iss) &&
      Number.isFinite(payload.exp) &&
      payload.exp > now &&
      (!Number.isFinite(payload.nbf) || payload.nbf <= now + 60)
    );
  }

  function unlockApp(payload) {
    elements.signedInEmail.textContent = payload.email;
    elements.accountControl.hidden = false;
    elements.protectedApp.hidden = false;
    elements.protectedApp.removeAttribute("inert");
    elements.protectedApp.removeAttribute("aria-hidden");
    elements.gate.hidden = true;
    elements.gate.setAttribute("aria-hidden", "true");
    document.body.classList.remove("auth-locked");

    window.requestAnimationFrame(() => {
      document.querySelector("#ucSelect")?.focus({ preventScroll: true });
    });
  }

  function handleCredentialResponse(response) {
    try {
      const payload = decodeJwtPayload(response?.credential);
      if (!isAllowedCredential(payload)) {
        setAuthStatus(
          "یہ گوگل اکاؤنٹ مجاز نہیں ہے۔ براہِ کرم شفاء اللہ ٹوانہ کے اکاؤنٹ سے سائن اِن کریں۔",
          "error",
          "ur",
        );
        window.google?.accounts?.id?.disableAutoSelect();
        return;
      }

      setAuthStatus("Access confirmed.", "success");
      unlockApp(payload);
    } catch (error) {
      console.error("Google sign-in response could not be validated.", error);
      setAuthStatus("Google sign-in could not be verified. Please try again.", "error");
    }
  }

  function loadGoogleIdentity() {
    if (window.google?.accounts?.id) return Promise.resolve();
    if (sdkLoadPromise) return sdkLoadPromise;

    sdkLoadPromise = new Promise((resolve, reject) => {
      document.querySelector("#googleIdentityServices")?.remove();
      const script = document.createElement("script");
      const timeoutId = window.setTimeout(() => {
        script.remove();
        reject(new Error("Google Identity Services timed out"));
      }, 15000);

      script.id = "googleIdentityServices";
      script.src = GOOGLE_IDENTITY_SRC;
      script.async = true;
      script.onload = () => {
        window.clearTimeout(timeoutId);
        if (window.google?.accounts?.id) resolve();
        else reject(new Error("Google Identity Services is unavailable"));
      };
      script.onerror = () => {
        window.clearTimeout(timeoutId);
        reject(new Error("Google Identity Services failed to load"));
      };
      document.head.appendChild(script);
    }).finally(() => {
      sdkLoadPromise = null;
    });

    return sdkLoadPromise;
  }

  function renderGoogleButton() {
    const availableWidth = Math.floor(elements.signInButton.getBoundingClientRect().width);
    const buttonWidth = Math.max(160, Math.min(320, availableWidth));
    elements.signInButton.replaceChildren();
    window.google.accounts.id.renderButton(elements.signInButton, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "signin_with",
      shape: "pill",
      logo_alignment: "left",
      width: buttonWidth,
    });
  }

  async function initializeAuthentication() {
    elements.retryButton.hidden = true;
    setAuthStatus("Loading Google sign-in…");

    try {
      await loadGoogleIdentity();
      googleIdentityReady = true;

      if (!googleIdentityInitialized) {
        window.google.accounts.id.initialize({
          client_id: AUTH_CONFIG.clientId,
          callback: handleCredentialResponse,
          auto_select: false,
          ux_mode: "popup",
          context: "signin",
        });
        googleIdentityInitialized = true;
      }

      renderGoogleButton();
      setAuthStatus("Sign in with the authorized Google account to continue.");
    } catch (error) {
      googleIdentityReady = false;
      console.error("Google sign-in could not be loaded.", error);
      elements.signInButton.replaceChildren();
      elements.retryButton.hidden = false;
      setAuthStatus("Google sign-in could not load. Check your internet connection and try again.", "error");
    }
  }

  elements.retryButton.addEventListener("click", initializeAuthentication);

  let resizeTimer;
  window.addEventListener("resize", () => {
    if (!googleIdentityInitialized || elements.gate.hidden) return;
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(renderGoogleButton, 120);
  });

  elements.signOutButton.addEventListener("click", () => {
    elements.signOutButton.disabled = true;
    try {
      if (googleIdentityReady) window.google.accounts.id.disableAutoSelect();
    } finally {
      window.location.reload();
    }
  });

  window.requestAnimationFrame(() => elements.title.focus({ preventScroll: true }));
  initializeAuthentication();
})();
