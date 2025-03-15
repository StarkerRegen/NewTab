/**
 * Tab utilities for Chrome browser
 */

/**
 * Closes the current tab
 * @returns {Promise<void>} A promise that resolves when the tab is closed
 */
export const closeCurrentTab = async (): Promise<void> => {
  if (typeof chrome !== "undefined" && chrome.tabs) {
    try {
      const [currentTab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (currentTab && currentTab.id) {
        await chrome.tabs.remove(currentTab.id);
      }
    } catch (error) {
      console.error("Failed to close tab:", error);
    }
  } else {
    console.warn(
      "Chrome tabs API not available. This function requires a Chrome extension context."
    );
  }
};

/**
 * Closes a specific tab by ID
 * @param {number} tabId - The ID of the tab to close
 * @returns {Promise<void>} A promise that resolves when the tab is closed
 */
export const closeTabById = async (tabId: string): Promise<void> => {
  if (tabId == "") return;
  if (typeof chrome !== "undefined" && chrome.tabs) {
    try {
      await chrome.tabs.remove(parseInt(tabId));
    } catch (error) {
      console.error(`Failed to close tab ${tabId}:`, error);
    }
  } else {
    console.warn(
      "Chrome tabs API not available. This function requires a Chrome extension context."
    );
  }
};

/**
 * Opens a new tab with the given URL or activates it if already open
 * @param {string} url - The URL to open in a new tab
 * @returns {Promise<chrome.tabs.Tab>} A promise that resolves with the opened or activated tab
 */
export const openOrActivateTab = async (
  url: string
): Promise<chrome.tabs.Tab | undefined> => {
  if (typeof chrome !== "undefined" && chrome.tabs) {
    try {
      const existingTabs = await chrome.tabs.query({ url });

      if (existingTabs.length > 0) {
        const existingTab = existingTabs[0];
        if (existingTab.id) {
          await chrome.tabs.update(existingTab.id, { active: true });

          if (existingTab.windowId) {
            await chrome.windows.update(existingTab.windowId, {
              focused: true,
            });
          }

          return existingTab;
        }
      }

      return await chrome.tabs.create({ url });
    } catch (error) {
      console.error("Failed to open or activate tab:", error);
      return undefined;
    }
  } else {
    console.warn(
      "Chrome tabs API not available. This function requires a Chrome extension context."
    );
    return undefined;
  }
};
