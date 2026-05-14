/**
 * auto-lock.js — Indian Accounts Solver
 * 5-minute idle auto-lock with a 30-second countdown warning toast.
 *
 * Exports on window.autoLock:
 *   start()  — Begin watching for idle. Call after the PIN is accepted.
 *   stop()   — Cancel timers (e.g. when the page is being torn down in tests).
 *
 * Dependencies (resolved at runtime, not at parse time):
 *   window.cryptoStore  — clear() called on lock
 *   window.i18n         — t() used for translated toast messages
 *   DOM element #autolock-toast  — warning toast container
 */
(function () {
  'use strict';

  var IDLE_MS  = 5 * 60 * 1000;   /* 5 minutes  */
  var WARN_MS  = 30 * 1000;        /* warn 30 s before lock */

  var _idleTimer      = null;
  var _warnTimer      = null;
  var _countdownTimer = null;

  // ── Fix #3 ──────────────────────────────────────────────────────────────────
  // _isListening tracks whether the activity event listeners are currently
  // attached to document. Without this flag, every call to start() — including
  // the one inside the "Stay Active" button handler — adds a fresh set of
  // listeners on top of the existing ones. After N presses, resetIdle() fires
  // N times per user gesture, creating N parallel timer chains and a memory
  // leak that grows for the entire session.
  var _isListening = false;
  // ────────────────────────────────────────────────────────────────────────────

  /* ── toast helpers ────────────────────────────────────── */

  function getToast() {
    return document.getElementById('autolock-toast');
  }

  function getMsgEl() {
    var t = getToast();
    return t ? t.querySelector('[data-autolock-msg]') : null;
  }

  function setToastMsg(secs) {
    var el  = getMsgEl();
    if (!el) { return; }
    var msg = (window.i18n && typeof window.i18n.t === 'function')
      ? window.i18n.t('lock.warning', { seconds: secs })
      : 'Session locks in ' + secs + ' seconds due to inactivity.';
    el.textContent = msg;
  }

  function showWarning(secs) {
    var toast = getToast();
    if (!toast) { return; }
    setToastMsg(secs);
    toast.hidden = false;
    toast.setAttribute('aria-hidden', 'false');
  }

  function hideWarning() {
    var toast = getToast();
    if (!toast) { return; }
    toast.hidden = true;
    toast.setAttribute('aria-hidden', 'true');
  }

  /* ── lock ─────────────────────────────────────────────── */

  function lock() {
    hideWarning();
    if (window.cryptoStore && typeof cryptoStore.clear === 'function') {
      cryptoStore.clear();
    }
    /* Short delay so the UI clears before reload */
    setTimeout(function () { window.location.reload(); }, 80);
  }

  /* ── timers ───────────────────────────────────────────── */

  function clearAllTimers() {
    clearTimeout(_idleTimer);
    clearTimeout(_warnTimer);
    clearInterval(_countdownTimer);
    _idleTimer      = null;
    _warnTimer      = null;
    _countdownTimer = null;
  }

  function scheduleWarnAndLock() {
    _warnTimer = setTimeout(function () {
      var secsLeft = Math.round(WARN_MS / 1000);
      showWarning(secsLeft);

      _countdownTimer = setInterval(function () {
        secsLeft -= 1;
        if (secsLeft > 0) {
          setToastMsg(secsLeft);
        } else {
          clearInterval(_countdownTimer);
        }
      }, 1000);
    }, IDLE_MS - WARN_MS);

    _idleTimer = setTimeout(lock, IDLE_MS);
  }

  /* ── activity handler ─────────────────────────────────── */

  function resetIdle() {
    hideWarning();
    clearAllTimers();
    scheduleWarnAndLock();
  }

  /* ── public API ───────────────────────────────────────── */

  var EVENTS = ['click', 'keydown', 'scroll', 'touchstart'];

  // ─── Fix #3 ─────────────────────────────────────────────────────────────────
  // start() is called in three places:
  //   1. initPinFlow() → on successful PIN unlock
  //   2. The "Stay Active" button click handler
  //   3. Any future caller (e.g. after re-authentication)
  //
  // Original code attached new listeners every time without checking whether
  // they were already registered. Because removeEventListener() requires the
  // exact same function reference, and we always pass `resetIdle` (which is
  // stable), deduplication is straightforward: skip addEventListener when
  // _isListening is already true, and only reset the idle countdown.
  // ────────────────────────────────────────────────────────────────────────────
  function start() {
    if (!_isListening) {
      // First call (or call after stop()) — attach listeners once.
      EVENTS.forEach(function (ev) {
        document.addEventListener(ev, resetIdle, { passive: true });
      });
      _isListening = true;
    }
    // Always reset the countdown, whether this is a first-start or a
    // "Stay Active" keepalive — this is the intended behaviour either way.
    resetIdle();
  }

  function stop() {
    clearAllTimers();
    EVENTS.forEach(function (ev) {
      document.removeEventListener(ev, resetIdle);
    });
    // Fix #3 — reset flag so start() re-attaches cleanly after a stop()
    _isListening = false;
    hideWarning();
  }

  window.autoLock = { start: start, stop: stop };
}());
