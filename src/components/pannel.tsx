import { useState, useEffect } from "react";
import Card from "./card";
import { defaultTabs } from "@/utils/testUtils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function Panel() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTabs, setFilteredTabs] = useState<Tab[]>(defaultTabs);
  const { theme, setTheme } = useTheme();

  // Filter tabs based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTabs(defaultTabs);
      return;
    }

    const lowercaseSearch = searchTerm.toLowerCase();
    const filtered = defaultTabs.filter(
      (tab) =>
        tab.title.toLowerCase().includes(lowercaseSearch) ||
        tab.url.toLowerCase().includes(lowercaseSearch)
    );

    setFilteredTabs(filtered);
  }, [searchTerm]);

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
            onClick={() => {
              // Import functionality
              console.log("Import tabs");
            }}
          >
            Import
          </button>

          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

          <button
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            aria-label="Export tabs"
            onClick={() => {
              // Export functionality
              console.log("Export tabs");
            }}
          >
            Export
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card />
        {Object.keys(filteredTabs).length === 0 && (
          <div className="col-span-3 flex justify-center items-center h-40 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">No tabs match your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
