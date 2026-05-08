/**
 * crypto-store.js — Indian Accounts Solver
 * AES-GCM encryption / PBKDF2 key derivation (Web Crypto API only, zero deps).
 *
 * Exports on window.cryptoStore:
 *   init(pin)          — Derive key from PIN. PIN stored ONLY in sessionStorage.
 *   encrypt(obj)       — Returns an encrypted JSON string suitable for localStorage.
 *   decrypt(stored)    — Decrypts a string produced by encrypt(). Returns the original object.
 *   clear()            — Wipe the in-memory key and sessionStorage flag (on lock / logout).
 *   hasPin()           — True if a PBKDF2 salt exists in localStorage (i.e. PIN was ever set).
 *   isUnlocked()       — True if a key is loaded in memory for this session.
 */
(function () {
  'use strict';

  var SALT_KEY        = 'ias_pbkdf2_salt';
  var SESSION_FLAG    = 'ias_session_active';
  var IV_BYTES        = 12;
  var SALT_BYTES      = 16;
  var PBKDF2_ITERS    = 200000;

  /* ── tiny helpers ─────────────────────────────────────── */

  function buf2b64(buf) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(buf)));
  }

  function b642buf(b64) {
    var bin   = atob(b64);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) { bytes[i] = bin.charCodeAt(i); }
    return bytes.buffer;
  }

  function buf2hex(ab) {
    return Array.from(new Uint8Array(ab))
      .map(function (b) { return b.toString(16).padStart(2, '0'); })
      .join('');
  }

  function hex2buf(hex) {
    var bytes = new Uint8Array(hex.length / 2);
    for (var i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
    }
    return bytes.buffer;
  }

  /* ── key derivation ───────────────────────────────────── */

  async function deriveKey(pin, saltBuf) {
    var enc     = new TextEncoder();
    var rawKey  = await crypto.subtle.importKey(
      'raw',
      enc.encode(String(pin)),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    return crypto.subtle.deriveKey(
      {
        name:       'PBKDF2',
        salt:       saltBuf,
        iterations: PBKDF2_ITERS,
        hash:       'SHA-256'
      },
      rawKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /* ── module state (single in-memory key) ─────────────── */

  var _key = null;

  /* ── public API ───────────────────────────────────────── */

  /**
   * Derive an AES-GCM key from the user PIN via PBKDF2.
   * Creates a random 16-byte salt on first call; re-uses the persisted salt
   * on subsequent calls so data encrypted in earlier sessions can be decrypted.
   * The PIN itself is never written to disk or localStorage.
   *
   * @param {string} pin  4–6 digit string
   */
  async function init(pin) {
    if (!pin || !/^\d{4,6}$/.test(String(pin))) {
      throw new Error('PIN must be 4–6 digits.');
    }

    var saltHex = localStorage.getItem(SALT_KEY);
    var saltBuf;

    if (saltHex) {
      saltBuf = hex2buf(saltHex);
    } else {
      var saltArr = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
      saltBuf     = saltArr.buffer;
      localStorage.setItem(SALT_KEY, buf2hex(saltBuf));
    }

    _key = await deriveKey(pin, saltBuf);
    sessionStorage.setItem(SESSION_FLAG, '1');
  }

  /**
   * Encrypt a serialisable JS object.
   * Generates a fresh random 12-byte IV for every call.
   *
   * @param   {*}       obj  Any JSON-serialisable value
   * @returns {string}       JSON string with `iv` and `ct` fields (safe to write to localStorage)
   */
  async function encrypt(obj) {
    if (!_key) { throw new Error('cryptoStore: call init(pin) first.'); }

    var enc        = new TextEncoder();
    var iv         = crypto.getRandomValues(new Uint8Array(IV_BYTES));
    var ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      _key,
      enc.encode(JSON.stringify(obj))
    );

    return JSON.stringify({ iv: buf2b64(iv.buffer), ct: buf2b64(ciphertext) });
  }

  /**
   * Decrypt a string produced by encrypt().
   *
   * @param   {string} stored  Value previously written by encrypt()
   * @returns {*}              The original object
   */
  async function decrypt(stored) {
    if (!_key) { throw new Error('cryptoStore: call init(pin) first.'); }

    var payload    = JSON.parse(stored);
    var dec        = new TextDecoder();
    var plaintext  = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: b642buf(payload.iv) },
      _key,
      b642buf(payload.ct)
    );

    return JSON.parse(dec.decode(plaintext));
  }

  /**
   * Wipe the in-memory key and sessionStorage flag.
   * Call this on auto-lock or explicit sign-out.
   * localStorage data (encrypted blob + salt) is intentionally kept.
   */
  function clear() {
    _key = null;
    sessionStorage.removeItem(SESSION_FLAG);
  }

  /** @returns {boolean} True if a PBKDF2 salt exists (i.e. a PIN was previously set). */
  function hasPin() {
    return !!localStorage.getItem(SALT_KEY);
  }

  /** @returns {boolean} True if a key is held in memory for this session. */
  function isUnlocked() {
    return _key !== null && sessionStorage.getItem(SESSION_FLAG) === '1';
  }

  /* ── expose ───────────────────────────────────────────── */

  window.cryptoStore = {
    init:       init,
    encrypt:    encrypt,
    decrypt:    decrypt,
    clear:      clear,
    hasPin:     hasPin,
    isUnlocked: isUnlocked
  };
}());
