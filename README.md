# invoices2

A better version full stack app MEAN of the invoicing application. This project is a full-stack invoicing application built using the MEAN stack (MongoDB, Express.js, Angular, Node.js). The application allows users to manage their invoices efficiently, including the ability to scan expense invoices, automatically extract relevant data, and generate summary reports. Additionally, it provides a dedicated panel for accountants to manage their clients' financial data.

This expanded description provides a comprehensive overview of the invoicing application, including its key features, technology stack, installation instructions, usage guidelines, contribution process, and licensing information.

# Live Demo

You can try out the application at the following URL:
[https://invoices2.ewebpartner.pl/](https://invoices2.ewebpartner.pl/)

# Assumptions

The application is used to issue invoices online.

## Key Features

1. **Invoice Management:**

   - Create, read, update, and delete invoices.
   - Categorize invoices as sales or expenses.

2. **Expense Invoice Scanning:**

   - Users can scan expense invoices using their device's camera or upload scanned images/PDFs.
   - The system uses OCR (Optical Character Recognition) to extract data such as company name, taxes, and invoice values.

3. **Data Extraction:**

   - Automatically extract and categorize data from scanned invoices.
   - Extracted fields include: Company Name, Tax Amount, Invoice Value, Date, and Invoice Number.

4. **Summary Report Generation:**

   - Generate a summary report of all scanned expense invoices.
   - Export the report in JPK format.
   - Share the report with accountants via email or download it.

5. **Accountant Panel:**
   - Accountants can log in using their credentials.
   - Manage multiple clients.
   - View both sales and expense invoices for each client.
   - Generate and export financial reports for each client.

## Technology Stack

- **MongoDB:** NoSQL database for storing invoice data.
- **Express.js:** Backend framework for building REST APIs.
- **Angular:** Frontend framework for building a dynamic user interface.
- **Node.js:** JavaScript runtime for server-side development.

## Installation

1. Clone the repository:

```bash
  git clone https://github.com/terabajt/invoices2.git
```

2. Navigate to the project directory:

```bash
   cd invoices2
```

3. Install the dependencies:

```bash
   npm install
```

## Running the Project Locally

1. Build the project

```bash
  npx nx run apps/invoice2:build
```

2. Serve the project:

```bash
   npx nx run apps/invoice2:serve
```

3. Open your browser and navigate to http://localhost:4200

# Server run:

Before run server please add your server/.env file like: <br />
`API_URL = ''` <br />
`CONNECTION_STRING = '' ` <br />
`PORT = '' `<br />
`SECRET = ''`

## Key Features

1. **Invoice Management:**

   - Create, read, update, and delete invoices.
   - Categorize invoices as sales or expenses.

2. **Expense Invoice Scanning:**

   - Users can scan expense invoices using their device's camera or upload scanned images/PDFs.
   - The system uses OCR (Optical Character Recognition) to extract data such as company name, taxes, and invoice values.

3. **Data Extraction:**

   - Automatically extract and categorize data from scanned invoices.
   - Extracted fields include: Company Name, Tax Amount, Invoice Value, Date, and Invoice Number.

4. **Summary Report Generation:**

   - Generate a summary report of all scanned expense invoices.
   - Export the report in JPK format.
   - Share the report with accountants via email or download it.

5. **Accountant Panel:**
   - Accountants can log in using their credentials.
   - Manage multiple clients.
   - View both sales and expense invoices for each client.
   - Generate and export financial reports for each client.

## Technology Stack

- **MongoDB:** NoSQL database for storing invoice data.
- **Express.js:** Backend framework for building RESTful APIs.
- **Angular:** Frontend framework for building a dynamic user interface.
- **Node.js:** JavaScript runtime for server-side development.

## Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/invoicing-app.git
   cd invoicing-app
   ```
2. **Install backend dependencies:**

   ```sh
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**

   ```sh
   cd ../frontend
   npm install
   ```

4. **Start the backend server:**

   ```sh
   cd ../backend
   npm start
   ```

5. **Start the frontend server:**

   ```sh
   cd ../frontend
   ng serve
   ```

6. **Access the application:**
   Open your browser and navigate to `http://localhost:4200`.

## Usage

1. **User Registration and Login:**

   - Register a new account or log in with existing credentials.

2. **Invoice Management:**

   - Navigate to the invoice management section to create, view, update, or delete invoices.

3. **Scan Expense Invoices:**

   - Use the scanning feature to upload or capture images of expense invoices.
   - Review and confirm the extracted data.

4. **Generate Reports:**

   - Navigate to the reports section to generate and export summary reports in JPK format.

5. **Accountant Panel:**
   - Accountants can log in to access their dedicated panel.
   - Manage clients and view their financial data.

## Application architecture

![Database schema](https://github.com/terabajt/invoices2/blob/main/Efaktury24.database.png)

## Project Repository

![Repository schema](https://github.com/terabajt/invoices2/blob/main/ProjectRepository.png)

# API Documentation

This API provides endpoints for managing users, customers, invoices, and activation.<br />

## Users <br />

Get User by ID <br />
`GET /api/v1/users/:id`<br />
Retrieve user details by providing the user ID.<br />

Register User<br />
`POST /api/v1/users/register`<br />
Register a new user with email, password, and other details.<br />

Login User<br />
`POST /api/v1/users/login`<br />
Authenticate a user by email and password.<br />

Update User<br />
`PUT /api/v1/users/:id`<br />
Update user details by providing the user ID.<br />

Delete User<br />
`DELETE /api/v1/users/:id`<br />
Delete a user by providing the user ID.<br />

Activation<br />
Activate User<br />
`GET /api/v1/activation?token=<activationToken>`<br />
Activate a user account by providing the activation token.<br />

## Customers

Get Customer by ID<br />
`GET /api/v1/customers/:id`<br />
Retrieve customer details by providing the customer ID.<br />

Get Customers for User<br />
`GET /api/v1/customers/foruser/:userId`<br />
Retrieve all customers associated with a specific user.<br />

Create Customer<br />
`POST /api/v1/customers/`
Create a new customer.<br />

Update Customer<br />
`PUT /api/v1/customers/:id`<br />
Update customer details by providing the customer ID.<br />

Delete Customer<br />
`DELETE /api/v1/customers/:id`<br />
Delete a customer by providing the customer ID.<br />

## Invoices

Get Invoice by ID<br />
`GET /api/v1/invoices/:id`<br />
Retrieve invoice details by providing the invoice ID.<br />

Get Invoices for User<br />
`GET /api/v1/invoices/foruser/:userID`<br />
Retrieve all invoices associated with a specific user.<br />

Create Invoice<br />
`POST /api/v1/invoices/`<br />
Create a new invoice.<br />

Update Invoice<br />
`PUT /api/v1/invoices/:id`<br />
Update invoice details by providing the invoice ID.<br />

Delete Invoice<br />
`DELETE /api/v1/invoices/:id`<br />
Delete an invoice by providing the invoice ID.<br />

## Get Number of Invoices<br />

`GET /api/v1/invoices/get/invoicesNumber`
Get the total number of invoices.<br />

## Entry Item Operations<br />

`POST /api/v1/invoices/entryitem`<br />
`PUT /api/v1/invoices/entryitem/:id`<br />
`DELETE /api/v1/invoices/entryitem/:id`<br />
Perform operations (create, update, delete) on entry items associated with invoices.<br />

## Statistics<br />

`GET /api/v1/invoices/statistics/:userID`<br />
Retrieve statistics for invoices associated with a specific user.<br />

# Authorization Documentation

This document provides an overview of the authorization mechanism implemented in the application, as well as details about the store used for managing user sessions.

## Authorization

The authorization mechanism is implemented using JSON Web Tokens (JWT) and the `express-jwt` middleware in the backend, and Angular route guards in the frontend.

### Backend Authorization

In the backend, the `authJwt()` function is used to generate middleware for authenticating HTTP requests. This middleware checks for a valid JWT in the Authorization header of incoming requests. The JWT secret is fetched from the environment variables, and the algorithm used for signing the tokens is HS256.

```javascript
const expressJwt = require("express-jwt");

function authJwt() {
  const secret = process.env.SECRET;
  const api = process.env.API_URL;

  return expressJwt({
    secret,
    algorithms: ["HS256"],
  }).unless({
    path: [`${api}/users/login`, `${api}/users/register`, /\/activation\/*/],
  });
}

module.exports = authJwt;
```

### Frontend Authorization

In the frontend, Angular route guards are utilized to secure routes based on the user's authentication status. The `AuthGuard` class implements the `CanActivate` interface to manage access to routes. It verifies the presence of a valid JWT token in the local storage and checks the user's authentication status before granting access to protected routes.

```typescript
@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private localStorageToken: LocalstorageService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    const token = this.localStorageToken.getToken();
    if (token) {
      const tokenDecode = JSON.parse(atob(token.split(".")[1]));
      //isAdmin check
      if (tokenDecode.isAdmin && this._tokenExpired(tokenDecode.exp)) {
        return true;
      }

      //user check
      if (this._tokenExpired(tokenDecode.exp)) {
        return true;
      }
    }

    this.router.navigate(["/login"]);
    return false;
  }
  private _tokenExpired(expiration: number): boolean {
    return Math.floor(new Date().getTime() / 1000) <= expiration;
  }
}
```

## Store

The store manages user sessions and authentication status in the frontend using NgRx, a reactive state management library for Angular applications.

```typescript
import {Injectable} from "@angular/core";
import {createReducer, on, Action} from "@ngrx/store";
import * as UsersActions from "./users.actions";
import {User} from "../models/user";

export const USERS_FEATURE_KEY = "users";
export interface UsersState {
  user: User | null;
  isAuthenticated: boolean;
}
export interface UsersPartialState {
  readonly [USERS_FEATURE_KEY]: UsersState;
}
export const initialUsersState: UsersState = {
  user: null,
  isAuthenticated: false,
};
const usersReducer = createReducer(
  initialUsersState,
  on(UsersActions.buildUserSession, (state) => ({...state})),
  on(UsersActions.buildUserSessionSuccess, (state, action) => ({
    ...state,
    user: action.user,
    isAuthenticated: true,
  })),
  on(UsersActions.buildUserSessionFailed, (state) => ({
    ...state,
    user: null,
    isAuthenticated: false,
  }))
);
export function reducer(state: UsersState | undefined, action: Action) {
  return usersReducer(state, action);
}
```

### Product Requirements Document (PRD)

#### Feature: Expense Management

**Objective:**
To enable users to scan expense invoices, automatically extract relevant data, and generate a summary report that can be shared with their accountant and exported in JPK format. Additionally, provide an accountant panel for managing clients' sales and expense invoices.

**Key Features:**

1. **Invoice Scanning:**

   - Users can scan expense invoices using their device's camera or upload a scanned image/PDF.
   - The system will use OCR (Optical Character Recognition) to extract data such as company name, taxes, and invoice values.

2. **Data Extraction:**

   - Automatically extract and categorize data from scanned invoices.
   - Fields to extract: Company Name, Tax Amount, Invoice Value, Date, and Invoice Number.

3. **Summary Report:**

   - Generate a summary report of all scanned expense invoices.
   - The report should be exportable in JPK format.
   - Users can share the report with their accountant via email or download it.

4. **Accountant Panel:**
   - Accountants can log in using their credentials.
   - Accountants can manage multiple clients.
   - View both sales and expense invoices for each client.
   - Generate and export reports for each client.

**User Stories:**

1. **As a user,** I want to scan my expense invoices so that I can keep track of my expenses.
2. **As a user,** I want the system to automatically extract data from my scanned invoices so that I don't have to enter it manually.
3. **As a user,** I want to generate a summary report of my expenses so that I can share it with my accountant.
4. **As a user,** I want to export my expense report in JPK format so that it complies with local regulations.
5. **As an accountant,** I want to log in to a dedicated panel so that I can manage my clients' invoices.
6. **As an accountant,** I want to view both sales and expense invoices for my clients so that I can have a complete overview of their financials.
7. **As an accountant,** I want to generate and export reports for my clients so that I can provide them with accurate financial statements.

**Technical Requirements:**

1. **OCR Integration:**

   - Integrate with an OCR service (e.g., Google Vision API, Tesseract) to extract data from scanned invoices.

2. **Database Schema:**

   - Update the database schema to store expense invoice data.
   - Create tables for storing scanned invoice images, extracted data, and user-accountant relationships.

3. **Frontend:**

   - Update the user interface to include options for scanning/uploading invoices.
   - Create a new section for generating and viewing expense reports.
   - Develop the accountant panel with client management features.

4. **Backend:**

   - Implement endpoints for uploading scanned invoices and extracting data.
   - Implement endpoints for generating and exporting reports.
   - Implement authentication and authorization for the accountant panel.

5. **Testing:**
   - Write unit and integration tests for new features.
   - Perform user acceptance testing (UAT) to ensure the feature meets user needs.

### Pre-Mortem Analysis

**Objective:**
To identify potential risks and failure points for the new expense management feature and develop mitigation strategies.

**Potential Risks and Mitigations:**

1. **OCR Accuracy:**

   - **Risk:** The OCR may not accurately extract data from scanned invoices, leading to incorrect information.
   - **Mitigation:** Use a high-quality OCR service and implement a manual review process for users to correct extracted data.

2. **Data Privacy:**

   - **Risk:** Sensitive financial data may be exposed or mishandled.
   - **Mitigation:** Implement strong encryption for data storage and transmission. Ensure compliance with data protection regulations (e.g., GDPR).

3. **User Adoption:**

   - **Risk:** Users may find the scanning process cumbersome or may not trust the automated data extraction.
   - **Mitigation:** Provide a user-friendly interface and clear instructions. Offer a manual entry option as a fallback.

4. **System Performance:**

   - **Risk:** The system may experience performance issues when processing large volumes of scanned invoices.
   - **Mitigation:** Optimize the OCR processing pipeline and ensure scalable infrastructure.

5. **Accountant Panel Security:**

   - **Risk:** Unauthorized access to the accountant panel could lead to data breaches.
   - **Mitigation:** Implement robust authentication and authorization mechanisms. Regularly audit access logs.

6. **Regulatory Compliance:**

   - **Risk:** The generated JPK reports may not comply with local regulations.
   - **Mitigation:** Consult with legal experts to ensure compliance. Regularly update the report generation logic to adhere to regulatory changes.

7. **Integration Issues:**
   - **Risk:** Integration with existing systems (e.g., OCR service, database) may encounter technical challenges.
   - **Mitigation:** Conduct thorough integration testing and have contingency plans for alternative services.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

For any questions or feedback, please contact us at michalpasynek@gmail.com.
