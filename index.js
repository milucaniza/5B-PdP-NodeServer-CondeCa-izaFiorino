var express = require('express');
var bodyParser = require('body-parser');

var MySql = require('./modulos/mysql.js');

var app = express();
var port = process.env.PORT || 3000;

// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/', function(req, res){
	res.status(200).send({
		message: 'GET Home route working fine!'
	});
});

app.listen(port, function(){
	console.log(`Server running in http://localhost:${port}`);
	console.log('Defined routes:');
	console.log('	[GET] http://localhost:3000/');
});

app.get("/actores", async function(req, res) {
	console.log(req.query)
	const result = await MySql.realizarQuery("SELECT * FROM Actores");
	res.send(result)
})

app.get("/peliculas", async function(req, res) {
	console.log(req.query)
	const result = await MySql.realizarQuery("SELECT * FROM Peliculas");
	res.send(result)
})

app.get("/directores", async function(req, res) {
	console.log(req.query)
	const result = await MySql.realizarQuery("SELECT * FROM Directores");
	res.send(result)
})

app.get("/peliculasActores", async function(req, res) {
	console.log(req.query)
	const result = await MySql.realizarQuery("SELECT * FROM PeliculasActores");
	res.send(result)
})


app.get("/saludoActor", async function(req, res) {
	console.log(req.query.parametro1)
	const result = await MySql.realizarQuery(`SELECT nombre FROM Actores WHERE id_actor = "${req.query.parametro1}"`);
	res.send(result)
})

app.get("/saludoPelicula", async function(req, res) {
	console.log(req.query.parametro1)
	const result = await MySql.realizarQuery(`SELECT titulo FROM Peliculas WHERE id_pelicula = "${req.query.parametro1}"`);
	res.send(result)
})

app.get("/saludoDirector", async function(req, res) {
	console.log(req.query.parametro1)
	const result = await MySql.realizarQuery(`SELECT nombre FROM Directores WHERE id_director = "${req.query.parametro1}"`);
	res.send(result)
})

app.post("/agregarActor", async function(req,res) {
    console.log(req.body);
    const existeDirector = await MySql.realizarQuery(`SELECT nombre FROM Actores WHERE nombre = '${req.body.nombre}'`);
    if (existeDirector ) {
        res.send("El actor ya existe");
    } else {
        await MySql.realizarQuery(`INSERT INTO Actores (nombre, nacionalidad, apellido, edad, id_actor) 
            VALUES ('${req.body.nombre}', '${req.body.nacionalidad}', '${req.body.apellido}','${req.body.edad}','${req.body.id_actor}')`);
        res.send("ok");
    }
});

app.post("/agregarPelicula", async function(req, res) {
    console.log(req.body);
    const existePelicula = await MySql.realizarQuery(`SELECT titulo FROM Peliculas WHERE titulo = '${req.body.titulo}'`);
    if (existePelicula ) {
        res.send("La película ya existe");
    } else {
        await MySql.realizarQuery(`INSERT INTO Peliculas (titulo, genero, duracion, id_pelicula) 
            VALUES ('${req.body.titulo}', '${req.body.genero}', '${req.body.duracion}', '${req.body.id_pelicula}')`);
        res.send("ok");
    }
});

app.post("/agregarDirector", async function(req,res) {
    console.log(req.body);
    const existeDirector = await MySql.realizarQuery(`SELECT nombre FROM Directores WHERE nombre = '${req.body.nombre}'`);
    if (existeDirector ) {
        res.send("El director ya existe");
    } else {
        await MySql.realizarQuery(`INSERT INTO Director (nombre, nacionalidad, apellido, edad, id_director) 
            VALUES ('${req.body.nombre}', '${req.body.nacionalidad}', '${req.body.apellido}','${req.body.edad}','${req.body.id_director}')`);
        res.send("ok");
    }
});

app.post("/agregarPeliculasActores", async function(req,res) {
    console.log(req.body);
    const existePelicula = await MySql.realizarQuery(`SELECT id_actor FROM PeliculasActores WHERE id_actor = '${req.body.id_actor}' && SELECT id_pelicula FROM PeliculasActores WHERE id_pelicula = '${req.body.id_pelicula}'`);
    if (existePelicula ) {
        res.send("PeliculasActores ya existen");
    } else {
        await MySql.realizarQuery(`INSERT INTO Peliculas (id_actor, id_pelicula) 
            VALUES ('${req.body.id_actor}', '${req.body.id_pelicula}')`);
        res.send("ok");
    }
});

app.put("/modificarActores", async function(req,res) {
	console.log(req.body)
	await MySql.realizarQuery(`UPDATE Actores SET nacionalidad = "${req.body.nacionalidad}", nombre = "${req.body.nombre}", apellido = "${req.body.apellido}", edad = "${req.body.edad}", premios = "${req.body.premios}"  WHERE id_actor = ${req.body.id_actor};`)
	res.send("ok")
})	

app.put("/modificarPeliculas", async function(req,res) {
	console.log(req.body)
	await MySql.realizarQuery(`UPDATE Peliculas SET titulo = "${req.body.titulo}", genero = "${req.body.genero}", duracion = "${req.body.duracion}"  WHERE id_pelicula = ${req.body.id_pelicula};`)
	res.send("ok")
})

app.put("/modificarDirectores", async function(req,res) {
	console.log(req.body)
	await MySql.realizarQuery(`UPDATE Directores SET nombre = "${req.body.nombre}", nacionalidad = "${req.body.nacionalidad}", apellido = "${req.body.apellido}", edad = "${req.body.edad}" WHERE id_director = ${req.body.id_director};`)
	res.send("ok")
})	

app.put("/modificarPeliculasActores", async function(req,res) {
	console.log(req.body)
	await MySql.realizarQuery(`UPDATE PeliculasActores SET id_actor = "${req.body.id_actor}", id_pelicula = "${req.body.id_pelicula}" WHERE id_actor = ${req.body.id_actor} and id_pelicula = "${req.body.id_pelicula}";`)
	res.send("ok")
})	

app.delete("/borrarActores", async function(req,res) {
	console.log(req.body)
	await MySql.realizarQuery(`DELETE FROM Actores WHERE id_actor = "${req.body.id_actor}";`)
	res.send("ok")
})

app.delete("/borrarDirectores", async function(req,res) {
	console.log(req.body)
	await MySql.realizarQuery(`DELETE FROM Directores WHERE id_director = "${req.body.id_director}";`)
	res.send("ok")
})

app.delete("/borrarPeliculas", async function(req,res) {
	console.log(req.body)
	await MySql.realizarQuery(`DELETE FROM Peliculas WHERE id_pelicula = "${req.body.id_pelicula}";`)
	res.send("ok")
})

app.delete("/borrarPeliculasActores", async function(req,res) {
	console.log(req.body)
	await MySql.realizarQuery(`DELETE FROM PeliculasActores WHERE id_actor = "${req.body.id_actor}" and id_pelicula = "${req.body.id_pelicula}";`)
	res.send("ok")
})
/// Agregar a los pedidos del punto 4 que no agregue datos a la base de datos que sean duplicados. (Verificar previamente si ya existen con un if)
