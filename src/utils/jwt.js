export function getJWT() {
  let json = localStorage.getItem('jwt');

  if (json === null || json === undefined) {
    return {
      type: 'error',
      message: 'entry not found'
    };
  }

  let { email, token, expires } = JSON.parse(json);

  if (new Date(expires).getTime() <= new Date()) {
    localStorage.removeItem('jwt');

    return {
      type: 'error',
      message: 'jwt has expired'
    };
  }

  return {
    type: 'success',
    email,
    token,
    expires
  };
}

export function storeJWT(data) {
  localStorage.setItem('jwt', JSON.stringify(data));
}

export function deleteJWT() {
  console.log('delete JWT');
  localStorage.removeItem('jwt');
}
