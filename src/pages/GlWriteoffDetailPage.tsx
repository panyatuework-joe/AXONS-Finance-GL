import { useMemo, useState } from 'react';
import type { GlWriteoffEntry, GlWriteoffLine } from '../types';
import { useApp } from '../context/AppContext';
import Dialog from '../components/Dialog';
import StatusBadge from '../components/StatusBadge';
import { buildGlWriteoffSchedule, formatWholeAmount, glWriteoffPerPeriodAmount } from '../utils';
import { ChevronBreadcrumbIcon, DeleteIcon } from '../icons';

interface Props {
  entry: GlWriteoffEntry;
  onBack: () => void;
  onDelete: () => void;
}

function formatMoney(n: number): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function GlWriteoffDetailPage({ entry, onBack, onDelete }: Props) {
  const { t } = useApp();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteSuccessOpen, setDeleteSuccessOpen] = useState(false);

  const schedule = useMemo(
    () => buildGlWriteoffSchedule(entry.totalAmount, entry.installments, entry.startPeriod),
    [entry.totalAmount, entry.installments, entry.startPeriod],
  );

  // ยอดบัญชีเดบิต/เครดิตล็อกตามยอดตัดบัญชีต่อเดือน (งวดที่ 2 เป็นต้นไป) เสมอ ไม่อิงค่าที่บันทึกไว้ในบรรทัด
  const perPeriodAmount = glWriteoffPerPeriodAmount(entry.totalAmount, entry.installments);

  function handleConfirmDelete() {
    setDeleteConfirmOpen(false);
    setDeleteSuccessOpen(true);
  }

  function handleDeleteSuccessClose() {
    setDeleteSuccessOpen(false);
    onDelete();
    onBack();
  }

  function renderLineTable(lines: GlWriteoffLine[]) {
    return (
      <div className="glw-line-table-wrapper">
        <table className="glw-line-table">
          <colgroup>
            <col style={{ width: '48px' }} />
            <col style={{ width: '220px' }} />
            <col style={{ width: '180px' }} />
            <col style={{ width: '260px' }} />
            <col style={{ width: '200px' }} />
          </colgroup>
          <thead>
            <tr>
              <th></th>
              <th>{t('ฝ่าย (UL)')}</th>
              <th>{t('รหัสบัญชี')}</th>
              <th>{t('รหัส CV')}</th>
              <th className="glw-col-amount">{t('จำนวนเงิน')}</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line, i) => (
              <tr key={line.id}>
                <td>{i + 1}</td>
                <td>{t(line.dept)}</td>
                <td>{t(line.accountCode)}</td>
                <td>{t(line.cvCode)}</td>
                <td className="glw-col-amount">{formatWholeAmount(perPeriodAmount)} THB</td>
              </tr>
            ))}
            <tr className="glw-total-row">
              <td colSpan={4} className="glw-total-label">
                {t('ยอดรวม')}
              </td>
              <td className="glw-col-amount glw-total-amount">{formatWholeAmount(perPeriodAmount)} THB</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <>
      <div className="aft-page-header">
        <div className="aft-breadcrumb">
          <span className="aft-breadcrumb-link" onClick={onBack}>
            {t('สร้างรายการตัดบัญชี')}
          </span>
          <ChevronBreadcrumbIcon />
          <span className="aft-breadcrumb-current">{t('รายละเอียดรายการตัดบัญชี')}</span>
        </div>
        <div className="view-title-row">
          <h1 className="aft-page-title">{t('รายละเอียดรายการตัดบัญชี')}</h1>
          <div className="view-header-actions">
            <button className="ft-btn-outline-danger" onClick={() => setDeleteConfirmOpen(true)}>
              <DeleteIcon color="#D92D20" />
              {t('ลบ')}
            </button>
          </div>
        </div>
      </div>

      <div className="aft-card">
        <div className="aft-section-title">{t('รายละเอียด')}</div>

        <div className="view-detail-grid">
          <div className="view-detail-field">
            <span className="view-detail-label">{t('รหัสรายการตัดบัญชี')}</span>
            <span className="view-detail-value">{entry.code}</span>
          </div>
          <div className="view-detail-field">
            <span className="view-detail-label">{t('บริษัท')}</span>
            <span className="view-detail-value">{t(entry.company)}</span>
          </div>
          <div className="view-detail-field">
            <span className="view-detail-label">{t('หน่วยงานหลัก')}</span>
            <span className="view-detail-value">{t(entry.dept)}</span>
          </div>
          <div className="view-detail-field">
            <span className="view-detail-label">{t('หน่วยงานย่อย')}</span>
            <span className="view-detail-value">{t(entry.subDept)}</span>
          </div>
          <div className="view-detail-field">
            <span className="view-detail-label">{t('ประเภทเอกสารอ้างอิง')}</span>
            <span className="view-detail-value">{t(entry.docType)}</span>
          </div>
          <div className="view-detail-field">
            <span className="view-detail-label">{t('เลขที่เอกสารอ้างอิง')}</span>
            <span className="view-detail-value">{entry.docNo}</span>
          </div>
          <div className="view-detail-field">
            <span className="view-detail-label">{t('ประเภท')}</span>
            <span className="view-detail-value">{t(entry.category)}</span>
          </div>
          <div className="view-detail-field">
            <span className="view-detail-label">{t('รายละเอียด')}</span>
            <span className="view-detail-value">{t(entry.description)}</span>
          </div>
          <div className="view-detail-field">
            <span className="view-detail-label">{t('ยอดเงินรวมทั้งสัญญา')}</span>
            <span className="view-detail-value">{formatMoney(entry.totalAmount)} THB</span>
          </div>
          <div className="view-detail-field">
            <span className="view-detail-label">{t('ความคืบหน้า')}</span>
            <span className="view-detail-value">
              {entry.installmentsPaid}/{entry.installments} {t('งวด')}
            </span>
          </div>
          <div className="view-detail-field">
            <span className="view-detail-label">{t('วันที่เริ่มตัดบัญชี')}</span>
            <span className="view-detail-value">{entry.startDate}</span>
          </div>
          <div className="view-detail-field">
            <span className="view-detail-label">{t('ผู้สร้าง')}</span>
            <span className="view-detail-value">{entry.createdBy}</span>
          </div>
          <div className="view-detail-field">
            <span className="view-detail-label">{t('วันที่สร้าง')}</span>
            <span className="view-detail-value">{entry.createdAt}</span>
          </div>
          <div className="view-detail-field">
            <span className="view-detail-label">{t('สถานะ')}</span>
            <span>
              <StatusBadge value={entry.status} />
            </span>
          </div>
        </div>

        <div className="aft-divider" />

        <div className="aft-section-title">{t('ไฟล์แนบ')}</div>
        {entry.files.length === 0 ? (
          <span className="glw-file-empty">{t('ไม่มีไฟล์แนบ')}</span>
        ) : (
          <div>
            {entry.files.map((name, i) => (
              <span className="glw-file-chip" key={`${name}-${i}`}>
                {name}
              </span>
            ))}
          </div>
        )}

        <div className="aft-divider" />

        <div className="aft-section-title">{t('ข้อมูลบัญชีเดบิต')}</div>
        {renderLineTable(entry.debitLines)}

        <div className="aft-section-title">{t('ข้อมูลบัญชีเครดิต')}</div>
        {renderLineTable(entry.creditLines)}

        <div className="aft-divider" />

        <div className="aft-section-title">{t('รายละเอียดการตัดบัญชีรายงวด')}</div>
        <div className="glw-line-table-wrapper">
          <table className="glw-line-table glw-schedule-table">
            <colgroup>
              <col style={{ width: '160px' }} />
              <col />
              <col style={{ width: '240px' }} />
              <col style={{ width: '160px' }} />
            </colgroup>
            <thead>
              <tr>
                <th>{t('งวดที่')}</th>
                <th>{t('เดือน')}</th>
                <th className="glw-col-amount">{t('จำนวนเงินต่องวด (THB)')}</th>
                <th>{t('สถานะ')}</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row) => (
                <tr key={row.seq}>
                  <td>
                    {row.seq}/{schedule.length}
                  </td>
                  <td>{row.date}</td>
                  <td className="glw-col-amount">{formatMoney(row.amount)} THB</td>
                  <td>
                    {row.seq <= entry.installmentsPaid ? (
                      <span className="status-badge status-badge--ok">{t('จ่ายแล้ว')}</span>
                    ) : (
                      <span className="status-badge status-badge--neutral">{t('รอตัดบัญชี')}</span>
                    )}
                  </td>
                </tr>
              ))}
              <tr className="glw-total-row">
                <td className="glw-total-label" colSpan={2}>
                  {t('ยอดรวม')}
                </td>
                <td className="glw-col-amount glw-total-amount">{formatMoney(entry.totalAmount)} THB</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Dialog
        open={deleteConfirmOpen}
        variant="delete"
        title={t('คุณต้องการลบรายการตัดบัญชีนี้ใช่ไหม?')}
        message={t('หากลบแล้ว จะไม่สามารถเรียกคืนได้อีก')}
        onClose={() => setDeleteConfirmOpen(false)}
        actions={[
          { label: t('ยกเลิก'), variant: 'outline', onClick: () => setDeleteConfirmOpen(false) },
          { label: t('ลบ'), variant: 'danger', onClick: handleConfirmDelete },
        ]}
      />

      <Dialog
        open={deleteSuccessOpen}
        variant="success"
        title={t('ลบรายการตัดบัญชีสำเร็จ!')}
        autoCloseMs={3000}
        onClose={handleDeleteSuccessClose}
      />
    </>
  );
}
