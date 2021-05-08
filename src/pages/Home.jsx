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
    <Container className='content-1'>
      <main className='flex-shrink-0'>
        <h4>World Happiness Rankings</h4>
        <p>Explore data from 2015 to 2020 on happiness in countries around the world</p>
      </main>
    </Container>
  );
}

export default Home;

