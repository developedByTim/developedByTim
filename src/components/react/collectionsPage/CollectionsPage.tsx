import React, { useEffect, useState } from 'react';
import useFetchCollections from './useFetchCollections';
import Input from '../UI/Input';
import SubmitButton from '../UI/SubmitButton';
import IconButton from '../UI/IconButton';
import Collection from './Collection';
import useLogin from '../login/useLogin';
import Dropdown from '../UI/Dropdown';
import { type CategoryType } from '../UI/types';
 

const API_BASE = import.meta.env.PUBLIC_API_BASE_URL;

const categoryTypes: { key: CategoryType; text: string }[] = [
  { key: 'Collection', text: 'Collection' },
  { key: 'Subject', text: 'Subject' },
  { key: 'Mood', text: 'Mood' },
  { key: 'Event', text: 'Event' },
];

export default function CollectionsGallery() {
  const { collections, loading: loadingData } = useFetchCollections();
  const { isLoggedIn } = useLogin();

  // state for selected tab
  const [selectedTab, setSelectedTab] = useState<'All' | CategoryType>('All');

  // filter collections based on selected tab
  const filteredCollections =
    selectedTab === 'All'
      ? collections
      : collections.filter((c) => c.type === selectedTab);

  return (
    <div>
      {/* Tabs */}
      <TabsContainer>
  <Tab active={selectedTab === 'All'} onClick={() => setSelectedTab('All')}>All</Tab>
  {categoryTypes.map((type) => (
    <Tab
      key={type.key}
      active={selectedTab === type.key}
      onClick={() => setSelectedTab(type.key)}
    >
      {type.text}
    </Tab>
  ))}
</TabsContainer>

      {/* Collections */}
     <div className="flex flex-wrap gap-6 justify-center md:justify-start">
  <span className="hidden md:block">
    {isLoggedIn ? <AddCollectionBlock selectedTab={selectedTab}/> : undefined}
  </span>

  {filteredCollections.map((collection) => (
    <CollectionItem
      key={collection.id}
      name={collection.name}
      thumbnailUrl={collection.thumbnailImage?.url}
    >
      <Collection collection={collection} />
    </CollectionItem>
  ))}

  {!filteredCollections.length && (
    <span className="text-[var(--text-muted)]">No items in this category.</span>
  )}
</div>
    </div>
  );
}
// Tab Container wrapper for responsiveness
const TabsContainer = ({ children }: { children: React.ReactNode }) => (
  <div className=" gap-5 flex-col overflow-x-auto scrollbar-hide px-2 py-2 mb-10 md:flex-row hidden md:flex">
    {children}
  </div>
);

// Simple Tab component
const Tab = ({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    className={`
      flex-shrink-0
      px-4 py-2 font-semibold transition
      ${active 
        ? 'bg-[var(--panel-hover)] text-[var(--text)]'
        : 'bg-gray-50 text-gray-800 hover:bg-[var(--panel-hover)] hover:text-[var(--text)]'}
    `}
    onClick={onClick}
  >
    {children}
  </button>
);
export const CollectionItem = ({
  name,
  thumbnailUrl,
  children,
}: {
  name?: string
  thumbnailUrl?: string
  children?: React.ReactNode
}) => {
  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8">
<div className="relative aspect-square w-full sm:w-[18rem] md:w-[20rem] h-auto overflow-hidden">
        {/* Background image */}
        {thumbnailUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${thumbnailUrl})` }}
          />
        )}

        {/* Dark overlay */}
        {thumbnailUrl && (
          <div className="absolute inset-0 bg-black/40" />
        )}

        {/* Foreground content */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          {children}
        </div>
      </div>

      {/* Title */}
      {/* <span className="text-sm sm:text-lg md:text-xl uppercase tracking-wider text-[var(--text)] text-center break-words">
        {name}
      </span> */}
    </div>
  )
}
const AddCollectionBlock = ({selectedTab}:{selectedTab: CategoryType | 'All'}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<'Collection' | 'Subject' | 'Mood' | 'Event'>('Collection');
  const [loading, setLoading] = useState(false);
  useEffect(()=>{
    if(selectedTab!=='All')setType(selectedTab)
  },[selectedTab])
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
          type, // ✅ matches backend enum
        }),
      });

      if (!res.ok) throw new Error('Failed to create category');

      setName('');
      setIsAdding(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CollectionItem name="Add Category">
      <div
        onClick={() => setIsAdding(true)}
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
              placeholder="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* Simple native select for now */}
            <Dropdown label='Type:' value={type} onChange={v=>setType(v)} options={categoryTypes}/>

            <SubmitButton
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
          <span className="text-8xl">+</span>
        )}
      </div>
    </CollectionItem>
  );
};