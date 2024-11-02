import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BackendJSONResponse, environment } from '@invoice2-team/shared';
import { Observable, throwError } from 'rxjs';
import { Invoice } from '../models/invoice';
import { EntryItem } from '../models/entryItem';
import { catchError } from 'rxjs/operators';
import mongoose from 'mongoose';

@Injectable({
    providedIn: 'root'
})
export class InvoicesService {
    apiURLInvoices = environment.apiURL + 'invoices';
    apiURLItems = 'entryitem';

    constructor(
        private http: HttpClient,
    ) {}
    getInvoices(userId: string): Observable<Invoice[]> {
        return this.http.get<Invoice[]>(`${this.apiURLInvoices}/foruser/${userId}`);
    }
    getInvoice(invoiceId: string): Observable<Invoice> {
        return this.http.get<Invoice>(`${this.apiURLInvoices}/${invoiceId}`);
    }
    updateInvoice(invoice: Invoice, invoiceId: string) {
        return this.http.put<Invoice>(`${this.apiURLInvoices}/${invoiceId}`, invoice);
    }
    addInvoice(invoice: Invoice) {
        return this.http.post<Invoice>(`${this.apiURLInvoices}`, invoice);
    }
    updateEntryItem(items: EntryItem[]) {
        items.map((item) => {
            if (item._id) {
                this.http.put<EntryItem>(`${this.apiURLInvoices}/${this.apiURLItems}/${item._id}`, item).subscribe();
            } else {
                this.http.post<EntryItem>(`${this.apiURLInvoices}/${this.apiURLItems}`, item).subscribe();
            }
        });
    }
    deleteEntryItem(itemId: string) {
        return this.http.delete<EntryItem>(`${this.apiURLInvoices}/${this.apiURLItems}/${itemId}`);
    }
    deleteInvoice(invoiceId: string) {
        return this.http.delete<Invoice>(`${this.apiURLInvoices}/${invoiceId}`);
    }
    getNumberOfInvoices() {
        return this.http.get<{ invoicesCount: number }>(`${this.apiURLInvoices}/get/invoicesNumber`);
    }
    //Statistics
    getMonthlyGrossSums(userID: string): Observable<Record<number, number>> {
        // Sprawdź, czy przekazano prawidłowy identyfikator użytkownika
        if (!mongoose.Types.ObjectId.isValid(userID)) {
            // Możesz obsłużyć błąd tutaj lub w inny sposób
            console.error('Nieprawidłowy identyfikator użytkownika');
            return throwError('Invalid user ID format.');
        }

        // Wyślij żądanie z dodanym identyfikatorem użytkownika w ścieżce URL
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
            // Tutaj możesz dodać inne nagłówki, jeśli są potrzebne
        });

        return this.http.get<Record<number, number>>(`${this.apiURLInvoices}/statistics/${userID}`, { headers }).pipe(
            catchError((error: BackendJSONResponse) => {
                console.error('Błąd w żądaniu getMonthlyGrossSums:', error);
                return throwError('Wystąpił błąd w żądaniu getMonthlyGrossSums.');
            })
        );
    }

    getYearlyGrossSums(userID: string): Observable<Record<number, number>> {
        // Sprawdź, czy przekazano prawidłowy identyfikator użytkownika
        if (!mongoose.Types.ObjectId.isValid(userID)) {
            // Możesz obsłużyć błąd tutaj lub w inny sposób
            console.error('Nieprawidłowy identyfikator użytkownika');
            return throwError('Invalid user ID format.');
        }

        // Wyślij żądanie z dodanym identyfikatorem użytkownika w ścieżce URL
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
            // Tutaj możesz dodać inne nagłówki, jeśli są potrzebne
        });

        return this.http.get<Record<number, number>>(`${this.apiURLInvoices}/statistics/${userID}`, { headers }).pipe(
            catchError((error: BackendJSONResponse) => {
                console.error('Błąd w żądaniu getYearlyGrossSums:', error);
                return throwError('Wystąpił błąd w żądaniu getYearlyGrossSums.');
            })
        );
    }
}
