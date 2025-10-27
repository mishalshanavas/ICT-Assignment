import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import './Cart.css';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal, groupCartByRestaurant } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const cartGroups = groupCartByRestaurant();
  const subtotal = getCartTotal();
  const deliveryFees = cartGroups.reduce((total, group) => total + group.restaurant.deliveryFee, 0);
  const tax = Math.round(subtotal * 0.05); // 5% tax
  const totalAmount = subtotal + deliveryFees + tax;

  const handleQuantityChange = (menuItemId, restaurantId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(menuItemId, restaurantId);
    } else {
      updateQuantity(menuItemId, restaurantId, newQuantity);
    }
  };

  const handleRemoveItem = (menuItemId, restaurantId) => {
    removeFromCart(menuItemId, restaurantId);
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      setMessage('Please login to place an order! Even imaginary food needs real authentication! 😄');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (cart.length === 0) {
      setMessage('Your cart is emptier than your promises to diet! Add some items first! 🛒');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Create orders for each restaurant group
      const orderPromises = cartGroups.map(async (group) => {
        const orderData = {
          restaurantId: group.restaurant._id,
          items: group.items.map(item => ({
            menuItemId: item.menuItem._id,
            quantity: item.quantity,
            price: item.menuItem.price
          })),
          deliveryAddress: {
            street: "123 Wiggy Street", // Default address for demo
            city: "Food City",
            state: "Hunger State",
            zipCode: "12345",
            phone: "+1234567890"
          },
          orderNotes: "Please deliver with extra love and imagination! 💖"
        };

        return await orderAPI.create(orderData);
      });

      // Wait for all orders to be created
      const orderResults = await Promise.all(orderPromises);
      
      setMessage(`🎉 ${orderResults.length} order${orderResults.length > 1 ? 's' : ''} placed successfully! Your imaginary food is on its way!`);
      clearCart();
      
      setTimeout(() => {
        navigate('/orders');
      }, 3000);

    } catch (error) {
      console.error('Order placement error:', error);
      setMessage('Failed to place order! Our digital chefs are probably on a coffee break! ☕');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is emptier than a diet book in a food court!</h2>
            <p>Looks like you haven't added any delicious items yet. Time to fix that tragedy!</p>
            <Link to="/restaurants" className="btn btn-primary btn-large">
              Browse Restaurants 🍽️
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1 className="cart-title">Your Food Cart 🛒</h1>
          <p className="cart-subtitle">
            Review your digital deliciousness before pretending to eat it!
          </p>
        </div>

        {message && (
          <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        <div className="cart-content">
          <div className="cart-items">
            {cartGroups.map((group, groupIndex) => (
              <div key={group.restaurant._id} className="restaurant-group">
                <div className="restaurant-header">
                  <h3 className="restaurant-name">
                    🏪 {group.restaurant.name}
                  </h3>
                  <span className="delivery-fee">
                    Delivery: ₹{group.restaurant.deliveryFee}
                  </span>
                </div>

                <div className="cart-items-list">
                  {group.items.map((item, itemIndex) => (
                    <div key={`${item.menuItem._id}-${item.restaurant._id}`} className="cart-item">
                      <div className="item-image">
                        <img 
                          src={item.menuItem.image} 
                          alt={item.menuItem.name}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/80x80?text=Food';
                          }}
                        />
                        <span className={`item-type ${item.menuItem.isVeg ? 'veg' : 'non-veg'}`}>
                          {item.menuItem.isVeg ? '🟢' : '🔴'}
                        </span>
                      </div>

                      <div className="item-details">
                        <h4 className="item-name">{item.menuItem.name}</h4>
                        <p className="item-description">{item.menuItem.funnyDescription}</p>
                        <span className="item-price">₹{item.menuItem.price}</span>
                      </div>

                      <div className="item-controls">
                        <div className="quantity-controls">
                          <button 
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(item.menuItem._id, item.restaurant._id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span className="quantity">{item.quantity}</span>
                          <button 
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(item.menuItem._id, item.restaurant._id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        
                        <div className="item-total">
                          ₹{item.menuItem.price * item.quantity}
                        </div>
                        
                        <button 
                          className="remove-btn"
                          onClick={() => handleRemoveItem(item.menuItem._id, item.restaurant._id)}
                          title="Remove item"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3 className="summary-title">Order Summary 📋</h3>
              
              <div className="summary-line">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              
              <div className="summary-line">
                <span>Delivery Fees</span>
                <span>₹{deliveryFees}</span>
              </div>
              
              <div className="summary-line">
                <span>Taxes (5%)</span>
                <span>₹{tax}</span>
              </div>
              
              <div className="summary-line total-line">
                <span>Total Amount</span>
                <span>₹{totalAmount}</span>
              </div>

              <div className="summary-actions">
                <button 
                  className="btn btn-secondary btn-full"
                  onClick={clearCart}
                  disabled={loading}
                >
                  Clear Cart 🧹
                </button>
                
                <button 
                  className="btn btn-primary btn-full"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                >
                  {loading ? 'Placing Order...' : `Place Order - ₹${totalAmount} 🚀`}
                </button>
              </div>

              <div className="summary-note">
                <p>
                  💡 <strong>Pro Tip:</strong> This is imaginary food, so you won't gain any real calories! 
                  Perfect for your diet! 😄
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="cart-footer">
          <Link to="/restaurants" className="continue-shopping">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;