# Let's code, a Leetcode clone

Feature rich and Interactive Leetcode clone.
Code runs on dockerized containers to protect backend

## Features
1. Users can create and attempt problem
2. Resizable Code Editor
3. Rich text support for publishing problems
4. Support for dark mode
5. Support for Autocomplete
6. Supports java, Python and Javascript
 
## Running in development mode
Run the following command:

```sh
turbo run dev
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `server`: a Node.js Express app
- `client`: a React frontend app
- `common`: a library shared by both `server` and `client` applications


Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).


### Build

To build all apps and packages, run the following command:

```
cd letscode
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd letscode
pnpm dev
```
