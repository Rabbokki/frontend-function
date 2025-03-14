import "bootstrap/dist/css/bootstrap.min.css";
import { FaStar } from "react-icons/fa";
import { Button, Card } from "react-bootstrap";

const List = () => {
    return (
        <div className="container">
            <div className="row">
                {[...Array(16)].map((_, index) => (
                    <div key={index} className="col-md-3">
                        <Card style={{ width: '12rem' }}>
                            <Card.Img 
                                variant="top" 
                                src="/image/logoo.jpg.png" 
                                alt="product" 
                                className="img-fluid" 
                            />
                            <Card.Body>
                                <Card.Title>히비키</Card.Title>
                                <Card.Text>200,000원</Card.Text>
                                <div className="d-flex align-items-center">
                                    <FaStar />
                                    <span className="ms-1">5.0 (249)</span>
                                </div>
                                <Button variant="primary" className="mt-2 w-100">추천</Button>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default List;