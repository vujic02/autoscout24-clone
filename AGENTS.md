## Skill: Commit Message + Changelog

Trigger:

- Any user request asking for a commit message.
- Any user request asking for a changelog.
- Wording does not need to be exact (examples: "the changelog", "write commit msg", "can you prepare release notes").

When this intent is detected, always return exactly 1 fenced code block.

Output wrapper contract (strict):

- Return exactly 1 fenced code block using ```text.
- The block contains 2 sections separated by a line of dashes: ----------------------------------------
- Section 1 (top) = semantic commit message.
- Section 2 (bottom) = GitHub changelog.
- Do not output any plain text before or after the fenced code block.

### Section 1: Semantic commit message (top half)

- First line must be semantic: feat:, fix:, refactor:, perf:, test:, docs:, chore:, build:, ci:, or style:
- Subject must be short and specific.
- Add bullets with concise technical scope by area (UI, Service, Controller, Repository, Entity, DB, Security, Dependency).
- Plain text only in section 1: no backticks, no bold, no italic, no links, no markdown code formatting.
- If a class/file/field/method name is mentioned in section 1, write it as plain text.

### Section 2: GitHub changelog (bottom half)

- Start with ## Changes (<commit_link>)
- Use markdown code formatting for technical identifiers: `fieldName`, `ClassName`, routes, SQL columns, etc.
- Use **bold** for major impact points when useful.

### Template

```text
<type>: <short title>

- <Area>: <change>
- <Area>: <change>
- <Area>: <change>

----------------------------------------

## Changes (<commit_link>)

- <Area>: <detailed summary with `identifiers`>.
- <Area>: <detailed summary>.
- <Area>: <migration/dependency/security/testing note>.
```

Selection hints:

- feat: new feature/capability
- fix: bug fix
- refactor: internal restructuring without behavior change
- perf: performance improvement
- docs: documentation only
