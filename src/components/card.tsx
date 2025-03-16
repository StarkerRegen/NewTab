import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";
import { TabItem } from "./tab";
import { CardItem } from "@/models/CardItem";
import { db } from "@/models/db";

function Card({
  cardId,
  cardTitle,
  cardItems,
}: {
  cardId: number;
  cardTitle: string;
  cardItems: CardItem[];
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [title, setTitle] = useState(cardTitle);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [items, setItems] = useState<CardItem[]>(cardItems);

  const deleteTab = async (item: CardItem) => {
    if (!item.id) return;
    try {
      await db.cardItems.where("id").equals(item.id).delete();
      setItems(items.filter((i) => i.id !== item.id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const updateCardTitle = async (t: string) => {
    setTitle(t);
    await db.cards.where("id").equals(cardId).modify({ title: t });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        {isEditingTitle ? (
          <input
            type="text"
            className="text-xl font-semibold text-gray-800 dark:text-white bg-white dark:bg-gray-800 border rounded px-2 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500"
            value={title}
            onChange={(e) => updateCardTitle(e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
            onKeyDown={(e) => e.key === "Enter" && setIsEditingTitle(false)}
            autoFocus
          />
        ) : (
          <h2
            className="text-xl font-semibold text-gray-800 dark:text-white cursor-pointer"
            onClick={() => setIsEditingTitle(true)}
          >
            {title}
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
        <div className="container">
          {items.map((item) => (
            <TabItem
              key={item.id}
              tab={item as ActiveTab}
              closeFunction={(tab) => deleteTab(tab as CardItem)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Card;
