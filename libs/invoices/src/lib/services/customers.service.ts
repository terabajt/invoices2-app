import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer';
import { environment } from '@invoice2-team/shared';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    apiURLCustomer = environment.apiURL + 'customers';

    constructor(private http: HttpClient) {}

    getCustomers(userId: string): Observable<Customer[]> {
        return this.http.get<Customer[]>(`${this.apiURLCustomer}/foruser/${userId}`);
    }
    getCustomer(customerId: string) {
        return this.http.get<Customer>(`${this.apiURLCustomer}/${customerId}`);
    }
    updateCustomer(customer: Customer) {
        return this.http.put<Customer>(`${this.apiURLCustomer}/${customer._id}`, customer);
    }
    addCustomer(customer: Customer) {
        return this.http.post<Customer>(`${this.apiURLCustomer}`, customer);
    }
    deleteCustomer(customerId: string) {
        return this.http.delete(`${this.apiURLCustomer}/${customerId}`);
    }
}
