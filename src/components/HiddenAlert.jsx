import React from 'react';
import { Alert } from 'react-bootstrap';

export const EMPTY = { type: '', msg: '' };

export default function AutoAlert({ alert, set }) {
  return (
    alert.type !== '' &&
    <Alert dismissible variant={alert.type}
      onClose={() => set(EMPTY)}>
      {alert.msg}
    </Alert>
  )
}
