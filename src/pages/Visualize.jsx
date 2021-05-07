import React, { useState } from 'react';
import { RANKINGS_URL, FACTORS_URL } from '../util';

const exampleQuery =
  `plot year, economy
where
  year between 2016, 2020
as
  lineplot
`;

function Visualize() {
  const [query, setQuery] = useState(exampleQuery);

  const updateQuery = (e) => {
    setQuery(e.target.value);
  }

  return (
    <div>

    </div>
  );
}

export default Visualize;

