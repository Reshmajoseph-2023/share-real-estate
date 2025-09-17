// utils/common.js

// ---------- UI Helpers ----------
export const getMenuStyles = (menuOpened) => {
  if (document.documentElement.clientWidth <= 800) {
    return { right: !menuOpened && "-100%" };
  }
};

export const sliderSettings = {
  slidesPerView: 1,
  spaceBetween: 50,
  breakpoints: {
    480: { slidesPerView: 1 },
    600: { slidesPerView: 2 },
    750: { slidesPerView: 3 },
    1100: { slidesPerView: 4 },
  },
};

// ---------- Favourites Helpers ----------

// Safely pick an ID from various shapes (string | number | object | nested)
export const pickId = (x) =>
  x?.id ??
  x?._id ??
  x?.propertyId ??
  x?.propertyID ??
  x?.property_id ??
  x?.property?.id ??
  x?.property?._id ??
  (typeof x === "string" || typeof x === "number" ? x : null);

// Always normalize to an array of **string** IDs
export const normalizeFavs = (favs) => {
  if (!favs) return [];

  // If favs accidentally stored as a JSON string, try to parse
  if (typeof favs === "string") {
    try {
      return normalizeFavs(JSON.parse(favs));
    } catch {
      return [];
    }
  }

  // If server sent a wrapper like { ids: [...] }
  if (Array.isArray(favs?.ids)) {
    return favs.ids
      .map((v) => String(pickId(v)))
      .filter(Boolean);
  }

  // Normal array of ids/objects
  if (Array.isArray(favs)) {
    return favs
      .map((v) => String(pickId(v)))
      .filter(Boolean);
  }

  // Anything else -> empty list
  return [];
};

// Toggle an id in favourites (returns a new array of string IDs)
export const updateFavourites = (id, favourites) => {
  const idStr = String(pickId(id));
  const list = normalizeFavs(favourites);

  if (!idStr) return list;

  const exists = list.includes(idStr);
  const next = exists ? list.filter((x) => x !== idStr) : [...list, idStr];

  // De-duplicate just in case
  return Array.from(new Set(next));
};

// Return heart color based on membership in favourites
export const checkFavourites = (id, favourites) => {
  const idStr = String(pickId(id));
  const list = normalizeFavs(favourites);
  return list.includes(idStr) ? "#fa3e5f" : "white";
};

export const validateString = (value) => {
  return value?.length < 3 || value === null
    ? "Must have atleast 3 characters"
    : null;
};