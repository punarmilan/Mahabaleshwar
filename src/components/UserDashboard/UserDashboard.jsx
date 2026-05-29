import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';
import bgImage from '../../assets/hillstationhome (1).jpg';

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userData || !token) {
      navigate('/signin');
      return;
    }

    setUser(JSON.parse(userData));
    fetchMyBookings(token);
  }, [navigate]);

  const fetchMyBookings = async (token) => {
    try {
      const response = await fetch('http://localhost:5001/api/bookings/my-bookings', {
        headers: { 'x-auth-token': token }
      });
      const data = await response.json();
      if (response.ok) {
        setBookings(data);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin');
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      console.log('Attempting to cancel booking:', bookingId);
      const response = await fetch(`http://127.0.0.1:5001/api/bookings/cancel/${bookingId}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token 
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        alert('Booking cancelled successfully.');
        fetchMyBookings(token); // Refresh list
      } else {
        alert(data.msg || 'Cancellation failed.');
      }
    } catch (err) {
      console.error('Cancellation error:', err);
      alert('Network error. Please try again.');
    }
  };

  const activeBookings = bookings.filter(
    (b) => b.status !== 'cancelled' && new Date(b.checkOut) >= new Date()
  );
  const cancelledBookings = bookings.filter((b) => b.status === 'cancelled');
  const bookingHistory = bookings.filter(
    (b) => b.status !== 'cancelled' && new Date(b.checkOut) < new Date()
  );

  const renderBookingList = (bookingsList, emptyMessage, isHistoryOrCancelled = false) => {
    if (bookingsList.length === 0) {
      return (
        <div className="compact-empty-state glass-morphism">
          <p>{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="bookings-list">
        {bookingsList.map((booking) => {
          const propertyImg = (booking.property?.photos && booking.property.photos.length > 0)
            ? (booking.property.photos[0].startsWith('http') || booking.property.photos[0].startsWith('data:') ? booking.property.photos[0] : "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800")
            : (booking.property?.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80');
          
          return (
            <div key={booking._id} className="booking-list-item glass-morphism">
              <div className="booking-list-image">
                <img src={propertyImg} alt={booking.property?.name} />
                <div className={`booking-status-badge ${booking.status}`}>
                  {booking.status}
                </div>
              </div>
              
              <div className="booking-list-details">
                <div className="booking-list-header">
                  <h2>{booking.property?.name || 'Deleted Property'}</h2>
                  <p className="location"><i className="fas fa-map-marker-alt"></i> {booking.property?.location || 'Unknown Location'}</p>
                </div>
                
                <div className="booking-list-dates">
                  <div className="date-item">
                    <span>Check In</span>
                    <strong>{new Date(booking.checkIn).toLocaleDateString()}</strong>
                  </div>
                  <div className="date-divider"></div>
                  <div className="date-item">
                    <span>Check Out</span>
                    <strong>{new Date(booking.checkOut).toLocaleDateString()}</strong>
                  </div>
                </div>
              </div>

              <div className="booking-list-right">
                <div className="total-price">
                  <span>Total Price</span>
                  <strong>₹{booking.totalPrice}</strong>
                </div>
                <div className="action-buttons">
                  <button className="view-details-btn">View Receipt</button>
                  {!isHistoryOrCancelled && booking.status !== 'cancelled' && (
                    (() => {
                      const diffHours = Math.abs(new Date() - new Date(booking.createdAt)) / 36e5;
                      return diffHours <= 24 ? (
                        <button 
                          onClick={() => handleCancelBooking(booking._id)} 
                          className="cancel-booking-btn"
                        >
                          Cancel Stay
                        </button>
                      ) : (
                        <span className="policy-expired">Policy Expired</span>
                      );
                    })()
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) return <div className="loading">Loading your dashboard...</div>;

  return (
    <div className="user-dashboard">
      <div className="dashboard-bg">
        <img src={bgImage} alt="Background" />
        <div className="dashboard-overlay"></div>
      </div>
      
      <nav className="dashboard-nav">
        <div className="user-info">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <h3>
              {user?.name}
              {user?.role === 'owner' && <span className="owner-label">Owner</span>}
            </h3>
            {user?.role !== 'owner' && <p>{user?.email}</p>}
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </nav>

      <div className="dashboard-content">
        <header className="content-header">
          <h1>Your Luxury Dashboard</h1>
          <p>Manage your bookings, cancellations, and history</p>
        </header>

        {/* Quick Nav Tabs */}
        <div className="dashboard-tabs-nav glass-morphism">
          <a href="#active-bookings" className="tab-nav-link">
            <span className="nav-icon">🛎️</span> Active Bookings ({activeBookings.length})
          </a>
          <a href="#cancelled-bookings" className="tab-nav-link">
            <span className="nav-icon">❌</span> Cancelled Bookings ({cancelledBookings.length})
          </a>
          <a href="#booking-history" className="tab-nav-link">
            <span className="nav-icon">⏳</span> Booking History ({bookingHistory.length})
          </a>
        </div>

        {/* Active Bookings Section */}
        <section id="active-bookings" className="dashboard-section">
          <div className="section-title-container">
            <h2>🛎️ Active Bookings</h2>
            <span className="section-badge active-badge">{activeBookings.length}</span>
          </div>
          {renderBookingList(activeBookings, "You do not have any active stays at the moment. Explore our luxury stays!", false)}
        </section>

        {/* Cancelled Bookings Section */}
        <section id="cancelled-bookings" className="dashboard-section">
          <div className="section-title-container">
            <h2>❌ Cancelled Bookings</h2>
            <span className="section-badge cancelled-badge">{cancelledBookings.length}</span>
          </div>
          {renderBookingList(cancelledBookings, "No cancelled bookings found.", true)}
        </section>

        {/* Booking History Section */}
        <section id="booking-history" className="dashboard-section">
          <div className="section-title-container">
            <h2>⏳ Booking History</h2>
            <span className="section-badge history-badge">{bookingHistory.length}</span>
          </div>
          {renderBookingList(bookingHistory, "You haven't stayed with us in the past yet.", true)}
        </section>
      </div>
    </div>
  );
};

export default UserDashboard;
