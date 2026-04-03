# Banking Portal Frontend (Monorepo Workspace)

This is a modern [Next.js](https://nextjs.org) application, fundamentally structured as a multi-app monorepo to house both the **Control** and **Dashboard** applications under one roof while seamlessly sharing core UI dependencies.

---

## 🏗️ Architecture

The codebase has been restructured to allow multiple autonomous applications to run simultaneously while inheriting a unified design system.

- **`/control`**: The Next.js application powering the internal Control interface.
- **`/dashboard`**: The Next.js application powering the external Customer Dashboard interface.
- **`/shared`**: The central repository housing shared Shadcn components, master `globals.css` structure, custom hooks, and utility functions. 

> [!TIP]
> Both apps have specialized TypeScript configuration (`tsconfig.json`) mapped so that importing `@shared/*` points directly to the root `shared/` directory.

---

## 🚀 Getting Started

This repository utilizes `pnpm` as its core package manager to maintain speed and isolated lockfiles.

1.  **Install dependencies**:
    ```bash
    pnpm install
    ```
    _This ensures all peer dependencies install smoothly and automatically wires up the Husky git hooks._

2.  **Run the development servers**:
    To sprint up both the `control` and `dashboard` environments concurrently:
    ```bash
    pnpm run dev
    ```

### Port Mapping
* **Control App:** [http://localhost:3000](http://localhost:3000)
* **Dashboard App:** [http://localhost:3001](http://localhost:3001)

---

## 📜 Available Scripts

We have abstracted all run commands in the root `package.json` to handle simultaneous executions cleanly:

| Command                         | Description                                                                 |
| :------------------------------ | :-------------------------------------------------------------------------- |
| `pnpm run dev`                  | Boots both `control` & `dashboard` synchronously on ports 3000 & 3001.      |
| `pnpm run dev:control`          | Starts *only* the Control server.                                           |
| `pnpm run dev:dashboard`        | Starts *only* the Dashboard server.                                         |
| `pnpm run build`                | Validates and builds production bundles for both applications natively.     |
| `pnpm run start`                | Starts combined production servers.                                         |
| `pnpm run lint`                 | Runs ESLint heavily to check code quality.                                  |
| `pnpm run test`                 | Executes unit test suites globally via Jest.                                |

---

## 🛠️ Shadcn UI & Theming

This project utilizes [Shadcn UI](https://ui.shadcn.com/) heavily for its component interfaces. Because we operate in a multi-app layout:
* The root `components.json` is configured to route all automated component installations natively to the `shared/components/ui/` directory.
* Run `npx shadcn-ui@latest add [component]` from the **root** folder.
* **Styles**: Any theming, palette manipulations, or font additions should be done safely inside `shared/styles/globals.css`.

---

## 🔒 Git Hooks & Code Quality (Husky)

We heavily enforce automated workflow safety constraints via Husky to ensure bad code never hits the primary git pipeline.

### Pre-commit Hook (Formatting)
Before every commit, Husky intercepts the action and executes `pnpm exec lint-staged`.
* It safely runs `Prettier` to perfectly format your code structure.
* It safely runs `ESLint` to validate structural code quality.
* *Note: This is strictly executed ONLY on the files you are actively committing so local workflows remain incredibly fast.*

### Pre-push Hook (Validation)
Before pushing to remote endpoints, Husky enacts a heavy gatekeeper routine:
```bash
pnpm run test
pnpm run build
```
1. Ensure all Unit Tests are fully passing.
2. Ensure both the Dashboard and Control applications successfully compile and pass native TS compilation checking.
*Note: If logic structural faults are spotted, the push to remote is rigidly blocked.*

---

## 📝 Commit Message Convention

We enforce the **Conventional Commits** specification using `commitlint`.

**Format:**
```
<type>(<scope>): <subject>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatted style restructuring
- `refactor`: Structural algorithm fixes
- `perf`: Performance enhancement computations
- `test`: Updating testing suites
- `chore`: Generic dependency maintenance

If your commit message format is invalid, Husky will structurally reject the commit entirely.
