const express = require('express')
const ejs = require('ejs')
const axios = require('axios').default;
const path = require('path');
const { randomInt } = require('crypto');
const app = express()
const LoremIpsum = require("lorem-ipsum").LoremIpsum;
const port = 3000

// set the view engine to ejs
app.set('view engine', 'ejs');

// For assets
app.use(express.static('public'));

const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: 8,
        min: 4
    },
    wordsPerSentence: {
        max: 16,
        min: 4
    }
});

let normal_user = { username: 'user', password: 'letmein', fullname: 'Test' }
let admin_user = { username: 'admin', password: 'admin', fullname: 'Admin' }

let states = {
    logged_in_as_user: false,
    logged_in_as_admin: false,
    evil_number: 0
}

function redirect(res, location) {
    res.writeHead(302, { 'Location': location });
    res.end();
}

app.get('/views/home', (req, res) => {
    res.render('home', { states: states })
})

app.get('/views/about', (req, res) => {
    res.render('about')
})

app.get('/views/login', (req, res) => {
    if (!states.logged_in_as_user || !states.logged_in_as_admin) {
        let username = req.query.username
        let password = req.query.password

        if (username == normal_user.username && password == normal_user.password) {
            states.logged_in_as_user = true
        }
        else if (username == admin_user.username && password == admin_user.password) {
            states.logged_in_as_admin = true
        }
        else {
            res.render('login')
            return
        }
    }
    redirect(res, '/views/user')
})


async function get_random_quote() {
    return new Promise((resolve) => {
        axios.get('https://api.quotable.io/random').then(response => {
            let data = response.data;
            resolve(data)
        })
            .catch(err => {
                resolve({ content: "Couldn't fetch quote fron server", author: "Error:" })
            })
    })
}

function get_user_fullname() {
    let fullname = ""
    if (states.logged_in_as_user) {
        fullname = normal_user.fullname
    }
    else if (states.logged_in_as_admin) {
        fullname = admin_user.fullname
    }
    else {
        fullname = "No user logged in"
    }

    return fullname
}

app.get('/views/user', (req, res) => {
    get_random_quote().then(quote => {
        if (states.logged_in_as_user || states.logged_in_as_admin) {
            res.render('user', {
                user: get_user_fullname(),
                quote,
                states: states
            })
        }
        else {
            redirect(res, '/views/login')
        }
    })
})

app.get('/views/features', (req, res) => {
    res.render('features')
})

app.get('/views/const-content/const-links/:page', (req, res) => {
    let links_count = 5

    let links = []
    for (let i = 0; i < links_count; i++) {
        links.push({
            address: "link" + i.toString(),
            text: "Link " + i.toString()
        })
    }

    let params = {
        links: links,
        text_content: lorem.generateSentences(5)
    };
    res.render('const_content_const_links', params)
})

app.get('/views/const-content/dynamic-links/:page', (req, res) => {
    let links_count = randomInt(20)
    let links = []

    for (let i = 0; i < links_count; i++) {
        let random_word = lorem.generateWords(1);
        links.push({
            address: random_word,
            text: "Link " + random_word
        })
    }
    let params = {
        links: links,
        text_content: lorem.generateSentences(5)
    };
    res.render('const_content_dynamic_links', params)
})

app.get('/views/dynamic-content/const-links/:page', (req, res) => {
    let links_count = 5
    let content_sentances_count = 20

    let links = []
    for (let i = 0; i < links_count; i++) {
        links.push({
            address: "link" + i.toString(),
            text: "Link " + i.toString()
        })
    }

    let params = {
        links: links,
        text_content: lorem.generateSentences(content_sentances_count)
    };
    res.render('dynamic_content_const_links', params)
})

app.get('/views/dynamic-content/dynamic-links/:page', (req, res) => {
    let links_count = 5
    let content_sentances_count = 20

    let links = []
    for (let i = 0; i < links_count; i++) {
        let random_word = lorem.generateWords(1);
        links.push({
            address: random_word,
            text: "Link " + random_word
        })
    }

    let params = {
        links: links,
        text_content: lorem.generateSentences(content_sentances_count)
    };
    res.render('dynamic_content_dynamic_links', params)
})

