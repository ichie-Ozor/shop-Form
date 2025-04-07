// import { useHref } from 'react-router-dom';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import {
  Store, Search, PlusCircle, FileDown, ArrowLeft, Calendar,
  User, ShoppingBag, FileText, Upload, X, Printer, Eye
} from 'lucide-react';
import {
  Container, Card, CardHeader, CardBody, Button,
  Input, Form, FormGroup, Label, Table, Col, Row,
  InputGroup, InputGroupText, Spinner, Alert, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import html2canvas from 'html2canvas';
import { Certificate } from './Certificate';
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
        const response = await axios.get("http://localhost:3000/form");
        setData(response?.data?.resp || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Pagination
  const recordsPerPage = 6;
  const filteredData = data.filter(item =>
    item.name?.toLowerCase().includes(itemSearch.toLowerCase()) ||
    item.shop_no?.toString().includes(itemSearch)
  );
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const currentRecords = filteredData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // PDF Generation
  const generatePDF = useCallback(async () => {
    if (!contentRef.current) return;
    
    try {
        const { jsPDF } = await import('jspdf');
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // Add these options to html2canvas
        const canvas = await html2canvas(contentRef.current, {
            scale: 2,
            logging: false,
            useCORS: true, // Enable CORS
            allowTaint: true, // Allow tainted canvas
            backgroundColor: null, // Transparent background
            onclone: (clonedDoc) => {
                // Ensure all images have CORS attributes
                const images = clonedDoc.querySelectorAll('img');
                // images.forEach(img => {
                //     img.setAttribute('crossOrigin', 'anonymous');
                // });
            }
        });
        
        const imgData = canvas.toDataURL('image/png', 1.0);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        return pdf;
    } catch (error) {
        console.error('Error generating PDF:', error);
        setError('Failed to generate PDF. Please try again.');
        return null;
    }
}, []);

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
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Failed to submit form. Please try again.");
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
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-all ${isDragging ? 'border-primary bg-primary bg-opacity-10' : 'border-gray-300'
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
          <Card className="shadow-lg border-0 overflow-hidden">
            <CardHeader className="bg-blue-600 text-white py-4"  style={{ backgroundColor: '#4a7bcb' }}>
              <h2 className="text-center mb-0 font-bold text-xl md:text-2xl">
                <Store className="inline mr-2 mb-1" size={24} />
                MOHAMMUD ABUBAKAR RM SABON GARI MARKET
              </h2>
            </CardHeader>

            <CardBody className="p-4">
              <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <Button
                  color="primary"
                  className="flex items-center gap-2 shadow-md mb-2"
                  onClick={() => setOpenForm(true)}

                >
                  <PlusCircle size={18} />
                  Add New Shop
                </Button>

                <InputGroup className="w-full md:w-96">
                  <InputGroupText className="bg-blue-500 text-white" style={{ backgroundColor: '#4a7bcb' }}>
                    <Search size={18} />
                  </InputGroupText>
                  <Input
                    value={itemSearch}
                    onChange={(e) => {
                      setItemSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search by name or shop number..."
                  />
                </InputGroup>
              </div>

              {loading ? (
                <div className="text-center py-10">
                  <Spinner color="primary" />
                  <p className="mt-3">Loading shop data...</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table striped hover responsive>
                      <thead className="bg-blue-500 text-white">
                        <tr>
                          <th>S/N</th>
                          <th>Name</th>
                          <th>Shop No</th>
                          <th>Date</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentRecords.length > 0 ? (
                          currentRecords.map((item, index) => (
                            <tr key={`${item._id || index}`}>
                              <td>{(currentPage - 1) * recordsPerPage + index + 1}</td>
                              <td>{item.name}</td>
                              <td>{item.shop_no}</td>
                              <td>{new Date(item.date).toLocaleDateString()}</td>
                              <td className="flex justify-center gap-2">
                                <Button
                                  color="info"
                                  size="sm"
                                  className="flex items-center gap-1"
                                  onClick={() => handlePreview(item)}
                                >
                                  <Eye size={14} /> Preview
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center py-4">
                              No records found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>

                  {totalPages > 1 && (
                    <div className="flex justify-center mt-4">
                      <nav>
                        <ul className="pagination">
                          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <Button
                              className="page-link"
                              onClick={() => goToPage(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              Previous
                            </Button>
                          </li>
                          
                          {Array.from({ length: totalPages }, (_, i) => (
                            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                              <Button
                                className="page-link"
                                onClick={() => goToPage(i + 1)}
                              >
                                {i + 1}
                              </Button>
                            </li>
                          ))}
                          
                          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <Button
                              className="page-link"
                              onClick={() => goToPage(currentPage + 1)}
                              disabled={currentPage === totalPages}
                            >
                              Next
                            </Button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  )}
                </>
              )}
            </CardBody>
          </Card>
        ) : (
          <Card className="shadow-lg border-0">
          <CardHeader
            className="text-white d-flex justify-content-between align-items-center py-4"
            style={{ backgroundColor: '#4a7bcb' }}
          >
            <Button
              color="light"
              className="d-flex align-items-center gap-2"
              onClick={() => setOpenForm(false)}
            >
              <ArrowLeft size={20} />
              Back
            </Button>
            <h3 className="mb-0 fw-bold">Create New Shop</h3>
            <div style={{ width: '70px' }}></div>
          </CardHeader>

          <CardBody className="p-4">
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="date" className="fw-bold d-flex align-items-center gap-2">
                      <Calendar size={18} className="text-primary" />
                      Date
                    </Label>
                    <Input
                      type="date"
                      name="date"
                      id="date"
                      value={form.date}
                      onChange={handleChange}
                      className="shadow-sm"
                      required
                    />
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <Label for="name" className="fw-bold d-flex align-items-center gap-2">
                      <User size={18} className="text-primary" />
                      Name
                    </Label>
                    <Input
                      type="text"
                      name="name"
                      id="name"
                      value={form.name}
                      onChange={handleChange}
                      className="shadow-sm"
                      required
                    />
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <Label for="shop_no" className="fw-bold d-flex align-items-center gap-2">
                      <ShoppingBag size={18} className="text-primary" />
                      Shop Number
                    </Label>
                    <Input
                      type="text"
                      name="shop_no"
                      id="shop_no"
                      value={form.shop_no}
                      onChange={handleChange}
                      className="shadow-sm"
                      required
                    />
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <Label for="allocation" className="fw-bold d-flex align-items-center gap-2">
                      <FileText size={18} className="text-primary" />
                      Allocation Form
                    </Label>
                    <Input
                      type="text"
                      name="allocation"
                      id="allocation"
                      value={form.allocation}
                      onChange={handleChange}
                      className="shadow-sm"
                      required
                    />
                  </FormGroup>
                </Col>

                <Col md={12}>
                  <FormGroup>
                    <Label className="fw-bold d-flex align-items-center gap-2">
                      <Upload size={18} className="text-primary" />
                      Upload Document
                    </Label>
                    <FileUploadCard
                      onFileSelect={handleChange}
                      selectedFile={form.file}
                      onRemoveFile={handleRemoveFile}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <div className="text-center mt-4">
                <Button
                  type="submit"
                  color="primary"
                  size="lg"
                  className="px-5 shadow d-flex align-items-center gap-2 mx-auto"
                  style={{ backgroundColor: '#80aaff', borderColor: '#80aaff' }}
                  disabled={!form.date || !form.name || !form.shop_no || !form.allocation}
                >
                  <PlusCircle size={20} />
                  Submit
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>

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