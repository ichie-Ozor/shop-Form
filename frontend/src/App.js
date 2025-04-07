// import React, { useEffect, useState, useRef, useCallback } from 'react'
// import axios from 'axios'
// import html2canvas from 'html2canvas';
// import { jsPDF } from 'jspdf';
// import Certificate from './Certificate';
// // import html2PDF from 'jspdf-html2canvas';
// // import DataTable from 'react-data-table-component';
// import { Store, Search, PlusCircle, FileDown, ArrowLeft, Calendar, User, ShoppingBag, FileText, Upload, X } from 'lucide-react';
// import {
//   Container,
//   Card,
//   CardHeader,
//   CardBody,
//   Button,
//   Input,
//   Form,
//   FormGroup,
//   Label,
//   Table,
//   Col,
//   Row,
//   InputGroup,
//   InputGroupText
// } from 'reactstrap';
// // import Table from 'react-bootstrap/Table';
// import "./index.css"

// const customStyles = {
//   header: {
//     style: {
//       minHeight: '56px',
//       backgroundColor: '#4a7bcb',
//       color: 'white',
//     },
//   },
//   headRow: {
//     style: {
//       backgroundColor: '#80aaff',
//       color: 'white',
//       fontSize: '14px',
//       fontWeight: 'bold',
//     },
//   },
//   rows: {
//     style: {
//       minHeight: '60px',
//       fontSize: '14px',
//       '&:nth-child(odd)': {
//         backgroundColor: '#f8f9fa',
//       },
//       '&:hover': {
//         backgroundColor: '#e9ecef',
//         cursor: 'pointer',
//       },
//     },
//   },
// };

// const FileUploadCard = ({ onFileSelect, selectedFile, onRemoveFile }) => {
//   const [isDragging, setIsDragging] = useState(false);

//   const handleDrag = useCallback((e) => {
//     e.preventDefault();
//     e.stopPropagation();
//   }, []);

//   const handleDragIn = useCallback((e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(true);
//   }, []);

//   const handleDragOut = useCallback((e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(false);
//   }, []);

//   const handleDrop = useCallback((e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(false);
//     const files = e.dataTransfer.files;
//     if (files && files.length > 0) {
//       onFileSelect({ target: { name: 'file', files: [files[0]] } });
//     }
//   }, [onFileSelect]);

//   return (
//     <div
//       className={`border-2 border-dashed rounded-lg p-4 text-center transition-all ${isDragging ? 'border-primary bg-primary bg-opacity-10' : 'border-gray-300'
//         }`}
//       onDragEnter={handleDragIn}
//       onDragLeave={handleDragOut}
//       onDragOver={handleDrag}
//       onDrop={handleDrop}
//       style={{
//         minHeight: '200px',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: isDragging ? '#e8f0fe' : '#fff',
//         cursor: 'pointer'
//       }}
//     >
//       {selectedFile ? (
//         <div className="w-100 p-3 bg-light rounded d-flex align-items-center justify-content-between">
//           <div className="d-flex align-items-center gap-2">
//             <FileText size={24} className="text-primary" />
//             <span className="text-truncate">{selectedFile.name}</span>
//           </div>
//           <Button
//             color="danger"
//             size="sm"
//             outline
//             className="d-flex align-items-center justify-content-center p-1"
//             onClick={(e) => {
//               e.stopPropagation();
//               onRemoveFile();
//             }}
//           >
//             <X size={16} />
//           </Button>
//         </div>
//       ) : (
//         <>
//           <Upload size={48} className="text-primary mb-3" />
//           <div className="fw-bold mb-2">Drag and drop your file here</div>
//           <div className="text-muted mb-3">or</div>
//           <Button
//             color="primary"
//             outline
//             size="lg"
//             className="position-relative"
//             style={{ overflow: 'hidden' }}
//           >
//             Browse Files
//             <Input
//               type="file"
//               name="file"
//               accept="image/*, .pdf, .doc, .docx"
//               onChange={onFileSelect}
//               className="position-absolute"
//               style={{
//                 top: 0,
//                 right: 0,
//                 bottom: 0,
//                 left: 0,
//                 opacity: 0,
//                 cursor: 'pointer'
//               }}
//             />
//           </Button>
//           <div className="text-muted mt-2">
//             <small>Supported formats: Images, PDF, DOC, DOCX</small>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// const App = () => {
//   const contentRef = useRef(null)
//   const [openForm, setOpenForm] = useState(false)
//   const [data, setData] = useState([])
//   const [itemSearch, setItemSearch] = useState("")
//   const [currentPage, setCurrentPage] = useState(1)
//   const [form, setform] = useState({
//     date: "",
//     name: "",
//     shop_no: "",
//     allocation: "",
//     file: null
//   });;

