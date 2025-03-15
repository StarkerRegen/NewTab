import { openOrActivateTab } from "@/utils/tabUtils";
import { X } from "lucide-react";
import { useState } from "react";

interface TabItemProps {
  tab: Tab;
  closeFunction: (tab: Tab) => void;
}

export const TabItem: React.FC<TabItemProps> = ({ tab, closeFunction }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 3,
      y: rect.bottom - 12,
    });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div
      className="flex items-center p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => openOrActivateTab(tab.url ?? "")}
    >
      <div className="flex-shrink-0 mr-3">
        {tab.favIconUrl ? (
          <img src={tab.favIconUrl} alt="" className="w-5 h-5" />
        ) : (
          <div className="w-5 h-5 bg-gray-200 dark:bg-gray-600 rounded-full" />
        )}
      </div>
      <div className="flex-grow min-w-0">
        <div className="text-sm font-medium text-gray-800 dark:text-white truncate">
          {tab.title}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {tab.url}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          closeFunction(tab);
        }}
        className="ml-2 p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
        aria-label="Close tab"
      >
        <X className="w-4 h-4" />
      </button>
      {showTooltip && (
        <div
          className="absolute z-10 bg-gray-800 text-white text-xs px-2 py-1 rounded"
          style={{ left: tooltipPosition.x, top: tooltipPosition.y }}
        >
          <div className="flex-col items-center">
            <h4 className="text-sm font-medium">{tab.title}</h4>
            <div className="text-xs text-gray-200">{tab.url}</div>
          </div>
        </div>
      )}
    </div>
  );
};
