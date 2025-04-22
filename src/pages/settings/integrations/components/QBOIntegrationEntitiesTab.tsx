
import React from "react";
import QBOIntegrationEntitiesAccordion from "./QBOIntegrationEntitiesAccordion";

export const QBOIntegrationEntitiesTab = ({
  entityTypes,
  entityConfigs,
  updateEntityConfig,
  isLoading
}: any) => (
  <QBOIntegrationEntitiesAccordion
    entityTypes={entityTypes}
    entityConfigs={entityConfigs}
    updateEntityConfig={updateEntityConfig}
    isLoading={isLoading}
  />
);
