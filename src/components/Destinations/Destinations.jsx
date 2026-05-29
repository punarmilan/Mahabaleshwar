import React from 'react';
import './Destinations.css';
import mahabaleshwarImg from '../../assets/krishnabai-temple-mahabaleshwar-maharashtra-1-attr-nearby.jpg';
import panchgangaImg from '../../assets/panchganga-temple.jpg';
import morarjiImg from '../../assets/morarji-castle-.jpg';
import panchganiImg from '../../assets/panchgani.jpg';

const destinations = [
  {
    name: "Krishnabai Temple",
    state: "Maharashtra",
    properties: "150+ Stays",
    image: mahabaleshwarImg
  },
  {
    name: "Panchaganga Temple",
    state: "Maharashtra",
    properties: "85+ Stays",
    image: panchgangaImg
  },
  {
    name: "Morarji Castle",
    state: "Maharashtra",
    properties: "65+ Stays",
    image: morarjiImg
  },
  {
    name: "Panchgani",
    state: "Maharashtra",
    properties: "110+ Stays",
    image: panchganiImg
  }
];

const Destinations = () => {
  return (
    <section className="destinations-section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Discover Your Path</span>
          <h2>Top Hill Destinations</h2>
        </div>
        
        <div className="destinations-grid">
          {destinations.map((dest, index) => (
            <div className="destination-card fade-in" key={index} style={{ animationDelay: `${index * 0.15}s` }}>
              <img src={dest.image} alt={dest.name} />
              <div className="destination-info">
                <h3>{dest.name}</h3>
                <p>{dest.state} • {dest.properties}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Destinations;
