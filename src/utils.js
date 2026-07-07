export function formatThaiTimestamp(d) {
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear() + 543;
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hh}:${mm}`;
}

export function formatDateTime(d) {
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hh}:${mm}`;
}

export function formatDateCompact(d) {
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${year}${month}${day}`;
}

const THAI_BE_MONTHS_PER_YEAR = 12;

// แต่ละงวด (ยกเว้นงวดที่ 1) ต้องเป็นจำนวนเต็มบาทไม่มีทศนิยม เศษที่หารไม่ลงตัวจะถูกทบไปรวมที่งวดที่ 1
export function buildGlWriteoffSchedule(totalAmount, installments, startPeriod) {
  if (totalAmount <= 0 || installments <= 0 || !startPeriod) return [];
  const per = Math.floor(totalAmount / installments);
  const first = Math.round((totalAmount - per * (installments - 1)) * 100) / 100;
  const [startMonth, startYear] = startPeriod.split('/').map((v) => parseInt(v, 10));
  return Array.from({ length: installments }, (_, i) => {
    const monthIndex = startMonth - 1 + i;
    const month = (monthIndex % THAI_BE_MONTHS_PER_YEAR) + 1;
    const year = startYear + Math.floor(monthIndex / THAI_BE_MONTHS_PER_YEAR);
    return {
      seq: i + 1,
      date: `25/${String(month).padStart(2, '0')}/${year}`,
      amount: i === 0 ? first : per,
    };
  });
}

// ยอดตัดบัญชีต่อเดือน (งวดที่ 2 เป็นต้นไป) ใช้เป็นยอดบัญชีเดบิต/เครดิตของรายการ ต้องเป็นจำนวนเต็มบาท
export function glWriteoffPerPeriodAmount(totalAmount, installments) {
  if (totalAmount <= 0 || installments <= 0) return 0;
  return Math.floor(totalAmount / installments);
}

export function formatWholeAmount(n) {
  return Math.round(n).toLocaleString('en-US');
}

export function nextGlWriteoffCode(existing) {
  const maxCode = existing.reduce((max, e) => {
    const n = parseInt(e.code.split('-').pop() ?? '0', 10);
    return Number.isNaN(n) ? max : Math.max(max, n);
  }, 0);
  return `RCE-26062526-${String(maxCode + 1).padStart(4, '0')}`;
}

/** Splits raw CSV text into rows of trimmed cell strings, handling quoted fields (with embedded commas/newlines) and "" escapes. */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  const content = text.replace(/^﻿/, '');

  function endField() {
    row.push(field);
    field = '';
  }
  function endRow() {
    endField();
    rows.push(row);
    row = [];
  }

  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    if (inQuotes) {
      if (ch === '"') {
        if (content[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      endField();
    } else if (ch === '\n') {
      endRow();
    } else if (ch === '\r') {
      // consume, handled with the following \n (or bare \r as a line end)
      if (content[i + 1] !== '\n') endRow();
    } else {
      field += ch;
    }
  }
  if (field.length > 0 || row.length > 0) endRow();

  return rows.filter((r) => r.some((cell) => cell.trim() !== ''));
}
