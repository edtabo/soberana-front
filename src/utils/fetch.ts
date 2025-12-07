
import { RequestMethods } from './enums';
import { FetchParams } from "./interface";
import { localizations } from './localizations';

export const apiFetch = async ({
  url, method = RequestMethods.GET, body, headers: customHeaders, cache,
}: FetchParams) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...customHeaders,
    };

    console.log("🔵 API Request:", {
      url,
      method,
      body
    });

    const req = await fetch(`${process.env.BACK_URL}${url}`, {
      method,
      credentials: 'include',
      headers,
      body: body ? JSON.stringify(body) : undefined,
      cache: cache || 'no-store',
    });

    console.log("🟢 API Response Status:", req.status, req.statusText);

    if (!req.ok) {
      const errorBody = await req.text();
      console.error("🔴 API Error Response:", {
        status: req.status,
        statusText: req.statusText,
        url,
        body: errorBody
      });
      throw new Error(`${localizations.error.request} (${req.status}): ${errorBody}`);
    }

    return req.json();

  } catch (error) {
    console.error("🔴 Fetch Error:", error);
    throw error;
  }
};