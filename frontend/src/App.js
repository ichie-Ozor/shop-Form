import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CardHeader,
  Button,
  Table,
  Input,
  Card,
  CardBody,
  InputGroup, Form, FormGroup, Label, Col, Row
} from 'reactstrap'
// import Table from 'react-bootstrap/Table';
import "./index.css"
const App = () => {
  const [openForm, setOpenForm] = useState(false)
  const [data, setData] = useState([])
  const [itemSearch, setItemSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [form, setform] = useState({
    date: "",
    name: "",
    shop_no: "",
    allocation: "",
    file: null
  });;

  useEffect(() => {
    axios.get("http://localhost:3000/form")
      .then((resp) => setData(resp?.data?.resp))
      .catch((err) => {
        console.log(err, "error")
      })
  }, [])

  ///////////////pagination
  const recordsPerPage = 6;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = data.slice(firstIndex, lastIndex);
  const npage = Math.ceil(data.length / recordsPerPage)
  const numbers = [...Array(npage + 1).keys()].slice(1)


  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === "file") {
      setform((prev) => ({
        ...prev,
        [name]: files[0]
      }))
    } else {
      setform({
        ...form, [name]: value,
      })
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form, "form here")

    const formData = new FormData()
    formData.append("date", form.date)
    formData.append("name", form.name)
    formData.append("shop_no", form.shop_no)
    formData.append("allocation", form.allocation)
    formData.append("file", form.file)
    axios({
      method: 'post',
      url: "http://localhost:3000/form",
      data: formData
    }).then((response) => console.log(response, "response here"))
      .catch((err) => console.log(err, "error"))
    setOpenForm(false)
  };

  return (
    <div className="container mt-4">
      {!openForm ?
        <Card>
          <CardHeader className='d-flex justify-content-center align-item-center' >MOHAMMUD ABUBAKAR RM SABON GARI MARKET</CardHeader>
          <CardBody>
            <div className='d-flex justify-content-between mb-3'>
              <Button color="primary" size="lg" onClick={() => setOpenForm(true)}>Add New</Button>
            </div>
            <InputGroup style={{ width: "" }}>
              {itemSearch && (
                <div>
                  {data.filter((item) => {
                    console.log(item.name, "item")
                    const searchItem = itemSearch.toLowerCase();
                    const name = item?.name.toLowerCase();
                    const no = item?.shop_no.toString().toLowerCase();
                    return searchItem && (name?.startsWith(searchItem) || no?.startsWith(searchItem)) && name !== searchItem;
                  }).map((t, index) => (
                    <div key={index}
                      style={{ position: "absolute", top: "40px", display: "block", justifySelf: "center", cursor: "pointer" }}
                      onClick={() => {
                        console.log(t, "ttttttttttt")
                        setItemSearch(t.name)
                        setData([t])
                      }}
                    >
                      {t.name || t.shop_no}</div>
                  ))}
                </div>
              )}
              <Input
                type="text"
                name="itemSearch"
                value={itemSearch}
                onChange={(e) => setItemSearch(e.target.value)}
                id="search"
                placeholder="Search" />
            </InputGroup>
          </CardBody>
          {/* <Button size="sm">Add New</Button> */}
          {/* {JSON.stringify(data)} */}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>S/N</th>
                <th> Name</th>
                <th>SHOP NO</th>
                <th>DATE</th>
                <th>Download Certificate</th>
              </tr>
            </thead>
            <tbody>
              {
                records?.map((item, index) =>
                  <tr>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.shop_no}</td>
                    <td>{item.date}</td>
                    {/* <td><img className='rounded' width={20} src={`http://localhost:3000/uploads/${item.image_url}`} alt='logo' /></td> */}
                    <td style={{ width: "20px", textAlign: "center" }}>
                      <a
                        href="/path/to/file.pdf"
                        download="filename.pdf"
                        className="no-decoration"
                        style={{ textDecoration: "none" }} // Fallback if CSS class doesn't load
                      >
                        <button
                          style={{
                            padding: "6px 12px",
                            background: "#1976d2",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "14px",
                            transition: "background 0.2s"
                          }}
                          onMouseOver={(e) => e.currentTarget.style.background = "#1565c0"}
                          onMouseOut={(e) => e.currentTarget.style.background = "#1976d2"}
                        >
                          Download PDF
                        </button>
                      </a>
                    </td>
                  </tr>)
              }
            </tbody>
          </Table>
        </Card> :
        <Card style={{ margin: "auto", width: "90%", boxShadow: "2px  2px 3px  2px rgb(219, 184, 184)", }}>
          <CardHeader style={{ fontWeight: "bolder", display: "flex" }}> <Col md={3} className=' ' style={{ marginRight: "160px" }} >
            <Button color='primary' onClick={() => setOpenForm(!openForm)} outline>Back</Button>
          </Col><span className='mt-2'>Create Shop</span></CardHeader>

          <CardBody className='bg-white'>

            <Form className='bg-white'>
              <Row className='bg-white'>
                <Col md={6} className='bg-white'>
                  <FormGroup>
                    <Label for="exampledate">Date</Label>
                    <Input
                      type="date"
                      name="date"
                      id="date"
                      placeholder=""
                      value={form.date}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
                {/* <Col md={5}>
                  <FormGroup>
                    <Label for="exampleuid">UID</Label>
                    <Input
                      type="text"
                      name="uid"
                      id="uid"
                      placeholder=""
                      value={form.uid}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col> */}

                <Col md={6} className='bg-white'>
                  <FormGroup>
                    <Label for="examplename">Name</Label>
                    <Input
                      type="text"
                      name="name"
                      id="name"
                      placeholder=""
                      value={form.name}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>

                <Col md={6} className='bg-white'>
                  <FormGroup>
                    <Label for="exampleshopnumber">
                      <span >Enter Shop Number</span>
                    </Label>
                    <Input
                      type="number"
                      name="shop_no"
                      id="shopnumber"
                      placeholder=""

                      value={form.shop_no}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="exampleshopnumber">
                      Allocation Form
                    </Label>
                    <Input
                      type="text"
                      name="allocation"
                      id="allocation"
                      placeholder=""

                      value={form.allocation}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="image">
                      upload image
                    </Label>
                    <Input
                      type="file"
                      name="file"
                      accept='image/*, .pdf, .doc, .docx'
                      id="image"
                      placeholder=""

                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Form>
            <Button
              color='primary'
              style={{
                marginLeft: "40%",
                width: "10%",
                height: "50px",
                border: "none",
              }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </CardBody>
        </Card>}
      <nav>
        <ul className='pagination'>
          <li className='page-item'>
            <a href='#' onClick={prePage} className='page-link'>Prev</a>
          </li>
          {
            numbers.map((n, i) => (
              <li key={i} className={`page-item ${currentPage === n ? "active" : ""}`}>
                <a href='#' onClick={() => changeCurrentPage(n)} className='page-link'>{n}</a>
              </li>
            ))
          }
          <li className='page-item'>
            <a href='#' onClick={nextPage} className='page-link'>Next</a>
          </li>
        </ul>
      </nav>
    </div>
  );
  function prePage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1)
    }
  }
  function nextPage() {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1)
    }
  }
  function changeCurrentPage(value) {
    setCurrentPage(value)
  }
}

export default App
