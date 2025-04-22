
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Switch } from "@/components/ui/switch";
import { Button } from '@/components/ui/button';
import { Loader2, Settings, List } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface EntityType {
  type: string;
  label: string;
  priority: number;
}

interface EntityConfig {
  id: string;
  entity_type: string;
  is_enabled: boolean;
  sync_direction: 'to_qbo' | 'from_qbo' | 'bidirectional';
  sync_frequency_minutes: number;
  priority_level: number;
  batch_size: number;
  isLoading?: boolean;
}

interface QBOIntegrationEntitiesAccordionProps {
  entityTypes: EntityType[];
  entityConfigs: EntityConfig[];
  updateEntityConfig: (params: { configId: string; updates: Partial<EntityConfig> }) => void;
  isLoading: boolean;
}

const syncDirections = [
  { value: 'bidirectional', label: 'Bidirectional' },
  { value: 'to_qbo', label: 'Sync to QBO Only' },
  { value: 'from_qbo', label: 'Sync from QBO Only' },
];

const QBOIntegrationEntitiesAccordion: React.FC<QBOIntegrationEntitiesAccordionProps> = ({
  entityTypes,
  entityConfigs,
  updateEntityConfig,
  isLoading,
}) => {
  // Get config by entity type
  const getConfig = (entityType: string) => {
    return entityConfigs.find(ec => ec.entity_type === entityType);
  };

  return (
    <Accordion type="multiple" defaultValue={entityTypes.map(et => et.type)}>
      {entityTypes.map((entity) => {
        const config = getConfig(entity.type);
        return (
          <AccordionItem value={entity.type} key={entity.type} className="border rounded-md mb-2">
            <AccordionTrigger className="flex justify-between items-center">
              <span className="font-semibold">{entity.label}</span>
              <div className="flex items-center space-x-4">
                {isLoading || config?.isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                  <Switch 
                    checked={config?.is_enabled ?? false}
                    onCheckedChange={(checked) => {
                      if (!config) return;
                      updateEntityConfig({ configId: config.id, updates: { is_enabled: checked } });
                    }}
                    aria-label={`Toggle sync enable for ${entity.label}`}
                  />
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {!config ? (
                <p className="text-sm text-muted-foreground">Loading configuration...</p>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`syncDirection-${entity.type}`} className="mb-1 block text-sm font-medium">Sync Direction</Label>
                    <select
                      id={`syncDirection-${entity.type}`}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      value={config.sync_direction}
                      onChange={(e) => {
                        updateEntityConfig({ configId: config.id, updates: { sync_direction: e.target.value as any } });
                      }}
                      aria-label={`Set sync direction for ${entity.label}`}
                    >
                      {syncDirections.map(dir => (
                        <option key={dir.value} value={dir.value}>{dir.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`frequency-${entity.type}`} className="mb-1 block text-sm font-medium">Sync Frequency (minutes)</Label>
                      <input
                        id={`frequency-${entity.type}`}
                        type="number"
                        min={5}
                        max={1440}
                        value={config.sync_frequency_minutes}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!config || isNaN(val)) return;
                          updateEntityConfig({ configId: config.id, updates: { sync_frequency_minutes: val } });
                        }}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        aria-label={`Set sync frequency in minutes for ${entity.label}`}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`batchSize-${entity.type}`} className="mb-1 block text-sm font-medium">Batch Size</Label>
                      <input
                        id={`batchSize-${entity.type}`}
                        type="number"
                        min={1}
                        max={100}
                        value={config.batch_size}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!config || isNaN(val)) return;
                          updateEntityConfig({ configId: config.id, updates: { batch_size: val } });
                        }}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        aria-label={`Set batch size for ${entity.label}`}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`priorityLevel-${entity.type}`} className="mb-1 block text-sm font-medium">Priority Level</Label>
                      <input
                        id={`priorityLevel-${entity.type}`}
                        type="number"
                        min={1}
                        max={10}
                        value={config.priority_level}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!config || isNaN(val)) return;
                          updateEntityConfig({ configId: config.id, updates: { priority_level: val } });
                        }}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        aria-label={`Set priority level for ${entity.label}`}
                      />
                    </div>
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default QBOIntegrationEntitiesAccordion;
