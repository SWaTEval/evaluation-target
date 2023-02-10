# SWaTEval Evaluation Target

An evaluation target for the SWaTEval framework.

This repository has been published as a part of the following paper. Please consider citing this paper if you use our work in your research.

> Borcherding, A.; Penkov, N.; Giraud, M. and Beyerer, J. (2023). SWaTEval: An Evaluation Framework for Stateful Web Application Testing. In Proceedings of the 9th International Conference on Information Systems Security and Privacy - ICISSP

# How to run

1. Install [NodeJs](https://nodejs.org/en/)

2. Install project depndencies using npm:

```
npm install
```

3. Run the application

```
node index.js
```

4. Access the application http://localhost:3000

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
