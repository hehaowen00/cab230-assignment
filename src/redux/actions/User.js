export function LoginAction(email) {
  return { type: 'user', sub: 'userLogin', payload: email };
}

export function LogoutAction() {
  return { type: 'user', sub: 'userLogout' };
}

export function RedirectAction(path) {
  return { type: 'user', sub: 'setRedirect', payload: path };
}

export function ClearRedirectAction() {
  return { type: 'user', sub: 'clearRedirect' };
}

