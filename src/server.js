const express = require ("express") 
const server = express()

//pegar banco de dados
const db = require("./database/db.js")

//configurar pasta publica

server.use(express.static("public"))

//habilitar o uso do req.body 
server.use(express.urlencoded({ extended:true}))

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
    //req.query: Query Strings na URL
    //console.log (req.query)


    return res.render("create-point.html")
})

server.post("/savepoint", (req, res)=> {
    //req.body: O corpo do formulário
   // console.log(req.body)

   //inserir dados no banco de dados
   const query = `
   INSERT INTO places (
       image,
       name,
       address,
       address2,
       state,
       city,
       items
    ) VALUES (?,?,?,?,?,?,?);
    `
   const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
   ]

   function afterInsertData(err) {
       if (err) {
           console.log(err)
           return res.send("Erro no cadastro!")
       }
       console.log("Cadastrado com sucesso")
       console.log(this)
       
      return res.render("create-point.html", {saved:true})
    }
    db.run(query, values, afterInsertData)
 
})

server.get("/search-results",(req,res) => {
    const search = req.query.search

    if(search == ""){
        //pesquisa vazia
        return res.render("search-results.html", { total:0 })
    }

//pegar os dados do banco de dados 
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
        if (err) {
            return console.log(err)
        }
        console.log(rows)

        const total = rows.length
    
    //mostrar a page HTML com os dados do bd
    return res.render("search-results.html", { places : rows, total })
    })
})

//ligar servidor
server.listen(3000)