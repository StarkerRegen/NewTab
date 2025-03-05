import { useState, useEffect } from "react";
const defaultTabs: Tab[] = [
  {
    id: 1,
    url: "https://example.com",
    title: "Example",
    favIconUrl: "https://example.com/favicon.ico",
    windowId: 1,
  },
  {
    id: 2,
    url: "https://example.com",
    title: "Example",
    favIconUrl: "https://example.com/favicon.ico",
    windowId: 1,
  },
];

export function useActiveTabs() {
  const [activeTabs, setActiveTabs] = useState<Tab[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getActiveTabs = async () => {
      try {
        const tabs = await new Promise<Tab[]>((resolve) => {
          chrome.tabs.query({ url: ["https://*/*", "http://*/*"] }, (tabs) => {
            resolve(tabs as Tab[]);
          });
        });
        setActiveTabs(tabs);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch tabs")
        );
        setActiveTabs(defaultTabs);
      } finally {
        setLoading(false);
      }
    };

    getActiveTabs();

    // Optional: Add listener for tab changes
    const handleTabChange = () => {
      getActiveTabs();
    };

    chrome.tabs.onActivated.addListener(handleTabChange);
    chrome.tabs.onUpdated.addListener(handleTabChange);
    chrome.tabs.onRemoved.addListener(handleTabChange);

    return () => {
      chrome.tabs.onActivated.removeListener(handleTabChange);
      chrome.tabs.onUpdated.removeListener(handleTabChange);
      chrome.tabs.onRemoved.removeListener(handleTabChange);
    };
  }, []);

  return { activeTabs, loading, error };
}
