import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './PropertyDetails.css';
import { properties as mockProperties } from '../../data/mockData';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingDates, setBookingDates] = useState(() => ({
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || ''
  }));
  const [guests, setGuests] = useState(() => {
    const qGuests = searchParams.get('guests');
    if (qGuests) {
      const parsed = parseInt(qGuests, 10);
      if (!isNaN(parsed)) return parsed;
    }
    return 1;
  });
  const [showFakeModal, setShowFakeModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  useEffect(() => {
    const qCheckIn = searchParams.get('checkIn');
    const qCheckOut = searchParams.get('checkOut');
    const qGuests = searchParams.get('guests');

    if (qCheckIn || qCheckOut) {
      setBookingDates({
        checkIn: qCheckIn || '',
        checkOut: qCheckOut || ''
      });
    }
    if (qGuests) {
      const parsed = parseInt(qGuests, 10);
      if (!isNaN(parsed)) {
        setGuests(parsed);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProperty = async () => {
      const mockId = parseInt(id);
      if (!isNaN(mockId) && mockId < 100) {
        const mockItem = mockProperties.find(p => p.id === mockId);
        if (mockItem) {
          setProperty({ ...mockItem, photos: [mockItem.image] });
          setLoading(false);
          return;
        }
      }

      try {
        const response = await fetch(`http://localhost:5001/api/properties/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProperty(data);
        } else {
          const mockItem = mockProperties.find(p => p.id === parseInt(id));
          if (mockItem) setProperty({ ...mockItem, photos: [mockItem.image] });
        }
      } catch (err) {
        const mockItem = mockProperties.find(p => p.id === parseInt(id));
        if (mockItem) setProperty({ ...mockItem, photos: [mockItem.image] });
      }
      setLoading(false);
    };
    fetchProperty();
    window.scrollTo(0, 0);
  }, [id]);

  const calculateTotalPrice = () => {
    if (!bookingDates.checkIn || !bookingDates.checkOut || !property) return 0;
    const start = new Date(bookingDates.checkIn);
    const end = new Date(bookingDates.checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const priceValue = property.price?.toString().replace(/[^0-9]/g, '') || '15000';
    return parseInt(priceValue) * diffDays;
  };

  const handleBookingStart = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please sign in to book your stay.');
      navigate('/signin');
      return;
    }

    const total = calculateTotalPrice();
    if (total <= 0) {
      alert('Please select valid check-in and check-out dates.');
      return;
    }

    try {
      setIsProcessing(true);
      // Create order on server (marking as fake for now to ensure it works)
      const response = await fetch('http://localhost:5001/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          propertyId: id,
          checkIn: bookingDates.checkIn,
          checkOut: bookingDates.checkOut,
          guests: guests,
          totalPrice: total,
          isFake: true 
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Booking failed');

      setPendingData(data);
      console.log('Booking session initialized:', data.order_id);
      
      // Small timeout to ensure state is flushed before modal interactions
      setTimeout(() => {
        setShowFakeModal(true);
      }, 100);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmFakePayment = async () => {
    // Safety check: if state is missing, try to recover or show detailed error
    if (!pendingData) {
      console.error('State Error: pendingData is null');
      alert('Session lost. Please refresh and try again.');
      setShowFakeModal(false);
      return;
    }

    if (!pendingData.order_id) {
      console.error('Data Error: order_id is missing in pendingData', pendingData);
      alert('Order ID missing. Please try reserving again.');
      setShowFakeModal(false);
      return;
    }

    setIsProcessing(true);
    const token = localStorage.getItem('token');
    try {
      console.log('Confirming simulated payment for order:', pendingData.order_id);
      const response = await fetch('http://localhost:5001/api/bookings/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          razorpay_order_id: pendingData.order_id,
          isFake: true
        })
      });

      const resData = await response.json();
      console.log('Verification response:', resData);

      if (response.ok) {
        alert('Payment Successful! (Simulated)');
        navigate('/dashboard');
      } else {
        alert(`Payment simulation failed: ${resData.msg || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Verification Network Error:', err);
      alert('Network Error: Could not reach the server.');
    } finally {
      setIsProcessing(false);
      setShowFakeModal(false);
    }
  };

  if (loading) return <div className="loading">Loading your luxury experience...</div>;
  if (!property) return <div className="error">Property not found</div>;

  return (
    <>
      <Navbar />
      <div className="property-details-page">
        <div className="details-hero">
          <img src={property.photos?.[0] || property.image} alt={property.name} />
          <div className="hero-overlay">
            <div className="container">
              <span className="badge">{property.type}</span>
              <h1>{property.name}</h1>
              <p className="location-text">📍 {property.location}</p>
            </div>
          </div>
        </div>

        <div className="container main-content">
          <div className="details-grid">
            <div className="info-section">
              <div className="description-card glass-morphism">
                <h3>About this {property.type}</h3>
                <p>Experience the ultimate luxury at {property.name}. Nestled in the heart of {property.location}, this exquisite {property.type} offers breathtaking views and premium amenities.</p>
                <div className="amenities">
                  <h4>What this place offers</h4>
                  <ul>
                    <li>Mountain View</li>
                    <li>Premium Wifi</li>
                    <li>Private Kitchen</li>
                    <li>Infinity Pool Access</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="booking-section">
              <div className="booking-card glass-morphism">
                <div className="price-header">
                  <span className="price-text">₹{property.price || '15,000'}</span>
                  <span className="per-night">/ night</span>
                </div>

                <form onSubmit={handleBookingStart} className="booking-form">
                  <div className="form-group">
                    <label>Check-in</label>
                    <input type="date" required value={bookingDates.checkIn} onChange={(e) => setBookingDates({ ...bookingDates, checkIn: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Check-out</label>
                    <input type="date" required value={bookingDates.checkOut} onChange={(e) => setBookingDates({ ...bookingDates, checkOut: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Guests</label>
                    <select value={guests} onChange={(e) => setGuests(parseInt(e.target.value))}>
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                    </select>
                  </div>
                  
                  {bookingDates.checkIn && bookingDates.checkOut && (
                    <div className="price-summary">
                      <div className="price-row">
                        <span>Total Amount</span>
                        <strong>₹{calculateTotalPrice()}</strong>
                      </div>
                    </div>
                  )}

                  <button type="submit" disabled={isProcessing} className="btn-primary w-full">
                    {isProcessing ? 'Processing...' : 'Reserve & Pay'}
                  </button>
                </form>
                <p className="no-charge">Secure Simulation Mode Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Fake Payment Modal */}
        {showFakeModal && (
          <div className="fake-payment-overlay">
            <div className="fake-payment-modal glass-morphism">
              <div className="modal-header">
                <h3>Secure Checkout</h3>
                <p>Simulation Mode</p>
              </div>
              <div className="modal-body">
                <div className="payment-summary">
                  <p>Property: <strong>{property.name}</strong></p>
                  <p>Amount to Pay: <strong className="amount">₹{calculateTotalPrice()}</strong></p>
                </div>
                <div className="fake-card-info">
                  <div className="fake-card-graphic">
                    <div className="chip"></div>
                    <p className="card-number">**** **** **** 1234</p>
                    <p className="card-holder">LUXURY MEMBER</p>
                  </div>
                  <p className="sim-hint">This is a simulated payment gateway for testing.</p>
                </div>
                <button onClick={confirmFakePayment} disabled={isProcessing} className="btn-primary pay-btn">
                  {isProcessing ? 'Verifying...' : 'Pay Now'}
                </button>
                <button onClick={() => setShowFakeModal(false)} className="btn-text cancel-btn">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default PropertyDetails;
