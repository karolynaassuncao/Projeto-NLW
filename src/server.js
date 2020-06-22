const express = require ("express") 
const server = express()

//pegar banco de dados
const db = require("./database/db")

//configurar pasta publica

server.use(express.static("public"))

// utilizando template engine
const nunjucks =require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

 //configurar caminho da aplicação
 //pagina inicial
 //req:requisição
 //res:resposta

server.get("/",(req,res) => {
   return res.render("index.html")
})

server.get("/create-point",(req,res) => {
    return res.render("create-point.html")
})

server.get("/search-results",(req,res) => {
//pegar os dados do banco de dados 
    db.all(`SELECT * FROM places`, function(err, rows){
        if (err) {
            return console.log(err)
        }
    })
    //mostrar a page HTML com os dados do bd
    return res.render("search-results.html", { places : rows })
})

//ligar servidor
server.listen(3000)