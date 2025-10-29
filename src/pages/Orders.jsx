import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingBag,
  faTruck,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faMapMarkerAlt,
  faCreditCard,
  faCalendarAlt,
  faEye,
  faRefresh,
  faPhone,
  faBox,
} from "@fortawesome/free-solid-svg-icons";

const Orders = () => {
  const { token, bookings, fetchBookings, loading } = useContext(ShopContext);
  const navigate = useNavigate();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
  }, [token, navigate]);

  // Fetch bookings on mount
  useEffect(() => {
    if (token && bookings.length === 0) {
      fetchBookings();
    }
  }, [token]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <FontAwesomeIcon icon={faClock} className="w-4 h-4" />;
      case "confirmed":
        return <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4" />;
      case "processing":
        return <FontAwesomeIcon icon={faBox} className="w-4 h-4" />;
      case "shipped":
        return <FontAwesomeIcon icon={faTruck} className="w-4 h-4" />;
      case "delivered":
        return <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4" />;
      case "cancelled":
        return <FontAwesomeIcon icon={faTimesCircle} className="w-4 h-4" />;
      default:
        return <FontAwesomeIcon icon={faShoppingBag} className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateShort = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Show only bookings where payment is completed
  const completedOrders = bookings.filter(
    (booking) => booking.paymentStatus?.toLowerCase() === "completed"
  );

  const handleViewOrder = (booking) => {
    setSelectedOrder(booking);
    setShowOrderDetails(true);
  };

  const getOrderProgress = (status) => {
    const normalizedStatus = status?.toLowerCase();
    const steps = [
      {
        key: "confirmed",
        label: "Confirmed",
        completed: ["confirmed", "processing", "shipped", "delivered"].includes(
          normalizedStatus
        ),
      },
      {
        key: "processing",
        label: "Processing",
        completed: ["processing", "shipped", "delivered"].includes(
          normalizedStatus
        ),
      },
      {
        key: "shipped",
        label: "Shipped",
        completed: ["shipped", "delivered"].includes(normalizedStatus),
      },
      {
        key: "delivered",
        label: "Delivered",
        completed: normalizedStatus === "delivered",
      },
    ];
    return steps;
  };

  // We only show paid orders here; users can track delivery status from the order cards

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf7f0]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2b1f] mx-auto mb-4"></div>
          <p className="text-[#3d2b1f] opacity-60">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf7f0] py-10 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#3d2b1f] mb-2">
            My Bookings
          </h1>
          <p className="text-[#3d2b1f] opacity-80">
            Track and manage your bookings
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-[#e8dccf]">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FontAwesomeIcon
                icon={faShoppingBag}
                className="w-12 h-12 text-gray-400"
              />
            </div>
            <h2 className="text-2xl font-bold text-[#3d2b1f] mb-2">
              No orders yet
            </h2>
            <p className="text-[#3d2b1f] opacity-60 mb-6">
              Start shopping to see your orders here
            </p>
            <button
              onClick={() => navigate("/collection")}
              className="bg-[#3d2b1f] text-[#fdf7f0] px-8 py-3 rounded-lg hover:bg-[#5a3c2c] transition-colors font-semibold"
            >
              Browse Collection
            </button>
          </div>
        ) : (
          <>
            {/* Showing only paid bookings; add refresh control */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">
                  Successfully Placed Orders
                </h3>
                <p className="text-sm text-gray-600">
                  Showing orders with completed payments
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchBookings()}
                  className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"
                >
                  <FontAwesomeIcon icon={faRefresh} />
                  <span className="text-sm">Refresh</span>
                </button>
                <div className="text-sm text-gray-600">
                  {completedOrders.length} order
                  {completedOrders.length !== 1 ? "s" : ""} found
                </div>
              </div>
            </div>

            {/* Orders List */}
            {completedOrders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-[#e8dccf]">
                <FontAwesomeIcon
                  icon={faShoppingBag}
                  className="w-12 h-12 text-gray-400 mb-4"
                />
                <p className="text-[#3d2b1f] opacity-60">
                  No paid orders found
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {completedOrders.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-white rounded-xl shadow-lg border border-[#e8dccf] p-6 hover:shadow-xl transition-shadow"
                  >
                    {/* Order Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 pb-6 border-b border-[#e8dccf]">
                      <div className="flex items-center gap-4 mb-4 lg:mb-0">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(booking.status)}
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                        </div>
                        <div className="border-l pl-4 border-gray-300">
                          <p className="text-sm font-mono text-gray-600">
                            #{booking._id.slice(-8).toUpperCase()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDateShort(booking.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-[#3d2b1f]">
                            ₹{booking.totalPrice}
                          </p>
                          <p
                            className={`text-sm font-medium capitalize ${getPaymentStatusColor(
                              booking.paymentStatus
                            )}`}
                          >
                            {booking.paymentStatus}
                          </p>
                        </div>
                        <button
                          onClick={() => handleViewOrder(booking)}
                          className="bg-[#3d2b1f] text-white px-6 py-3 rounded-lg hover:bg-[#5a3c2c] transition-colors flex items-center gap-2 font-semibold"
                        >
                          <FontAwesomeIcon icon={faEye} />
                          <span>Details</span>
                        </button>
                      </div>
                    </div>

                    {/* Order Progress - Only show for confirmed+ orders */}
                    {booking.status?.toLowerCase() !== "pending" &&
                      booking.status?.toLowerCase() !== "cancelled" && (
                        <div className="mb-6">
                          <div className="flex items-center justify-between">
                            {getOrderProgress(booking.status).map(
                              (step, index) => (
                                <React.Fragment key={step.key}>
                                  <div className="flex flex-col items-center">
                                    <div
                                      className={`flex items-center justify-center w-10 h-10 rounded-full mb-2 transition-colors ${
                                        step.completed
                                          ? "bg-green-500 text-white"
                                          : "bg-gray-200 text-gray-500"
                                      }`}
                                    >
                                      {step.completed ? (
                                        <FontAwesomeIcon
                                          icon={faCheckCircle}
                                          className="w-5 h-5"
                                        />
                                      ) : (
                                        <span className="text-sm font-bold">
                                          {index + 1}
                                        </span>
                                      )}
                                    </div>
                                    <span
                                      className={`text-xs font-medium text-center ${
                                        step.completed
                                          ? "text-green-600"
                                          : "text-gray-500"
                                      }`}
                                    >
                                      {step.label}
                                    </span>
                                  </div>
                                  {index <
                                    getOrderProgress(booking.status).length -
                                      1 && (
                                    <div
                                      className={`flex-1 h-1 mx-2 ${
                                        step.completed
                                          ? "bg-green-500"
                                          : "bg-gray-200"
                                      }`}
                                    />
                                  )}
                                </React.Fragment>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* Order Items Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faShoppingBag}
                          className="text-gray-500"
                        />
                        <span className="text-gray-600">
                          {booking.items.length} item
                          {booking.items.length > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faMapMarkerAlt}
                          className="text-gray-500"
                        />
                        <span className="text-gray-600">
                          {booking.deliveryAddress?.city},{" "}
                          {booking.deliveryAddress?.state}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faCreditCard}
                          className="text-gray-500"
                        />
                        <span className="text-gray-600 capitalize">
                          {booking.paymentMethod}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#e8dccf]">
                  <div>
                    <h2 className="text-3xl font-bold text-[#3d2b1f]">
                      Order Details
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Order #{selectedOrder._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowOrderDetails(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FontAwesomeIcon icon={faTimesCircle} className="w-8 h-8" />
                  </button>
                </div>

                {/* Order Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Order Information */}
                  <div className="bg-[#fdf7f0] rounded-xl p-6 border border-[#e8dccf]">
                    <h3 className="font-bold text-[#3d2b1f] mb-4 text-lg">
                      Order Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Date:</span>
                        <span className="font-semibold text-[#3d2b1f]">
                          {formatDate(selectedOrder.createdAt)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Status:</span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(
                            selectedOrder.status
                          )}`}
                        >
                          {selectedOrder.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Payment Status:</span>
                        <span
                          className={`font-semibold capitalize ${getPaymentStatusColor(
                            selectedOrder.paymentStatus
                          )}`}
                        >
                          {selectedOrder.paymentStatus}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="font-semibold text-[#3d2b1f] capitalize">
                          {selectedOrder.paymentMethod}
                        </span>
                      </div>
                      {selectedOrder.razorpayPaymentId && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment ID:</span>
                          <span className="font-mono text-xs text-gray-600">
                            {selectedOrder.razorpayPaymentId}
                          </span>
                        </div>
                      )}
                      {selectedOrder.deliveryTracking && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium text-gray-600 mb-2">
                            Delivery Tracking
                          </h4>
                          <div className="space-y-1 text-sm text-gray-700">
                            {selectedOrder.deliveryTracking.provider && (
                              <div className="flex justify-between">
                                <span>Provider:</span>
                                <span className="font-semibold">
                                  {selectedOrder.deliveryTracking.provider}
                                </span>
                              </div>
                            )}
                            {selectedOrder.deliveryTracking.trackingId && (
                              <div className="flex justify-between">
                                <span>Tracking ID:</span>
                                <span className="font-mono text-xs">
                                  {selectedOrder.deliveryTracking.trackingId}
                                </span>
                              </div>
                            )}
                            {selectedOrder.deliveryTracking.status && (
                              <div className="flex justify-between">
                                <span>Status:</span>
                                <span className="font-semibold capitalize">
                                  {selectedOrder.deliveryTracking.status}
                                </span>
                              </div>
                            )}
                            {selectedOrder.deliveryTracking.deliveryETA && (
                              <div className="flex justify-between">
                                <span>ETA:</span>
                                <span className="font-semibold">
                                  {formatDateShort(
                                    selectedOrder.deliveryTracking.deliveryETA
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="bg-[#fdf7f0] rounded-xl p-6 border border-[#e8dccf]">
                    <h3 className="font-bold text-[#3d2b1f] mb-4 text-lg flex items-center gap-2">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                      Delivery Address
                    </h3>
                    <div className="text-gray-700 space-y-1">
                      <p className="font-semibold text-[#3d2b1f]">
                        {selectedOrder.deliveryAddress?.name}
                      </p>
                      <p>{selectedOrder.deliveryAddress?.street}</p>
                      {selectedOrder.deliveryAddress?.landmark && (
                        <p className="text-sm text-gray-600">
                          Landmark: {selectedOrder.deliveryAddress.landmark}
                        </p>
                      )}
                      <p>
                        {selectedOrder.deliveryAddress?.city},{" "}
                        {selectedOrder.deliveryAddress?.state}
                      </p>
                      <p>PIN: {selectedOrder.deliveryAddress?.pincode}</p>
                      <p className="pt-2">
                        <FontAwesomeIcon icon={faPhone} className="mr-2" />
                        {selectedOrder.deliveryAddress?.phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-8">
                  <h3 className="font-bold text-[#3d2b1f] mb-4 text-lg">
                    Rental Items
                  </h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="border border-[#e8dccf] rounded-xl p-6 hover:bg-[#fdf7f0] transition-colors"
                      >
                        <div className="flex items-start gap-6">
                          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                            {item.listingId?.images?.[0] ? (
                              <img
                                src={item.listingId.images[0]}
                                alt={item.listingId.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <FontAwesomeIcon
                                icon={faShoppingBag}
                                className="w-8 h-8 text-gray-400"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-[#3d2b1f] mb-2">
                              {item.listingId?.name || "Product"}
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">
                                  Size:{" "}
                                  <span className="font-semibold text-[#3d2b1f]">
                                    {item.size}
                                  </span>
                                </p>
                                <p className="text-gray-600">
                                  Duration:{" "}
                                  <span className="font-semibold text-[#3d2b1f]">
                                    {item.rentalDuration} days
                                  </span>
                                </p>
                                <p className="text-gray-600">
                                  Quantity:{" "}
                                  <span className="font-semibold text-[#3d2b1f]">
                                    {item.quantity}
                                  </span>
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">
                                  <FontAwesomeIcon
                                    icon={faCalendarAlt}
                                    className="mr-2"
                                  />
                                  Start:{" "}
                                  <span className="font-semibold">
                                    {formatDateShort(item.startDate)}
                                  </span>
                                </p>
                                <p className="text-gray-600">
                                  End:{" "}
                                  <span className="font-semibold">
                                    {formatDateShort(item.endDate)}
                                  </span>
                                </p>
                                {item.appliedSubscriptionPlan !== "free" && (
                                  <p className="text-xs text-purple-600 font-semibold capitalize mt-1">
                                    {item.appliedSubscriptionPlan} Plan Applied
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-[#3d2b1f]">
                              ₹{item.totalPrice}
                            </p>
                            {item.discountAmount > 0 && (
                              <p className="text-sm text-gray-500 line-through">
                                ₹{item.originalPrice}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-[#fdf7f0] rounded-xl p-6 border border-[#e8dccf]">
                  <h3 className="font-bold text-[#3d2b1f] mb-4 text-lg">
                    Order Summary
                  </h3>
                  <div className="space-y-3">
                    {(() => {
                      const couponDiscount =
                        selectedOrder.appliedCoupon?.discountAmount || 0;
                      const deliveryFee = selectedOrder.deliveryFee || 0;
                      const subtotal =
                        selectedOrder.subtotal ??
                        Number(selectedOrder.totalPrice) -
                          deliveryFee +
                          couponDiscount;

                      return (
                        <>
                          <div className="flex justify-between text-gray-700">
                            <span>Subtotal:</span>
                            <span>₹{subtotal}</span>
                          </div>
                          <div className="flex justify-between text-gray-700">
                            <span>Delivery Charges:</span>
                            <span
                              className={`${
                                deliveryFee > 0
                                  ? "text-gray-800 font-semibold"
                                  : "text-green-600 font-semibold"
                              }`}
                            >
                              {deliveryFee > 0 ? `₹${deliveryFee}` : "FREE"}
                            </span>
                          </div>
                          {couponDiscount > 0 && (
                            <div className="flex justify-between text-gray-700">
                              <span>Coupon Discount:</span>
                              <span className="text-red-600 font-semibold">
                                -₹{couponDiscount}
                              </span>
                            </div>
                          )}
                          <hr className="border-[#e8dccf]" />
                          <div className="flex justify-between text-xl font-bold text-[#3d2b1f]">
                            <span>Total Amount:</span>
                            <span>₹{selectedOrder.totalPrice}</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