//   useEffect(() => {
//     axios.get("http://localhost:3000/form")
//       .then((resp) => setData(resp?.data?.resp))
//       .catch((err) => {
//         console.log(err, "error")
//       })
//   }, [])

//   ///////////////pagination
//   const recordsPerPage = 6;
//   const lastIndex = currentPage * recordsPerPage;
//   const firstIndex = lastIndex - recordsPerPage;
//   const records = data.slice(firstIndex, lastIndex);
//   const npage = Math.ceil(data.length / recordsPerPage)
//   const numbers = [...Array(npage + 1).keys()].slice(1)


//   //////////////////Download

// const downloadPDF = async () => {
//   const element = contentRef.current
//   if (!element) return
//   try {
//     const canvas = await html2canvas(element, {
//       scale: 2,
//       useCORS: true,
//       logging: true,
//       scrollX: 0,
//       scrollY: 0
//     });
//     const pdf = new jsPDF('p', 'mm', 'a4');
//     const imgProps = pdf.getImageProperties(canvas);
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//     pdf.addImage(canvas, 'PNG', 0, 0, pdfWidth, pdfHeight);
//     pdf.save('document.pdf');
//   } catch (error) {
//     console.error('Error generating PDF:', error);
//     alert('Failed to generate PDF');
//   }
// };

//   const handleChange = (e) => {
//     const { name, value, files } = e.target
//     if (name === "file") {
//       setform((prev) => ({
//         ...prev,
//         [name]: files[0]
//       }))
//     } else {
//       setform({
//         ...form, [name]: value,
//       })
//     }
//   };

//   const handleRemoveFile = () => {
//     setform((prev) => ({
//       ...prev,
//       file: null
//     }));
//   };


//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log(form, "form here")

//     const formData = new FormData()
//     formData.append("date", form.date)
//     formData.append("name", form.name)
//     formData.append("shop_no", form.shop_no)
//     formData.append("allocation", form.allocation)
//     formData.append("file", form.file)
//     axios({
//       method: 'post',
//       url: "http://localhost:3000/form",
//       data: formData
//     }).then((response) => console.log(response, "response here"))
//       .catch((err) => console.log(err, "error"))
//     setOpenForm(false)
//   };


//   return (
//     <div className="min-h-screen bg-gradient-to-b from-[#80aaff] to-white">
//       {/* Watermark */}
//       <div
//         className="fixed inset-0 pointer-events-none flex items-center justify-center"
//         style={{
//           zIndex: 0,
//           opacity: 0.05,
//           transform: 'rotate(-15deg) scale(1.5)'
//         }}
//       >
//         <Store size={100} color="#4a7bcb" />
//       </div>
//       <Container className="py-5" style={{ position: 'relative', zIndex: 1 }}>
//         {!openForm ?
//           <Card className="shadow-lg border-0">
//             <CardHeader
//               className="text-white py-4"
//               style={{ backgroundColor: '#4a7bcb' }}
//             >
//               <h2 className="text-center mb-0 fw-bold">
//                 <Store className="me-2 mb-1" size={28} />
//                 MOHAMMUD ABUBAKAR RM SABON GARI MARKET
//               </h2>
//             </CardHeader>
//             <CardBody className="p-4">
//               <div className="d-flex justify-content-between align-items-center mb-4">
//                 <Button
//                   color="primary"
//                   size="lg"
//                   className="shadow-sm d-flex align-items-center gap-2"
//                   style={{ backgroundColor: '#80aaff', borderColor: '#80aaff' }}
//                   onClick={() => setOpenForm(true)}
//                 >
//                   <PlusCircle size={20} />
//                   Add New Shop
//                 </Button>
//                 <InputGroup style={{ width: '300px' }}>
//                   <InputGroupText style={{ backgroundColor: '#80aaff', borderColor: '#80aaff' }}>
//                     <Search size={20} className="text-white" />
//                   </InputGroupText>
//                   <Input
//                     type="text"
//                     name="itemSearch"
//                     value={itemSearch}
//                     onChange={(e) => setItemSearch(e.target.value)}
//                     placeholder="Search by name or shop number..."
//                     className="shadow-sm border-start-0"
//                   />
//                 </InputGroup>
//               </div>
//               <InputGroup style={{ width: "" }}>
//                 {itemSearch && (
//                   <div className="position-absolute bg-white w-25 shadow-lg rounded-3 mt-1" style={{ right: '15px', zIndex: 1000 }}>
//                     {data.filter((item) => {
//                       const searchItem = itemSearch.toLowerCase();
//                       const name = item?.name.toLowerCase();
//                       const no = item?.shop_no.toString().toLowerCase();
//                       return searchItem && (name?.startsWith(searchItem) || no?.startsWith(searchItem)) && name !== searchItem;
//                     }).map((t, index) => (
//                       <div key={index}
//                         style={{ position: "absolute", top: "40px", display: "block", justifySelf: "center", cursor: "pointer" }}
//                         onClick={() => {
//                           setItemSearch(t.name)
//                           setData([t])
//                         }}
//                       >
//                         {/* {t.name || t.shop_no} */}
//                         <User size={16} className="text-primary" />
//                         <div>
//                           <div className="fw-bold">{t.name}</div>
//                           <div className="text-muted small">Shop No: {t.shop_no}</div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//                 <Input
//                   type="text"
//                   name="itemSearch"
//                   value={itemSearch}
//                   onChange={(e) => setItemSearch(e.target.value)}
//                   id="search"
//                   placeholder="Search" />
//               </InputGroup>
//             </CardBody>
//             <Table striped bordered hover>
//               <thead>
//                 <tr>
//                   <th>S/N</th>
//                   <th> Name</th>
//                   <th>SHOP NO</th>
//                   <th>DATE</th>
//                   <th>Download Certificate</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {
//                   records?.map((item, index) =>
//                     <tr>
//                       <td>{index + 1}</td>
//                       <td>{item.name}</td>
//                       <td>{item.shop_no}</td>
//                       <td>{item.date}</td>
//                       {/* <td><img className='rounded' width={20} src={`http://localhost:3000/uploads/${item.image_url}`} alt='logo' /></td> */}
//                       <td style={{ width: "20px", textAlign: "center" }}>

