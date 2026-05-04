# Dependabot — `dependabot.yml`

**File:** `.github/dependabot.yml`

---

## Purpose

Automatically opens pull requests to update dependencies on a weekly schedule. PRs target the `dev` branch (not `main`) and use [Conventional Commits ↗](https://www.conventionalcommits.org) message prefixes so they integrate cleanly with the [release-please ↗](https://github.com/googleapis/release-please) workflow.

---

## Schedule

Runs every **Monday**.

---

## Target Branch

All [Dependabot ↗](https://docs.github.com/en/code-security/dependabot) PRs target **`dev`**, not `main`. This ensures dependency updates go through the standard PR review and CI pipeline before reaching production.

---

## Ecosystems

### npm Dependencies

<dl>
    <dt>Package ecosystem</dt>
    <dd><code>npm</code></dd>
    <dt>Directory</dt>
    <dd><code>/</code></dd>
    <dt>Commit prefix</dt>
    <dd><code>chore(deps):</code></dd>
    <dt>Labels</dt>
    <dd><code>dependencies</code></dd>
</dl>

#### Grouping

Related packages are grouped into single PRs to reduce noise:

<dl>
    <dt><code>typescript</code></dt>
    <dd><code>typescript</code></dd>
    <dt><code>tooling</code></dt>
    <dd><code>prettier</code>, <code>prettier-*</code>, <code>@prettier/*</code>, <code>husky</code>, <code>lint-staged</code>, <code>vitest</code>, <code>@vitest/*</code>, <code>eslint</code>, <code>eslint-*</code>, <code>@eslint/*</code>, <code>typescript-eslint</code></dd>
</dl>

Ungrouped packages (e.g., `@types/node`) get individual PRs.

### GitHub Actions

<dl>
    <dt>Package ecosystem</dt>
    <dd><code>github-actions</code></dd>
    <dt>Directory</dt>
    <dd><code>/</code></dd>
    <dt>Commit prefix</dt>
    <dd><code>chore(ci):</code></dd>
    <dt>Labels</dt>
    <dd><code>dependencies</code>, <code>ci</code></dd>
</dl>

Updates action versions used in all workflow files (e.g., `actions/checkout@v4` to `@v5`).

---

## Interaction with Pinned Dependencies

Some dependencies are intentionally pinned without caret ranges (see `devDependenciesPinned` in `package.json`):

- **`typescript-eslint`** — pinned without `^` because patch releases have introduced breaking rule changes
- **`@types/node`** — pinned to `~24.0.0` to match the [Node.js ↗](https://nodejs.org) 24 runtime

[Dependabot ↗](https://docs.github.com/en/code-security/dependabot) will still open PRs for these packages. Review them carefully and test before merging — the pinning is intentional and documented.

---

## CI Integration

[Dependabot ↗](https://docs.github.com/en/code-security/dependabot) PRs trigger the CI workflow like any other PR. However, the CI workflow handles [Dependabot ↗](https://docs.github.com/en/code-security/dependabot) specially:

- **App token generation is skipped** — [Dependabot ↗](https://docs.github.com/en/code-security/dependabot) cannot access repository secrets
- **Submodule checkout is skipped** — [Dependabot ↗](https://docs.github.com/en/code-security/dependabot) cannot access private submodules
- **Falls back to `GITHUB_TOKEN`** — sufficient for read-only validation (audit, lint, typecheck, test)
- **Badge commits are not generated** — badges only commit on push events, not PRs
