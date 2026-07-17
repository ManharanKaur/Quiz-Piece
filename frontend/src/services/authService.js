const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const TOKEN_STORAGE_KEY = "quiz_app_token";

const requestOptions = {
  credentials: "include",
};

const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
};

export const registerUser = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    ...requestOptions,

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(formData),
  });

  return handleResponse(response);
};

export const loginUser = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    ...requestOptions,

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(formData),
  });

  return handleResponse(response);
};

export const refreshAccessToken = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    ...requestOptions,
  });

  return handleResponse(response);
};

export const logoutUser = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    ...requestOptions,
  });

  return handleResponse(response);
};

export const getCurrentUser = async (token) => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    ...requestOptions,

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

export const deleteAccount = async (token) => {
  const response = await fetch(`${API_BASE_URL}/auth/delete-account`, {
    method: "DELETE",
    ...requestOptions,

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};
