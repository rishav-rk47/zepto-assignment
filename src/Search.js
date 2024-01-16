import React, { useState, useRef, useEffect } from 'react';
import './Style.css';
import data from './data.json';

function Search() {
    const [inputText, setInputText] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedSuggestions, setSelectedSuggestions] = useState([]);
    const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(null);

    const inputRef = useRef(null);
    const suggestionBoxRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (
                inputRef.current &&
                !inputRef.current.contains(e.target) &&
                suggestionBoxRef.current &&
                !suggestionBoxRef.current.contains(e.target)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputText(value);

        const filteredSuggestions = data.user.filter((user) =>
            user.name.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filteredSuggestions);

        const inputRect = e.target.getBoundingClientRect();
        setCursorPosition({ top: inputRect.bottom + window.scrollY, left: inputRect.left + window.scrollX });
        setShowSuggestions(true);
    };

    const handleSuggestionClick = (suggestion, index) => {
        setSelectedSuggestions([...selectedSuggestions, suggestion.name]);
        setInputText('');
        setSuggestions([]);
        setShowSuggestions(false);
        setHighlightedIndex(null);
    };

    const handleCancelClick = (index) => {
        const updatedUsers = [...selectedSuggestions];
        updatedUsers.splice(index, 1);
        setSelectedSuggestions(updatedUsers);
    };

    const handleBackspaceKeyDown = (e) => {
        if (e.key === 'Backspace') {
            if (inputText === '' && selectedSuggestions.length > 0) {
                e.preventDefault();
                if (highlightedIndex === null) {
                    setHighlightedIndex(selectedSuggestions.length - 1);
                } else {
                    const updatedUsers = [...selectedSuggestions];
                    updatedUsers.pop();
                    setSelectedSuggestions(updatedUsers);
                    setHighlightedIndex(null);
                }
            }
        }
    };

    return (
        <div className='user-search'>
            <div className='added-users'>
                {selectedSuggestions.map((selected, index) => (
                    <div
                        key={index}
                        className={`added-user ${index === highlightedIndex ? 'highlighted' : ''}`}
                    >
                        <span>{selected}</span>
                        <span className='cancel' onClick={() => handleCancelClick(index)}> X&nbsp;</span>
                    </div>
                ))}
                <div className="search-input" ref={inputRef}>
                    <input
                        type="text"
                        className='user-search-input'
                        value={inputText}
                        onChange={handleInputChange}
                        onKeyDown={handleBackspaceKeyDown}
                        placeholder='search user here..'
                    />
                </div>
                {showSuggestions && (
                    <div className="suggestion-box" style={{ top: cursorPosition.top, left: cursorPosition.left }} ref={suggestionBoxRef}>
                        <ul className="suggestion-list">
                            {suggestions.map((suggestion, index) => (
                                <li key={index} onClick={() => handleSuggestionClick(suggestion, index)}>
                                    {suggestion.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Search;
