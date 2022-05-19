// Instrucciones iniciales //
let name = prompt('Bienvenido, ingresa tu nombre');
alert('1. ' + name + ' utiliza las flechas para moverte dentro del mapa');
alert('2. para avanzar tendrás que pasar por la puerta al final del mapa \npero cuidado con las lechugas, no son de fiar.');
alert('3. Una cosa más... el portón no se abre solo con lo cual busca dentro del mapa la herramienta para abrirlo. Buena suerte');

let canvas;
let ctx;
let fps = 50;
let anchoF = 50;
let altoF = 50;

// let cesped = '#34c62f';
// let agua = '#4286f4';
// let tierra = '#c6892f';
// let muro = '#044f14';
// let puerta = '#3a1700';
// let llave = '#c6bc00';
// let colorProta = '#820c01';

let tileMap;
let imagenAntorcha;
let enemigo = [];

// creacion del mapa
let escenario = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,2,2,0,0,0,2,2,2,2,0,0,2,2,0],
    [0,0,2,2,2,2,2,0,0,2,0,0,2,0,0],
    [0,0,2,0,0,0,2,2,0,2,2,2,2,0,0],
    [0,0,2,2,2,0,0,2,0,0,0,2,0,0,0],
    [0,2,2,0,0,0,0,2,0,0,0,2,0,0,0],
    [0,0,2,0,0,0,2,2,2,0,0,2,2,2,0],
    [0,2,2,2,0,0,2,0,0,0,1,0,0,2,0],
    [0,2,2,3,0,0,2,0,0,2,2,2,2,2,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

function dibujarEscenario()
{
    for(y=0;y<10;y++)
    {
        for(x=0;x<15;x++) 
        {
            let tile = escenario[y][x];
            ctx.drawImage(tileMap,tile*32,0,32,32,anchoF*x,altoF*y,anchoF,altoF);
        }
    }
}

let Antorcha = function(x,y)
{
    this.x = x;
    this.y = y;

    this.fotograma = 0; // 0-3
    this.retraso = 10;
    this.contador = 0;

    this.cambiaFotograma = function()
    {
        if(this.fotograma < 3)
        {
            this.fotograma++;
        }
        else{
            this.fotograma = 0;
        }
    }

    this.dibuja = function ()
    {
        if(this.contador < this.retraso)
        {
            this.contador++;
        }
        else
        {
            this.contador = 0;
        }
    
        ctx.drawImage(tileMap,this.fotograma*32,0,32,32,anchoF*x,altoF*y,anchoF,altoF);
    }
}

// CLASE JUGADOR //
let Jugador = function()
{
    this.x = 1;
    this.y = 1;
    this.color = '#820c01';
    this.llave = false;
    this.dibuja = function()
    {
        ctx.drawImage(tileMap,32,32,32,32,this.x*anchoF,this.y*altoF,anchoF,altoF);
    }

    this.colisionEnemigo = function(x,y)
    {
        if(this.x == x && this.y == y)
        {
            this.dead();
        }
    }

    this.margenes = function(y,x)
    {
        let colision = false;
        if(escenario[y][x] == 0)
        {
            colision = true;
        }
        return colision;
    }

    this.arriba = function()
    {   
        if(this.margenes(this.y-1,this.x) == false)
        {
            this.y --;
            this.logicaObjetos();
        }
        
    }

    this.abajo = function()
    {   
        if(this.margenes(this.y+1,this.x) == false)
        {
            this.y ++;
            this.logicaObjetos();
        }
    }

    this.izquierda = function()
    {
        if(this.margenes(this.y,this.x-1) == false)
        {
            this.x --;
            this.logicaObjetos();
        }
  
    }

    this.derecha = function()
    {
        if(this.margenes(this.y,this.x+1) == false)
        {
            this.x ++;
            this.logicaObjetos();
        }
        
    }

    this.victoria = function()
    {
        alert("Haz ganado :)");
        this.x = 1;
        this.y = 1;
        this.llave = false;
        escenario[8][3] = 3;
    }
    this.dead = function()
    {
        this.x = 1;
        this.y = 1;
        this.llave = false;
        escenario[8][3] = 3; // vuelve al inicio
        alert("Haz perdido :(");
    }

    this.logicaObjetos = function()
    {
        let objeto = escenario[this.y][this.x];
        // Obtiene la llave //
        if(objeto == 3)
        {
            this.llave = true;
            escenario[this.y][this.x] = 2;
            alert("Haz obtenido la llave!");
        }
        
        // Abrimos la puerta //
        if(objeto == 1 && this.llave == true)
            this.victoria();
        else if(objeto == 1 && this.llave == false)
        {
            alert("Te falta la llave para poder pasar!");
        }
    }
}

// CLASE ENEMIGO //
let malo = function(x,y)
{
    this.x = x;
    this.y = y;
    this.direccion = Math.floor(Math.random()*4);
    this.retraso = 25;
    this.fotograma = 0;

    this.dibuja = function()
    {
        ctx.drawImage(tileMap,0,32,32,32,this.x*anchoF,this.y*altoF,anchoF,altoF);
    }

    this.compruebaColision = function(x,y)
    {
        let colisiona = false;
        if(escenario[y][x] == 0)
        {
            colisiona = true;
        }
        return colisiona;
    }

    this.mueve = function()
    {
        player.colisionEnemigo(this.x,this.y);
        // ARRIBA //
        if(this.contador < this.retraso)
        {
            this.contador++;
        }
        else
        {
            this.contador = 0;    
            if(this.direccion == 0)
            {
                if(!this.compruebaColision(this.x,this.y -1))
                {
                    this.y--;
                }
                else
                {
                    this.direccion = Math.floor(Math.random()*4);
                }
            }
            // ABAJO //
            if(this.direccion == 1)
            {
                if(!this.compruebaColision(this.x,this.y +1))
                {
                    this.y++;
                }
                else
                {
                    this.direccion = Math.floor(Math.random()*4);
                }
            }
            // IZQUIERDA //
            if(this.direccion == 2)
            {
                if(!this.compruebaColision(this.x -1,this.y))
                {
                    this.x--;
                }
                else
                {
                    this.direccion = Math.floor(Math.random()*4);
                }
            }
            // DERECHA //
            if(this.direccion == 3)
            {
                if(!this.compruebaColision(this.x +1,this.y))
                {
                    this.x++;
                }
                else
                {
                    this.direccion = Math.floor(Math.random()*4);
                }
            }
        }        
    }
}


/* funciones del teclado */
/* Eventos de teclado */
document.addEventListener('keydown',function(tecla)
{
    /* ARRIBA */
    if(tecla.keyCode == 38)
    {
        player.arriba();
    }

    /* ABAJO */
    if(tecla.keyCode == 40)
    {
        player.abajo();
    }

    /* IZQUIERDA */
    if(tecla.keyCode == 37)
    {
        player.izquierda();
    }

    /* DERECHA */
    if(tecla.keyCode == 39)
    {
        player.derecha();
    }
});

function principal()
{   
    borraCanvas();
    //console.log('function');
    dibujarEscenario();
    player.dibuja();
    imagenAntorcha.dibuja();
    
    for(c=0;c<enemigo.length;c++)
    {
        enemigo[c].mueve();
        enemigo[c].dibuja();
    }
}


let player;
function inicializar()
{
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    tileMap = new Image();
    tileMap.src = 'imagenes/tilemap.png';

    // creamos al jugador // 
    player = new Jugador();

    // creamos lo enemigos //
    enemigo.push(new malo(3,3));
    enemigo.push(new malo(5,6));
    enemigo.push(new malo(9,2));
    
    // creamos la antorcha //
    imagenAntorcha = new Antorcha(0,0);

    setInterval(function(){
        principal();
    },1000/fps);
}

function borraCanvas()
{
    canvas.width = 750;
    canvas.height = 500;
}


