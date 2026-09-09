export const isValidUrl = (urlString) => {
  if (!urlString) return false;
  try {
    const url = new URL(urlString);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (e) {
    return false;
  }
};

export const isValidAlias = (alias) => {
  if (!alias) return true; // Optional
  const aliasRegex = /^[a-zA-Z0-9_-]{3,30}$/;
  return aliasRegex.test(alias);
};
