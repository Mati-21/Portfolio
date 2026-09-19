import { createContext, useContext, useEffect, useState } from "react";

const BACKEND_URL = "http://localhost:3001";

const ContentContext = createContext({
  content: {},
  loading: true,
  resolveMediaUrl: (url) => url,
});

export function ContentProvider({ children }) {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    try {
      const res = await fetch("/api/content");
      if (res.ok) {
        const json = await res.json();
        if (json && json.content) {
          setContent(json.content);
        }
      }
    } catch {
      // Backend is optional during static preview; silently fallback to static defaults
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();

    // Listen for storage / window focus events so preview updates in real-time
    const handleFocus = () => fetchContent();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const resolveMediaUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//")) {
      return url;
    }
    if (url.startsWith("/uploads")) {
      return `${BACKEND_URL}${url}`;
    }
    return url;
  };

  return (
    <ContentContext.Provider value={{ content, loading, resolveMediaUrl, refreshContent: fetchContent }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
