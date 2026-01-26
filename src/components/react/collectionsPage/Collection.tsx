import type { Collection } from "../UI/types";

export default function Collection({collection}: {collection: Collection}) {
    
    return <div className="w-60 h-60 border border-gray-300 rounded-lg m-4 flex items-center justify-center">
        <span className="text-gray-500">{collection.name}</span>
    </div>
}