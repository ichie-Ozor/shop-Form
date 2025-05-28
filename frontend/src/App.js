// import { useHref } from 'react-router-dom';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import {
   PlusCircle, FileDown, ArrowLeft, 
  User, ShoppingBag, FileText, Upload, X, Printer, 
} from 'lucide-react';
import { Search, Plus, Eye, Store, MapPin, Phone, Calendar, Building, Image, Download, Info, ExternalLink } from 'lucide-react';

import {
  Container, Card, CardHeader, CardBody, Button,
  Input, Form, FormGroup, Label, Table, Col, Row,
  InputGroup, InputGroupText, Spinner, Alert, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import html2canvas from 'html2canvas';
import Certificate from './Certificate';
import ModernShopForm from './CreateNewSHop';
const App = () => {
  const contentRef = useRef(null);
  const [openForm, setOpenForm] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemSearch, setItemSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
 
  const [selectedShop, setSelectedShop] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
 
  const [form, setForm] = useState({
    date: "",
    name: "",
    shop_no: "",
    allocation: "",
    file: null
  });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        fetch("http://localhost:3000/form")
        .then(response => response.json())
        .then(response => {
          console.log(response, "response")
          setData(response?.resp || []);
        })
        .catch(error => {
          console.error("Error fetching data:", error);
          setError("Failed to fetch data. Please try again.");
        })
    } finally {
      setLoading(false);
    }
  };

    fetchData();
  }, [openForm]);

  // Pagination
  const recordsPerPage = 6;
  const filteredData = data.filter(item =>
    item.applicant_name?.toLowerCase().includes(itemSearch.toLowerCase()) ||
    item.shop_number?.toString().includes(itemSearch)
  );
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const currentRecords = filteredData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // PDF Generation
// Fix for App.js - Updated PDF generation code
// Replace the generatePDF function with this improved version
// Fix for App.js - Enhanced PDF generation with proper image handling

// Fix for App.js - Enhanced PDF generation with proper image handling

const generatePDF = useCallback(async () => {
  if (!contentRef.current) return;
  
  try {
    const { jsPDF } = await import('jspdf');
    
    // Correct A4 dimensions in mm (210mm width × 297mm height)
    const pageWidth = 210;
    const pageHeight = 297;
    
    // Calculate the aspect ratio of your content
    const contentWidth = contentRef.current.offsetWidth;
    const contentHeight = contentRef.current.offsetHeight;
    const contentAspectRatio = contentWidth / contentHeight;
    
    // Calculate PDF aspect ratio
    const pdfAspectRatio = pageWidth / pageHeight;
    
    // Options for html2canvas with higher quality and proper handling of images
    const options = {
      scale: 3, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FFFFFF',
      logging: false,
      imageTimeout: 5000, // Give more time for images to load
      onclone: (clonedDoc) => {
        // Force all images to complete loading in the clone
        const images = clonedDoc.querySelectorAll('img');
        return Promise.all(Array.from(images).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve; // Continue even if image fails
            // Set a backup timeout
            setTimeout(resolve, 3000);
          });
        }));
      }
    };
    
    // Convert the content to canvas
    const canvas = await html2canvas(contentRef.current, options);
    
    // Create PDF with proper dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Get the image data from canvas
    const imgData = canvas.toDataURL('image/png', 1.0);
    
    // Determine how to fit the content on the PDF page to fill completely
    let imgWidth, imgHeight, xOffset, yOffset;
    
    if (contentAspectRatio > pdfAspectRatio) {
      // alert(pageHeight)
      // Content is wider than PDF proportionally
      imgHeight = pageHeight + 9;
      imgWidth = pageWidth * 1.45;
      xOffset = (pageWidth - imgWidth) / 2; // Center horizontally
      yOffset = 0;
    } else {
      alert("else")
      // Content is taller than PDF proportionally
      imgWidth = pageWidth;
      imgHeight = imgWidth / contentAspectRatio;
      xOffset = 0;
      yOffset = (pageHeight - imgHeight) / 2; // Center vertically
    }
    
    // Add the image to fill the page
    pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
    
    return pdf;
  } catch (error) {
    console.error('Error generating PDF:', error);
    setError('Failed to generate PDF. Please try again.');
    return null;
  }
}, []);

