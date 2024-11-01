import { EntryItem } from './entryItem';

export class Invoice {
    invoiceNumber?: string;
    invoiceDate?: Date;
    dueDate?: Date;
    customer?: string;
    entryItem?: EntryItem[];
    user?: string;
    netAmountSum?: number;
    grossSum?: number;
}

export class MonthToSorted {
    month?: string;
    monthNumber?: string;
}
