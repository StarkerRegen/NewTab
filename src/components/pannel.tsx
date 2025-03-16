import { useState, useEffect } from "react";
import Card from "./card";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useLiveQuery } from "dexie-react-hooks";
import { db, exportDB, importJson } from "@/models/db";
import { CardItem } from "@/models/CardItem";

export function Panel() {
  const [searchTerm, setSearchTerm] = useState("");
  const { theme, setTheme } = useTheme();
  const tabs = useLiveQuery(() => db.cardItems.toArray());
  const cards = useLiveQuery(() => db.cards.toArray());
  const [filteredTabs, setFilteredTabs] = useState<CardItem[]>(tabs ?? []);
  const [groupedTabs, setGroupedTabs] = useState<Record<number, CardItem[]>>(
    {}
  );

  useEffect(() => {
    cards?.forEach((card) => {
      const cardTabs = filteredTabs?.filter((tab) => tab.cardId === card.id);
      setGroupedTabs((prev) => ({
        ...prev,
        [card.id as keyof typeof prev]: cardTabs ?? [],
      }));
    });
  }, [cards, filteredTabs]);

  // Filter tabs based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTabs(tabs ?? []);
      return;
    }

    const lowercaseSearch = searchTerm.toLowerCase();
    const filtered = tabs?.filter(
      (tab) =>
        tab.title.toLowerCase().includes(lowercaseSearch) ||
        tab.url.toLowerCase().includes(lowercaseSearch)
    );

    setFilteredTabs(filtered ?? []);
  }, [searchTerm, tabs]);

  const handleImport = async () => {
    try {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: "JSON Files",
            accept: {
              "application/json": [".json"],
            },
          },
        ],
        multiple: false,
      });

      const file = await fileHandle.getFile();
      await importJson(file);

      console.log("Database imported successfully");
    } catch (error) {
      console.error("Failed to import database:", error);
      alert(
        `Failed to import database: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  return (
    <div
      className={`flex flex-col w-full h-full overflow-auto p-4 bg-white dark:bg-gray-900 dark:text-white`}
    >
      {/* Search Bar */}
      <div className="flex items-center justify-between">
        <div className="mb-6 w-1/2">
          <div className="relative flex">
            <input
              type="text"
              placeholder="Search tabs by title or URL..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                onClick={() => setSearchTerm("")}
              >
                ✕
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            aria-label="Toggle theme"
          >
            <div className="relative h-[1.2rem] w-[1.2rem]">
              <Sun className="absolute top-0 h-full w-full rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <Moon className="h-full w-full rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            </div>
            <span className="sr-only">Toggle theme</span>
          </button>

          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

          <button
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            aria-label="Import tabs"
            onClick={handleImport}
          >
            Import
          </button>

          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

          <button
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            aria-label="Export tabs"
            onClick={exportDB}
          >
            Export
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.keys(groupedTabs).map((cardId) => (
          <Card
            key={cardId}
            cardId={parseInt(cardId)}
            cardTitle={
              cards?.find((card) => card.id === parseInt(cardId))?.title ||
              "Untitled"
            }
            cardItems={groupedTabs[parseInt(cardId)]}
          />
        ))}
        {!searchTerm && (
          <button
            className="flex justify-center items-center h-full w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={async () => {
              const newCardId = await db.cards.add({
                title: "New Card",
                description: "",
                createdAt: new Date(),
                updatedAt: new Date(),
              });
              setGroupedTabs({
                ...groupedTabs,
                [newCardId]: [],
              });
            }}
          >
            <p className="text-gray-500 dark:text-gray-400 font-semibold">
              + Add Card
            </p>
          </button>
        )}
        {searchTerm && Object.keys(filteredTabs).length === 0 && (
          <div
            className="col-span-3 flex justify-center items-center h-40 bg-gray-50 rounded-lg border border-gray-200"
            key="no-tabs"
          >
            <p className="text-gray-500">No tabs match your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
