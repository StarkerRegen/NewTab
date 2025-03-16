// import { useActiveTabs } from "@/hooks/use-tabs";
import { useEffect, useState } from "react";
import { TabItem } from "./tab";
import { closeTabById } from "@/utils/tabUtils";
import { defaultTabs } from "@/utils/testUtils";
import {
  AppWindowIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const groupedTabs = (tabs: ActiveTab[]) =>
  tabs.reduce<Record<number, ActiveTab[]>>((acc, item) => {
    const windowId = item.windowId ?? -1;
    if (!acc[windowId]) {
      acc[windowId] = [];
    }
    acc[windowId].push(item);
    return acc;
  }, {});

export function Sidebar() {
  // const { activeTabs, loading } = useActiveTabs();
  const loading = false;
  const activeTabs = defaultTabs;
  const [tabs, setTabs] = useState<Record<number, ActiveTab[]>>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedSections, setExpandedSections] = useState<
    Record<number, boolean>
  >({});

  useEffect(() => {
    setTabs(groupedTabs(activeTabs));
  }, [activeTabs]);

  useEffect(() => {
    const initialExpandedSections: Record<number, boolean> = {};
    Object.keys(tabs).forEach((windowId) => {
      initialExpandedSections[Number(windowId)] = true;
    });
    setExpandedSections(initialExpandedSections);
  }, [tabs]);

  const closeTab = async (tab: ActiveTab) => {
    await closeTabById(tab.id ?? -1);
    setTabs((prev) => {
      const windowTabs = prev[tab.windowId ?? -1] ?? [];
      return {
        ...prev,
        [tab.windowId ?? -1]: windowTabs.filter((t) => t.id !== tab.id),
      };
    });
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleSection = (windowId: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [windowId]: !prev[windowId],
    }));
  };

  return (
    <div
      className={`overflow-y-auto transition-all duration-300 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 ${
        isExpanded ? "w-64" : "w-12"
      }`}
    >
      <div className="flex flex-col">
        {/* Sidebar header with toggle button */}
        <div className="p-2 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isExpanded ? (
              <PanelLeftClose className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <PanelLeftOpen className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* Sidebar content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full mt-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 dark:border-gray-200"></div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {Object.entries(tabs).map(([windowIdStr, windowTabs]) => {
                const windowId = Number(windowIdStr);
                const isWindowExpanded = expandedSections[windowId];

                return (
                  <div
                    key={windowId}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <button
                      onClick={() => toggleSection(windowId)}
                      className={`h-12 w-full flex items-center border-b border-gray-200 dark:border-gray-700 ${
                        isExpanded ? "justify-between" : "justify-center"
                      }`}
                    >
                      {isExpanded ? (
                        <>
                          <span className="ml-4 font-medium text-gray-800 dark:text-gray-200">
                            Window {windowId}
                          </span>
                          <span className="ml-2 text-sm text-gray-500 dark:text-white bg-amber-200 dark:bg-blue-400 rounded-full px-3">
                            {windowTabs.length}
                          </span>
                          {isWindowExpanded ? (
                            <ChevronUpIcon className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-300" />
                          ) : (
                            <ChevronDownIcon className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-300" />
                          )}
                        </>
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                          <AppWindowIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                        </div>
                      )}
                    </button>

                    {isExpanded && isWindowExpanded && (
                      <div className="pl-2">
                        {windowTabs.map((tab) => (
                          <TabItem
                            key={tab.id}
                            tab={tab}
                            closeFunction={closeTab}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
