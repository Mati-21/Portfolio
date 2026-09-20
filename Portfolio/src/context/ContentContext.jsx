import { createContext, useContext, useEffect, useState } from "react";
import { defaultContent } from "../data/defaultContent";

const BACKEND_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

const ContentContext = createContext({
  content: defaultContent,
  loading: true,
  resolveMediaUrl: (url) => url,
});

export function ContentProvider({ children }) {
  const [content, setContent] = useState(() => {
    try {
      const cached = localStorage.getItem("portfolio_cached_content");
      if (cached) {
        const parsed = JSON.parse(cached);
        return {
          ...defaultContent,
          ...parsed,
          projects: {
            ...defaultContent.projects,
            ...(parsed.projects || {}),
          },
          hero: {
            ...defaultContent.hero,
            ...(parsed.hero || {}),
          },
          about: {
            ...defaultContent.about,
            ...(parsed.about || {}),
          },
          skills: {
            ...defaultContent.skills,
            ...(parsed.skills || {}),
          },
          contact: {
            ...defaultContent.contact,
            ...(parsed.contact || {}),
          },
        };
      }
    } catch {
      // ignore
    }
    return defaultContent;
  });
  const [loading, setLoading] = useState(false);

  const fetchContent = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/content`);
      if (res.ok) {
        const json = await res.json();
        if (json && json.content) {
          setContent((prev) => ({
            ...prev,
            ...json.content,
            projects: {
              ...prev.projects,
              ...(json.content.projects || {}),
            },
            hero: {
              ...prev.hero,
              ...(json.content.hero || {}),
            },
            about: {
              ...prev.about,
              ...(json.content.about || {}),
            },
            skills: {
              ...prev.skills,
              ...(json.content.skills || {}),
            },
            contact: {
              ...prev.contact,
              ...(json.content.contact || {}),
            },
          }));
          try {
            localStorage.setItem("portfolio_cached_content", JSON.stringify(json.content));
          } catch {
            // ignore
          }
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
  }, []);

  const resolveMediaUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//")) {
      return url;
    }
    if (url.startsWith("/uploads")) {
      return `${BACKEND_URL || "http://localhost:3001"}${url}`;
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
