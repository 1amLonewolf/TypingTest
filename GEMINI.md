# Project Instructions

This project is a modern typing test application built with React 19, Vite, and Tailwind CSS 4.

## 🏗️ Architecture & Conventions

### Directory Structure
- `src/components`: UI components. Prefer functional components with React.FC.
- `src/hooks`: Custom hooks for business logic. 
  - `useTypingTest.ts` handles the core typing logic.
- `src/utils`: Utility functions and managers (e.g., `sounds.ts` for keystroke sounds).
- `src/constants`: Static configurations and word lists.
- `src/assets`: Images and static assets.

### Styling
- **Tailwind CSS 4**: Use utility classes for most styling.
- **Theming**: The application supports multiple themes via `data-theme` attributes on the root element.
- **CSS Variables**: Use the following variables for consistent theming:
  - `var(--bg-color)`
  - `var(--main-color)`
  - `var(--caret-color)`
  - `var(--sub-color)`
  - `var(--text-color)`
  - `var(--error-color)`
- These are also mapped to Tailwind colors: `bg-bg`, `text-main`, etc. (see `index.css`).

### State Management
- Prefer React's `useState` and `useEffect` for local state.
- Complex typing logic is encapsulated in `useTypingTest` hook.

### Testing
- **Framework**: Vitest.
- **Conventions**: Place tests alongside the files they test (e.g., `filename.test.ts`) or in a dedicated `test/` directory.
- Run tests using `npm run test`.

## 🛠️ Workflows

### Development
- Start server: `npm run dev`
- Always check for lint/type errors before committing.

### Adding New Themes
1. Add the theme colors to `src/index.css` under a new `[data-theme='theme-name']` block.
2. Update the `THEMES` constant in `src/App.tsx` to include the new theme option.

### Adding New Word Categories
1. Update `src/constants/words.ts` with the new word list.
2. Update the `WordCategory` type in `src/hooks/useTypingTest.ts`.
3. Add the new category button to the `TypingTest` component.
