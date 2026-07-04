export interface FinancialTarget {
  id: string;
  year: string;
  dept: string;
  subDept: string;
  accountCode: string;
  monthlyAmounts: number[];
}

export interface AccountGroup {
  id: string;
  code: string;
  nameTH: string;
  nameEN: string;
  allowEdit: boolean;
  carryForward: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type ModuleKey =
  | 'reports'
  | 'report-lines'
  | 'link-account-groups'
  | 'link-report-lines';

export type SidebarKey =
  | 'home'
  | 'reconciliation'
  | 'gl-writeoff-create'
  | 'gl-writeoff-list'
  | ModuleKey
  | 'account-group'
  | 'financial-target'
  | 'settings'
  | 'logout';

export type View =
  | { name: 'home' }
  | { name: 'settings' }
  | { name: 'reconciliation' }
  | { name: 'reconciliation-detail'; id: string }
  | { name: 'gl-writeoff-create' }
  | { name: 'gl-writeoff-form' }
  | { name: 'gl-writeoff-list' }
  | { name: 'module'; module: ModuleKey }
  | { name: 'account-group-list' }
  | { name: 'financial-target-list' }
  | { name: 'financial-target-form'; mode: 'add' }
  | { name: 'financial-target-form'; mode: 'edit'; id: string }
  | { name: 'financial-target-view'; id: string };

export type GlWriteoffStatus = 'ระหว่างดำเนินการ' | 'หยุดชั่วคราว' | 'ยกเลิก' | 'จ่ายครบแล้ว';

export interface GlWriteoffLine {
  id: string;
  dept: string;
  accountCode: string;
  cvCode: string;
  amount: number;
}

export interface GlWriteoffEntry {
  id: string;
  code: string;
  company: string;
  dept: string;
  subDept: string;
  docType: string;
  docNo: string;
  category: string;
  description: string;
  totalAmount: number;
  installments: number;
  installmentsPaid: number;
  startPeriod: string;
  startDate: string;
  createdBy: string;
  createdAt: string;
  status: GlWriteoffStatus;
  debitLines: GlWriteoffLine[];
  creditLines: GlWriteoffLine[];
  files: string[];
}

export type ReconciliationStatus = 'pass' | 'fail' | 'checking';

export interface ReconciliationItem {
  id: string;
  name: string;
  category: string;
  matchedReport: string;
  lastChecked: string;
  status: ReconciliationStatus;
}

export interface CrudField {
  key: string;
  label: string;
  type: 'text' | 'select';
  options?: string[];
  required?: boolean;
}

export interface CrudModuleConfig {
  key: ModuleKey;
  title: string;
  addLabel: string;
  searchPlaceholder: string;
  fields: CrudField[];
}

export type Row = { id: string } & Record<string, string>;
