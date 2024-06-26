import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function flattenAttributes(data: any): any {
  // Check if data is a plain object; return as is if not
  if (
    typeof data !== "object" ||
    data === null ||
    data instanceof Date ||
    typeof data === "function"
  ) {
    return data;
  }

  // If data is an array, apply flattenAttributes to each element and return as array
  if (Array.isArray(data)) {
    return data.map((item) => flattenAttributes(item));
  }

  // Initialize an object with an index signature for the flattened structure
  const flattened: { [key: string]: any } = {};

  // Iterate over each key in the object
  for (const key in data) {
    // Skip inherited properties from the prototype chain
    if (!data.hasOwnProperty(key)) continue;

    // If the key is 'attributes' or 'data', and its value is an object, merge their contents
    if (
      (key === "attributes" || key === "data") &&
      typeof data[key] === "object" &&
      !Array.isArray(data[key])
    ) {
      Object.assign(flattened, flattenAttributes(data[key]));
    } else {
      // For other keys, copy the value, applying flattenAttributes if it's an object
      flattened[key] = flattenAttributes(data[key]);
    }
  }

  return flattened;
}

export function getStrapiURL() {
  // TODO: discuss in the next stream
  console.log(ENV);
  return ENV.VITE_STRAPI_API_URL ?? "http://localhost:1337";
}

export function getStrapiMedia(url: string | null) {
  if (url == null) return null;
  if (url.startsWith("data:")) return url;
  if (url.startsWith("http") || url.startsWith("//")) return url;
  return `${getStrapiURL()}${url}`;
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}






export function extractYouTubeID(urlOrID: string): string | null {
  // Regular expression for YouTube ID format
  const regExpID = /^[a-zA-Z0-9_-]{11}$/;

  // Check if the input is a YouTube ID
  if (regExpID.test(urlOrID)) {
      return urlOrID;
  }

  // Regular expression for standard YouTube links
  const regExpStandard = /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/;

  // Regular expression for YouTube Shorts links
  const regExpShorts = /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/;

  // Check for standard YouTube link
  const matchStandard = urlOrID.match(regExpStandard);
  if (matchStandard) {
      return matchStandard[1];
  }

  // Check for YouTube Shorts link
  const matchShorts = urlOrID.match(regExpShorts);
  if (matchShorts) {
      return matchShorts[1];
  }

  // Return null if no match is found
  return null;
}

function timeStringToSeconds(timeString: string) {
  // Split the time string into its components
  const parts = timeString.split(':');

  // Make sure the time string format is correct
  if (parts.length !== 3) {
      throw new Error('Invalid time format. Please use "HH:MM:SS".');
  }

  // Convert hours, minutes, and seconds to integers
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const seconds = parseInt(parts[2], 10);

  // Check for any NaN values
  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
      throw new Error('Invalid time format. Please ensure all components are numbers.');
  }

  // Convert the time to seconds
  return hours * 3600 + minutes * 60 + seconds;
}

const MATCH_START_QUERY = /[?&#](?:start|t)=([0-9hms]+)/
const MATCH_END_QUERY = /[?&#]end=([0-9hms]+)/
const MATCH_START_STAMP = /(\d+)(h|m|s)/g
const MATCH_NUMERIC = /^\d+$/

// Parse YouTube URL for a start time param, ie ?t=1h14m30s
// and return the start time in seconds
function parseTimeParam (url: any, pattern: RegExp): number | undefined {
  if (url instanceof Array) {
    return undefined
  }
  const match = url.match(pattern)
  if (match) {
    const stamp = match[1]
    if (stamp.match(MATCH_START_STAMP)) {
      return parseTimeString(stamp)
    }
    if (MATCH_NUMERIC.test(stamp)) {
      return parseInt(stamp)
    }
  }
  return undefined
}

function parseTimeString (stamp: string) {
  let seconds = 0
  let array = MATCH_START_STAMP.exec(stamp)
  while (array !== null) {
    const [, count, period] = array
    if (period === 'h') seconds += parseInt(count, 10) * 60 * 60
    if (period === 'm') seconds += parseInt(count, 10) * 60
    if (period === 's') seconds += parseInt(count, 10)
    array = MATCH_START_STAMP.exec(stamp)
  }
  return seconds
}

export function parseStartTime (url: string ) {
  return parseTimeParam(url, MATCH_START_QUERY)
}

export function parseEndTime (url: string) {
  return parseTimeParam(url, MATCH_END_QUERY)
}

export function isValidYouTubeUrl(url: string) {
  const regex =
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/(watch\?v=|embed\/)?[a-zA-Z0-9_-]+(\?.*)?$/;
  return regex.test(url);
}