//                         <div>
//                           <div style={{ position: 'absolute', left: '-9999px' }}>
//                             <Certificate ref={contentRef} props={item.image_url} value={item} />
//                           </div>
//                           <button
//                             style={{
//                               padding: "6px 12px",
//                               background: "#1976d2",
//                               color: "white",
//                               border: "none",
//                               borderRadius: "4px",
//                               cursor: "pointer",
//                               fontSize: "14px",
//                               transition: "background 0.2s"
//                             }}
//                             onMouseOver={(e) => e.currentTarget.style.background = "#1565c0"}
//                             onMouseOut={(e) => e.currentTarget.style.background = "#1976d2"}
//                             onClick={downloadPDF}
//                           >
//                             Download PDF
//                           </button>
//                         </div>
//                       </td>
//                     </tr>)
//                 }
//               </tbody>
//             </Table>
//             <nav>
//               <ul className='pagination'>
//                 <li className='page-item'>
//                   <a href='#' onClick={prePage} className='page-link'>Prev</a>
//                 </li>
//                 {
//                   numbers.map((n, i) => (
//                     <li key={i} className={`page-item ${currentPage === n ? "active" : ""}`}>
//                       <a href='#' onClick={() => changeCurrentPage(n)} className='page-link'>{n}</a>
//                     </li>
//                   ))
//                 }
//                 <li className='page-item'>
//                   <a href='#' onClick={nextPage} className='page-link'>Next</a>
//                 </li>
//               </ul>
//             </nav>
//           </Card> :
//           <Card className="shadow-lg border-0">
//             <CardHeader
//               className="text-white d-flex justify-content-between align-items-center py-4"
//               style={{ backgroundColor: '#4a7bcb' }}
//             >
//               <Button
//                 color="light"
//                 className="d-flex align-items-center gap-2"
//                 onClick={() => setOpenForm(false)}
//               >
//                 <ArrowLeft size={20} />
//                 Back
//               </Button>
//               <h3 className="mb-0 fw-bold">Create New Shop</h3>
//               <div style={{ width: '70px' }}></div>
//             </CardHeader>
//             <CardBody className='bg-white p-4'>

//               <Form className=''>
//                 <Row className=''>
//                   <Col md={6} className=''>
//                     <FormGroup>
//                       <Label for="date" className="fw-bold d-flex align-items-center gap-2">
//                         <Calendar size={18} className="text-primary" />
//                         Date
//                       </Label>
//                       <Input
//                         type="date"
//                         name="date"
//                         id="date"
//                         placeholder=""
//                         value={form.date}
//                         onChange={handleChange}
//                         className="shadow-sm"
//                       />
//                     </FormGroup>
//                   </Col>
//                   <Col md={6} className=''>
//                     <FormGroup>
//                       <Label for="name">Name</Label>
//                       <Input
//                         type="text"
//                         name="name"
//                         id="name"
//                         placeholder=""
//                         value={form.name}
//                         onChange={handleChange}
//                         className="shadow-sm"
//                       />
//                     </FormGroup>
//                   </Col>

