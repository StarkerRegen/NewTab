import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { SlotItemMapArray, Swapy, utils } from "swapy";
import { createSwapy } from "swapy";
import { TabItem } from "./tab";

const initialItems: Tab[] = [
  {
    id: "1",
    title: "Google",
    url: "https://www.google.com/",
    windowId: 1,
    favIconUrl: "https://www.google.com/favicon.ico",
  },
  {
    id: "2",
    title: "GitHub",
    url: "https://github.com/",
    windowId: 1,
    favIconUrl: "https://github.com/favicon.ico",
  },
  {
    id: "3",
    title: "Stack Overflow",
    url: "https://stackoverflow.com/",
    windowId: 2,
    favIconUrl: "https://stackoverflow.com/favicon.ico",
  },
  {
    id: "4",
    title: "MDN Web Docs",
    url: "https://developer.mozilla.org/",
    windowId: 2,
    favIconUrl: "https://developer.mozilla.org/favicon.ico",
  },
];

function Card() {
  const [isOpen, setIsOpen] = useState(true);
  const [cardTitle, setCardTitle] = useState("Active Tabs");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [items, setItems] = useState<Tab[]>(initialItems);
  const [slotItemMap, setSlotItemMap] = useState<SlotItemMapArray>(() =>
    utils.initSlotItemMap(initialItems, "id")
  );
  const slottedItems = useMemo(
    () => utils.toSlottedItems(items, "id", slotItemMap),
    [items, slotItemMap]
  );
  const swapyRef = useRef<Swapy | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(
    () =>
      utils.dynamicSwapy(
        swapyRef.current,
        items,
        "id",
        slotItemMap,
        setSlotItemMap
      ),
    [items] // Only re-run when items change, cannot be changed
  );

  useEffect(() => {
    swapyRef.current = createSwapy(containerRef.current!, {
      manualSwap: true,
      // animation: 'dynamic'
      // autoScrollOnDrag: true,
      // swapMode: 'drop',
      // enabled: true,
      // dragAxis: 'x',
      // dragOnHold: true
    });

    swapyRef.current.onSwap((event) => {
      setSlotItemMap(event.newSlotItemMap.asArray);
    });

    return () => {
      swapyRef.current?.destroy();
    };
  }, []);

  const deleteTab = (item: Tab) => {
    setItems(items.filter((t) => t.id !== item.id));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        {isEditingTitle ? (
          <input
            type="text"
            className="text-xl font-semibold text-gray-800 dark:text-white bg-white dark:bg-gray-800 border rounded px-2 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500"
            value={cardTitle}
            onChange={(e) => setCardTitle(e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
            onKeyDown={(e) => e.key === "Enter" && setIsEditingTitle(false)}
            autoFocus
          />
        ) : (
          <h2
            className="text-xl font-semibold text-gray-800 dark:text-white cursor-pointer"
            onClick={() => setIsEditingTitle(true)}
          >
            {cardTitle}
          </h2>
        )}
        <button
          className="toggle-button ml-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Hide content" : "Show content"}
        >
          {isOpen ? (
            <ChevronDownIcon className="dark:text-white" />
          ) : (
            <ChevronUpIcon className="dark:text-white" />
          )}
        </button>
      </div>
      {isOpen && (
        <div className="container" ref={containerRef}>
          <div className="items">
            {slottedItems.map(
              ({ slotId, itemId, item }) =>
                item && (
                  <div className="slot" key={slotId} data-swapy-slot={slotId}>
                    <div key={itemId} data-swapy-item={itemId}>
                      <TabItem tab={item as Tab} closeFunction={deleteTab} />
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Card;
