export function getJWT() {
  let json = localStorage.getItem('jwt');

  if (json === null || json === undefined) {
    return {
      type: 'error',
      message: 'entry not found'
    };
  }

  let { email, token, expires } = JSON.parse(json);

  if (new Date(expires) <= new Date()) {
    return {
      type: 'error',
      message: 'jwt has expired'
    };
  }

  return {
    type: 'success',
    email,
    token
  };
}

export function storeJWT(email, token, expires) {
  localStorage.setItem('jwt', JSON.stringify({ email, token, expires }));
}
