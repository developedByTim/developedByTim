import React, { useState, useEffect } from 'react';
import Dropdown from "../UI/Dropdown"; // Assuming your Dropdown is imported
import { filmSpeedOptions, filmStockOptions, filmFormatOptions, filmOrientationOptions } from '../uploadWindow/UploadWindow'; // Update the import paths based on your project structure
import SearchInput from "../UI/SearchInput"; // Update if necessary
import { FilmSpeedType, FilmStockType, FilmFormatType, FilmOrientationType } from "../UI/types"; // Assuming you have the necessary types
import Loading from '../UI/Loading';
import useFetchCollections from './useFetchCollections';
import Input from '../UI/Input';
import SubmitButton from '../UI/SubmitButton';
import IconButton from '../UI/IconButton';
import Collection from './Collection';

// Assuming Image type is defined somewhere


export default function CollectionsGallery() {

    const [sortBy, setSortBy] = useState<string>('');
    const { collections, loading: loadingData } = useFetchCollections()


    // Pagination state


    const [loadedImagesCount, setLoadedImagesCount] = useState<number>(0);
    // State to store fetched images


    const handleUpdate = () => {

    };



    return (
        <div>
            {/* Loading Indicator */}
            {/* {(loadingData ||loading ) &&  <Loading />}  */}
            {/* Collections Display Section */}
            <div className='flex justify-start'>
                <AddCollectionBlock />
                {collections.map((collection) => <CollectionItem name={collection.name}><Collection collection={collection} /></CollectionItem>)}
            </div>


        </div>
    );
}
const CollectionItem = ({name, children}: {name: string, children: React.ReactNode}) => {
    return <div className='flex flex-col items-center gap-8'>
        {children}
                <span className='text-3xl uppercase'>{name}</span>
    </div>
}
const AddCollectionBlock = () => {
    const [isAdding, setIsAdding] = useState<boolean>(false);
    return <CollectionItem name="Add Collection">
        <div className={`relative w-[20rem] h-[20rem] border-dashed border-2 border-gray-400 flex items-center justify-center cursor-pointer ${!isAdding ? 'hover:bg-gray-100' : ''}`} onClick={() => setIsAdding(true)}>
            {isAdding ? <div className='flex items-center flex-col'>
                <Input className="mb-4" placeholder="Collection Name" onChange={() => { }} />
                <SubmitButton className="mr-4" onClick={() => { }}>Create</SubmitButton>
                <IconButton className='absolute top-2 right-2' onRenderIcon={() => <span className="text-2xl">X</span>} onClick={(e) => { e.stopPropagation(); setIsAdding(false) }} />
            </div> :
                <div className='flex flex-col items-center'>
                    <span className='text-9xl'>+</span>

                </div>}
        </div>

    </CollectionItem>
}