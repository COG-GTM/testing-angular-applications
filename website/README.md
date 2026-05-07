# Contacts App (React + TypeScript)

A contacts management application migrated from Angular to React with TypeScript.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router v6** for routing
- **MUI (Material UI) v5** for UI components
- **Vitest** + **React Testing Library** for testing

## Getting Started

```bash
cd website
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Type-check and production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Lint with ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm test` | Run tests with Vitest |
| `npm run test:watch` | Run tests in watch mode |

## Project Structure

```
src/
├── __tests__/          # Test files
├── components/         # React components
│   ├── ContactList.tsx
│   ├── ContactDetail.tsx
│   ├── ContactEdit.tsx
│   ├── ContactFeedDialog.tsx
│   ├── FavoriteIcon.tsx
│   ├── NewContact.tsx
│   └── PageNotFound.tsx
├── models/             # TypeScript interfaces
│   └── contact.ts
├── services/           # Data services
│   ├── contact.service.ts
│   ├── contact-feed.service.ts
│   └── mock-contacts.ts
├── utils/              # Utility functions
│   ├── phone-number.ts
│   └── validation.ts
├── App.tsx             # Root component with routing
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Routes

| Path | Component | Description |
| --- | --- | --- |
| `/` | ContactList | Home / contact list |
| `/contacts` | ContactList | Contact list |
| `/contact/:id` | ContactDetail | View contact details |
| `/edit/:id` | ContactEdit | Edit a contact |
| `/add` | NewContact | Add a new contact |
| `*` | PageNotFound | 404 page |
