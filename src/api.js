// src/api.js
// Centralized API helper functions for TripCheck frontend

const BASE_URL = "http://127.0.0.1:8000";

function getAuthToken() {
  return localStorage.getItem("authToken") || "";
}

function getHeaders(isJson = true) {
  const headers = {};
  if (isJson) headers["Content-Type"] = "application/json";
  const token = getAuthToken();
  if (token) headers["Authorization"] = `Token ${token}`;
  return headers;
}

export async function postJson(path, data) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw result;
  return result;
}

export async function getJson(path) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    headers: getHeaders(false),
  });
  const result = await response.json();
  if (!response.ok) throw result;
  return result;
}

export async function deleteJson(path) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "DELETE",
    headers: getHeaders(false),
  });
  if (!response.ok) {
    let result = {};
    try {
      result = await response.json();
    } catch {
      result = { error: "Delete request failed." };
    }
    throw result;
  }
  return true;
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

export function fetchWardrobe(user_id) {
  return getJson(`/api/wardrobe/${user_id}`);
}
export function deleteWardrobeItem(user_id, item_id) {
  return deleteJson(`/api/wardrobe/${user_id}/${item_id}`);
}
export function fetchBestSellingProducts() {
  return getJson("/api/marketplace");
}
