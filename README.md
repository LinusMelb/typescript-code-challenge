## Sinefa TypeScript Challenge
[![forthebadge made-with-typescript](https://badgen.net/badge/Made%20with/Typescript/yellow)](https://www.typescriptlang.org/)
![Coverage badge gree][coverage-badge-green]

[coverage-badge-green]: https://img.shields.io/badge/Coverage-100%25-brightgreen.svg

Write a Node script that transforms data.json into data-transformed.json. Solution is implemetned in TypeScript.


## Development Environment
* node (15.2.1)
* tsc (4.1.3)


## Usage
``` bash
# install dependencies
npm install

# run this program
npm run start

# compile to js (folder: dist/)
npm run build

# run test
npm run test
```


## Folder Structure
```bash
├── dist
├── node_modules
├── src
│   ├── index.ts
├── test
│   ├── index.ts
│   ├── invalid-data.json
├── .gitignore
├── data.json
├── data-transformed.json
├── example-output.json
├── jest.config.js
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json
```