import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { BiSearchAlt2 } from 'react-icons/bi';

const SearchBar = ({ keyword, setKeyword }) => {
    return (
        <Row className="mb-5 justify-content-center">
            <Col md={8} lg={6} className="position-relative">
                <BiSearchAlt2 className="position-absolute fs-4" style={{ top: '15px', left: '25px', color: '#d4af37' }} />
                <Form.Control
                    type="text"
                    placeholder="Find your next blockbuster movie..."
                    className="form-control-custom ps-5 py-3 shadow-sm text-center"
                    style={{ fontSize: '1.1rem', borderRadius: '50px' }}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </Col>
        </Row>
    );
};

export default SearchBar;
