import DiaryEntry from "../types";
import { useState, useRef, useEffect } from "react"; // Added useRef, useEffect
import { FaRegCalendarAlt, FaStar, FaRegStar, FaTags, FaTimes } from "react-icons/fa"; // Added FaTags, FaTimes

//defining the props expected by the component
type EntryFormProps = {
  addEntry: (entry: DiaryEntry) => void;
  allTags: string[]; // <-- NEW PROP: list of all previously used tags for suggestions
};

const EntryForm: React.FC<EntryFormProps> = ({ addEntry, allTags }) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isImportant, setIsImportant] = useState(false);

  // --- NEW TAGS STATE AND LOGIC ---
  const [currentEntryTags, setCurrentEntryTags] = useState<string[]>([]); // Tags for the entry being created
  const [tagInput, setTagInput] = useState(""); // State for the tag input field
  const [suggestions, setSuggestions] = useState<string[]>([]); // State for tag suggestions
  const tagInputRef = useRef<HTMLInputElement>(null); // Ref to manage focus/clearing input

  // Effect to filter suggestions as the user types
  useEffect(() => {
      if (tagInput.trim() === "") {
          setSuggestions([]); // No suggestions if input is empty
          return;
      }
      const filteredSuggestions = allTags.filter(tag =>
          tag.toLowerCase().includes(tagInput.toLowerCase()) &&
          !currentEntryTags.map(t => t.toLowerCase()).includes(tag.toLowerCase()) // Don't suggest tags already added to this entry
      ).slice(0, 10); // Limit number of suggestions
      setSuggestions(filteredSuggestions);
  }, [tagInput, allTags, currentEntryTags]); // Re-run when tagInput, allTags, or currentEntryTags change


  // Handles adding a tag from input (on Enter or comma) or suggestion click
  const addTag = (tag: string) => {
      const trimmedTag = tag.trim();
      if (trimmedTag && !currentEntryTags.map(t => t.toLowerCase()).includes(trimmedTag.toLowerCase())) {
          setCurrentEntryTags(prevTags => [...prevTags, trimmedTag]);
          setTagInput(""); // Clear the input after adding
          setSuggestions([]); // Clear suggestions
          if (tagInputRef.current) {
              tagInputRef.current.focus(); // Keep focus on the input
          }
      }
  };

  // Handles key presses in the tag input
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === ',') {
          e.preventDefault(); // Prevent form submission on Enter, and prevent comma from typing
          addTag(tagInput);
      }
       // Optional: Handle Backspace on empty input to remove last tag
       if (e.key === 'Backspace' && tagInput === '' && currentEntryTags.length > 0) {
            setCurrentEntryTags(prevTags => prevTags.slice(0, -1));
       }
  };

  // Handles removing a tag from the current entry
  const removeTag = (tagToRemove: string) => {
      setCurrentEntryTags(prevTags => prevTags.filter(tag => tag !== tagToRemove));
  };
  // --- END NEW TAGS STATE AND LOGIC ---


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !text.trim()) {
      alert("Title and Entry text cannot be left empty. ");
      return;
    }

    const newEntry: DiaryEntry = {
      id: Date.now(),
      title,
      text,
      createdAt: new Date(selectedDate),
      isImportant,
      tags: currentEntryTags, // <-- Include the current entry tags
    };

    addEntry(newEntry);

    // Clearing inputs after successful submission
    setText("");
    setTitle("");
    setSelectedDate(new Date().toISOString().split('T')[0]); // Reset date to today
    setIsImportant(false);
    setCurrentEntryTags([]); // <-- Clear tags for the next entry
    setTagInput(""); // Clear tag input
    setSuggestions([]); // Clear suggestions
  };

  return (
    <div className="entry-form relative p-4 border rounded-md shadow-md bg-white">
      <div className="star">
        <button
          aria-label={isImportant ? "Wichtig markiert" : "Markieren als wichtig"}
          onClick={() => setIsImportant(prev => !prev)}
          className="absolute top-2 right-2 z-10 cursor-pointer"
          style={{
            background: "transparent",
            boxShadow: "none",
            // borderRadius: "50%",
            padding: "2px",
            mixBlendMode: "multiply", // helps blend with background
            opacity: 0.85, // subtle blending
            transition: "opacity 0.2s"
          }}
          tabIndex={0}
          role="button"
        >
          {isImportant ? (
            <FaStar className="text-yellow-400" size={22} style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.07))", mixBlendMode: "multiply" }} />
          ) : (
            <FaRegStar className="text-gray-300" size={22} style={{ mixBlendMode: "multiply" }} />
          )}
        </button>
      </div>

      <div className="header">
        <h2>Add a New Entry </h2>
      </div>

      <br />
      <br />

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
            placeholder="Write your entry Title... "
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content" className="form-label">
            Content
          </label>
          <textarea
            id="content"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="form-textarea"
            placeholder="write your diary entry..."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date" className="form-label">
            <FaRegCalendarAlt className="inline mr-1" /> Date
          </label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="form-input"
          />
        </div>

        {/* --- NEW TAGS INPUT AREA --- */}
        <div className="form-group relative"> {/* relative for positioning suggestions */}
            <label htmlFor="tags" className="form-label">
                <FaTags className="inline mr-1" /> Tags (comma or Enter separated)
            </label>
            <input
                ref={tagInputRef} // Attach ref
                type="text"
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown} // Handle Enter/comma
                className="form-input"
                placeholder="Add tags (e.g., work, personal, idea)..."
                // No 'required' here as tags are optional
            />

            {/* Tag Suggestions */}
            {suggestions.length > 0 && (
                <ul className="suggestions-list absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto">
                    {suggestions.map(suggestedTag => (
                        <li
                            key={suggestedTag}
                            className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => addTag(suggestedTag)} // Add tag on click
                        >
                            {suggestedTag}
                        </li>
                    ))}
                </ul>
            )}

             {/* Display current entry tags */}
            {currentEntryTags.length > 0 && (
                <div className="tags-display mt-2 flex flex-wrap gap-2">
                    {currentEntryTags.map(tag => (
                        <span key={tag} className="tag-badge bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 flex items-center">
                            {tag}
                            <FaTimes className="ml-1 cursor-pointer text-blue-600 hover:text-blue-900" size={12} onClick={() => removeTag(tag)} />
                        </span>
                    ))}
                </div>
            )}
        </div>
         {/* --- END NEW TAGS INPUT AREA --- */}



          <button type="submit" className="submit-button mt-4">add entry</button>
      </form>
    </div>
  );
};

export default EntryForm;

