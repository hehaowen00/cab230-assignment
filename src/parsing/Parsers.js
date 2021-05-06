// (plot/select) [field 1], [field 2], [field n] ...
// where
//   x matches '' // regex
//   (or | and),
//   x between a, b
//   x < a
//   x > b
//   x = c
//   x in []
//   x between [a, b] // a must always be less than b
//   count = n
// as
//   lineplot,
//   barplot,
//   scatterplot
//   worldmap

// x can be any field
// eg.
// plot year, economy
// where
//   country in 'Australia', 'China'
//   year between 2018, 2019
// as
//   lineplot

// first field will always be x axis
// for map plots, multiple years given results in multiple plots
// select shows the data in tables
// disables the use of as

/*
plot ['year', 'economy', 'family']
where
  country = 'Japan'
  year between 2016, 2020
as
  lineplot
*/
