import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const SearchBox: React.FC<{
  query: string;
  onQueryChange: (q: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
}> = ({
  query,
  onQueryChange,
  onKeyDown,
  placeholder = "Search location keys...",
}) => (
  <div className="relative mb-3">
    <FontAwesomeIcon
      icon={faMagnifyingGlass}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
    />
    <input
      type="text"
      value={query}
      onChange={(e) => onQueryChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Escape") onQueryChange("");
        onKeyDown?.(e);
      }}
      placeholder={placeholder}
      className="w-full pl-9 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {query && (
      <button
        onClick={() => onQueryChange("")}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        title="Clear search"
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
    )}
  </div>
);

export default SearchBox;
