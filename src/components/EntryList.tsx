import { Star } from "lucide-react";
import DiaryEntry from "../types"; // Assuming types.ts is one level up

type EntryListProps = {
    entries: DiaryEntry[]; // DiaryEntry now includes 'tags'
    selectedEntryID: number | null;
    onselected: (id: number | null) => void; // This handles the expansion of entries
    onToggleImportant: (id: number) => void; // This toggles the important status
};

const EntryList: React.FC<EntryListProps> = ({
    entries,
    selectedEntryID,
    onselected,
    onToggleImportant,
}) => {
    // Log when EntryList renders and what selectedEntryID it received
    console.log(`EntryList rendering. Received selectedEntryID: ${selectedEntryID}`);

    if (!entries || entries.length === 0) {
        return <p>No entries yet.</p>; // Handle case with no entries
    }

    return (
        <div className="entrylist" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}> {/* Added some flex styles for layout */}
            {entries.map((entry) => {
                // Basic check for valid entry structure
                if (!entry || typeof entry.id === 'undefined') {
                    console.warn("Skipping invalid entry object:", entry);
                    return null; // Skip rendering this invalid entry
                }

                const isSelected = entry.id === selectedEntryID;
                // Log the check for each entry
                console.log(`Entry ID: ${entry.id}, isSelected: ${isSelected}`);

                // Validate createdAt is a Date object and format
                const entryDate = entry.createdAt instanceof Date && !isNaN(entry.createdAt.getTime())
                    ? entry.createdAt.toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })
                    : "Invalid Date";


                return (
                    <div
                        key={entry.id}
                        data-testid="entry"                   // Added test ID for easier testing
                        className="entry-preview"
                        onClick={(e) => {
                            // Prevent nested clicks from propagating unnecessarily if EntryList is wrapped
                            e.stopPropagation();
                            console.log(`Clicked Entry ID: ${entry.id}, Currently Selected: ${selectedEntryID}`);
                            const nextSelectedId = isSelected ? null : entry.id;
                            console.log(`Calling onselected with: ${nextSelectedId}`);
                            onselected(nextSelectedId); // Expand or collapse entry
                        }}
                        style={{
                            padding: "15px", // Increased padding slightly
                            marginBottom: "0", // Removed marginBottom from item, added gap to container
                            background: "#2a2a2a",
                            borderRadius: "8px",
                            cursor: "pointer",
                            color: "#fff",
                            wordWrap: "break-word",
                            overflow: "hidden", // Crucial for maxHeight to work
                            maxHeight: isSelected ? "1000px" : "130px", // Made max height larger for expanded view
                            // Using minHeight ensures minimum size even with short content
                            minHeight: "130px",
                            width: "100%", // Consider using max-width or % for responsiveness
                            transition: "max-height 0.4s ease-in-out", // Smooth transition
                            position: "relative", // Keep star in place
                            display: 'flex', // Use flexbox for internal layout
                            flexDirection: 'column',
                        }}
                    >
                        {/* ⭐ Star Toggle */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent expansion when clicking the star
                                console.log(`Star clicked for entry ID: ${entry.id}`);
                                onToggleImportant(entry.id); // Toggle important status
                            }}
                            // style={{
                            //     position: "absolute",
                            //     top: "15px", // Adjusted position due to increased padding
                            //     right: "15px", // Adjusted position due to increased padding
                            //     background: "transparent",
                            //     border: "none",
                            //     cursor: "pointer",
                            //     padding: 0,
                            //     lineHeight: 0,
                            //     zIndex: 1, // Ensure it's above other content
                            // }}
                            aria-label={entry.isImportant ? "Unmark as important" : "Mark as important"} // Accessibility
                            className={`star-button ${entry.isImportant ? "important" : ""}`}
                        >
                            {/* <Star fill={entry.isImportant ? "gold" : "none"} size={18} color={entry.isImportant ? "gold" : "#888"} /> Added color for outline
                             */}
                              <Star fill="currentColor" size={18} />
                        </button>

                        {/* Title */}
                        <h3 style={{ marginRight: '30px' }}>{entry.title || "Untitled Entry"}</h3> {/* Added margin to not overlap star */}

                        {/* Date - Using createdAt */}
                        <p style={{ fontSize: "0.8rem", color: "#aaa", marginTop: '2px', marginBottom: '5px' }}>
                            {entryDate}
                        </p>

                        {/* --- Display Tags --- */}
                        {/* Only show tags in collapsed view preview */}
                        {!isSelected && entry.tags && entry.tags.length > 0 && (
                            <div className="entry-tags-preview" style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '5px',
                                marginTop: '5px',
                                // Optional: Truncate tag line if too many tags
                                overflow: 'hidden',
                                maxHeight: '20px', // Limit height to about one line of tags
                            }}>
                                {entry.tags.map(tag => (
                                    <span key={tag} className="tag-display" style={{
                                        background: '#3a3a3a', // Slightly lighter dark background
                                        color: '#bbb',
                                        fontSize: '0.75rem', // Smaller font size
                                        padding: '2px 6px',
                                        borderRadius: '12px', // More rounded pill shape
                                        whiteSpace: 'nowrap', // Prevent tags from wrapping within badge
                                    }}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                        {/* --- End Display Tags --- */}


                        {/* Entry Text & Full Content (only when expanded) */}
                        {isSelected ? (
                            // Expanded view shows full text and potentially other details
                            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #444' }}>
                                {/* Full Text */}
                                <p style={{ fontSize: "0.9rem", color: "#ccc", whiteSpace: "pre-wrap", overflowWrap: "break-word", wordBreak: "break-word" }}>
                                    {entry.text || ""}
                                </p>

                                {/* Display Tags again in expanded view if desired, maybe styled differently? */}
                                {entry.tags && entry.tags.length > 0 && (
                                    <div className="entry-tags-expanded" style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '5px',
                                        marginTop: '10px',
                                        borderTop: '1px solid #444',
                                        paddingTop: '10px'
                                    }}>
                                        <span style={{ fontSize: '0.85rem', color: '#aaa', marginRight: '5px' }}>Tags:</span>
                                        {entry.tags.map(tag => (
                                            <span key={tag} style={{
                                                background: '#4a4a4a', // Slightly lighter dark background
                                                color: '#ddd',
                                                fontSize: '0.85rem', // Slightly larger font size than preview
                                                padding: '3px 8px',
                                                borderRadius: '15px',
                                                whiteSpace: 'nowrap',
                                            }}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                            </div>
                        ) : (
                            // Collapsed view shows truncated text preview
                            <div // Using a div allows block layout needed for line-clamp
                                style={{
                                    fontSize: "0.9rem",
                                    color: "#ccc",
                                    whiteSpace: "normal", // Allow wrapping
                                    overflowWrap: "break-word",
                                    wordBreak: "break-word", // Break long words
                                    overflow: "hidden", // Needed for text-overflow and line-clamp
                                    textOverflow: "ellipsis", // Add "..."
                                    display: "-webkit-box",
                                    WebkitBoxOrient: "vertical",
                                    // Check if entry.text exists before trying to clamp
                                    WebkitLineClamp: entry.text ? 3 : 0, // CSS multi-line clamp, 0 if no text
                                    maxWidth: "100%",
                                    flexGrow: 1, // Allow text area to grow
                                }}
                            >
                                {entry.text || ""} {/* Show entry text, fallback to empty string */}
                            </div>
                        )}

                    </div>
                );
            })}
        </div>
    );
};

export default EntryList;