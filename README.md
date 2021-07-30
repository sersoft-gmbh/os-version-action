# OS Version Action

[![Tests](https://github.com/sersoft-gmbh/os-version-action/actions/workflows/tests.yml/badge.svg)](https://github.com/sersoft-gmbh/os-version-action/actions/workflows/tests.yml)

This action reads the current operating system (os) version.

## Inputs

_None_

## Outputs

### `version`

The version of the operating system this action is run on (e.g. `20.04` for Ubuntu 20.04).

## Example Usage

Use the following snippet to read the current os version:
```yaml
uses: sersoft-gmbh/os-version-action@v1
```
