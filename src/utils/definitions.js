import iso from 'iso-3166-1';

export const URL_PREFIX = 'http://131.181.190.87:3000';

let isoCountries = { 
  'Congo (Brazzaville)': 'CG',
  'Congo (Kinshasa)': 'CD',
  'Iran': 'IR',
  'Ivory Coast': 'CI',
  'Kosovo': 'XK',
  'Laos': 'LA',
  'Moldova': 'MD',
  'Palestinian Territories': 'PS',
  'Russia': 'RU',
  'South Korea': 'KR',
  'Taiwan': 'TW',
  'Tanzania': 'TZ',
  'United Kingdom': 'GB',
  'United States': 'US',
  'Venezuela': 'VE',
  'Vietnam': 'VN'
};

export const getCountryCode = (name) => {
  if (name === 'Macedonia' || name === 'North Macedonia') {
    return 'MK';
  }

  let entry = iso.whereCountry(name);
  return entry ? entry.alpha2 : isoCountries[name];
};