const getStatusBadge = (status) => {
  const statusConfig = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200'
  };
  
  return statusConfig[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};
const handleViewDetails = (shop) => {
  setSelectedShop(shop);
  setShowDetails(true);
};
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getFileIcon = (filename) => {
  const extension = filename.split('.').pop().toLowerCase();
  switch (extension) {
    case 'pdf':
      return <FileText className="text-red-500" size={20} />;
    case 'doc':
    case 'docx':
      return <FileText className="text-blue-500" size={20} />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return <Image className="text-green-500" size={20} />;
    default:
      return <FileText className="text-gray-500" size={20} />;
  }
};

const getFileType = (filename) => {
  const extension = filename.split('.').pop().toLowerCase();
  switch (extension) {
    case 'pdf':
      return 'PDF Document';
    case 'doc':
    case 'docx':
      return 'Word Document';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return 'Image File';
    default:
      return 'Document';
  }
};


  const downloadPDF = useCallback(async () => {
    const pdf = await generatePDF();
    if (pdf) {
      pdf.save(`certificate_${selectedItem?.shop_no || ''}_${selectedItem?.name || ''}.pdf`);
    }
  }, [generatePDF, selectedItem]);

  const printCertificate = useCallback(async () => {
    const pdf = await generatePDF();
    if (pdf) {
      pdf.autoPrint();
      window.open(pdf.output('bloburl'), '_blank');
    }
  }, [generatePDF]);

  // Preview handler
  const handlePreview = (item) => {
    setSelectedItem(item);
    setPreviewModal(true);
  };

  // Form handlers
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };


  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      await axios.post("http://localhost:3000/form", formData);
      const response = await axios.get("http://localhost:3000/form");
      setData(response?.data?.resp || []);
      setOpenForm(false);
      setForm({
        date: "", name: "", shop_no: "", allocation: "", file: null
      });
      setLoading(false);
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Failed to submit form. Please try again.");
      setLoading(false);
    }
  };

 

  const handleRemoveFile = () => {
    setForm(prev => ({ ...prev, file: null }));
  };


  // Pagination controls
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDownload = async (fileUrl) => {
    // alert(fileUrl)
    if (!fileUrl) {
      alert('No file available for download');
      return;
    }

    try {
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileUrl.split('/').pop(); // Extract filename from URL
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file');
    }
  };

  // Handle file preview
  const handlePreview2 = (fileUrl) => {
    if (!fileUrl) {
      alert('No file available for preview');
      return;
    }

    try {
      const extension = fileUrl.split('.').pop().toLowerCase();
      const isPdf = extension === 'pdf';
      const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(extension);
      
      if (isPdf || isImage) {
        window.open(fileUrl, '_blank', 'noopener,noreferrer');
      } else {
        // For other file types, force download
        handleDownload(fileUrl);
      }
    } catch (error) {
      console.error('Preview error:', error);
      alert('Failed to preview file');
    }
  };
  const FileUploadCard = ({ onFileSelect, selectedFile, onRemoveFile }) => {
    const [isDragging, setIsDragging] = useState(false);
  
    const handleDragEvents = useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();
    }, []);
  
    const handleDragIn = useCallback((e) => {
      handleDragEvents(e);
      setIsDragging(true);
    }, [handleDragEvents]);
  
    const handleDragOut = useCallback((e) => {
      handleDragEvents(e);
      setIsDragging(false);
    }, [handleDragEvents]);
  
    const handleDrop = useCallback((e) => {
      handleDragEvents(e);
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files?.length) {
        onFileSelect({ target: { name: 'file', files: [files[0]] } });
      }
    }, [handleDragEvents, onFileSelect]);
  
    return (
      <div
        className={`border-2 border-dashed rounded-lg p-2 text-center transition-all ${isDragging ? 'border-primary bg-primary bg-opacity-10' : 'border-gray-300'
          }`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDragEvents}
        onDrop={handleDrop}
        style={{
          minHeight: '200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isDragging ? '#e8f0fe' : '#fff',
          cursor: 'pointer'
        }}
      >
        {selectedFile ? (
          <div className="w-100 p-3 bg-light rounded d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <FileText size={24} className="text-primary" />
              <span className="text-truncate">{selectedFile.name}</span>
            </div>
            <Button
              color="danger"
              size="sm"
              outline
              className="d-flex align-items-center justify-content-center p-1"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFile();
              }}
            >
              <X size={16} />
            </Button>
          </div>
        ) : (
          <>
            <Upload size={48} className="text-primary mb-3" />
            <div className="fw-bold mb-2">Drag and drop your file here</div>
            <div className="text-muted mb-3">or</div>
            <Button
              color="primary"
              outline
              size="lg"
              className="position-relative"
              style={{ overflow: 'hidden' }}
            >
              Browse Files
              <Input
                type="file"
                name="file"
                accept="image/*, .pdf, .doc, .docx"
                onChange={onFileSelect}
                className="position-absolute"
                style={{
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  opacity: 0,
                  cursor: 'pointer'
                }}
              />
            </Button>
            <div className="text-muted mt-2">
              <small>Supported formats: Images, PDF, DOC, DOCX</small>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className=" bg-gray-50">
      {/* Watermark */}
    

      <Container className="py relative mt-5">
        {error && (
          <Alert color="danger" className="mb-4" toggle={() => setError(null)}>
            {error}
          </Alert>
        )}

        {!openForm ? (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
          <div className="max-w-7xl mx-auto">
            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                <div className="flex items-center justify-center">
                  <Store className="text-white mr-3" size={32} />
                  <h1 className="text-white text-2xl md:text-3xl font-bold text-center">
                    MOHAMMUD ABUBAKAR RM SABON GARI MARKET
                  </h1>
                </div>
              </div>
    
              <div className="p-8">
                {/* Action Bar */}
                <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-8">
                  <button
                    onClick={() => setOpenForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group"
                  >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    Add New Shop Application
                  </button>
    
                  <div className="relative w-full lg:w-96">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-blue-500" />
                    </div>
                    <input
                      type="text"
                      value={itemSearch}
                      onChange={(e) => {
                        setItemSearch(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Search by name, shop number, or application ID..."
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>
    
                {/* Loading State */}
                {loading ? (
                  <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading shop data...</p>
                  </div>
                ) : (
                  <>
                    {/* Table */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                              <th className="px-6 py-4 text-left text-sm font-semibold">S/N</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold">Application ID</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold">Applicant Name</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold">Phone Number</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold">Shop Number</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold">Business Type</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold">Application Date</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                              <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {currentRecords.length > 0 ? (
                              currentRecords.map((item, index) => (
                                <tr key={item.id} className="hover:bg-blue-50 transition-colors duration-200">
                                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                    {(currentPage - 1) * recordsPerPage + index + 1}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-blue-600 font-semibold">
                                    {item.application_id}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                    {item.applicant_name}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-600">
                                    {item.phone_number}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                                    {item.shop_number}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-600">
                                    {item.nature_of_business}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-600">
                                    {formatDate(item.application_date)}
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border capitalize ${getStatusBadge(item.status)}`}>
                                      {item.status}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                      <button
                                        onClick={() => handlePreview(item)}
                                        className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 group"
                                      >
                                        <Eye size={14} className="group-hover:scale-110 transition-transform duration-200" />
                                        Preview
                                      </button>
                                      <button
                                        onClick={() => handleViewDetails(item)}
                                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 group"
                                      >
                                        <Info size={14} className="group-hover:scale-110 transition-transform duration-200" />
                                        Details
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                                  <div className="flex flex-col items-center">
                                    <Store size={48} className="text-gray-300 mb-4" />
                                    <p className="text-lg font-medium">No records found</p>
                                    <p className="text-sm">Try adjusting your search criteria</p>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
    
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center mt-8 gap-2">
                        <button
                          onClick={() => goToPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                          Previous
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => (
                          <button
                            key={i}
                            onClick={() => goToPage(i + 1)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                              currentPage === i + 1
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-blue-600 bg-white border border-blue-300 hover:bg-blue-50'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => goToPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
    
            {/* View Details Modal */}
            {showDetails && selectedShop && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl sticky top-0 z-10">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      <Info size={28} />
                      Complete Application Details
                    </h2>
                    <button
                      onClick={() => setShowDetails(false)}
                      className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors duration-200"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>
        
                {/* Modal Content */}
                <div className="p-8">
                  {/* Header Info Card */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 mb-8">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <h3 className="text-sm font-medium text-blue-600 mb-1">Application ID</h3>
                        <p className="text-2xl font-bold text-blue-900">{selectedShop.application_id}</p>
                      </div>
                      <div className="text-center">
                        <h3 className="text-sm font-medium text-blue-600 mb-1">Shop Number</h3>
                        <p className="text-2xl font-bold text-blue-900">{selectedShop.shop_number}</p>
                      </div>
                      <div className="text-center">
                        <h3 className="text-sm font-medium text-blue-600 mb-1">Status</h3>
                        <span className={`inline-flex px-4 py-2 rounded-full text-sm font-bold border capitalize ${getStatusBadge(selectedShop.status)}`}>
                          {selectedShop.status}
                        </span>
                      </div>
                    </div>
                  </div>
        
                  {/* Main Content Grid */}
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column - Personal & Business Info */}
                    <div className="space-y-6">
                      {/* Personal Information */}
                      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2 pb-3 border-b border-gray-200">
                          <User size={22} className="text-blue-600" />
                          Personal Information
                        </h3>
                        <div className="grid gap-4">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-500 block mb-1">Full Name</label>
                              <p className="text-gray-900 font-semibold text-lg">{selectedShop.applicant_name}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500 block mb-1">Phone Number</label>
                              <p className="text-gray-900 font-semibold flex items-center gap-2">
                                <Phone size={16} className="text-green-600" />
                                {selectedShop.phone_number}
                              </p>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500 block mb-1">Address</label>
                            <p className="text-gray-900 flex items-start gap-2 leading-relaxed">
                              <MapPin size={16} className="text-red-500 mt-1 flex-shrink-0" />
                              {selectedShop.address}
                            </p>
                          </div>
                        </div>
                      </div>
        
                      {/* Business Information */}
                      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2 pb-3 border-b border-gray-200">
                          <Building size={22} className="text-green-600" />
                          Business Information
                        </h3>
                        <div className="grid gap-4">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-500 block mb-1">Nature of Business</label>
                              <p className="text-gray-900 font-semibold">{selectedShop.nature_of_business}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500 block mb-1">Former Allottee</label>
                              <p className="text-gray-900 font-semibold">{selectedShop.former_allottee}</p>
                            </div>
                          </div>
                        </div>
                      </div>
        
                      {/* Timeline Information */}
                      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2 pb-3 border-b border-gray-200">
                          <Calendar size={22} className="text-purple-600" />
                          Timeline
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
                            <div className="bg-purple-600 w-3 h-3 rounded-full"></div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">Application Submitted</p>
                              <p className="text-sm text-gray-600">{formatDate(selectedShop.application_date)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                            <div className="bg-blue-600 w-3 h-3 rounded-full"></div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">Record Created</p>
                              <p className="text-sm text-gray-600">{formatDate(selectedShop.created_at)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 p-3 bg-orange-50 rounded-lg">
                            <div className="bg-orange-600 w-3 h-3 rounded-full"></div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">Last Updated</p>
                              <p className="text-sm text-gray-600">{formatDate(selectedShop.updated_at)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
        
                    {/* Right Column - Documents */}
                    <div className="space-y-6">
                      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2 pb-3 border-b border-gray-200">
                          <FileText size={22} className="text-indigo-600" />
                          Supporting Documents
                        </h3>
                        
                        <div className="space-y-4">
                          {/* Passport Photo */}
                          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="bg-red-100 p-3 rounded-lg">
                                  {getFileIcon(selectedShop.passport_photo)}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">Passport Photograph</h4>
                                  <p className="text-sm text-gray-600">{getFileType(selectedShop.passport_photo)}</p>
                                  <p className="text-xs text-gray-500 mt-1">{selectedShop.passport_photo}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleDownload(`http://localhost:3000/uploads/${selectedShop.passport_photo}`)}
                                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors duration-200"
                                >
                                  <Download size={16} />
                                </button>
                                <button 
                                  onClick={() => handlePreview(`http://localhost:3000/uploads/${selectedShop.passport_photo}`)}
                                  className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors duration-200"
                                >
                                  <ExternalLink size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
        
                          {/* Allocation Letter */}
                          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-3 rounded-lg">
                                  {getFileIcon(selectedShop.allocation_letter)}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">Allocation Letter</h4>
                                  <p className="text-sm text-gray-600">{getFileType(selectedShop.allocation_letter)}</p>
                                  <p className="text-xs text-gray-500 mt-1">{selectedShop.allocation_letter}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleDownload(`http://localhost:3000/uploads/${selectedShop.allocation_letter}`)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors duration-200"
                                >
                                  <Download size={16} />
                                </button>
                                <button 
                                  onClick={() => handlePreview(`http://localhost:3000/uploads/${selectedShop.allocation_letter}`)}
                                  className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors duration-200"
                                >
                                  <ExternalLink size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
        
                          {/* Agreement Letter */}
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="bg-green-100 p-3 rounded-lg">
                                  {getFileIcon(selectedShop.agreement_letter)}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">Agreement Letter</h4>
                                  <p className="text-sm text-gray-600">{getFileType(selectedShop.agreement_letter)}</p>
                                  <p className="text-xs text-gray-500 mt-1">{selectedShop.agreement_letter}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleDownload(`http://localhost:3000/uploads/${selectedShop.agreement_letter}`)}
                                  className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors duration-200"
                                >
                                  <Download size={16} />
                                </button>
                                <button 
                                  onClick={() => handlePreview(`http://localhost:3000/uploads/${selectedShop.agreement_letter}`)}
                                  className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors duration-200"
                                >
                                  <ExternalLink size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
        
                      {/* Application Summary */}
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Summary</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Application ID:</span>
                            <span className="font-semibold text-gray-900">{selectedShop.application_id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Applicant:</span>
                            <span className="font-semibold text-gray-900">{selectedShop.applicant_name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Shop Number:</span>
                            <span className="font-semibold text-gray-900">{selectedShop.shop_number}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Business Type:</span>
                            <span className="font-semibold text-gray-900">{selectedShop.nature_of_business}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Documents:</span>
                            <span className="font-semibold text-green-600">3 files attached</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
        
                  {/* Action Buttons */}
                  <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setShowDetails(false)}
                      className="px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
                    >
                      Close
                    </button>
                    <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2">
                      <FileText size={18} />
                      Print Application
                    </button>
                  </div>
                </div>
              </div>
            </div>
            )}
    
            {/* Preview Modal */}
            {showPreview && selectedShop && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  {/* Modal Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <FileText size={28} />
                        Shop Application Details
                      </h2>
                      <button
                        onClick={() => setShowPreview(false)}
                        className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors duration-200"
                      >
                        <X size={24} />
                      </button>
                    </div>
                  </div>
    
                  {/* Modal Content */}
                  <div className="p-8">
                    {/* Application Info */}
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                      <div className="space-y-6">
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                            <User size={20} />
                            Applicant Information
                          </h3>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-gray-600">Full Name</label>
                              <p className="text-gray-900 font-semibold">{selectedShop.applicant_name}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">Phone Number</label>
                              <p className="text-gray-900 flex items-center gap-2">
                                <Phone size={16} />
                                {selectedShop.phone_number}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">Address</label>
                              <p className="text-gray-900 flex items-center gap-2">
                                <MapPin size={16} />
                                {selectedShop.address}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
    
                      <div className="space-y-6">
                        <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                          <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
                            <Building size={20} />
                            Shop Details
                          </h3>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-gray-600">Application ID</label>
                              <p className="text-gray-900 font-semibold">{selectedShop.application_id}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">Shop Number</label>
                              <p className="text-gray-900 font-semibold text-lg">{selectedShop.shop_number}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">Nature of Business</label>
                              <p className="text-gray-900">{selectedShop.nature_of_business}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">Former Allottee</label>
                              <p className="text-gray-900">{selectedShop.former_allottee}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
    
                    {/* Dates and Status */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar size={18} className="text-purple-600" />
                          <label className="text-sm font-medium text-purple-800">Application Date</label>
                        </div>
                        <p className="text-gray-900 font-semibold">{formatDate(selectedShop.application_date)}</p>
                      </div>
                      
                      <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar size={18} className="text-orange-600" />
                          <label className="text-sm font-medium text-orange-800">Last Updated</label>
                        </div>
                        <p className="text-gray-900 font-semibold">{formatDate(selectedShop.updated_at)}</p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Building size={18} className="text-gray-600" />
                          <label className="text-sm font-medium text-gray-800">Application Status</label>
                        </div>
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold border capitalize ${getStatusBadge(selectedShop.status)}`}>
                          {selectedShop.status}
                        </span>
                      </div>
                    </div>
    
                    {/* Documents Section */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <FileText size={20} />
                        Attached Documents
                      </h3>
                      
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <Image size={20} className="text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">Passport Photo</h4>
                              <p className="text-sm text-gray-600">Image file</p>
                            </div>
                          </div>
                          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2">
                            <Download size={16} />
                            Download
                          </button>
                        </div>
    
                        <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="bg-green-100 p-2 rounded-lg">
                              <FileText size={20} className="text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">Allocation Letter</h4>
                              <p className="text-sm text-gray-600">Document file</p>
                            </div>
                          </div>
                          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2">
                            <Download size={16} />
                            Download
                          </button>
                        </div>
    
                        <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="bg-purple-100 p-2 rounded-lg">
                              <FileText size={20} className="text-purple-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">Agreement Letter</h4>
                              <p className="text-sm text-gray-600">Document file</p>
                            </div>
                          </div>
                          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2">
                            <Download size={16} />
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
    
                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => setShowPreview(false)}
                        className="px-6 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
                      >
                        Close
                      </button>
                      <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200">
                        Print Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        ) : (
        <ModernShopForm setOpenForm={setOpenForm}/>

        )}

        {/* Certificate Preview Modal */}
        <Modal isOpen={previewModal} toggle={() => setPreviewModal(false)} size="xl">
          <ModalHeader toggle={() => setPreviewModal(false)}>
            Certificate Preview - {selectedItem?.name || ''}
          </ModalHeader>
          <ModalBody style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
            <div ref={contentRef}>

            <Certificate  value={selectedItem} />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setPreviewModal(false)}>
              Close
            </Button>
            <Button color="primary" onClick={printCertificate} className="flex items-center gap-2">
              <Printer size={16} />
              Print
            </Button>
            <Button color="success" onClick={downloadPDF} className="flex items-center gap-2">
              <FileDown size={16} />
              Download PDF
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    </div>
  );
};

export default App;