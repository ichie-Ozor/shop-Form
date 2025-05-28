import React, { useState, useCallback, memo } from 'react';
import { ArrowLeft, Calendar, User, Phone, MapPin, Briefcase, Store, FileText, Upload, Plus, Check, X, Eye } from 'lucide-react';
import axios from 'axios';

// Memoized InputField component to prevent unnecessary re-renders
const InputField = memo(({ icon: Icon, label, ...props }) => (
  <div className="space-y-2">
    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
      <Icon className="w-4 h-4 text-blue-600" />
      <span>{label}</span>
    </label>
    <input
      {...props}
      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
    />
  </div>
));

// Memoized FileUploadZone component
const FileUploadZone = memo(({ fieldName, label, acceptedFile, onFileSelect }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(fieldName, files[0]);
    }
  }, [fieldName, onFileSelect]);

  const handleFileInput = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(fieldName, file);
    }
  }, [fieldName, onFileSelect]);

  const handleRemoveFile = useCallback((e) => {
    e.stopPropagation();
    onFileSelect(fieldName, null);
  }, [fieldName, onFileSelect]);

  return (
    <div 
      className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${
        isDragOver 
          ? 'border-blue-400 bg-blue-50' 
          : acceptedFile 
            ? 'border-green-400 bg-green-50' 
            : 'border-gray-300 hover:border-gray-400 bg-gray-50'
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        accept=".pdf,.jpg,.jpeg,.png"
      />
      
      <div className="text-center">
        {acceptedFile ? (
          <div className="flex items-center justify-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{acceptedFile.name}</p>
              <p className="text-xs text-gray-500">{(acceptedFile.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-red-600" />
            </button>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">Upload {label}</p>
            <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
          </>
        )}
      </div>
    </div>
  );
});

const ModernShopForm = ({setOpenForm=f=>f}) => {
  const [form, setForm] = useState({
    date: '',
    name: '',
    phoneNumber: '',
    address: '',
    natureOfBusiness: '',
    shop_no: '',
    allocation: '',
    passport: null,
    allocationLetter: null,
    agreementLetter: null
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  // Memoized change handler to prevent re-renders
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  // Memoized file upload handler
  const handleFileUpload = useCallback((fieldName, file) => {
    setForm(prev => ({ ...prev, [fieldName]: file }));
  }, []);

  // Memoized submit handler
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData();
      
      // Append all text fields
      formData.append('date', form.date);
      formData.append('name', form.name);
      formData.append('phoneNumber', form.phoneNumber);
      formData.append('address', form.address);
      formData.append('natureOfBusiness', form.natureOfBusiness);
      formData.append('shop_no', form.shop_no);
      formData.append('allocation', form.allocation);
      
      // Append files with specific field names
      if (form.passport) {
        formData.append('passport', form.passport);
      }
      if (form.allocationLetter) {
        formData.append('allocationLetter', form.allocationLetter);
      }
      if (form.agreementLetter) {
        formData.append('agreementLetter', form.agreementLetter);
      }

      const response = await axios.post("http://localhost:3000/form", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Form submitted successfully:', response.data);
      
      // Reset form
      setForm({
        date: '',
        name: '',
        phoneNumber: '',
        address: '',
        natureOfBusiness: '',
        shop_no: '',
        allocation: '',
        passport: null,
        allocationLetter: null,
        agreementLetter: null
      });
      
      setCurrentStep(1);
      alert('Form submitted successfully!');
      setOpenForm(false)
      
    } catch (err) {
      console.error("Error submitting form:", err);
      alert('Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [form]);

  // Memoized navigation handlers
  const handlePrevious = useCallback(() => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentStep(prev => Math.min(3, prev + 1));
  }, []);

  const steps = [
    { id: 1, title: 'Basic Information', icon: User },
    { id: 2, title: 'Business Details', icon: Briefcase },
    { id: 3, title: 'Documents', icon: FileText }
  ];

  const isStepComplete = useCallback((step) => {
    switch(step) {
      case 1: return form.date && form.name && form.phoneNumber && form.address;
      case 2: return form.natureOfBusiness && form.shop_no && form.allocation;
      case 3: return form.passport && form.allocationLetter && form.agreementLetter;
      default: return false;
    }
  }, [form]);

  return (
    <div className=" bg-gradient-to-br from-blue-50 via-white to-indigo-50 ">
      <div className="max-w-10xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl mb-2 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
            <div className="flex items-center justify-between">
              <button onClick={()=>setOpenForm(false)} className="flex items-center space-x-2 text-white hover:text-blue-100 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-white">Create New Shop</h1>
              </div>
              <div className="w-16"></div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-6 bg-gray-50">
            <div className="flex items-center justify-between max-w-md mx-auto">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentStep === step.id 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : isStepComplete(step.id)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    {isStepComplete(step.id) ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-3 transition-all duration-300 ${
                      isStepComplete(step.id) ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between max-w-md mx-auto mt-2">
              {steps.map(step => (
                <span key={step.id} className="text-xs font-medium text-gray-600">{step.title}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                  <p className="text-gray-600 mt-1">Let's start with your personal details</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    icon={Calendar}
                    label="Date of Allocation Letter"
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                  />
                  <InputField
                    icon={User}
                    label="Full Name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                  <InputField
                    icon={Phone}
                    label="Phone Number"
                    type="tel"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    placeholder="+234 XXX XXX XXXX"
                    required
                  />
                  <div className="md:col-span-2">
                    <InputField
                      icon={MapPin}
                      label="Address"
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Enter your full address"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Business Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-xl font-semibold text-gray-900">Business Details</h2>
                  <p className="text-gray-600 mt-1">Tell us about your business</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    icon={Briefcase}
                    label="Nature of Business"
                    type="text"
                    name="natureOfBusiness"
                    value={form.natureOfBusiness}
                    onChange={handleChange}
                    placeholder="e.g., Retail, Restaurant, etc."
                    required
                  />
                  <InputField
                    icon={Store}
                    label="Shop Number"
                    type="text"
                    name="shop_no"
                    value={form.shop_no}
                    onChange={handleChange}
                    placeholder="Enter shop number"
                    required
                  />
                  <div className="md:col-span-2">
                    <InputField
                      icon={FileText}
                      label="Name of Former Allottee"
                      type="text"
                      name="allocation"
                      value={form.allocation}
                      onChange={handleChange}
                      placeholder="Enter previous owner's name"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Documents */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-xl font-semibold text-gray-900">Required Documents</h2>
                  <p className="text-gray-600 mt-1">Upload the necessary documents</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Passport Photograph</h3>
                    <FileUploadZone
                      fieldName="passport"
                      label="Passport"
                      acceptedFile={form.passport}
                      onFileSelect={handleFileUpload}
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Allocation Letter</h3>
                    <FileUploadZone
                      fieldName="allocationLetter"
                      label="Allocation Letter"
                      acceptedFile={form.allocationLetter}
                      onFileSelect={handleFileUpload}
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Agreement Letter</h3>
                    <FileUploadZone
                      fieldName="agreementLetter"
                      label="Agreement Letter"
                      acceptedFile={form.agreementLetter}
                      onFileSelect={handleFileUpload}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Previous
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!isStepComplete(currentStep)}
                  className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isStepComplete(currentStep)
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isStepComplete(3) || loading}
                  className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                    isStepComplete(3) && !loading
                      ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernShopForm;