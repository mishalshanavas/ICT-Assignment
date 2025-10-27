import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ImageWithFallback from '../components/ImageWithFallback';
import './Orders.css';

const Orders = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getMyOrders();
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load your order history. Our delivery guy might have eaten the data! 🍕');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await orderAPI.updateStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { ...order, status: newStatus, funnyStatusMessage: response.data.order.funnyStatusMessage }
          : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order? Even our imaginary food has feelings! 😢')) {
      try {
        await orderAPI.cancel(orderId);
        await fetchOrders(); // Refresh orders
      } catch (error) {
        console.error('Error cancelling order:', error);
        alert('Failed to cancel order. It seems your food is too attached to you! 💔');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'placed': '#007bff',
      'confirmed': '#6f42c1',
      'preparing': '#fd7e14',
      'out-for-delivery': '#20c997',
      'delivered': '#28a745',
      'cancelled': '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  const getStatusEmoji = (status) => {
    const emojis = {
      'placed': '📝',
      'confirmed': '✅',
      'preparing': '👨‍🍳',
      'out-for-delivery': '🏍️',
      'delivered': '🎉',
      'cancelled': '❌'
    };
    return emojis[status] || '❓';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFunnyEmptyMessage = () => {
    const messages = [
      "Your order history is emptier than your fridge on a Sunday night! 🥲",
      "No orders yet? Your wallet is probably thanking us! 💸",
      "Looks like you haven't experienced our digital deliciousness yet! 🤤",
      "Your order history is as clean as your search history... or is it? 🤔",
      "No orders found! Time to fix this tragic situation! 😱"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  if (!isAuthenticated) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="auth-prompt">
            <h1>🔐 Login Required!</h1>
            <p>You need to login to see your hilarious order history!</p>
            <p className="funny-text">
              Don't worry, we promise not to judge your 3 AM food choices... much! 🌙🍕
            </p>
            <Link to="/login" className="btn btn-primary">
              Login & See My Shame
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading your order history... Our accountant is counting imaginary receipts! 🧾</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="error-state">
            <h2>🤷‍♂️ Oops!</h2>
            <p>{error}</p>
            <button onClick={fetchOrders} className="btn btn-primary">
              Try Again (Pretty Please)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <div className="orders-header">
          <h1 className="page-title">🍽️ My Hilarious Order History</h1>
          <p className="page-subtitle">
            Welcome back, {user?.name}! Ready to relive your food decisions? 
            {orders.length > 0 && ` You've made ${orders.length} questionable choices so far! 😄`}
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-content">
              <div className="empty-icon">🍽️</div>
              <h2>No Orders Yet!</h2>
              <p className="funny-empty-message">{getFunnyEmptyMessage()}</p>
              <div className="empty-actions">
                <Link to="/restaurants" className="btn btn-primary">
                  🛒 Start Your Food Adventure
                </Link>
                <Link to="/" className="btn btn-secondary">
                  🏠 Go Home
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3 className="order-restaurant">{order.restaurant?.name}</h3>
                    <p className="order-date">{formatDate(order.createdAt)}</p>
                    <p className="order-id">Order #{order._id.slice(-8)}</p>
                  </div>
                  
                  <div className="order-status-section">
                    <div 
                      className="order-status"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      <span className="status-emoji">{getStatusEmoji(order.status)}</span>
                      <span className="status-text">{order.status.replace('-', ' ').toUpperCase()}</span>
                    </div>
                    <div className="order-amount">₹{order.finalAmount}</div>
                  </div>
                </div>

                <div className="order-funny-status">
                  💭 "{order.funnyStatusMessage}"
                </div>

                <div className="order-items-preview">
                  <div className="items-count">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''} ordered
                  </div>
                  <div className="items-list">
                    {order.items.slice(0, 3).map((item, index) => (
                      <span key={index} className="item-name">
                        {item.menuItem.name} x{item.quantity}
                        {index < Math.min(order.items.length, 3) - 1 && ', '}
                      </span>
                    ))}
                    {order.items.length > 3 && (
                      <span className="more-items">... and {order.items.length - 3} more</span>
                    )}
                  </div>
                </div>

                <div className="order-actions">
                  <button
                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                    className="btn btn-secondary btn-sm"
                  >
                    {expandedOrder === order._id ? '👆 Hide Details' : '👇 Show Details'}
                  </button>

                  {/* Demo order status buttons */}
                  {order.status === 'placed' && (
                    <button
                      onClick={() => handleStatusUpdate(order._id, 'confirmed')}
                      className="btn btn-primary btn-sm"
                    >
                      ✅ Confirm Order (Demo)
                    </button>
                  )}
                  {order.status === 'confirmed' && (
                    <button
                      onClick={() => handleStatusUpdate(order._id, 'preparing')}
                      className="btn btn-primary btn-sm"
                    >
                      👨‍🍳 Start Preparing (Demo)
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => handleStatusUpdate(order._id, 'out-for-delivery')}
                      className="btn btn-primary btn-sm"
                    >
                      🏍️ Out for Delivery (Demo)
                    </button>
                  )}
                  {order.status === 'out-for-delivery' && (
                    <button
                      onClick={() => handleStatusUpdate(order._id, 'delivered')}
                      className="btn btn-success btn-sm"
                    >
                      🎉 Mark Delivered (Demo)
                    </button>
                  )}

                  {!['delivered', 'cancelled'].includes(order.status) && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="btn btn-danger btn-sm"
                    >
                      ❌ Cancel Order
                    </button>
                  )}

                  <Link 
                    to={`/restaurant/${order.restaurant?._id}`}
                    className="btn btn-secondary btn-sm"
                  >
                    🔄 Reorder (More Mistakes!)
                  </Link>
                </div>

                {expandedOrder === order._id && (
                  <div className="order-details">
                    <div className="order-items-detailed">
                      <h4>📋 Order Items:</h4>
                      <div className="detailed-items">
                        {order.items.map((item, index) => (
                          <div key={index} className="detailed-item">
                            <ImageWithFallback
                              src={item.menuItem.image}
                              alt={item.menuItem.name}
                              className="item-image-small"
                            />
                            <div className="item-details">
                              <span className="item-name">{item.menuItem.name}</span>
                              <span className="item-quantity">Qty: {item.quantity}</span>
                              <span className="item-price">₹{item.price}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="order-summary">
                      <h4>💰 Bill Breakdown:</h4>
                      <div className="bill-row">
                        <span>Subtotal:</span>
                        <span>₹{order.totalAmount}</span>
                      </div>
                      <div className="bill-row">
                        <span>Delivery Fee:</span>
                        <span>₹{order.deliveryFee}</span>
                      </div>
                      <div className="bill-row">
                        <span>Tax (5%):</span>
                        <span>₹{order.tax}</span>
                      </div>
                      <div className="bill-row total">
                        <span>Total Damage:</span>
                        <span>₹{order.finalAmount}</span>
                      </div>
                    </div>

                    <div className="delivery-info">
                      <h4>🏠 Delivery Address:</h4>
                      <p>
                        {order.deliveryAddress.street}<br />
                        {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}<br />
                        📞 {order.deliveryAddress.phone}
                      </p>
                    </div>

                    {order.orderNotes && (
                      <div className="order-notes">
                        <h4>📝 Special Instructions:</h4>
                        <p>"{order.orderNotes}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {orders.length > 0 && (
          <div className="orders-footer">
            <div className="funny-stats">
              <h3>🎭 Your Food Journey Stats:</h3>
              <div className="stats-grid">
                <div className="stat">
                  <span className="stat-number">{orders.length}</span>
                  <span className="stat-label">Total Orders</span>
                  <span className="stat-funny">Questionable Decisions</span>
                </div>
                <div className="stat">
                  <span className="stat-number">
                    ₹{orders.reduce((total, order) => total + order.finalAmount, 0)}
                  </span>
                  <span className="stat-label">Total Spent</span>
                  <span className="stat-funny">Money Well Wasted</span>
                </div>
                <div className="stat">
                  <span className="stat-number">
                    {orders.reduce((total, order) => total + order.items.length, 0)}
                  </span>
                  <span className="stat-label">Items Ordered</span>
                  <span className="stat-funny">Virtual Calories</span>
                </div>
                <div className="stat">
                  <span className="stat-number">
                    {orders.filter(order => order.status === 'delivered').length}
                  </span>
                  <span className="stat-label">Delivered</span>
                  <span className="stat-funny">Dreams Fulfilled</span>
                </div>
              </div>
            </div>
            
            <div className="wisdom-quote">
              <p>💡 "Every order is a step towards enlightenment... or at least towards a lighter wallet!"</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;