# Find and Replace Strings

A GitHub Action that performs find and replace operations on strings. Perfect for transforming branch names, processing environment variables, or manipulating any string data in your workflows.

## Features

- Find and replace text within any string
- Option to replace first occurrence or all occurrences
- TypeScript implementation with comprehensive testing
- Lightweight and fast execution

## Inputs

### `source`

**Required** The source string to perform find and replace on

### `find`

**Required** The text to search for within the source string

### `replace`

**Required** The text to replace found occurrences with

### `replaceAll`

**Optional** Replace all occurrences (`true`) or just the first one (`false`, default)

## Outputs

### `value`

The resulting string after find and replace operation

## Example Usage

### Basic Usage

```yaml
- name: Remove refs/heads/ from branch name
  uses: step-security/actions-find-and-replace-string@v5
  id: branch-name
  with:
    source: ${{ github.ref }}
    find: 'refs/heads/'
    replace: ''

- name: Use cleaned branch name
  run: echo "Branch: ${{ steps.branch-name.outputs.value }}"
```

### Replace All Occurrences

```yaml
- name: Replace dots with dashes
  uses: step-security/actions-find-and-replace-string@v5
  id: sanitize
  with:
    source: 'test.example.com'
    find: '.'
    replace: '-'
    replaceAll: 'true'
    # Output: test-example-com
```

### Processing Environment Variables

```yaml
- name: Transform environment name
  uses: step-security/actions-find-and-replace-string@v5
  id: env-name
  with:
    source: ${{ github.event.pull_request.head.ref }}
    find: 'feature/'
    replace: 'preview-'
    # Transforms: feature/new-login -> preview-new-login
```

## Common Use Cases

- Extracting branch names from git references
- Sanitizing strings for use in URLs or file names
- Transforming environment variable values
- Processing configuration strings
- Cleaning up user input or external data

## Development

This action is built with TypeScript and includes comprehensive tests. The codebase follows modern development practices with proper type safety and error handling.

