const api = require('./api')

const express = require('express')

const server = express();

const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./localstorage')

server.use(express.json());

server.listen(3000);

server.get('/first', (req, res) => {
    return res.send({first: "Hello Worl"})
})

server.get('/query-params', (req, res) => {
    const { name, age, site } = req.query;

    return res.json({ result: `Nome: ${name} e idade: ${age} e o seu site é: ${site}`});
})

var products= [];

//*POST => INSERT
server.post('/products', (req, res) => {
    const {id, name, price} = req.body

    products.push({id: id, name: name, price: price})
    res.send({message: 'Sucess!'});
})

//*GET => SELECT (LIST) 
server.get('/products', (req, res) => {
    res.send({products: products})
})

//* PUT => UPDATE
server.put('/products', (req, res) => {
    const {name, price} = req.query;
    const {oldName} = req.query;

    const index = products.findIndex(item => item.name === oldName)

    products[index].name = name;
    products[index].price = price;

    res.send({message: "Sucess!"})
})

server.delete('/product/:id', (req, res) => {
    const {id} = req.params
    const newProducts = products.filter(item => item.id !== parseInt(id));

    res.send({ product: products})
})

server.get('/pokemon', async (req, res) => {

    try{
        const {data} = await api.get('pokemon/1')
        return res.send({name: data.name})

    } catch (error) {
        res.send({error: error.message})
    }
})

function verifyUserAlread(req, res, next) {
    const {email} = req.body

    if (!allUsers.find(user => user.email === email)) {
        return next();
    }

    return res.status(400).json({Failed: 'This is email alread registered'})

}

const allUsers = [];

server.post('/register-users', verifyUserAlread, (req, res) => {
    const user = req.body;

    allUsers.push(user)

    localStorage.setItem('users', JSON.stringify(allUsers))

    return res.json({user})
})

server.get('/users', (req, res) => {

    const users = JSON.parse(localStorage.getItem('user'))

    return res.json(users)
})
    

