import { createResource } from './resource';
import {
  MODULE_CONFIGS,
  seedAccountGroups,
  seedFinancialTargets,
  seedGlWriteoffEntries,
  seedModuleData,
  seedReconciliationItems,
} from '../data';
import type {
  AccountGroup,
  FinancialTarget,
  GlWriteoffEntry,
  ModuleKey,
  ReconciliationItem,
  Row,
} from '../types';

export const MODULE_KEYS = Object.keys(MODULE_CONFIGS) as ModuleKey[];

export const accountGroupApi = createResource<AccountGroup>('account-groups', seedAccountGroups);
export const financialTargetApi = createResource<FinancialTarget>('financial-targets', seedFinancialTargets);
export const glWriteoffApi = createResource<GlWriteoffEntry>('gl-writeoff-entries', seedGlWriteoffEntries);
export const reconciliationApi = createResource<ReconciliationItem>('reconciliation-items', seedReconciliationItems);

const moduleResources = Object.fromEntries(
  MODULE_KEYS.map((key) => [key, createResource<Row>(`module-${key}`, () => seedModuleData()[key])]),
) as Record<ModuleKey, ReturnType<typeof createResource<Row>>>;

export const crudModuleApi = {
  list(module: ModuleKey): Promise<Row[]> {
    return moduleResources[module].list();
  },
  replace(module: ModuleKey, rows: Row[]): Promise<Row[]> {
    return moduleResources[module].replace(rows);
  },
};

export { ApiError } from './http';
