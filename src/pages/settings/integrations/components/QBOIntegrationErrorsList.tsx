
import React from 'react';
// ...import Badge, Button, toast, etc.
const QBOIntegrationErrorsList = ({
  errors,
  resolveError,
  isLoading
}: {
  errors: any[];
  resolveError: Function;
  isLoading: boolean;
}) => {
  if (isLoading) return <div>Loading...</div>;
  // ...render error list UI as in the main file
  return <div>{errors.length ? 'Show errors...' : 'No errors'}</div>
};
export default QBOIntegrationErrorsList;
