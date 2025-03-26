import React from 'react'
import { Form, FormGroup, Label, Input, Col, Row, Card, CardBody, } from 'reactstrap'
import { useState } from "react";
export default function Home() {
    const [form, setform] = useState("");;

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form);
    };
    return (
        <div>
            <Card style={{ margin: "auto", width: "80%" }}>
                <CardBody>
                    <Form>
                        <Row>
                            <Col md={5}>
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
                            <Col md={5}>
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
                            </Col>
                        </Row>
                        <Col md={6}>
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

                        <Col md={5}>
                            <FormGroup>
                                <Label for="exampleshopnumber">
                                    <span style={{ marginLeft: "300px" }}>Enter Shop Number</span>
                                </Label>
                                <Input
                                    type="number"
                                    name="shopnumber"
                                    id="shopnumber"
                                    placeholder=""
                                    style={{ marginLeft: "50%" }}
                                    value={form.shopnumber}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                        </Col>
                        <Col md={5}>
                            <FormGroup>
                                <Label for="exampleshopnumber">
                                    <span style={{ marginLeft: "300px" }}>Allocation Form</span>
                                </Label>
                                <Input
                                    type="text"
                                    name="allocation"
                                    id="allocation"
                                    placeholder=""
                                    style={{ marginLeft: "50%" }}
                                    value={form.text}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                        </Col>
                    </Form>
                    <button
                        style={{
                            marginLeft: "40%",
                            width: "10%",
                            height: "50px",
                            border: "none",
                        }}
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </CardBody>
            </Card>
        </div>
    );
}

