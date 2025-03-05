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
export const closeTabById = async (tabId: number): Promise<void> => {
  if (tabId == -1) return;
  if (typeof chrome !== "undefined" && chrome.tabs) {
    try {
      await chrome.tabs.remove(tabId);
    } catch (error) {
      console.error(`Failed to close tab ${tabId}:`, error);
    }
  } else {
    console.warn(
      "Chrome tabs API not available. This function requires a Chrome extension context."
    );
  }
};
