import React from 'react';
import { Alert } from 'react-bootstrap-v5';

export const EMPTY = { type: '', msg: '' };

export default function AutoAlert({ alert, set }) {
  return (
    alert.type !== '' &&
    <Alert variant={alert.type}
      onClose={() => set(EMPTY)}>
      {alert.msg}
    </Alert>
  )
}
