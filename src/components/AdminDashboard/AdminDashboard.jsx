import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('properties');
  const [data, setData] = useState({
    users: [],
    properties: [],
    bookings: [] // Placeholder
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchAdminData();
  }, [activeTab]);

  const fetchAdminData = async () => {
    const token = localStorage.getItem('token');
    const endpoint = activeTab === 'properties' ? 'admin/properties' : 
                     activeTab === 'users' ? 'admin/users' : 'bookings/all';
    
    try {
      const response = await fetch(`http://localhost:5001/api/${endpoint}`, {
        headers: { 'x-auth-token': token }
      });
      const result = await response.json();
      if (response.ok && Array.isArray(result)) {
        setData(prev => ({ ...prev, [activeTab]: result }));
      } else {
        console.warn('Expected array but got:', result);
        setData(prev => ({ ...prev, [activeTab]: [] }));
      }
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setLoading(false);
    }
  };

  const handleUpdatePrice = async (id, newPrice) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5001/api/admin/property/${id}/price`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token 
        },
        body: JSON.stringify({ price: newPrice })
      });
      if (response.ok) {
        alert('Price updated successfully');
        fetchAdminData();
      }
    } catch (err) {
      alert('Failed to update price');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5001/api/admin/property/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token 
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        alert(`Property ${status} successfully`);
        fetchAdminData();
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>
        <button className={activeTab === 'properties' ? 'active' : ''} onClick={() => setActiveTab('properties')}>Properties</button>
        <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>Users</button>
        <button className={activeTab === 'bookings' ? 'active' : ''} onClick={() => setActiveTab('bookings')}>Bookings</button>
      </div>

      <div className="admin-content">
        {loading ? <p>Loading...</p> : (
          <div className="data-table glass-morphism">
            {activeTab === 'properties' && (
              <table>
                <thead>
                  <tr>
                    <th>Property Name</th>
                    <th>Owner</th>
                    <th>Location</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.properties.map(prop => (
                    <tr key={prop._id}>
                      <td>{prop.name}</td>
                      <td>{prop.owner?.name || 'Unknown'}</td>
                      <td>{prop.location}</td>
                      <td>₹{prop.price}</td>
                      <td>
                        <span className={`status-badge ${prop.status}`}>
                          {prop.status}
                        </span>
                      </td>
                      <td className="action-buttons">
                        <button className="btn-edit" onClick={() => {
                          const p = prompt('Enter new price:', prop.price);
                          if (p) handleUpdatePrice(prop._id, p);
                        }}>Price</button>
                        {prop.status === 'pending' && (
                          <>
                            <button className="btn-approve" onClick={() => handleStatusUpdate(prop._id, 'approved')}>Approve</button>
                            <button className="btn-reject" onClick={() => handleStatusUpdate(prop._id, 'rejected')}>Reject</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'users' && (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'bookings' && (
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Property</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.bookings.map(booking => (
                    <tr key={booking._id}>
                      <td>
                        <div className="user-cell">
                          <strong>{booking.user?.name || 'Unknown'}</strong>
                          <span>{booking.user?.email}</span>
                        </div>
                      </td>
                      <td>{booking.property?.name || 'Deleted Property'}</td>
                      <td>{new Date(booking.checkIn).toLocaleDateString()}</td>
                      <td>{new Date(booking.checkOut).toLocaleDateString()}</td>
                      <td>₹{booking.totalPrice}</td>
                      <td>
                        <div className="status-cell">
                          <span className={`status-badge ${booking.status}`}>
                            {booking.status}
                          </span>
                          <small>{booking.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Unpaid'}</small>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
