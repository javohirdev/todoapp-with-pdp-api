import React, { Component } from 'react'
import axios from 'axios';
import
{ Container, Row, Col, Form, FormGroup, Input, Card, CardHeader, CardBody,
    CardFooter, Modal, ModalHeader, ModalFooter, Button
} 
from 'reactstrap';
import '../styles/PostRequest.css';

class PostRequest extends Component {
    constructor(props) {
        super(props)

        this.state = {
            productItem: [],
            developerItem: [],
            isModalShow: false,
            selectedProduct: ""
        }
    }

    componentWillMount() {
        axios.get("https://pdp-developer.herokuapp.com/api/product")
            .then(response => {
                console.log(response)
                this.setState({
                    productItem: response.data._embedded.product
                })     
            })
    }

    render() {
        const addProduct = (e) => {
            e.preventDefault();

            let newProduct = {
                name: e.target.productName.value,
                description: e.target.productDescription.value,
                expireDate: e.target.expireDate.value
            }

            e.target.reset();

            axios.post("https://pdp-developer.herokuapp.com/api/product", newProduct)
                .then(response => {
                    console.log(response)
                    getProducts()
                })
        };

        const getProducts = (e) => {
            axios.get("https://pdp-developer.herokuapp.com/api/product")
                .then(response => {
                    console.log(response)
                    this.setState({
                        productItem: response.data._embedded.product
                    })
                })
        };

        const changeModal = () => {
            this.setState({
                isModalShow: !this.state.isModalShow
            })
        }

        const toggle = () => {
            this.setState({
                isModalShow: false
            })
        }

        const deleteProduct = (id) => {
            this.setState({
                selectedProduct: id,
                isModalShow: true
            })
        };

        const deletedSelectedProduct = () => {
            axios.delete("https://pdp-developer.herokuapp.com/api/product/" + this.state.selectedProduct)
                .then(response => {
                    console.log(response)
                    this.setState({
                        isModalShow: false,
                        selectedProduct: ""
                    });
                    getProducts()
                })
        };

        return (
            <div>
                <Container>
                    <Row>
                        <Col md={{size: 4, offset: 4}} className="mt-4 mb-3">
                            <h2 className="title text-center text-white">
                                <b>Todo App with PDP API</b>
                            </h2>
                            <p className="info text-center text-white">You can create or delete any note</p>
                            <Form onSubmit={addProduct}>
                                <FormGroup>
                                    <Input type="text"
                                     className="input form-control" name="productName" 
                                     placeholder="Title"
                                     />
                                </FormGroup>
                                <FormGroup>
                                    <Input type="text"
                                     className="input form-control" name="productDescription" 
                                     placeholder="Description"
                                     />
                                </FormGroup>
                                <FormGroup>
                                    <Input type="date" className="input form-control" 
                                    name="expireDate" 
                                    placeholder="Date"
                                    />
                                </FormGroup>
                                <Button className="submitBtn" color="success">Add Task</Button>
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        {this.state.productItem.map(product => (
                            <Col md="4" sm="4" className="mt-3 mb-3">
                                <Card>
                                    <CardHeader>
                                        <h3>{product.name}</h3>
                                    </CardHeader>
                                    <CardBody>
                                        <p>Description: <b>{product.description}</b></p>
                                        <p>Date: <b>{product.expireDate}</b></p>
                                    </CardBody>
                                    <CardFooter>
                                        <Button color="danger" onClick={() => deleteProduct(product.id)}>
                                            Delete
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    <Modal isOpen={this.state.isModalShow} toggle={changeModal}>
                        <ModalHeader toggle={changeModal}>Are you sure delete this note?</ModalHeader>
                        <ModalFooter>
                            <Button color="success" onClick={deletedSelectedProduct}>Yes</Button>{' '}
                            <Button onClick={toggle} color="danger">No</Button>
                        </ModalFooter>
                    </Modal>
                </Container>
            </div>
        )
    }
}

export default PostRequest;
