import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

function Home() {
  const fetchRankings = () => {
  };

  useEffect(async () => {
    const rankings = fetchRankings();
  }, []);

  return (
    <Container fluid className='content'>
    </Container>
  );
}

export default Home;

