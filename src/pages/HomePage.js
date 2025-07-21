import React, { useEffect, useState, useMemo } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';
import '../styles.css'; // Citing shared styles

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // <-- NEW: State for the search query
  const navigate = useNavigate();

  useEffect(() => {
    // Fetches all restaurants when the component first loads
    axios.get('/restaurants').then((res) => setRestaurants(res.data));
  }, []);

  // --- NEW: Filter restaurants based on the search query ---
  const filteredRestaurants = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      return restaurants; // If search is empty, return all restaurants
    }

    return restaurants.filter(restaurant => {
      // Check if the restaurant name matches the query
      const restaurantNameMatch = restaurant.name.toLowerCase().includes(query);
      if (restaurantNameMatch) {
        return true;
      }
      
      // Check if any menu item in that restaurant matches the query
      const menuItemMatch = restaurant.menu.some(item => 
        item.name.toLowerCase().includes(query)
      );
      
      return menuItemMatch;
    });
  }, [restaurants, searchQuery]); // Re-run this logic only when restaurants or searchQuery change


  return (
    <div className="container">
      <h2>Restaurants</h2>

      {/* --- NEW: Search Bar Input --- */}
      <input
        type="text"
        placeholder="Search for restaurants or food..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={styles.searchInput}
      />

      {/* Display filtered results */}
      {filteredRestaurants.length > 0 ? (
        filteredRestaurants.map((r) => (
          <div
            key={r._id}
            className="card"
            onClick={() => navigate(`/restaurant/${r._id}`)}
          >
            <h3>{r.name}</h3>
            <p>{r.address}</p>
          </div>
        ))
      ) : (
        <p>No results found for "{searchQuery}".</p>
      )}
    </div>
  );
}

const styles = {
  searchInput: {
    width: '100%',
    padding: '12px',
    marginBottom: '20px',
    fontSize: '16px',
    borderRadius: 'var(--border-radius)',
    border: '1px solid #ccc',
    boxSizing: 'border-box' // Ensures padding doesn't affect the total width
  }
};