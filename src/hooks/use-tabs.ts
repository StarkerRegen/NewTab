import { defaultTabs } from "@/utils/testUtils";
import { useState, useEffect } from "react";

export function useActiveTabs() {
  const [activeTabs, setActiveTabs] = useState<ActiveTab[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getActiveTabs = async () => {
      try {
        const tabs = await new Promise<ActiveTab[]>((resolve) => {
          chrome.tabs.query({ url: ["https://*/*", "http://*/*"] }, (tabs) => {
            resolve(tabs as ActiveTab[]);
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
