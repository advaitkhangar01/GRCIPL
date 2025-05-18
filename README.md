# GRCIPL CRM Lead Management Software

This is a Next.js-based Customer Relationship Management (CRM) application designed for Gaea Realty and Consultants India Pvt. Ltd. to manage sales leads, track interactions, and view basic analytics.

## Current Status

**This application, in its current state, operates primarily on the client-side using in-memory mock data for leads, attendance, and upload history.**

*   **Data Persistence:** All data (including leads uploaded from Excel) is **session-based**. This means data will be lost when the browser is closed or refreshed. For persistent data storage, a backend and database would need to be implemented.
*   **Firebase Independence:** The application has been modified to remove direct dependencies on Firebase platform services for its core CRM functionality.
*   **AI Features:** Integrations with Genkit (for Google AI, e.g., Gemini) are present. These features require an active internet connection and a valid `GOOGLE_GENAI_API_KEY` environment variable to function.
*   **User Authentication:** Uses a client-side mock login with predefined credentials.

This version is suitable for demonstration, local development, and as a foundation for further development (e.g., adding a persistent backend).

## Features

*   Role-based access (Admin, Employee).
*   Lead management:
    *   Displaying leads in a filterable, sortable data table.
    *   Uploading leads from Excel files (client-side parsing and session storage).
    *   Assigning leads (Admin).
    *   Editing lead details (inline and dialog-based).
    *   Dedicated views for "Prospects" and "Won by GRC" leads.
*   Analytics Dashboard (Admin):
    *   Charts for Call Outcome Distribution, Employee Performance, and Lead Source Analysis (based on session data).
*   Attendance Tracking:
    *   Employees can mark their daily attendance (session-based).
    *   Admins can view employee attendance (session-based).
*   Upload History (Admin): Tracks Excel uploads made during the current session.

## Tech Stack

*   Next.js (App Router)
*   React
*   TypeScript
*   ShadCN UI Components
*   Tailwind CSS
*   `xlsx` for client-side Excel parsing
*   `recharts` for charts
*   Genkit (with `@genkit-ai/googleai` for optional AI features)

## Getting Started

### Prerequisites

*   Node.js (LTS version recommended, e.g., 18.x or 20.x)
*   npm or yarn

### Installation

1.  **Clone the repository (once it's on GitHub):**
    ```bash
    git clone <repository-url>
    cd GRCIPL-CRM-Lead-Management-Software
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Variables (Optional - for AI Features):**
    Create a `.env.local` file in the root of your project and add your Google Generative AI API key if you want to use AI features:
    ```
    GOOGLE_GENAI_API_KEY=your_google_genai_api_key_here
    ```

### Running the Development Server

1.  **Start the server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

2.  Open [http://localhost:9002](http://localhost:9002) (or the port specified in your `package.json` dev script) in your browser to see the application.

### Login Credentials (Mock)

*   **Admin:**
    *   User ID: `master_admin`
    *   Password: `master1008`
*   **Employee:**
    *   User ID: `pooja`
    *   Password: `pooja@987`
*   **Employee:**
    *   User ID: `aditya`
    *   Password: `aditya@987`

## Building for Production

```bash
npm run build
# or
yarn build
```
This will create an optimized production build in the `.next` folder.

## Deployment

This application can be deployed to any hosting platform that supports Node.js (e.g., Vercel, Netlify).
Ensure environment variables (like `GOOGLE_GENAI_API_KEY`) are configured on your deployment platform if AI features are used.

## Known Limitations

*   **No Persistent Data Storage:** All data is reset when the browser session ends.
*   **AI Features Require API Key & Internet:** Genkit/Google AI functionalities will not work without a valid API key and internet access.
*   **External Images:** Placeholder images require an internet connection.

## Future Enhancements (Conceptual)

*   Implement a persistent backend with a database (e.g., PostgreSQL, MySQL, MongoDB).
*   Develop robust multi-user authentication and authorization.
*   Expand AI features (e.g., lead scoring, predictive analytics, smart suggestions).
