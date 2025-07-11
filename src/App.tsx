
import EntryForm from "./components/EntryForm";
import "./App.css";
import DiaryEntry from './types';
import EntryList from './components/EntryList';
import { Star } from 'lucide-react';
import { useEffect, useState } from "react";

const STORAGE_KEY_ENTRIES = 'diary-entries';
const STORAGE_KEY_TAGS = 'diary-tags'; // New storage key for tags

function App() {
  // State for entries, loading from localStorage
  const [entries, setEntries] = useState<DiaryEntry[]>(() => {
    console.log('Initializing entries state from localStorage...');
    const saved = localStorage.getItem(STORAGE_KEY_ENTRIES);
    if (saved) { 
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((entry: any) => ({ 
            ...entry,
            // Ensure createdAt is parsed correctly
            createdAt: entry.createdAt ? new Date(entry.createdAt) : new Date(),
            // Ensure tags is an array, default to empty array if missing
            tags: Array.isArray(entry.tags) ? entry.tags : []
          }));
        }
      } catch (error) {
        console.error("Failed to parse diary entries from localStorage", error);
        return [];
      }
    }
    return [];
  });

  // State for all unique tags, loading from localStorage
  const [allTags, setAllTags] = useState<string[]>(() => {
      console.log('Initializing tags state from localStorage...');
      const saved = localStorage.getItem(STORAGE_KEY_TAGS);
      if (saved) {
          try {
              const parsed = JSON.parse(saved);
              // Ensure parsed is an array of strings
              if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
                  return parsed;
              }
          } catch (error) {
              console.error("Failed to parse tags from localStorage", error);
              return [];
          }
      }
      return [];
  });


  const [selectedEntryID, setSelectedEntryID] = useState<number | null>(null);
  const [showImportantOnly, setShowImportantOnly] = useState(false);

  console.log(`App rendering. Selected Entry ID: ${selectedEntryID}`);

  // Effect to save entries to localStorage whenever they change
  useEffect(() => {
    console.log('Saving entries to localStorage...');
    try {
      localStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(entries));
    } catch (error) {
      console.error("Failed to save diary entries to localStorage", error);
    }
  }, [entries]); // Dependency array ensures this runs only when 'entries' changes

  // Effect to save allTags to localStorage whenever they change
  useEffect(() => {
      console.log('Saving allTags to localStorage...');
      try {
          localStorage.setItem(STORAGE_KEY_TAGS, JSON.stringify(allTags));
      } catch (error) {
          console.error("Failed to save allTags to localStorage", error);
      }
  }, [allTags]); // Dependency array ensures this runs only when 'allTags' changes


  function addEntry(entry: DiaryEntry) {
    console.log('Adding new entry:', entry);
    // Ensure createdAt is a Date object
    const newEntry = { ...entry, createdAt: entry.createdAt instanceof Date ? entry.createdAt : new Date(entry.createdAt) };

    // Add new tags from the entry to the allTags list
    const newTags = newEntry.tags.filter(tag => !allTags.includes(tag));
    if (newTags.length > 0) {
        setAllTags(prevTags => [...prevTags, ...newTags]);
    }

    setEntries((prevEntries) => [newEntry, ...prevEntries]);
  }

  const handleToggleImportant = (id: number) => {
    console.log(`Toggling important status for entry ID: ${id}`);
    setEntries(prev =>
      prev.map(entry =>
        entry.id === id ? { ...entry, isImportant: !entry.isImportant } : entry
      )
    );
  };

  const handleSetSelectedEntryID = (id: number | null) => {
    console.log(`Setting selected Entry ID to: ${id}`);
    setSelectedEntryID(id);
  };

  const displayedEntries = showImportantOnly
    ? entries.filter(entry => entry.isImportant)
    : entries;

  console.log(`Displaying ${displayedEntries.length} entries. Show important only: ${showImportantOnly}`);

  return (
    <div className="app-container" onClick={() => handleSetSelectedEntryID(null)}>
      <button
        onClick={(e) => {
            e.stopPropagation(); // Prevent setting selected ID to null when clicking button
            setShowImportantOnly(!showImportantOnly)
        }}
        className={`toggle-btn ${showImportantOnly ? 'important' : ''}`}
      >
        <Star size={20} className="mr-2" />
        {showImportantOnly ? 'Show All' : 'Show Important'}
      </button>

      <div onClick={(e) => e.stopPropagation()}>
          {/* Pass allTags as a prop to EntryForm */}
          <EntryForm addEntry={addEntry} allTags={allTags} />
      </div>

      <h2 style={{ marginTop: '2rem', fontSize: '1.5rem' }}>Recent Entries</h2>

      <div onClick={(e) => e.stopPropagation()}>
        <EntryList
          entries={displayedEntries} // displayedEntries now include tags
          selectedEntryID={selectedEntryID}
          onselected={handleSetSelectedEntryID}
          onToggleImportant={handleToggleImportant}
          // If EntryList needs to interact with tags (e.g., filter by tag),
          // you might pass allTags or filtering logic here as well.
          // For just displaying tags, passing entries with tags is enough.
        />
      </div>
    </div>
  );
}

export default App;