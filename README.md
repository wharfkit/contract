# Contract Kit

A library to simplify interactions with Antelope-based smart contracts.

Features:

-   Instantiate instances of a `Contract` in your frontend application
-   Retrieve smart contract data with `Table` instances.
-   Create action data by accessing actions directly through the `.action` method of a `Contract`
-   Retrieve Ricardian Contracts for specific actions through the `.ricardian` method of a `Contract`
-   Cache and optimize ABI call patterns automatically in your application.

## Installation

The `@wharfkit/contract` package is distributed as a module on [npm](https://www.npmjs.com/package/@wharfkit/contract).

```
yarn add @wharfkit/contract
# or
npm install --save @wharfkit/contract
```

## Developing

You need [Make](https://www.gnu.org/software/make/), [node.js](https://nodejs.org/en/) and [yarn](https://classic.yarnpkg.com/en/docs/install) installed.

Clone the repository and run `make` to checkout all dependencies and build the project. See the [Makefile](./Makefile) for other useful targets. Before submitting a pull request make sure to run `make lint`.

---

Made with ☕️ & ❤️ by [Greymass](https://greymass.com), if you find this useful please consider [supporting us](https://greymass.com/support-us).