app.get('/views/admin', (req, res) => {
    if (states.logged_in_as_admin) {
        res.render('admin')
    }
    else {
        redirect(res, '/views/user')
    }
})

app.get('/views/numbers', (req, res) => {
    let number = parseInt(req.query.number) || 0; // Force zero if NaN
    let nav_location = "numbers?number=" + (number + 1).toString();
    let params = { hardmode: false, current_number: number, nav_location: nav_location };
    res.render('numbers', params);
})

app.get('/views/numbers/hardmode', (req, res) => {
    let current_number = states.evil_number;
    states.evil_number = current_number + 1;
    let nav_location = "hardmode";
    let params = { hardmode: true, current_number: current_number, nav_location: nav_location };
    res.render('numbers', params);
})

app.get('/views/logout', (req, res) => {
    states.logged_in_as_user = false
    states.logged_in_as_admin = false
    redirect(res, '/')
})


class State {
    constructor(parent, keyword, identifier, is_current = false,) {
        this.parent = parent
        this.is_current = is_current
        this.keyword = keyword
        this.identifier = identifier
    }

    get_identifier() {
        return this.identifier
    }

    get_keyword() {
        return this.keyword
    }

    get_status() {
        return this.is_current
    }

    set_status(status) {
        this.is_current = status
    }
}

let state_machine = []

intial = new State(parent = null, keyword = null, identifier = 'Initial', is_current = true)
state_machine.push(intial)

secondary_1 = new State(intial, 'state2_1', 'Secondary 1')
state_machine.push(secondary_1)

secondary_2 = new State(intial, 'state2_2', 'Secondary 2')
state_machine.push(secondary_2)

teritary_1 = new State(secondary_1, 'state3_1', 'Teritary 1')
state_machine.push(teritary_1)

teritary_2 = new State(secondary_1, 'state3_2', 'Teritary 2')
state_machine.push(teritary_2)

teritary_3 = new State(secondary_1, 'state3_3', 'Teritary 3')
state_machine.push(teritary_3)

teritary_4 = new State(secondary_1, 'state3_4', 'Teritary 4')
state_machine.push(teritary_4)

secret_state = new State(teritary_1, 'special', 'Special')
state_machine.push(secret_state) 

// Trying to mock cyclic graph  
initial_mock = new State(secret_state, 'initial', 'Initial')
state_machine.push(initial_mock)      

function reset_state_machine() {
    state_machine.forEach(state => {
        state.set_status(false)
    });
}

function update_current_state(state) {
    reset_state_machine()
    state.set_status(true)
}

function get_current_state() {
    let current_state = null
    state_machine.forEach(state => {
        if (state.is_current) {
            current_state = state
        }
    });

    return current_state
}

function get_next_possible_states() {
    let current_state = get_current_state()
    let next_possible_states = []

    state_machine.forEach(state => {
        if (state.parent == current_state) {
            next_possible_states.push(state)
        }
    });

    return next_possible_states
}

app.get('/views/state', (req, res) => {
    let keyword = req.query.keyword

    if (keyword != undefined && keyword != null) {
        let next_possible_states = get_next_possible_states()

        next_possible_states.forEach(state => {
            if (state.get_keyword() == keyword) {
                if(keyword == "initial"){
                    update_current_state(state_machine[0])
                }
                else{
                    update_current_state(state)
                }
            }
        });
    }

    let current_state = get_current_state()
    let indentifier = current_state.get_identifier()
    let params = { state_identifier: indentifier };
    res.render('state', params);
})

app.get('/views/state/reset', (req, res) => {
    update_current_state(state_machine[0])
    redirect(res,'/views/state')
})


// Redirect all 404s to home
app.get('*', (req, res) => {
    redirect(res, '/views/home')
})

// Start the server
app.listen(port, () => {
    console.log(`Evaluation framework started on port ${port}`)
})