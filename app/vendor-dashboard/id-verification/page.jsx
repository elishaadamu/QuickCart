"use client";
import React, { useState } from "react";
import { FaIdCard, FaSpinner, FaCloudUploadAlt, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { apiUrl, API_CONFIG } from "@/configs/api";
import { useAppContext } from "@/context/AppContext";
import { useEffect } from "react";

const IdVerificationPage = () => {
  const { userData } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    idType: "NIN",
    idNumber: "",
    slip: null, // Base64 string
  });
  const [fileName, setFileName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024) { // 50KB limit
        toast.error("File size too large. Please upload an image under 50KB.");
        return;
      }

      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          slip: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchVerificationDetails = async () => {
      if (!userData?.id) return;
      try {
        const response = await axios.get( `${apiUrl(API_CONFIG.ENDPOINTS.PROFILE.GET)}/${userData.id}`);
        if (response.data && response.data.data) {
          const { idType, idNumber, slip } = response.data.data;
          setFormData({
            idType: idType || "NIN",
            idNumber: idNumber || "",
            slip: slip || null,
          });
          if (slip) {
             setFileName("Existing Uploaded Slip");
          }
        }
      } catch (error) {
        console.log("No existing verification details found or error fetching.");
      }
    };

    fetchVerificationDetails();
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.idNumber) {
      toast.error("Please enter your ID Number");
      return;
    }
    if (!formData.slip) {
      toast.error("Please upload your ID Slip");
      return;
    }

      const payload = {
        idType: formData.idType,
        idNumber: formData.idNumber,
        slip: formData.slip,
      };
      
    setLoading(true);
    try {
      // Assuming a generic endpoint since none was provided in API_CONFIG
      // Using POST for both create and update (upsert) for simplicity, or separate if needed
      const response = await axios.put(`${apiUrl(API_CONFIG.ENDPOINTS.PROFILE.UPDATE_USER)}/${userData.id}`, 
        payload
      );

      toast.success(response.data.message || "Verification details updated successfully!");
      // Optionally refresh data
    } catch (error) {
        console.error("Upload error:", error);
        toast.error(error.response?.data?.message || "Failed to upload verification details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-20 md:pb-0 px-4 pt-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
          <FaIdCard className="text-blue-600" />
          ID Verification
        </h1>
        <p className="mt-2 text-gray-600">
          Upload your NIN or BVN slip for identity verification.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* ID Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, idType: "NIN" })}
                className={`py-3 px-4 rounded-xl border transition-all duration-200 flex items-center justify-center gap-2 font-medium ${
                  formData.idType === "NIN"
                    ? "bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-200"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                NIN
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, idType: "BVN" })}
                className={`py-3 px-4 rounded-xl border transition-all duration-200 flex items-center justify-center gap-2 font-medium ${
                  formData.idType === "BVN"
                    ? "bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-200"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                BVN
              </button>
            </div>
          </div>

          {/* ID Number Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Number ({formData.idType})
            </label>
            <input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              placeholder={`Enter your ${formData.idType} Number`}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Slip
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-400 transition-colors bg-gray-50 hover:bg-blue-50/30 relative group">
              <div className="space-y-1 text-center">
                
                {formData.slip ? (
                    <div className="flex flex-col items-center">
                         <div className="relative w-full h-48 mb-2">
                            <img 
                                src={formData.slip} 
                                alt="Slip Preview" 
                                className="w-full h-full object-contain rounded-lg" 
                            />
                         </div>
                         <p className="text-sm text-green-600 font-medium break-all">{fileName}</p>
                         <p className="text-xs text-gray-500 mt-1">Click to change file</p>
                    </div>
                ) : (
                    <>
                        <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        <div className="flex text-sm text-gray-600">
                        <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 px-2"
                        >
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 50KB
                        </p>
                    </>
                )}
                {/* Overlay input for easier click on the whole area once file is selected or not */}
                <input id="file-upload-overlay" name="file-upload" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} accept="image/*" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" /> Submitting...
              </>
            ) : (
              "Submit Verification"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default IdVerificationPage;
