export function UserLogin(email) {
  return { type: 'user', sub: 'userLogin', payload: email };
}

