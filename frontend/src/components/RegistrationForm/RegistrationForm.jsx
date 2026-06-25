import React, { useState, useRef } from 'react';
import './RegistrationForm.css';
import { API_BASE_URL } from '../../config';


const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    propertyName: '',
    propertyType: 'Villa',
    location: '',
    photos: []
  });

  const fileInputRef = useRef(null);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    try {
      const base64Files = await Promise.all(files.map(file => convertToBase64(file)));
      setFormData({ ...formData, photos: base64Files });
    } catch (err) {
      console.error('Error converting files:', err);
      alert('Error processing images. Please try again.');
    }
  };

  const removePhotos = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setFormData({ ...formData, photos: [] });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.role !== 'owner') {
      alert('Please sign in as a Property Owner to register your property.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/properties/add`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          name: formData.propertyName,
          type: formData.propertyType,
          location: formData.location,
          photos: formData.photos // Sending the file names/urls to MongoDB
        })
      });

      const data = await response.json();
      if (response.ok) {
        alert('Success! Your property and images are now saved in MongoDB.');
        setFormData({
          name: '',
          email: '',
          propertyName: '',
          propertyType: 'Villa',
          location: '',
          photos: []
        });
      } else {
        alert(data.msg || 'Failed to register property');
      }
    } catch (err) {
      console.error('Registration error:', err);
      alert('Connection to server failed');
    }
  };

  return (
    <section className="registration-section" id="register">
      <div className="registration-container">
        <div className="registration-info fade-in">
          <h2>Become a Host</h2>
          <p>Join our exclusive community of premium hill station property owners. We help you reach travelers looking for unique and luxury experiences.</p>
          
          <ul className="benefits-list">
            <li>
              <span className="icon">✓</span>
              <div>
                <h4>Increased Visibility</h4>
                <p>Get featured in our curated collections.</p>
              </div>
            </li>
            <li>
              <span className="icon">✓</span>
              <div>
                <h4>Premium Audience</h4>
                <p>Reach high-value guests looking for quality.</p>
              </div>
            </li>
            <li>
              <span className="icon">✓</span>
              <div>
                <h4>Seamless Management</h4>
                <p>Easy-to-use tools to manage your listings.</p>
              </div>
            </li>
          </ul>
        </div>
        
        <div className="registration-card glass-morphism fade-in">
          <h3>Register Your Property</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                required 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="John Doe" 
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="john@example.com" 
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Property Name</label>
                <input 
                  type="text" 
                  required 
                  value={formData.propertyName}
                  onChange={(e) => setFormData({...formData, propertyName: e.target.value})}
                  placeholder="e.g. Pine View Retreat" 
                />
              </div>
              <div className="form-group">
                <label>Property Type</label>
                <select 
                  value={formData.propertyType}
                  onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                >
                  <option>Villa</option>
                  <option>Hotel</option>
                  <option>Cabin</option>
                  <option>Resort</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Location</label>
              <input 
                type="text" 
                required 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="City, State" 
              />
            </div>
            <div className="form-group">
              <label>Property Photos {formData.photos.length > 0 && `(${formData.photos.length} selected)`}</label>
              <div className="photo-upload-area">
                <div className="upload-content">
                  <span className="upload-icon">+</span>
                  <p>{formData.photos.length > 0 ? `${formData.photos.length} images selected` : 'Upload property images'}</p>
                  <span>Supported formats: JPG, PNG</span>
                </div>
                <input 
                  type="file" 
                  multiple 
                  className="file-input" 
                  onChange={handleFileChange} 
                  ref={fileInputRef}
                />
                {formData.photos.length > 0 && (
                  <button 
                    type="button" 
                    className="remove-photos-btn" 
                    onClick={removePhotos}
                    title="Remove selected photos"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            <button type="submit" className="btn-primary w-full">Submit Application</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RegistrationForm;
