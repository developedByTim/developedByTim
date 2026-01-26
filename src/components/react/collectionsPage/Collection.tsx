import type { Collection } from "../UI/types";
import React from "react";

export default function Collection({ collection }: { collection: Collection }) {
  const handleClick = () => {
    // Navigate to dynamic collection page
    window.location.href = `/collection/${collection.id}`;
  };

  return (
    <div
      className="w-[20rem] h-[20rem] border border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition"
      onClick={handleClick}
    >
      <span className="text-xl">{collection.name}</span>
    </div>
  );
}