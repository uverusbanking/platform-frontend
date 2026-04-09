export const apiEndpoint = `${import.meta.env.VITE_API_URL}/api/v1`;

export const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[~!@#$^&*()_\-+={}[\]\\|"'`;<>,.?/]).{6,}$/;

export type responseInterface = {
  display: boolean;
  status: boolean;
  message: string;
  errorMsg?: string[];
};

export const defaultApiResponse: responseInterface = {
  display: false,
  status: true,
  message: "",
};

export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Comprehensive email validation regex
  return emailRegex.test(email);
}

export const hours = [...Array(13).keys()].map((num) =>
  num.toString().padStart(2, "0"),
);
export const minutes = [...Array(60).keys()].map((num) =>
  num.toString().padStart(2, "0"),
);
export const seconds = [...Array(60).keys()].map((num) =>
  num.toString().padStart(2, "0"),
);

export function pauseExecution(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type base64Interface = {
  display: boolean;
  status: boolean;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result?: any;
};

export const convertToBase64 = (file: File): Promise<base64Interface> => {
  return new Promise((resolve) => {
    const fileReader = new FileReader();
    if (!file)
      resolve({
        display: false,
        status: false,
        message: "",
      });

    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      // resolve(fileReader.result);
      resolve({
        display: false,
        status: true,
        message: "",
        result: fileReader.result,
      });
    };

    fileReader.onerror = () => {
      resolve({
        display: true,
        status: false,
        message: "Error loading image.",
      });
    };
  });
};

export const getQueryParams = (query: string) => {
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const result = params.get(query);

  return result || "";
};

export function maskPhoneNumber(phoneNumber: string) {
  // Remove any non-digit characters from the input
  const cleanedNumber = phoneNumber.replace(/\D/g, "");

  // Check if the cleaned number has at least 4 digits
  if (cleanedNumber.length < 4) {
    return phoneNumber;
    // return 'Invalid phone number';
  }

  // Extract the last 4 digits
  const lastFourDigits = cleanedNumber.slice(-4);

  // Create a masked version with asterisks
  const maskedNumber = "*".repeat(cleanedNumber.length - 4) + lastFourDigits;

  return maskedNumber;
}

export function maskEmailAddress(email: string) {
  // Split the email address into username and domain parts
  const [username, domain] = email.split("@");

  const lastThreeCharacters = username.slice(-3);
  const firstTwoCharacters = username.slice(0, 2);

  // Mask the username part
  const maskedUsername =
    firstTwoCharacters + "*".repeat(username.length - 5) + lastThreeCharacters;

  // // Extract the last 3 characters before the @ symbol
  // const maskedDomain = domain.slice(0, domain.length - 3) + '*'.repeat(3);

  // Combine the masked parts to form the masked email
  const maskedEmail = `${maskedUsername}@${domain}`;

  return maskedEmail;
}

// remove Special Characters And Replace Spaces
export function sanitizedString(text: string) {
  // Use a regular expression to match special characters and spaces
  const regex = /[^a-zA-Z0-9\s]/g;

  // Replace special characters with an empty string and spaces with hyphens
  const sanitizedString = text.replace(regex, "").replace(/\s+/g, "-");

  return sanitizedString;
}

export const stringToColor = (string: string) => {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
};

export const stringAvatar = (name: string) => {
  // return `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`;

  const items = name.split(" ");

  let newName = "";
  for (let i = 0; i < items.length; i++) {
    newName = newName + items[i][0];
    if (i > 1) break;
  }
  return newName;
};

export function getAvatarInitials(name?: string | null): string {
  if (!name) return ""; // handles null, undefined, empty string

  // Trim spaces and split by whitespace
  const parts = name.trim().split(/\s+/);

  if (parts.length === 0) return "";

  // If name has more than one word, take first letter of first 2 words
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  // Otherwise take first 2 letters of the single word
  return parts[0].slice(0, 2).toUpperCase();
}

export function formatedNumber(
  number: number,
  locales = "en-US",
  options = {},
) {
  return new Intl.NumberFormat(locales, options).format(number);
}

export const currencyDisplay = (amount: number, fractionDigits = 2) => {
  const formattedAmount = amount.toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: fractionDigits,
  });

  return formattedAmount;
};

export function displayMessageCount(messageCount: number) {
  if (messageCount < 1000) {
    return formatedNumber(messageCount).toString(); // No suffix needed for less than 1000
  } else if (messageCount < 1000000) {
    return (messageCount / 1000).toFixed(2) + "K"; // Suffix K for thousands
  } else if (messageCount < 1000000000) {
    return (messageCount / 1000000).toFixed(2) + "M"; // Suffix M for millions
  } else {
    return (messageCount / 1000000000).toFixed(2) + "B"; // Suffix B for billions
  }
}

export function isNumeric(str: string) {
  // Use regular expression to check if the string contains only digits
  const regex = /^\d+$/;
  return regex.test(str);
}

export function handleExternalUrl(
  url: string,
  target: "_blank" | "_parent" | "_self" | "_top" = "_blank",
) {
  if (!url) return;

  window.open(url, target, "noopener,noreferrer");
}

export function convertToSubCurrency(amount: number, factor = 100) {
  return Math.round(amount * factor);
}

export function diaplayTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string provided");
  }

  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const days = Math.floor(seconds / 86400);

  if (days > 7) {
    // return formatted date (e.g. YYYY-MM-DD)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  const intervals: { [key: string]: number } = {
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const key in intervals) {
    const interval = intervals[key];
    const count = Math.floor(seconds / interval);
    if (count >= 1) {
      return count === 1 ? `${count} ${key} ago` : `${count} ${key}s ago`;
    }
  }

  return "just now";
}

export function toDateInputValue(dateStr: string): string {
  const [day, mon, year] = dateStr.split("-");

  const monthMap: Record<string, string> = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  return `${year}-${monthMap[mon]}-${day}`;
}
