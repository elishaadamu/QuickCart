"use client";
import React, { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import { API_CONFIG, apiUrl } from "@/configs/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "../Modal";

const ActionMenu = ({ product, onDelete, onEdit, categories, states }) => {
  const { router, userData } = useAppContext();
  const userId = userData?.id;
  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editedProduct, setEditedProduct] = useState({ ...product });
  const [isSaving, setIsSaving] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
    setIsOpen(false);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
    setIsOpen(false);
  };

  const confirmDelete = async () => {
    try {
      if (!userId) {
        console.error("User not authenticated");
        toast.error("User not authenticated.");
        return;
      }
      await axios.delete(
        apiUrl(
          API_CONFIG.ENDPOINTS.PRODUCT.DELETE + product._id + "/" + userId
        ),
        {
          withCredentials: true,
        }
      );
      onDelete(product._id);
      setIsDeleteModalOpen(false);
      toast.success("Product deleted successfully!");
    } catch (err) {
      console.error("Failed to delete product:", err);
      toast.error("Failed to delete product.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (!userId) {
        console.error("User not authenticated");
        toast.error("User not authenticated.");
        return;
      }
      await axios.put(
        apiUrl(
          API_CONFIG.ENDPOINTS.PRODUCT.UPDATE + product._id + "/" + userId
        ),
        editedProduct,
        {
          withCredentials: true,
        }
      );
      onEdit(editedProduct);
      setIsEditModalOpen(false);
      toast.success("Product has been sent for approval!");
    } catch (err) {
      console.error("Failed to update product:", err);
      toast.error("Failed to update product.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct({ ...editedProduct, [name]: value });
  };

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="text-gray-500 hover:text-gray-700"
      >
        <FaEllipsisV />
      </button>
      {isOpen && (
        <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-md shadow-lg z-1000">
          <button
            onClick={handleEdit}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Delete
          </button>
        </div>
      )}

      {isEditModalOpen && (
        <Modal onClose={() => setIsEditModalOpen(false)}>
          <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
          <form onSubmit={handleEditSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Product name</label>
              <input
                name="name"
                value={editedProduct.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              ></input>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Price</label>
              <input
                type="number"
                name="price"
                value={editedProduct.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Category</label>
              <select
                name="category"
                value={editedProduct.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Description</label>
              <textarea
                name="description"
                value={editedProduct.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Stock</label>
              <input
                type="number"
                name="stock"
                value={editedProduct.stock}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Condition</label>
              <select
                name="condition"
                value={editedProduct.condition}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="New">New</option>
                <option value="Used">Used</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">State</label>
              <select
                name="state"
                value={editedProduct.state}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="mr-4 px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-blue-400"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {isDeleteModalOpen && (
        <Modal onClose={() => setIsDeleteModalOpen(false)}>
          <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
          <p>Are you sure you want to delete this product?</p>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="mr-4 px-4 py-2 bg-gray-300 rounded-md"
            >
              No
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md"
            >
              Yes
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ActionMenu;
