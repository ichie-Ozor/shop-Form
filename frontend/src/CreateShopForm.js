import React from "react";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  ShoppingBag, 
  FileText, 
  Upload, 
  PlusCircle 
} from "lucide-react";

const CreateNewShopForm = ({ setOpenForm, form, handleChange, handleSubmit, handleRemoveFile }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => setOpenForm(false)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-md text-white transition duration-200"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
          
          <h2 className="text-xl font-semibold text-white">Create New Shop</h2>
          
          <div className="w-[70px]"></div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Date Field */}
              <div>
                <label htmlFor="date" className="block mb-2 font-medium text-gray-700 flex items-center gap-2">
                  <Calendar size={16} className="text-blue-500" />
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                  required
                />
              </div>

              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block mb-2 font-medium text-gray-700 flex items-center gap-2">
                  <User size={16} className="text-blue-500" />
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter shop owner name"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                  required
                />
              </div>

              {/* Shop Number Field */}
              <div>
                <label htmlFor="shop_no" className="block mb-2 font-medium text-gray-700 flex items-center gap-2">
                  <ShoppingBag size={16} className="text-blue-500" />
                  Shop Number
                </label>
                <input
                  type="number"
                  name="shop_no"
                  id="shop_no"
                  value={form.shop_no}
                  onChange={handleChange}
                  placeholder="Enter shop number"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                  required
                />
              </div>

              {/* Allocation Form Field */}
              <div>
                <label htmlFor="allocation" className="block mb-2 font-medium text-gray-700 flex items-center gap-2">
                  <FileText size={16} className="text-blue-500" />
                  Allocation Form
                </label>
                <input
                  type="text"
                  name="allocation"
                  id="allocation"
                  value={form.allocation}
                  onChange={handleChange}
                  placeholder="Enter allocation reference"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                  required
                />
              </div>
            </div>

            {/* Document Upload */}
            <div className="mt-6">
              <label className="block mb-2 font-medium text-gray-700 flex items-center gap-2">
                <Upload size={16} className="text-blue-500" />
                Upload Document
              </label>
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-100 transition duration-200">
                {form.file ? (
                  <div className="flex items-center justify-between bg-blue-50 p-3 rounded-md border border-blue-200">
                    <div className="flex items-center gap-3">
                      <FileText className="text-blue-500" size={24} />
                      <span className="font-medium text-gray-800 truncate max-w-xs">
                        {form.file.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-gray-500 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      name="file"
                      id="file"
                      className="hidden"
                      onChange={handleChange}
                    />
                    <label htmlFor="file" className="cursor-pointer">
                      <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                        <Upload size={20} className="text-blue-500" />
                      </div>
                      <p className="text-sm font-medium text-blue-600">Click to upload document</p>
                      <p className="text-xs text-gray-500 mt-1">PDF, PNG, JPG up to 10MB</p>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={!form.date || !form.name || !form.shop_no || !form.allocation}
                className={`w-full md:w-auto px-8 py-3 rounded-lg font-medium flex items-center justify-center gap-2 mx-auto 
                  ${!form.date || !form.name || !form.shop_no || !form.allocation
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg hover:shadow-blue-200 hover:from-blue-700 hover:to-blue-600'} 
                  transition duration-200`}
              >
                <PlusCircle size={18} />
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateNewShopForm;