// src/api.js
// Centralized API helper functions for DripCheck frontend

const BASE_URL = "http://127.0.0.1:8000";

// Endpoints that never require an Authorization header.
const PUBLIC_PATHS = [
  "/auth/signup/",
  "/auth/verify-otp/",
  "/auth/login/",
  "/auth/token/refresh/",
  "/auth/onboarding/public-submit/",
  "/api/logs",
];

function isPublicPath(path) {
  return PUBLIC_PATHS.some((p) => path.startsWith(p));
}

export function getAccessToken() {
  return localStorage.getItem("access_token") || "";
}

export function getRefreshToken() {
  return localStorage.getItem("refresh_token") || "";
}

export function saveAuthSession({ access_token, refresh_token, user_id } = {}) {
  if (access_token) localStorage.setItem("access_token", access_token);
  if (refresh_token) localStorage.setItem("refresh_token", refresh_token);
  if (user_id) localStorage.setItem("user_id", user_id);
}

export function clearAuthSession() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("isLoggedIn");
}

function getHeaders(isJson, includeAuth) {
  const headers = {};
  if (isJson) headers["Content-Type"] = "application/json";
  if (includeAuth) {
    const token = getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) return null;
  const response = await fetch(`${BASE_URL}/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  if (!response.ok) return null;
  const data = await response.json();
  if (data.access) localStorage.setItem("access_token", data.access);
  return data.access || null;
}

async function request(path, { method = "GET", data, formData, isJson = true, retry = true } = {}) {
  const includeAuth = !isPublicPath(path);
  const sendFormData = Boolean(formData);
  let headers = getHeaders(isJson && !sendFormData, includeAuth);
  const body = sendFormData ? formData : data != null ? JSON.stringify(data) : null;

  let response = await fetch(`${BASE_URL}${path}`, { method, headers, body });

  if (response.status === 401 && includeAuth && retry) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers = getHeaders(isJson && !sendFormData, includeAuth);
      response = await fetch(`${BASE_URL}${path}`, { method, headers, body });
    } else {
      clearAuthSession();
      window.location.href = "/";
      return {};
    }
  }

  const text = await response.text();
  let result = {};
  if (text) {
    try {
      result = JSON.parse(text);
    } catch {
      result = {};
    }
  }
  if (!response.ok) {
    const message =
      result.detail || result.error || result.message || result.non_field_errors?.[0] || "Request failed";
    const err = new Error(message);
    err.status = response.status;
    err.data = result;
    throw err;
  }
  return result;
}

export async function postJson(path, data) {
  return request(path, { method: "POST", data, isJson: true });
}

export async function postFormData(path, formData) {
  return request(path, { method: "POST", formData, isJson: false });
}

export async function getJson(path) {
  return request(path, { method: "GET", isJson: false });
}

export async function deleteJson(path) {
  return request(path, { method: "DELETE", isJson: false });
}

export async function deleteJsonBody(path, data) {
  return request(path, { method: "DELETE", data, isJson: true });
}

// Auth specific helpers
export function signup(mobile_no) {
  return postJson("/auth/signup/", { mobile_no });
}
export function verifyOtp(mobile_no, otp) {
  return postJson("/auth/verify-otp/", { mobile_no, otp });
}
export function login(mobile_no) {
  return postJson("/auth/login/", { mobile_no });
}
export function submitOnboarding(responses, full_name, email, mobile_no) {
  return postJson("/auth/onboarding/public-submit/", {
    responses,
    full_name,
    email,
    mobile_no,
  });
}

// Profile preferences (for the Edit Preferences screen)
export function fetchPreferences() {
  return getJson("/auth/onboarding/preferences/");
}
export function updatePreferences(responses) {
  return postJson("/auth/onboarding/preferences/", { responses });
}

// Wardrobe
export function fetchWardrobe() {
  return getJson('/api/wardrobe/');
}
export function deleteWardrobeItem(item_id) {
  return deleteJson(`/api/wardrobe/${item_id}`);
}
export function uploadProduct(formData) {
  return postFormData("/api/wardrobe/upload-product", formData);
}
export function addProductLink(url) {
  return postJson("/api/wardrobe/add-product-link", { url });
}
export function approveProduct(payload) {
  return postJson("/api/wardrobe/approve-product", payload);
}
export function generateAvatar(formData) {
  return postFormData("/api/wardrobe/generate-avatar", formData);
}

// Marketplace & bundles
export function fetchBestSellingProducts() {
  return getJson("/api/marketplace");
}
export function fetchBundles(occasion) {
  const query = occasion ? `?occasion=${encodeURIComponent(occasion)}` : '';
  return getJson(`/api/bundles/${query}`);
}
export function fetchBundlesFromItem(itemId) {
  return postJson('/api/bundle-generate/recommend-from-wardrobe/', { item_id: itemId });
}

// Wishlist
export function fetchWishlist() {
  return getJson("/api/wishlist/");
}
export function addWishlistItem(payload) {
  return postJson("/api/wishlist/", payload);
}
export function removeWishlistItem(payload) {
  return deleteJsonBody("/api/wishlist/", payload);
}

// AI generation suggestions
export function fetchTopwearSuggestions(params = {}) {
  return postJson("/api/ai-generation/topwear-suggestion/", params);
}
export function fetchBottomwearSuggestions(params = {}) {
  return postJson("/api/ai-generation/bottomwear-suggestion/", params);
}
export function fetchFootwearSuggestions(params = {}) {
  return postJson("/api/ai-generation/footwear-suggestion/", params);
}
