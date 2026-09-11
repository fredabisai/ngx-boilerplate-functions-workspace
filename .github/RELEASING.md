# Publishing releases

Merging a pull request into `master` runs `.github/workflows/npm-publish.yml`. The workflow type-checks, tests, builds, verifies, tags, publishes, and creates a GitHub Release.

## Version requirement

Every merge that should publish must change `version` in:

```text
projects/ngx-boilerplate-functions/package.json
```

For example, version `1.1.0` produces:

- npm package `@ngx-boilerplate-functions/forms@1.1.0`
- Git tag `v1.1.0`
- GitHub Release `v1.1.0`

The workflow refuses to reuse a version whose tag points to another commit. Use semantic versioning:

- Patch: backwards-compatible fixes, such as `1.0.0` to `1.0.1`.
- Minor: backwards-compatible features, such as `1.0.0` to `1.1.0`.
- Major: breaking API changes, such as `1.0.0` to `2.0.0`.

## Recommended credentials: npm Trusted Publishing

Configure a trusted publisher for `@ngx-boilerplate-functions/forms` on npmjs.com with:

- Provider: GitHub Actions
- GitHub owner: `fredabisai`
- Repository: `ngx-boilerplate-functions-workspace`
- Workflow filename: `npm-publish.yml`
- Environment: `npm`, if npm asks for one
- Allowed action: `npm publish`

The workflow grants `id-token: write` and uses a GitHub-hosted runner with Node 24 and npm 11.5.1 or newer. No npm write token is required. For a public repository and public package, npm also creates provenance automatically.

The owner, repository, and workflow filename are case-sensitive and must match npm's configuration exactly.

## Optional GitHub Environment

Create a GitHub Environment named `npm` under repository Settings → Environments. It can require reviewer approval before the release job starts.

## Token fallback

If Trusted Publishing is not available, create a granular npm automation token with publish access only to `@ngx-boilerplate-functions/forms`. Add it as an environment or repository Actions secret named:

```text
NPM_TOKEN
```

Do not commit an npm token or `.npmrc` containing credentials. After Trusted Publishing works, delete or revoke the write token.

## Recovery behavior

The workflow is safe to rerun from GitHub Actions:

- If the tag exists on the same commit but npm publication failed, it retries publication.
- If npm publication succeeded but GitHub Release creation failed, it skips npm and creates the missing release.
- If the version or tag belongs to another commit, it stops and requires a version bump.

The workflow also supports manual execution with `workflow_dispatch` for rerunning the current `master` commit.