//                   <Col md={6} className='bg-white'>
//                     <FormGroup>
//                       <Label for="shop_no">
//                         <span >Enter Shop Number</span>
//                       </Label>
//                       <Input
//                         type="number"
//                         name="shop_no"
//                         id="shopnumber"
//                         placeholder=""
//                         value={form.shop_no}
//                         onChange={handleChange}
//                         className="shadow-sm"
//                       />
//                     </FormGroup>
//                   </Col>
//                   <Col md={6}>
//                     <FormGroup>
//                       <Label for="allocation" className="fw-bold d-flex align-items-center gap-2">
//                         <FileText size={18} className="text-primary" />
//                         Allocation Form
//                       </Label>
//                       <Input
//                         type="text"
//                         name="allocation"
//                         id="allocation"
//                         placeholder=""
//                         className="shadow-sm"
//                         value={form.allocation}
//                         onChange={handleChange}
//                       />
//                     </FormGroup>
//                   </Col>
//                   <Col md={6}>
//                     <FormGroup>
//                       <Label for="image" className="fw-bold d-flex align-items-center gap-2">
//                         <Upload size={18} className="text-primary" />
//                         Upload Document
//                       </Label>
//                       <Input
//                         type="file"
//                         name="file"
//                         accept='image/*, .pdf, .doc, .docx'
//                         id="image"
//                         placeholder=""

//                         onChange={handleChange}
//                       />
//                     </FormGroup>
//                   </Col>
//                 </Row>
//               </Form>
//               <Button
//                 color="primary"
//                 size="lg"
//                 onClick={handleSubmit}
//                 className="px-5 shadow d-flex align-items-center gap-2 mx-auto"
//                 style={{ backgroundColor: '#80aaff', borderColor: '#80aaff' }}
//               >
//                 <PlusCircle size={20} />
//                 Submit
//               </Button>
//             </CardBody>
//           </Card>
//         }
//       </Container>

//     </div >
//   );
//   function prePage() {
//     if (currentPage !== 1) {
//       setCurrentPage(currentPage - 1)
//     }
//   }
//   function nextPage() {
//     if (currentPage !== npage) {
//       setCurrentPage(currentPage + 1)
//     }
//   }
//   function changeCurrentPage(value) {
//     setCurrentPage(value)
//   }
// }

// export default App

/////////////////////////////////////////////////////////////////////////////////

import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Certificate from './Certificate';
import {
  Store, Search, PlusCircle, FileDown, ArrowLeft, Calendar,
  User, ShoppingBag, FileText, Upload, X
} from 'lucide-react';
import {
  Container, Card, CardHeader, CardBody, Button,
  Input, Form, FormGroup, Label, Table, Col, Row,
  InputGroup, InputGroupText, Spinner, Alert
} from 'reactstrap';
import "./index.css";

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

