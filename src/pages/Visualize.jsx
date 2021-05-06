import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Button, Container, Form, Row, Col } from 'react-bootstrap';
import { RANKINGS_URL, FACTORS_URL } from '../util';

const exampleQuery =
  `plot year, economy
where
  year between 2016, 2020
as
  lineplot
`;

function Visualize() {
  const dispatch = useDispatch();

  const [query, setQuery] = useState(exampleQuery);

  const updateQuery = (e) => {
    setQuery(e.target.value);
  }

  return (
    <Container>
      <Form>
        <Form.Group controlId='query-input'>
          <Form.Label>Enter query:</Form.Label>
          <Form.Control as='textarea' rows={5} spellCheck={false}
            onChange={updateQuery}
            value={query} />
        </Form.Group>
      </Form>
    </Container>
  );
}

export default Visualize;

