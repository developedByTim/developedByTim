import React, { useState} from 'react';
import useFetchCollections from './useFetchCollections';
import Input from '../UI/Input';
import SubmitButton from '../UI/SubmitButton';
import IconButton from '../UI/IconButton';
import Collection from './Collection';
import useLogin from '../login/useLogin';
const API_BASE = import.meta.env.PUBLIC_API_BASE_URL;
export default function CollectionsGallery() {
    const [sortBy, setSortBy] = useState<string>('');
    const { collections, loading: loadingData } = useFetchCollections()
  const {isLoggedIn} = useLogin();
    const handleUpdate = () => {

    };

    return (
        <div>
            {/* Loading Indicator */}
            {/* {(loadingData ||loading ) &&  <Loading />}  */}
            {/* Collections Display Section */}
       <div className="flex md:flex-row flex-col items-start md:items-stretch gap-6 md:gap-10">
                <span className='hidden md:block'>
                  {isLoggedIn?<AddCollectionBlock />:undefined}
                  </span>
                {collections.map((collection) => <CollectionItem name={collection.name}><Collection collection={collection} /></CollectionItem>)}
            </div>


        </div>
    );
}
export const CollectionItem = ({name, children}: {name?: string, children?: React.ReactNode}) => {
    return <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8">
        {children}
   <span className="text-sm sm:text-lg md:text-xl uppercase tracking-wider text-[var(--text)] text-center break-words">
  {name}
</span>
    </div>
}
const AddCollectionBlock = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const createCollection = async () => {
    if (!name.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          isCollection: true,
        }),
      });

      if (!res.ok) throw new Error('Failed to create collection');

      setName('');
      setIsAdding(false);

      // 🔁 easiest refresh for now
      window.location.reload();
      // later: lift state / refetch hook instead
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CollectionItem name="Add Collection">
<div
onClick={()=>setIsAdding(true)}
  className="relative aspect-square border-2 border-dashed
             bg-[var(--panel)] border-[var(--border)]
             flex items-center justify-center cursor-pointer
             hover:bg-[var(--panel-hover)] transition-colors w-[20rem] h-[20rem]"
>
        {isAdding ? (
          <div
            className="flex items-center flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <Input
              className="mb-4"
              placeholder="Collection Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <SubmitButton
              className="mr-4"
              disabled={loading}
              onClick={createCollection}
            >
              {loading ? 'Creating…' : 'Create'}
            </SubmitButton>

            <IconButton
              className="absolute top-2 right-2"
              onRenderIcon={() => <span className="text-2xl">×</span>}
              onClick={(e) => {
                e.stopPropagation();
                setIsAdding(false);
                setName('');
              }}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl">+</span>
          </div>
        )}
      </div>
    </CollectionItem>
  );
};