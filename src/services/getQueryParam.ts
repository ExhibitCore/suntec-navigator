const getQuery = () => {
  if (typeof window !== "undefined") {
    return new URLSearchParams(window.location.search);
  }
  return new URLSearchParams();
};

const getQueryParam = (key: string): string | null => {
  return getQuery().get(key);
};

export default getQueryParam;
