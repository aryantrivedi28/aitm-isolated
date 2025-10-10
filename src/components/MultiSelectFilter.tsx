"use client";

import React from "react";

type MultiSelectFilterProps = {
  label: string;
  value?: string[]; // still optional
  options: string[];
  onChange: (value: string[]) => void;
};

export default function MultiSelectFilter({
  label,
  value = [], // ✅ default empty array
  options,
  onChange,
}: MultiSelectFilterProps) {
  const handleSelect = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else {
      onChange([...value, option]);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleSelect(option)}
            className={`px-3 py-1 rounded-full text-sm border ${
              value.includes(option)
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
