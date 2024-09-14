import { clsx } from "clsx";
import DOMPurify from "dompurify";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs) => {
  return twMerge(clsx(inputs));
};

export const handleShare = async (data, url) => {
  const shareData = {
    title: data.title || "Check this out!",
    text: data.text || "Here's something interesting!",
    url: url || window.location.href,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      console.log("Content shared successfully!");
    } catch (error) {
      console.error("Error sharing content:", error);
    }
  } else {
    // Fallback: Copy the URL to the clipboard if Web Share API is unavailable
    try {
      await navigator.clipboard.writeText(shareData.url);
      alert("URL copied to clipboard! You can now share it manually.");
    } catch (error) {
      console.error("Failed to copy the URL:", error);
    }
  }
};

export const purify = (content) => {
  return DOMPurify.sanitize(content);
};

