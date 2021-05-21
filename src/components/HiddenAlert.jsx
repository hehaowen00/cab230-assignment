import React from 'react';
import { Alert } from 'react-bootstrap-v5';

export default function HiddenAlert({ alert }) {
  return (
    alert !== undefined &&
    <Alert variant={alert.type}>
      {alert.msg}
    </Alert>
  )
}
