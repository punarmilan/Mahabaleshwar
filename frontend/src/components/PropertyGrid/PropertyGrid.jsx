import React, { useState } from 'react';
import PropertyCard from '../PropertyCard/PropertyCard';
import { properties } from '../../data/mockData';
import './PropertyGrid.css';
import { API_BASE_URL } from '../../config';


const PropertyGrid = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [dbProperties, setDbProperties] = useState([]);

  React.useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/properties/all`);
        const data = await response.json();
        if (response.ok) {
          // Map MongoDB data to match PropertyCard format
          const mappedData = data.map(prop => ({
            id: prop._id,
            name: prop.name,
            location: prop.location,
            type: prop.type,
            price: "₹10,000", // Default price
            rating: 4.8,      // Default rating
            tag: "New",       // Default tag
            // Use the first photo or a beautiful luxury placeholder
            image: prop.photos && prop.photos.length > 0 
              ? (prop.photos[0].startsWith('http') || prop.photos[0].startsWith('data:') ? prop.photos[0] : "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800")
              : "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800"
          }));
          setDbProperties(mappedData);
        }
      } catch (err) {
        console.error('Failed to fetch properties:', err);
      }
    };
    fetchProperties();
  }, []);

  // Merge mock data with DB data for demonstration if DB is empty
  const allProperties = dbProperties.length > 0 ? dbProperties : properties;

  const filteredProperties = activeFilter === 'All' 
    ? allProperties 
    : allProperties.filter(prop => prop.type === activeFilter);

  return (
    <section className="property-grid-section" id="explore">
      <div className="section-header">
        <span className="section-subtitle">Our Curated Collection</span>
        <h2>Explore Exceptional Stays</h2>
        <div className="filter-tabs">
          <button 
            className={`filter-btn ${activeFilter === 'All' ? 'active' : ''}`}
            onClick={() => setActiveFilter('All')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'Villa' ? 'active' : ''}`}
            onClick={() => setActiveFilter('Villa')}
          >
            Villas
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'Hotel' ? 'active' : ''}`}
            onClick={() => setActiveFilter('Hotel')}
          >
            Hotels
          </button>
        </div>
      </div>
      
      <div className="grid-container">
        {filteredProperties.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
      
      <div className="view-all-container">
        <button className="btn-outline">View All Destinations</button>
      </div>
    </section>
  );
};

export default PropertyGrid;
