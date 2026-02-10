import React, { useState } from 'react';

const FilterSidebar = ({ filters, onFiltersChange, onClearFilters }) => {
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice || '',
    max: filters.maxPrice || ''
  });
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  // Women's clothing categories
  const categories = [
    { id: 'dresses', name: 'Dresses', icon: '👗' },
    { id: 'tops', name: 'Tops', icon: '👚' },
    { id: 'jeans', name: 'Jeans', icon: '👖' },
    { id: 'lowers', name: 'Lowers', icon: '🩱' },
    { id: 'innerwear', name: 'Innerwear', icon: '🩲' },
    { id: 'ethnic', name: 'Ethnic Dresses', icon: '🥻' },
    { id: 'sexy', name: 'Sexy Dresses', icon: '💃' }
  ];

  // Pre-defined price ranges in Indian Rupees
  const priceRanges = [
    { label: 'Under ₹500', min: 0, max: 500 },
    { label: '₹500 - ₹1,000', min: 500, max: 1000 },
    { label: '₹1,000 - ₹2,000', min: 1000, max: 2000 },
    { label: '₹2,000 - ₹3,500', min: 2000, max: 3500 },
    { label: '₹3,500 - ₹5,000', min: 3500, max: 5000 },
    { label: 'Above ₹5,000', min: 5000, max: null }
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Newest First', order: 'desc' },
    { value: 'price', label: 'Price: Low to High', order: 'asc' },
    { value: 'price', label: 'Price: High to Low', order: 'desc' },
    { value: 'name', label: 'Name: A to Z', order: 'asc' },
    { value: 'rating', label: 'Customer Rating', order: 'desc' },
    { value: 'popularity', label: 'Most Popular', order: 'desc' }
  ];

  const handleCategoryChange = (categoryId) => {
    onFiltersChange({
      ...filters,
      category: filters.category === categoryId ? '' : categoryId
    });
  };

  const handlePriceRangeClick = (range) => {
    setPriceRange({ min: range.min, max: range.max || '' });
    onFiltersChange({
      ...filters,
      minPrice: range.min,
      maxPrice: range.max || ''
    });
  };

  const handleCustomPriceChange = (field, value) => {
    const newPriceRange = { ...priceRange, [field]: value };
    setPriceRange(newPriceRange);
    
    onFiltersChange({
      ...filters,
      minPrice: newPriceRange.min,
      maxPrice: newPriceRange.max
    });
  };

  const handleSortChange = (e) => {
    const selectedOption = sortOptions.find(option => 
      `${option.value}-${option.order}` === e.target.value
    );
    
    if (selectedOption) {
      onFiltersChange({
        ...filters,
        sortBy: selectedOption.value,
        order: selectedOption.order
      });
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Debounce search
    setTimeout(() => {
      onFiltersChange({
        ...filters,
        search: value
      });
    }, 500);
  };

  const handleClearFilters = () => {
    setPriceRange({ min: '', max: '' });
    setSearchTerm('');
    onClearFilters();
  };

  return (
    <div className="filter-sidebar">
      <div className="filter-header">
        <h3>🔍 Filters</h3>
        <button onClick={handleClearFilters} className="clear-filters">
          Clear All
        </button>
      </div>

      {/* Search Filter */}
      <div className="filter-section">
        <h4>🔎 Search Products</h4>
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search dresses, tops, jeans..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-filter-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      {/* Categories */}
      <div className="filter-section">
        <h4>📁 Categories</h4>
        <div className="category-grid">
          <label className="category-item all-categories">
            <input
              type="radio"
              name="category"
              checked={!filters.category}
              onChange={() => handleCategoryChange('')}
            />
            <div className="category-content">
              <span className="category-icon">🛍️</span>
              <span className="category-name">All Categories</span>
            </div>
          </label>
          
          {categories.map(category => (
            <label key={category.id} className="category-item">
              <input
                type="radio"
                name="category"
                checked={filters.category === category.id}
                onChange={() => handleCategoryChange(category.id)}
              />
              <div className="category-content">
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="filter-section">
        <h4>💰 Price Range</h4>
        
        {/* Quick Price Filters */}
        <div className="price-quick-filters">
          {priceRanges.map((range, index) => (
            <button
              key={index}
              onClick={() => handlePriceRangeClick(range)}
              className={`price-range-btn ${
                (priceRange.min === range.min && priceRange.max === range.max) ? 'active' : ''
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Custom Price Range */}
        <div className="custom-price-range">
          <h5>Custom Range</h5>
          <div className="price-inputs">
            <input
              type="number"
              placeholder="Min ₹"
              value={priceRange.min}
              onChange={(e) => handleCustomPriceChange('min', e.target.value)}
              className="price-input"
              min="0"
            />
            <span className="price-separator">-</span>
            <input
              type="number"
              placeholder="Max ₹"
              value={priceRange.max}
              onChange={(e) => handleCustomPriceChange('max', e.target.value)}
              className="price-input"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div className="filter-section">
        <h4>📊 Sort By</h4>
        <select 
          onChange={handleSortChange}
          value={`${filters.sortBy || 'createdAt'}-${filters.order || 'desc'}`}
          className="sort-select"
        >
          {sortOptions.map((option, index) => (
            <option key={index} value={`${option.value}-${option.order}`}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Special Filters */}
      <div className="filter-section">
        <h4>⚡ Special</h4>
        <div className="special-filters">
          <label className="special-filter-item">
            <input type="checkbox" />
            <span className="checkmark">⭐</span>
            Featured Products
          </label>
          <label className="special-filter-item">
            <input type="checkbox" defaultChecked />
            <span className="checkmark">📦</span>
            In Stock Only
          </label>
          <label className="special-filter-item">
            <input type="checkbox" />
            <span className="checkmark">🚚</span>
            Free Delivery
          </label>
          <label className="special-filter-item">
            <input type="checkbox" />
            <span className="checkmark">💰</span>
            On Sale
          </label>
        </div>
      </div>

      {/* Active Filters */}
      {(filters.category || filters.minPrice || filters.maxPrice || filters.search) && (
        <div className="filter-section">
          <h4>🏷️ Active Filters</h4>
          <div className="active-filters">
            {filters.search && (
              <span className="filter-tag">
                Search: "{filters.search}"
                <button onClick={() => {
                  setSearchTerm('');
                  onFiltersChange({ ...filters, search: '' });
                }}>×</button>
              </span>
            )}
            {filters.category && (
              <span className="filter-tag">
                {categories.find(c => c.id === filters.category)?.name || filters.category}
                <button onClick={() => handleCategoryChange(filters.category)}>×</button>
              </span>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <span className="filter-tag">
                ₹{filters.minPrice || '0'} - ₹{filters.maxPrice || '∞'}
                <button onClick={() => {
                  setPriceRange({ min: '', max: '' });
                  onFiltersChange({ ...filters, minPrice: '', maxPrice: '' });
                }}>×</button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;