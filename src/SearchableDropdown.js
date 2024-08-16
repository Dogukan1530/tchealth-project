import React, { useState } from 'react';

const SearchableDropdown = ({ options, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInputClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="dropdown-container">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleInputChange}
        onClick={handleInputClick}
        className="search-input"
      />
      {isDropdownOpen && (
        <div className="dropdown-menu">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.name}
                className="dropdown-item"
                onClick={() => {
                  setSearchTerm(option.name);
                  setIsDropdownOpen(false);
                  onSelect(option.name); // Pass selected option to parent
                }}
              >
                {option.name}
              </div>
            ))
          ) : (
            <div className="dropdown-item">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;