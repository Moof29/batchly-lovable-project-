
import React from "react";
import QBOIntegrationErrorsList from "./QBOIntegrationErrorsList";

export const QBOIntegrationErrorsTab = ({
  errors,
  resolveError,
  isLoading
}: any) => (
  <QBOIntegrationErrorsList
    errors={errors}
    resolveError={resolveError}
    isLoading={isLoading}
  />
);
