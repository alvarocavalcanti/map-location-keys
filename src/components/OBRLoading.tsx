import React from 'react';
import { Card, Container } from 'react-bootstrap';

const OBRLoading: React.FC = () => {
  return (
    <Container>
      <Card>
        <Card.Body>
          <Card.Title>Loading...</Card.Title>
          <Card.Text>
            Please wait while Owlbear Rodeo loads.
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OBRLoading;