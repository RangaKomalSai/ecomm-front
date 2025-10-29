import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faCrown,
  faShoppingBag,
  faHeart,
  faEdit,
  faSave,
  faTimes,
  faLock,
  faTrash,
  faCalendar,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
  const {
    token,
    user,
    subscription,
    planLevel,
    cart,
    wishlist,
    bookings,
    updateUserProfile,
    changePassword,
    deleteUserAccount,
    loading,
  } = useContext(ShopContext);

  const navigate = useNavigate();

  // State
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Initialize edit form when user data loads
  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  // Handle profile edit
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel edit - reset form
      setEditForm({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    if (!editForm.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setIsSaving(true);
    const result = await updateUserProfile(editForm);
    setIsSaving(false);

    if (result.success) {
      setIsEditing(false);
    }
  };

  // Handle password change
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsSaving(true);
    const result = await changePassword(
      passwordForm.currentPassword,
      passwordForm.newPassword
    );
    setIsSaving(false);

    if (result.success) {
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setActiveTab("overview");
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error("Please enter your password to confirm");
      return;
    }

    const confirmed = window.confirm(
      "Are you absolutely sure? This action cannot be undone. All your data will be permanently deleted."
    );

    if (!confirmed) return;

    setIsSaving(true);
    const result = await deleteUserAccount(deletePassword);
    setIsSaving(false);

    if (result.success) {
      setShowDeleteModal(false);
      navigate("/");
    }
  };

  // Loading state
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf7f0]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2b1f]"></div>
          <p className="text-[#3d2b1f]">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf7f0] py-10 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#3d2b1f] mb-2">
            My Profile
          </h1>
          <p className="text-[#3d2b1f] opacity-80">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-[#e8dccf] p-6 sticky top-24">
              {/* Profile Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-[#3d2b1f] to-[#8b4513] rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl font-bold text-white">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-[#3d2b1f] mb-1">
                  {user.name}
                </h2>
                <p className="text-sm text-gray-600 mb-3">{user.email}</p>

                {/* Subscription Badge */}
                <div
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    planLevel === "pro"
                      ? "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-2 border-amber-300"
                      : planLevel === "plus"
                      ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-2 border-purple-300"
                      : "bg-gray-100 text-gray-700 border-2 border-gray-300"
                  }`}
                >
                  <FontAwesomeIcon icon={faCrown} className="mr-2" />
                  {planLevel.toUpperCase()} Plan
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-3 mb-6 border-t border-[#e8dccf] pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#3d2b1f]">
                    <FontAwesomeIcon icon={faShoppingBag} className="w-5 h-5" />
                    <span className="text-sm">Bookings</span>
                  </div>
                  <span className="font-bold text-[#3d2b1f]">
                    {bookings?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#3d2b1f]">
                    <FontAwesomeIcon
                      icon={faHeart}
                      className="w-5 h-5 text-red-500"
                    />
                    <span className="text-sm">Wishlist</span>
                  </div>
                  <span className="font-bold text-[#3d2b1f]">
                    {wishlist?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#3d2b1f]">
                    <FontAwesomeIcon
                      icon={faShoppingCart}
                      className="w-5 h-5"
                    />
                    <span className="text-sm">Cart Items</span>
                  </div>
                  <span className="font-bold text-[#3d2b1f]">
                    {cart?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#3d2b1f]">
                    <FontAwesomeIcon icon={faCalendar} className="w-5 h-5" />
                    <span className="text-sm">Member Since</span>
                  </div>
                  <span className="font-semibold text-[#3d2b1f] text-sm">
                    {new Date(user.createdAt).toLocaleDateString("en-IN", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <button
                  onClick={() => navigate("/orders")}
                  className="w-full py-2 px-4 border-2 border-[#3d2b1f] text-[#3d2b1f] rounded-lg hover:bg-[#e8dccf] transition-colors font-medium text-sm"
                >
                  View My Bookings
                </button>
                <button
                  onClick={() => navigate("/subscription-plans")}
                  className="w-full py-2 px-4 bg-[#3d2b1f] text-white rounded-lg hover:bg-[#5a3c2c] transition-colors font-medium text-sm"
                >
                  {planLevel === "free"
                    ? "Upgrade Plan"
                    : "Manage Subscription"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Content - Tabs */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="bg-white rounded-xl shadow-lg border border-[#e8dccf] mb-6">
              <div className="flex border-b border-[#e8dccf] overflow-x-auto">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex-1 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    activeTab === "overview"
                      ? "text-[#3d2b1f] border-b-2 border-[#3d2b1f] bg-[#fdf7f0]"
                      : "text-gray-600 hover:text-[#3d2b1f]"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("subscription")}
                  className={`flex-1 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    activeTab === "subscription"
                      ? "text-[#3d2b1f] border-b-2 border-[#3d2b1f] bg-[#fdf7f0]"
                      : "text-gray-600 hover:text-[#3d2b1f]"
                  }`}
                >
                  Subscription
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`flex-1 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    activeTab === "security"
                      ? "text-[#3d2b1f] border-b-2 border-[#3d2b1f] bg-[#fdf7f0]"
                      : "text-gray-600 hover:text-[#3d2b1f]"
                  }`}
                >
                  Security
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl shadow-lg border border-[#e8dccf] p-6">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-[#3d2b1f]">
                      Personal Information
                    </h3>
                    <button
                      onClick={handleEditToggle}
                      className="flex items-center gap-2 px-4 py-2 border-2 border-[#3d2b1f] text-[#3d2b1f] rounded-lg hover:bg-[#e8dccf] transition-colors font-medium text-sm"
                    >
                      <FontAwesomeIcon icon={isEditing ? faTimes : faEdit} />
                      {isEditing ? "Cancel" : "Edit"}
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-[#3d2b1f] mb-2">
                        <FontAwesomeIcon icon={faUser} className="mr-2" />
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          className="w-full px-4 py-3 border-2 border-[#e8dccf] rounded-lg focus:border-[#3d2b1f] focus:outline-none"
                          placeholder="Enter your full name"
                        />
                      ) : (
                        <p className="px-4 py-3 bg-[#fdf7f0] rounded-lg text-[#3d2b1f]">
                          {user.name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-[#3d2b1f] mb-2">
                        <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                        Email Address
                      </label>
                      <p className="px-4 py-3 bg-gray-100 rounded-lg text-gray-600">
                        {user.email}
                        <span className="ml-2 text-xs text-gray-500">
                          (Cannot be changed)
                        </span>
                      </p>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-[#3d2b1f] mb-2">
                        <FontAwesomeIcon icon={faPhone} className="mr-2" />
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) =>
                            setEditForm({ ...editForm, phone: e.target.value })
                          }
                          className="w-full px-4 py-3 border-2 border-[#e8dccf] rounded-lg focus:border-[#3d2b1f] focus:outline-none"
                          placeholder="Enter your phone number"
                        />
                      ) : (
                        <p className="px-4 py-3 bg-[#fdf7f0] rounded-lg text-[#3d2b1f]">
                          {user.phone || "Not provided"}
                        </p>
                      )}
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-medium text-[#3d2b1f] mb-2">
                        <FontAwesomeIcon
                          icon={faMapMarkerAlt}
                          className="mr-2"
                        />
                        Address
                      </label>
                      {isEditing ? (
                        <textarea
                          value={editForm.address}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              address: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border-2 border-[#e8dccf] rounded-lg focus:border-[#3d2b1f] focus:outline-none resize-none"
                          rows="3"
                          placeholder="Enter your delivery address"
                        />
                      ) : (
                        <p className="px-4 py-3 bg-[#fdf7f0] rounded-lg text-[#3d2b1f] whitespace-pre-line">
                          {user.address || "Not provided"}
                        </p>
                      )}
                    </div>

                    {/* Save Button */}
                    {isEditing && (
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="w-full py-3 px-4 bg-[#3d2b1f] text-white rounded-lg hover:bg-[#5a3c2c] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FontAwesomeIcon icon={faSave} className="mr-2" />
                        {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Subscription Tab */}
              {activeTab === "subscription" && (
                <div>
                  <h3 className="text-xl font-bold text-[#3d2b1f] mb-6">
                    Subscription Details
                  </h3>

                  {planLevel === "free" ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FontAwesomeIcon
                          icon={faCrown}
                          className="text-4xl text-gray-400"
                        />
                      </div>
                      <h4 className="text-xl font-semibold text-[#3d2b1f] mb-3">
                        You're on the Free Plan
                      </h4>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Upgrade to unlock exclusive benefits and save money on
                        rentals
                      </p>
                      <button
                        onClick={() => navigate("/subscription-plans")}
                        className="px-8 py-3 bg-[#3d2b1f] text-white rounded-lg hover:bg-[#5a3c2c] transition-colors font-semibold"
                      >
                        View Plans
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-purple-50 to-amber-50 border-2 border-purple-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-2xl font-bold text-[#3d2b1f] capitalize mb-1">
                              {planLevel} Plan
                            </h4>
                            <p className="text-sm text-gray-600">
                              Active Subscription
                            </p>
                          </div>
                          <div className="text-3xl">
                            <FontAwesomeIcon
                              icon={faCrown}
                              className="text-amber-500"
                            />
                          </div>
                        </div>

                        {subscription && (
                          <div className="grid grid-cols-2 gap-4 mt-6">
                            <div>
                              <p className="text-xs text-gray-600 mb-1">
                                Start Date
                              </p>
                              <p className="font-semibold text-[#3d2b1f]">
                                {new Date(
                                  subscription.startDate
                                ).toLocaleDateString("en-IN")}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">
                                End Date
                              </p>
                              <p className="font-semibold text-[#3d2b1f]">
                                {new Date(
                                  subscription.endDate
                                ).toLocaleDateString("en-IN")}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">
                                Status
                              </p>
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                  subscription.isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {subscription.isActive ? "Active" : "Expired"}
                              </span>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">
                                Auto-Renew
                              </p>
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                  subscription.autoRenew
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {subscription.autoRenew
                                  ? "Enabled"
                                  : "Disabled"}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => navigate("/subscription-plans")}
                          className="flex-1 py-3 px-4 border-2 border-[#3d2b1f] text-[#3d2b1f] rounded-lg hover:bg-[#e8dccf] transition-colors font-semibold"
                        >
                          Change Plan
                        </button>
                      </div>

                      {/* Benefits */}
                      <div className="border-t border-[#e8dccf] pt-6">
                        <h5 className="font-semibold text-[#3d2b1f] mb-4">
                          Your Benefits:
                        </h5>
                        <ul className="space-y-2">
                          {planLevel === "plus" && (
                            <>
                              <li className="flex items-start gap-2 text-sm text-[#3d2b1f]">
                                <span className="text-green-600 mt-0.5">✓</span>
                                FREE rentals on Premium items (MRP &lt; ₹5,000)
                              </li>
                              <li className="flex items-start gap-2 text-sm text-[#3d2b1f]">
                                <span className="text-green-600 mt-0.5">✓</span>
                                50% OFF on Royal items (₹5,000 - ₹10,000)
                              </li>
                            </>
                          )}
                          {planLevel === "pro" && (
                            <>
                              <li className="flex items-start gap-2 text-sm text-[#3d2b1f]">
                                <span className="text-green-600 mt-0.5">✓</span>
                                FREE rentals on Premium items (MRP &lt; ₹5,000)
                              </li>
                              <li className="flex items-start gap-2 text-sm text-[#3d2b1f]">
                                <span className="text-green-600 mt-0.5">✓</span>
                                FREE rentals on Royal items (₹5,000 - ₹10,000)
                              </li>
                            </>
                          )}
                          <li className="flex items-start gap-2 text-sm text-[#3d2b1f]">
                            <span className="text-green-600 mt-0.5">✓</span>
                            14-day rental periods
                          </li>
                          <li className="flex items-start gap-2 text-sm text-[#3d2b1f]">
                            <span className="text-green-600 mt-0.5">✓</span>
                            Priority customer support
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div>
                  <h3 className="text-xl font-bold text-[#3d2b1f] mb-6">
                    Security Settings
                  </h3>

                  {/* Change Password Section */}
                  <div className="mb-8 pb-8 border-b border-[#e8dccf]">
                    <h4 className="text-lg font-semibold text-[#3d2b1f] mb-4">
                      Change Password
                    </h4>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#3d2b1f] mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              currentPassword: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border-2 border-[#e8dccf] rounded-lg focus:border-[#3d2b1f] focus:outline-none"
                          placeholder="Enter current password"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#3d2b1f] mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              newPassword: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border-2 border-[#e8dccf] rounded-lg focus:border-[#3d2b1f] focus:outline-none"
                          placeholder="Enter new password"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          At least 8 characters
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#3d2b1f] mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border-2 border-[#e8dccf] rounded-lg focus:border-[#3d2b1f] focus:outline-none"
                          placeholder="Confirm new password"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full py-3 px-4 bg-[#3d2b1f] text-white rounded-lg hover:bg-[#5a3c2c] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FontAwesomeIcon icon={faLock} className="mr-2" />
                        {isSaving ? "Updating..." : "Update Password"}
                      </button>
                    </form>
                  </div>

                  {/* Delete Account Section */}
                  <div>
                    <h4 className="text-lg font-semibold text-red-600 mb-2">
                      Danger Zone
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Once you delete your account, there is no going back.
                      Please be certain.
                    </p>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
                    >
                      <FontAwesomeIcon icon={faTrash} className="mr-2" />
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-red-600 mb-4">
              Delete Account
            </h3>
            <p className="text-gray-700 mb-6">
              This action is permanent and cannot be undone. All your data
              including bookings, wishlist, and cart will be deleted.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#3d2b1f] mb-2">
                Enter your password to confirm:
              </label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:border-red-500 focus:outline-none"
                placeholder="Password"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword("");
                }}
                className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isSaving || !deletePassword}
                className="flex-1 py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Deleting..." : "Delete Forever"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
