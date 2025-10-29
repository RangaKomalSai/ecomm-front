import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";

const CartTotal = () => {
  const { cart, cartTotal, deliveryFee } = useContext(ShopContext);
  const navigate = useNavigate();
  const currency = "₹";

  const getCartAmount = () => cartTotal || 0;
  const getCartCount = () => (cart ? cart.length : 0);

  return (
    <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
      <h3 className="text-lg font-medium mb-4">Cart Summary</h3>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>Items ({getCartCount()}):</span>
          <span>
            {currency}
            {getCartAmount()}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Delivery:</span>
          <span>{deliveryFee > 0 ? `${currency}${deliveryFee}` : "FREE"}</span>
        </div>
        <hr />
        <div className="flex justify-between font-medium text-lg">
          <span>Total:</span>
          <span>
            {currency}
            {getCartAmount() + (deliveryFee || 0)}
          </span>
        </div>
      </div>

      <button
        onClick={() => navigate("/place-order")}
        className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition-colors"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartTotal;
