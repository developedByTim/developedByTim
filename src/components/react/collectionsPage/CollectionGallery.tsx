import { useState } from "react";
import type { Collection } from "../UI/types";
import { CollectionItem } from "./CollectionsPage";
import useFetchCollection from "./useFetchCollectionImages";
import IconButton from "../UI/IconButton";
import Modal from "../UI/Modal";

export default function CollectionGallery({collectionId}: {collectionId: string}) {
        const { category, images, loading, error } = useFetchCollection({ categoryId: collectionId, sortBy: "date" });
        const [editMode, setEditMode] = useState(false);
    return <div>
    {loading && <div>Loading...</div>}
    {error && <div className="text-red-500">Error: {error}</div>}
    {!loading && !error && category && (
        <>
           <h1 className="text-4xl mb-6 text-center">{category.name}<IconButton className='ml-4' onClick={()=>setEditMode(true)} onRenderIcon={()=><span >✏️</span>}/></h1>  
      
        <div className="flex justify-start gap-10">
            <Modal isOpen={editMode} onClose={() => setEditMode(false)}>
              </Modal>
            <AddCollectionBlock />
        </div>  
        </>
    )}
    </div>
}
const AddCollectionBlock = () => {
  const [isAdding, setIsAdding] = useState(false);


  return (
    <CollectionItem >
      <div
        className={`relative w-[20rem] h-[20rem] border-dashed border-2 border-gray-400
        flex items-center justify-center cursor-pointer
        ${!isAdding ? 'hover:bg-gray-100' : ''}`}
        onClick={() => !isAdding && setIsAdding(true)}
      >
                <div className="flex flex-col items-center">
            <span className="text-9xl">+</span>
          </div>
      </div>
    </CollectionItem>
  );
};

const AddNewImagesPortal = () => {
  const [tab,setTab] = useState<'upload'|'select'>('upload');


  return <div>
    
  </div>
}