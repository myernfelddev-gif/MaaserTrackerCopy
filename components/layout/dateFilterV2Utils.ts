import { DateFilterMode, DateFilterPreset, DateFilterUIState, ResolvedDateRange } from '../../types/dateFilterV2';

export const hebrewMonths = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
];

export function getHebrewMonthName(month: number): string {
  if (month < 1 || month > 12) return '';
  return hebrewMonths[month - 1];
}

export function formatPresetSubtitle(preset: DateFilterPreset, now: Date): string {
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  switch (preset) {
    case 'CURRENT_MONTH':
      return `החודש (${getHebrewMonthName(currentMonth)} ${currentYear})`;
    case 'PREVIOUS_MONTH': {
      const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return `חודש שעבר (${getHebrewMonthName(prevDate.getMonth() + 1)} ${prevDate.getFullYear()})`;
    }
    case 'CURRENT_YEAR':
      return `השנה (${currentYear})`;
    case 'PREVIOUS_YEAR':
      return `שנה שעברה (${currentYear - 1})`;
    default:
      return '';
  }
}

export function formatManualSubtitle(ui: DateFilterUIState, now: Date): string {
  switch (ui.mode) {
    case 'ALL':
      return "ללא סינון";
    case 'YEAR':
      return `שנת ${ui.year || now.getFullYear()}`;
    case 'MONTH':
      return `${getHebrewMonthName(ui.month || now.getMonth() + 1)} ${ui.year || now.getFullYear()}`;
    case 'RANGE':
      if (ui.startDate && ui.endDate) {
        return `${ui.startDate} - ${ui.endDate}`;
      }
      return "טווח חופשי";
    default:
      return '';
  }
}

export function resolveDateRange(ui: DateFilterUIState): ResolvedDateRange {
  const now = new Date();
  let start: Date;
  let end: Date;

  if (ui.preset) {
    switch (ui.preset) {
      case 'CURRENT_MONTH':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        break;
      case 'PREVIOUS_MONTH':
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
        break;
      case 'CURRENT_YEAR':
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        break;
      case 'PREVIOUS_YEAR':
        start = new Date(now.getFullYear() - 1, 0, 1);
        end = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
        break;
      default:
        start = new Date(0);
        end = now;
    }
  } else {
    switch (ui.mode) {
      case 'ALL':
        start = new Date('1990-01-01');
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        break;
      case 'YEAR':
        const year = ui.year || now.getFullYear();
        start = new Date(year, 0, 1);
        end = new Date(year, 11, 31, 23, 59, 59, 999);
        break;
      case 'MONTH':
        const mYear = ui.year || now.getFullYear();
        const mMonth = (ui.month || now.getMonth() + 1) - 1;
        start = new Date(mYear, mMonth, 1);
        end = new Date(mYear, mMonth + 1, 0, 23, 59, 59, 999);
        break;
      case 'RANGE':
        start = ui.startDate ? new Date(ui.startDate) : new Date(0);
        end = ui.endDate ? new Date(ui.endDate) : now;
        end.setHours(23, 59, 59, 999);
        break;
      default:
        start = new Date(0);
        end = now;
    }
  }

  return {
    resolvedStartDate: start.toISOString(),
    resolvedEndDate: end.toISOString(),
  };
}

export interface DateFilterPresentation {
  pillTitle: string;
  pillSubtitle: string;
  modalActiveMode: DateFilterMode;
  modalActivePreset?: DateFilterPreset;
}

export function getDateFilterPresentation(ui: DateFilterUIState, now: Date): DateFilterPresentation {
  return {
    pillTitle: "טווח תאריכים (חדש)",
    pillSubtitle: ui.preset 
      ? formatPresetSubtitle(ui.preset, now) 
      : formatManualSubtitle(ui, now),
    modalActiveMode: ui.mode,
    modalActivePreset: ui.preset
  };
}
