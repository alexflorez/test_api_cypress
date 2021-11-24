# Testing an API with Cypress

There are two directories cypress and automate.
- `test_api` contains the code that runs the tests over the API server.
- `automate` contains a program that installs and starts the API server in node.js.

## Requirements
- `node.js` and `npm` to run the API server
- `python` 3.9 to run the automate program
- `unzip` to decompress the server code 

## Steps to run the automation

From the root directory
- `python automate codepass.zip`

This will install Cypress and then uncompress the server code and start the API server.
