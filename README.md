# evaluation-framework

An evaluation framework for the state aware crawler

# Initial
Run `npm install` to install packages

Run `node index.js` to start the application

# Features

- Pages with:
    - Constant page content and:
        - [x] Constant links
        - [x] Dynamic links

    - Dynamic page content and:
        - [x] Constant links
        - [x] Dynamic links
    - Chained links
        - [x] Generation with input parameter (No state change in backend)
        - [x] Generation with button click incrementing a counter (State change in backend)


- State machine
    - [x] Simple (2 States)
    - [x] Complex (multiple states and greater depth)