const App = () => {
  const contentRef = useRef(null);
  const [openForm, setOpenForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null)
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

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/form");
        console.log(response, "response")
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

  // Pagination logic
  const recordsPerPage = 6;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const filteredData = data.filter(item =>
    item.name?.toLowerCase().includes(itemSearch.toLowerCase()) ||
    item.shop_no?.toString().includes(itemSearch)
  );
  const records = filteredData.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);


  const downloadPDF = async (item) => {
    const element = contentRef.current
    console.log(item, "item")
    setSelectedItem(item)
    if (!element) return
    try {

      await new Promise(resolve => setTimeout(resolve, 50));

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: true,
        scrollX: 0,
        scrollY: 0
      });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(canvas);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(canvas, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('document.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    }
  };



  // Download PDF function
  // const downloadPDF = useCallback(async (item) => {
  //   if (!contentRef.current) return;

  //   console.log(item, "itemmmmmm")
  //   setSelectedItem(item)
  //   try {

  //     await new Promise(resolve => setTimeout(resolve, 100));

  //     const canvas = await html2canvas(contentRef.current, {
  //       scale: 2,
  //       useCORS: true,
  //       logging: false,
  //       scrollX: 0,
  //       scrollY: 0
  //     });

  //     const pdf = new jsPDF('p', 'mm', 'a4');
  //     const imgProps = pdf.getImageProperties(canvas);
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  //     pdf.addImage(canvas, 'PNG', 0, 0, pdfWidth, pdfHeight);
  //     pdf.save(`certificate_${item.shop_no}_${item.name}.pdf`);
  //   } catch (error) {
  //     console.error('Error generating PDF:', error);
  //     setError('Failed to generate PDF. Please try again.');
  //   }
  // }, []);

  console.log(selectedItem, "set item")

  // Form handlers
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleRemoveFile = () => {
    setForm(prev => ({ ...prev, file: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      await axios.post("http://localhost:3000/form", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Refresh data after successful submission
      const response = await axios.get("http://localhost:3000/form");
      setData(response?.data?.resp || []);
      setOpenForm(false);
      setForm({
        date: "",
        name: "",
        shop_no: "",
        allocation: "",
        file: null
      });
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Failed to submit form. Please try again.");
    }
  };

  // Pagination controls
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#80aaff] to-white">
      {/* Watermark */}
      <div
        className="fixed inset-0 pointer-events-none flex items-center justify-center"
        style={{
          zIndex: 0,
          opacity: 0.05,
          transform: 'rotate(-15deg) scale(1.5)'
        }}
      >
        <Store size={100} color="#4a7bcb" />
      </div>

      <Container className="py-5" style={{ position: 'relative', zIndex: 1 }}>
        {error && (
          <Alert color="danger" className="mb-4" toggle={() => setError(null)}>
            {error}
          </Alert>
        )}

        {!openForm ? (
          <Card className="shadow-lg border-0">
            <CardHeader className="text-white py-4" style={{ backgroundColor: '#4a7bcb' }}>
              <h2 className="text-center mb-0 fw-bold">
                <Store className="me-2 mb-1" size={28} />
                MOHAMMUD ABUBAKAR RM SABON GARI MARKET
              </h2>
            </CardHeader>

            <CardBody className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <Button
                  color="primary"
                  size="lg"
                  className="shadow-sm d-flex align-items-center gap-2"
                  style={{ backgroundColor: '#80aaff', borderColor: '#80aaff' }}
                  onClick={() => setOpenForm(true)}
                >
                  <PlusCircle size={20} />
                  Add New Shop
                </Button>

                <InputGroup style={{ maxWidth: '400px', minWidth: '300px' }}>
                  <InputGroupText style={{ backgroundColor: '#80aaff', borderColor: '#80aaff' }}>
                    <Search size={20} className="text-white" />
                  </InputGroupText>
                  <Input
                    type="text"
                    value={itemSearch}
                    onChange={(e) => {
                      setItemSearch(e.target.value);
                      setCurrentPage(1); // Reset to first page when searching
                    }}
                    placeholder="Search by name or shop number..."
                    className="shadow-sm border-start-0"
                  />
                </InputGroup>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <Spinner color="primary" />
                  <p className="mt-2">Loading data...</p>
                </div>
              ) : (
                <>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>S/N</th>
                        <th>Name</th>
                        <th>SHOP NO</th>
                        <th>DATE</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.length > 0 ? (
                        records.map((item, index) => (
                          <tr key={`${item.shop_no}-${index}`}>
                            <td>{firstIndex + index + 1}</td>
                            <td>{item.name}</td>
                            <td>{item.shop_no}</td>
                            <td>{new Date(item.date).toLocaleDateString()}</td>
                            <td className="text-center">
                              <div style={{ position: 'absolute', left: '-9999px' }}>

                                {selectedItem !== null ?
                                  <Certificate
                                    ref={contentRef}
                                    value={selectedItem}
                                    Image={item.image_url ? `http://localhost:3000/uploads/${item.image_url}` : ''}
                                  /> : ""}
                              </div>
                              <Button
                                color="primary"
                                size="sm"
                                className="d-flex align-items-center gap-2 mx-auto"
                                onClick={() => downloadPDF(item)}
                                style={{ width: 'fit-content' }}
                              >
                                <FileDown size={16} />
                                Download
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

                  {totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-4">
                      <nav>
                        <ul className="pagination">
                          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={prevPage} disabled={currentPage === 1}>
                              Previous
                            </button>
                          </li>

                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                              <button className="page-link" onClick={() => goToPage(page)}>
                                {page}
                              </button>
                            </li>
                          ))}

                          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={nextPage} disabled={currentPage === totalPages}>
                              Next
                            </button>
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
                        type="number"
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
      </Container>
    </div>
  );
};

export default App;