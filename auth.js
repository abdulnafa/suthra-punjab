"use strict";

(() => {
  const AUTH_CONFIG = Object.freeze({
    clientId: "501721622823-oocufe77mi810v82kcgeeskg5b9d8rms.apps.googleusercontent.com",
    allowedEmails: Object.freeze([
      "shafatiwana44@gmail.com",
      "abdulnafa1122@gmail.com",
    ]),
  });

  const FIREBASE_CONFIG = Object.freeze({
    apiKey: "AIzaSyB1kCR2vJVCoW5qj4OK11SOq9INXATs4rA",
    authDomain: "shutra-punjab.firebaseapp.com",
    projectId: "shutra-punjab",
    storageBucket: "shutra-punjab.firebasestorage.app",
    messagingSenderId: "501721622823",
    appId: "1:501721622823:web:c7d5281727a8a8421ae102",
  });

  const FIREBASE_SDK_VERSION = "12.18.0";
  const FIREBASE_SDK_BASE = `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}`;
  const GOOGLE_IDENTITY_SRC = "https://accounts.google.com/gsi/client";
  const VALID_ISSUERS = new Set(["accounts.google.com", "https://accounts.google.com"]);
  const DEVICE_ID_STORAGE_KEY = "suthra-punjab:browser-device-id:v1";
  const LEASE_COLLECTION = "activeBrowserLeases";
  const LEASE_DOCUMENT = "bannerMaker";
  const HEARTBEAT_INTERVAL_MS = 45_000;
  const LOCAL_LEASE_GRACE_MS = 150_000;
  const WATCHDOG_INTERVAL_MS = 10_000;
  const SESSION_DURATION_MS = 4 * 60 * 60 * 1_000;
  const FIREBASE_WRITE_TIMEOUT_MS = 15_000;
  const SIGN_OUT_RELEASE_TIMEOUT_MS = 5_000;

  const DEFAULT_GATE_COPY = Object.freeze({
    title: "Sign in to continue",
    message:
      "اگر آپ یہ ویب سائٹ استعمال کرنا چاہتے ہیں تو براہِ کرم براہِ راست واٹس ایپ پر رابطہ کریں۔ شکریہ۔",
    instruction: "Use an authorized Google account to open the banner maker.",
  });

  const DEVICE_CONFLICT_COPY = Object.freeze({
    title: "One device at a time",
    message:
      "یہ ویب سائٹ پہلے ہی کسی دوسرے موبائل پر استعمال ہو رہی ہے۔ ایک وقت میں صرف ایک ڈیوائس پر لاگ اِن کیا جا سکتا ہے۔",
    instruction: "Sign out on the first device, or wait up to 3 minutes before trying again.",
  });

  const CONNECTION_REQUIRED_COPY = Object.freeze({
    title: "Connection required",
    message:
      "ڈیوائس کی تصدیق مکمل نہیں ہو سکی۔ انٹرنیٹ کنکشن چیک کریں اور دوبارہ سائن اِن کریں۔",
    instruction: "An internet connection is required to keep this private session active.",
  });

  const elements = {
    gate: document.querySelector("#authGate"),
    title: document.querySelector("#authTitle"),
    message: document.querySelector("#authMessage"),
    instruction: document.querySelector("#authInstruction"),
    protectedApp: document.querySelector("#protectedApp"),
    signInButton: document.querySelector("#googleSignInButton"),
    status: document.querySelector("#authStatus"),
    retryButton: document.querySelector("#authRetryButton"),
    accountControl: document.querySelector("#accountControl"),
    signedInEmail: document.querySelector("#signedInEmail"),
    signOutButton: document.querySelector("#signOutButton"),
    sessionCheckOverlay: document.querySelector("#sessionCheckOverlay"),
    sessionCheckTitle: document.querySelector("#sessionCheckTitle"),
    sessionCheckDetail: document.querySelector("#sessionCheckDetail"),
  };

  let googleIdentityReady = false;
  let googleIdentityInitialized = false;
  let googleSdkLoadPromise = null;
  let firebaseLoadPromise = null;
  let firebaseServices = null;
  let leaseSession = null;
  let leaseWritePromise = null;
  let heartbeatTimer = null;
  let leaseWatchdogTimer = null;
  let sessionExpiryTimer = null;
  let lastLeaseConfirmedAt = 0;
  let authenticationInProgress = false;
  let signOutInProgress = false;
  let leaseFailurePromise = null;
  let resumeCheckPromise = null;

  function setAuthStatus(message, type = "info", language = "en") {
    elements.status.textContent = message;
    elements.status.classList.toggle("is-error", type === "error");
    elements.status.classList.toggle("is-success", type === "success");
    elements.status.lang = language;
    elements.status.dir = language === "ur" ? "rtl" : "ltr";
  }

  function setGateCopy(copy) {
    elements.title.textContent = copy.title;
    elements.message.textContent = copy.message;
    elements.instruction.textContent = copy.instruction;
  }

  function setAuthenticationBusy(isBusy) {
    authenticationInProgress = isBusy;
    elements.signInButton.classList.toggle("is-busy", isBusy);
    elements.signInButton.setAttribute("aria-busy", String(isBusy));
    elements.retryButton.disabled = isBusy;
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

  function isAllowedEmail(email) {
    return AUTH_CONFIG.allowedEmails.includes(email);
  }

  function isAllowedGoogleCredential(payload) {
    const now = Math.floor(Date.now() / 1000);
    const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";

    return (
      Boolean(payload.sub) &&
      isAllowedEmail(email) &&
      payload.email_verified === true &&
      audienceMatches(payload.aud) &&
      (!payload.azp || payload.azp === AUTH_CONFIG.clientId) &&
      VALID_ISSUERS.has(payload.iss) &&
      Number.isFinite(payload.exp) &&
      payload.exp > now &&
      (!Number.isFinite(payload.nbf) || payload.nbf <= now + 60)
    );
  }

  function isAllowedFirebaseUser(user) {
    const email = typeof user?.email === "string" ? user.email.trim().toLowerCase() : "";
    return Boolean(user?.uid) && isAllowedEmail(email) && user.emailVerified === true;
  }

  function createRandomDeviceId() {
    if (typeof window.crypto?.randomUUID === "function") return window.crypto.randomUUID();

    const bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  function getOrCreateDeviceId() {
    try {
      const existing = window.localStorage.getItem(DEVICE_ID_STORAGE_KEY);
      if (existing && existing.length >= 32 && existing.length <= 128) return existing;

      const deviceId = createRandomDeviceId();
      window.localStorage.setItem(DEVICE_ID_STORAGE_KEY, deviceId);
      if (window.localStorage.getItem(DEVICE_ID_STORAGE_KEY) !== deviceId) {
        throw new Error("Device identifier could not be saved");
      }
      return deviceId;
    } catch (error) {
      const storageError = new Error("Browser storage is required for the one-device check");
      storageError.code = "device/storage-unavailable";
      storageError.cause = error;
      throw storageError;
    }
  }

  function loadFirebase() {
    if (firebaseServices) return Promise.resolve(firebaseServices);
    if (firebaseLoadPromise) return firebaseLoadPromise;

    firebaseLoadPromise = Promise.all([
      import(`${FIREBASE_SDK_BASE}/firebase-app.js`),
      import(`${FIREBASE_SDK_BASE}/firebase-auth.js`),
      import(`${FIREBASE_SDK_BASE}/firebase-firestore-lite.js`),
    ])
      .then(([appSdk, authSdk, firestoreSdk]) => {
        const app = appSdk.initializeApp(FIREBASE_CONFIG);
        const auth = authSdk.initializeAuth(app, { persistence: authSdk.inMemoryPersistence });
        const db = firestoreSdk.getFirestore(app);

        firebaseServices = {
          auth,
          db,
          createGoogleCredential: (idToken) => authSdk.GoogleAuthProvider.credential(idToken),
          signInWithCredential: authSdk.signInWithCredential,
          signOut: authSdk.signOut,
          doc: firestoreSdk.doc,
          setDoc: firestoreSdk.setDoc,
          serverTimestamp: firestoreSdk.serverTimestamp,
        };
        return firebaseServices;
      })
      .catch((error) => {
        firebaseLoadPromise = null;
        throw error;
      });

    return firebaseLoadPromise;
  }

  function stopHeartbeat() {
    if (heartbeatTimer !== null) {
      window.clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
    if (leaseWatchdogTimer !== null) {
      window.clearInterval(leaseWatchdogTimer);
      leaseWatchdogTimer = null;
    }
  }

  function stopSessionExpiryTimer() {
    if (sessionExpiryTimer !== null) {
      window.clearTimeout(sessionExpiryTimer);
      sessionExpiryTimer = null;
    }
  }

  function isSessionExpired(session = leaseSession) {
    return Boolean(session?.expiresAt) && Date.now() >= session.expiresAt;
  }

  function expireActiveSession() {
    if (!leaseSession || signOutInProgress || document.hidden) return;
    elements.sessionCheckTitle.textContent = "4-hour session complete";
    elements.sessionCheckDetail.textContent = "Returning to Google sign-in…";
    setSessionChecking(true);
    void releaseLeaseAndSignOut();
  }

  function scheduleSessionExpiry() {
    stopSessionExpiryTimer();
    if (!leaseSession || signOutInProgress) return;

    const remainingMs = leaseSession.expiresAt - Date.now();
    if (remainingMs <= 0) {
      expireActiveSession();
      return;
    }

    sessionExpiryTimer = window.setTimeout(() => {
      sessionExpiryTimer = null;
      if (isSessionExpired()) expireActiveSession();
      else scheduleSessionExpiry();
    }, remainingMs);
  }

  function setSessionChecking(isChecking) {
    if (isChecking && !isSessionExpired()) {
      elements.sessionCheckTitle.textContent = "Checking this device…";
      elements.sessionCheckDetail.textContent = "Please keep your internet connection on.";
    }
    elements.sessionCheckOverlay.hidden = !isChecking;
    elements.sessionCheckOverlay.setAttribute("aria-hidden", String(!isChecking));
    elements.protectedApp.toggleAttribute("inert", isChecking);
    elements.protectedApp.toggleAttribute("aria-busy", isChecking);

    if (isChecking) {
      document.body.classList.add("auth-locked");
    } else if (elements.gate.hidden && !elements.protectedApp.hidden) {
      elements.protectedApp.removeAttribute("inert");
      document.body.classList.remove("auth-locked");
    }
  }

  function unlockApp(user) {
    elements.signedInEmail.textContent = user.email || "Authorized account";
    elements.accountControl.hidden = false;
    elements.protectedApp.hidden = false;
    elements.protectedApp.removeAttribute("inert");
    elements.protectedApp.removeAttribute("aria-hidden");
    elements.gate.hidden = true;
    elements.gate.setAttribute("aria-hidden", "true");
    setSessionChecking(false);

    window.requestAnimationFrame(() => {
      document.querySelector("#ucSelect")?.focus({ preventScroll: true });
    });
  }

  function lockApp(copy, statusMessage) {
    elements.sessionCheckOverlay.hidden = true;
    elements.sessionCheckOverlay.setAttribute("aria-hidden", "true");
    elements.protectedApp.hidden = true;
    elements.protectedApp.setAttribute("inert", "");
    elements.protectedApp.setAttribute("aria-hidden", "true");
    elements.accountControl.hidden = true;
    elements.gate.hidden = false;
    elements.gate.removeAttribute("aria-hidden");
    document.body.classList.add("auth-locked");
    setGateCopy(copy);
    setAuthStatus(statusMessage, "error");

    window.requestAnimationFrame(() => {
      if (googleIdentityInitialized && window.google?.accounts?.id) renderGoogleButton();
      elements.title.focus({ preventScroll: true });
    });
  }

  function hasErrorCode(error, expectedCode) {
    const code = typeof error?.code === "string" ? error.code : "";
    return code === expectedCode || code.endsWith(`/${expectedCode}`);
  }

  function isPermissionDenied(error) {
    return hasErrorCode(error, "permission-denied");
  }

  function withTimeout(promise, timeoutMs, message, errorCode = "device/write-timeout") {
    return new Promise((resolve, reject) => {
      const timeoutId = window.setTimeout(() => {
        const timeoutError = new Error(message);
        timeoutError.code = errorCode;
        reject(timeoutError);
      }, timeoutMs);
      Promise.resolve(promise).then(
        (value) => {
          window.clearTimeout(timeoutId);
          resolve(value);
        },
        (error) => {
          window.clearTimeout(timeoutId);
          reject(error);
        },
      );
    });
  }

  async function safeFirebaseSignOut() {
    if (!firebaseServices) return;
    try {
      await firebaseServices.signOut(firebaseServices.auth);
    } catch (error) {
      console.warn("Firebase sign-out did not complete cleanly.", error);
    }
  }

  function showUnauthorizedAccount() {
    setGateCopy(DEFAULT_GATE_COPY);
    setAuthStatus(
      "یہ گوگل اکاؤنٹ مجاز نہیں ہے۔ رسائی کے لیے براہِ راست واٹس ایپ پر رابطہ کریں۔ شکریہ۔",
      "error",
      "ur",
    );
    window.google?.accounts?.id?.disableAutoSelect();
  }

  function createOfflineError() {
    const error = new Error("An internet connection is required for the device check");
    error.code = "device/offline";
    return error;
  }

  function writeLease(session, active, timeoutMs = FIREBASE_WRITE_TIMEOUT_MS) {
    if (window.navigator.onLine === false) return Promise.reject(createOfflineError());

    const write = firebaseServices.setDoc(session.reference, {
      ownerId: session.ownerId,
      active,
      heartbeatAt: firebaseServices.serverTimestamp(),
    });

    return withTimeout(write, timeoutMs, "The device check timed out");
  }

  function handleLeaseLoss(error, session = leaseSession) {
    if (!session || leaseSession !== session || signOutInProgress) return Promise.resolve();
    if (leaseFailurePromise) return leaseFailurePromise;

    leaseFailurePromise = (async () => {
      const denied = isPermissionDenied(error);
      stopHeartbeat();
      stopSessionExpiryTimer();
      leaseSession = null;

      if (denied) {
        lockApp(
          DEVICE_CONFLICT_COPY,
          "This browser was blocked by the one-device check. If no other device is active, verify the Firebase setup and try again.",
        );
      } else {
        console.error("The active-device lease could not be renewed.", error);
        lockApp(
          CONNECTION_REQUIRED_COPY,
          "The device check lost its connection. Check the internet connection and sign in again.",
        );
      }

      await safeFirebaseSignOut();
    })().finally(() => {
      leaseFailurePromise = null;
    });

    return leaseFailurePromise;
  }

  function renewLease({ failClosed = false } = {}) {
    if (!leaseSession || signOutInProgress) return Promise.resolve(false);
    if (isSessionExpired()) {
      expireActiveSession();
      return Promise.resolve(false);
    }
    if (leaseWritePromise) return leaseWritePromise;

    const session = leaseSession;
    let trackedPromise;
    trackedPromise = writeLease(session, true)
      .then(() => {
        if (leaseSession !== session || signOutInProgress) return false;
        if (isSessionExpired(session)) {
          expireActiveSession();
          return false;
        }
        lastLeaseConfirmedAt = Date.now();
        return true;
      })
      .catch(async (error) => {
        if (leaseSession === session && !signOutInProgress) {
          if (document.hidden) {
            console.warn("The hidden page will verify its device lease when it becomes visible.", error);
          } else if (isPermissionDenied(error) || failClosed) {
            await handleLeaseLoss(error, session);
          } else {
            console.warn("The device heartbeat will be retried.", error);
          }
        }
        return false;
      })
      .finally(() => {
        if (leaseWritePromise === trackedPromise) leaseWritePromise = null;
      });

    leaseWritePromise = trackedPromise;
    return trackedPromise;
  }

  function startHeartbeat() {
    stopHeartbeat();
    if (!leaseSession || document.hidden || signOutInProgress) return;
    if (isSessionExpired()) {
      expireActiveSession();
      return;
    }

    heartbeatTimer = window.setInterval(() => {
      if (isSessionExpired()) {
        expireActiveSession();
      } else if (!document.hidden) {
        void renewLease();
      }
    }, HEARTBEAT_INTERVAL_MS);
    leaseWatchdogTimer = window.setInterval(() => {
      if (
        document.hidden ||
        !leaseSession ||
        Date.now() - lastLeaseConfirmedAt <= LOCAL_LEASE_GRACE_MS
      ) {
        return;
      }
      const session = leaseSession;
      const timeoutError = new Error("The device lease could not be confirmed in time");
      timeoutError.code = "lease/confirmation-timeout";
      void handleLeaseLoss(timeoutError, session);
    }, WATCHDOG_INTERVAL_MS);
  }

  function verifyLeaseOnResume() {
    if (!leaseSession || signOutInProgress || document.hidden) return Promise.resolve();
    if (isSessionExpired()) {
      expireActiveSession();
      return Promise.resolve();
    }
    if (resumeCheckPromise) return resumeCheckPromise;

    const session = leaseSession;
    stopHeartbeat();
    setSessionChecking(true);

    let trackedPromise;
    trackedPromise = (async () => {
      const pendingWrite = leaseWritePromise;
      if (pendingWrite) await pendingWrite;
      if (leaseSession !== session || signOutInProgress || document.hidden) return;
      if (isSessionExpired(session)) {
        expireActiveSession();
        return;
      }

      const confirmed = await renewLease({ failClosed: true });
      if (
        confirmed &&
        leaseSession === session &&
        !signOutInProgress &&
        !document.hidden
      ) {
        setSessionChecking(false);
        startHeartbeat();
        scheduleSessionExpiry();
      }
    })()
      .catch((error) => {
        if (leaseSession === session && !signOutInProgress && !document.hidden) {
          return handleLeaseLoss(error, session);
        }
        return undefined;
      })
      .finally(() => {
        if (resumeCheckPromise === trackedPromise) resumeCheckPromise = null;
      });

    resumeCheckPromise = trackedPromise;
    return trackedPromise;
  }

  function describeFirebaseError(error) {
    if (hasErrorCode(error, "operation-not-allowed")) {
      return "Google sign-in is not enabled in Firebase Authentication yet.";
    }
    if (hasErrorCode(error, "invalid-credential") || hasErrorCode(error, "invalid-idp-response")) {
      return "Google sign-in expired or could not be verified. Please sign in again.";
    }
    if (hasErrorCode(error, "failed-precondition")) {
      return "Cloud Firestore is not ready yet. Create the database and try again.";
    }
    if (hasErrorCode(error, "resource-exhausted")) {
      return "The Firebase free quota is temporarily unavailable. Please try again later.";
    }
    if (
      hasErrorCode(error, "network-request-failed") ||
      hasErrorCode(error, "unavailable") ||
      hasErrorCode(error, "deadline-exceeded") ||
      hasErrorCode(error, "write-timeout") ||
      hasErrorCode(error, "offline")
    ) {
      return "The device check could not connect. Check your internet connection and try again.";
    }
    if (hasErrorCode(error, "unauthorized-domain")) {
      return "This website address is not authorized in Firebase yet.";
    }
    if (hasErrorCode(error, "storage-unavailable")) {
      return "Allow browser storage for this site, then try again.";
    }
    return "Google sign-in or the device check could not be completed. Please try again.";
  }

  async function handleCredentialResponse(response) {
    if (authenticationInProgress) return;
    setAuthenticationBusy(true);
    setGateCopy(DEFAULT_GATE_COPY);
    elements.retryButton.hidden = true;

    try {
      const payload = decodeJwtPayload(response?.credential);
      if (!isAllowedGoogleCredential(payload)) {
        showUnauthorizedAccount();
        return;
      }

      setAuthStatus("Verifying the account and checking this device…");
      const services = await loadFirebase();
      const credential = services.createGoogleCredential(response.credential);
      const result = await services.signInWithCredential(services.auth, credential);

      if (!isAllowedFirebaseUser(result.user)) {
        await safeFirebaseSignOut();
        showUnauthorizedAccount();
        return;
      }

      const ownerId = getOrCreateDeviceId();
      const reference = services.doc(services.db, LEASE_COLLECTION, LEASE_DOCUMENT);
      const session = { reference, ownerId, expiresAt: 0 };

      try {
        await writeLease(session, true);
      } catch (error) {
        await safeFirebaseSignOut();
        if (isPermissionDenied(error)) {
          lockApp(
            DEVICE_CONFLICT_COPY,
            "Another device may be active. If it is already signed out, verify the Firebase setup and try again.",
          );
          return;
        }
        throw error;
      }

      session.expiresAt = Date.now() + SESSION_DURATION_MS;
      leaseSession = session;
      lastLeaseConfirmedAt = Date.now();
      setAuthStatus("Access confirmed on this device.", "success");
      unlockApp(result.user);
      startHeartbeat();
      scheduleSessionExpiry();
    } catch (error) {
      console.error("Private sign-in could not be completed.", error);
      await safeFirebaseSignOut();
      setAuthStatus(describeFirebaseError(error), "error");
    } finally {
      setAuthenticationBusy(false);
    }
  }

  function loadGoogleIdentity() {
    if (window.google?.accounts?.id) return Promise.resolve();
    if (googleSdkLoadPromise) return googleSdkLoadPromise;

    googleSdkLoadPromise = new Promise((resolve, reject) => {
      document.querySelector("#googleIdentityServices")?.remove();
      const script = document.createElement("script");
      const timeoutId = window.setTimeout(() => {
        script.remove();
        reject(new Error("Google Identity Services timed out"));
      }, 15_000);

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
      googleSdkLoadPromise = null;
    });

    return googleSdkLoadPromise;
  }

  function renderGoogleButton() {
    if (!googleIdentityInitialized || !window.google?.accounts?.id || elements.gate.hidden) return;
    const availableWidth = Math.floor(elements.signInButton.getBoundingClientRect().width);
    const buttonWidth = Math.max(120, Math.min(320, availableWidth || 240));
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
    setGateCopy(DEFAULT_GATE_COPY);
    setAuthStatus("Loading secure Google sign-in…");

    try {
      await Promise.all([loadGoogleIdentity(), loadFirebase()]);
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
      setAuthStatus("Sign in with an authorized Google account to continue.");
    } catch (error) {
      googleIdentityReady = false;
      console.error("Private sign-in could not be loaded.", error);
      elements.signInButton.replaceChildren();
      elements.retryButton.hidden = false;
      setAuthStatus("Secure sign-in could not load. Check your internet connection and try again.", "error");
    }
  }

  async function releaseLeaseAndSignOut() {
    if (signOutInProgress) return;
    signOutInProgress = true;
    elements.signOutButton.disabled = true;
    stopHeartbeat();
    stopSessionExpiryTimer();

    const session = leaseSession;
    leaseSession = null;
    let pendingRenewalSettled = true;

    if (leaseWritePromise) {
      try {
        await withTimeout(
          leaseWritePromise,
          SIGN_OUT_RELEASE_TIMEOUT_MS,
          "Pending lease renewal timed out",
        );
      } catch (error) {
        pendingRenewalSettled = false;
        console.warn("A pending lease renewal did not finish before sign-out.", error);
      }
    }

    try {
      if (session && firebaseServices && pendingRenewalSettled) {
        await writeLease(session, false, SIGN_OUT_RELEASE_TIMEOUT_MS);
      }
    } catch (error) {
      console.warn("The device lease will expire automatically because release did not complete.", error);
    } finally {
      await safeFirebaseSignOut();
      if (googleIdentityReady) window.google.accounts.id.disableAutoSelect();
      window.location.reload();
    }
  }

  elements.retryButton.addEventListener("click", initializeAuthentication);
  elements.signOutButton.addEventListener("click", () => void releaseLeaseAndSignOut());

  let resizeTimer;
  window.addEventListener("resize", () => {
    if (!googleIdentityInitialized || elements.gate.hidden) return;
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(renderGoogleButton, 120);
  });

  window.addEventListener("online", () => {
    if (leaseSession && !document.hidden) void verifyLeaseOnResume();
  });

  window.addEventListener("pagehide", () => {
    if (leaseSession) stopHeartbeat();
  });

  window.addEventListener("pageshow", () => {
    if (leaseSession && !document.hidden) void verifyLeaseOnResume();
  });

  document.addEventListener("visibilitychange", () => {
    if (!leaseSession) return;
    if (document.hidden) {
      stopHeartbeat();
      return;
    }
    void verifyLeaseOnResume();
  });

  window.requestAnimationFrame(() => elements.title.focus({ preventScroll: true }));
  initializeAuthentication();
})();
