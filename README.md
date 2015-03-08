#Bikingos

Juego de realidad aumentada; domina la ciudad usando ecobicis.

Este repositorio contiene la API interna del juego: está construida con base en los [datos abiertos de ecobici](http://datos.labplc.mx/movilidad.info) proporcionados durante el [segundo festival de datos de la ciudad de México](http://hack.labcd.mx/).


## El juego no termina aquí


Para jugar, necesitas instalar la [aplicación móvil](https://github.com/Alevardi/bikingos-app) en tu android.

También puedes ver el leaderboard general del juego y los mapas de calor de áreas dominadas por cada equipo en el mapa general en la [aplicación web](https://github.com/Alevardi/bikingos-web)

Este juego es un prototipo desarrollado para el [#HackCDMX 2015](http://hack.labcd.mx/).

##Desarrolladores

###Dependencias:

Para contribuir a Bikingos-api es necesario tener instalado en tu computadora:

+ [Node.js 0.10.* o superior](https://nodejs.org/)
 - Plataforma construida sobre el runtime para javascript de Google Chrome para construir aplicaciones en tiempo real y escalables.
+ [npm 2.5 o superior](https://www.npmjs.com/)
 - Node Package Manager: administrador de paquetes y dependencias para node.js
+ [git 2.3 o superior](http://git-scm.com/)
 - Control de versiones utilizado por Bikingos y sus dependencias.
+ [node-gyp1.0 o superior](https://www.npmjs.com/package/node-gyp)
 - Compilador de módulos nativos multiplatadorma para node.js
+ [MongoDB](http://www.mongodb.org/)
 - gestionador de bases de datos no relacional orientado a documentos.

###Configuración:

Para ejecutar bikingos-api exitosamente es necesario [instalar y configurar correctamente](https://github.com/joyent/node/wiki/installation) node.js y sus variables de entorno.

[instalar y configurar correctamente](http://git-scm.com/book/en/v2/Getting-Started-Installing-Git) git y sus variables de entorno.

Y finalemnte [Instalar y configurar correctamente](http://docs.mongodb.org/manual/) MongoDB

Los procesos de instalación y configuración varían en función del sistema operativo que utilices, y están cubiertos en las guías propocionadas anteriormente.

###Configuración de desarrollo local:

Para comenzar a contribuir a bikingos-api:

Clona este repositorio:

`git clone https://github.com/Ardroz/bikingos-api`

Instala sus dependencias:

`npm install`

Empaqueta:

`grunt`

Y ejecuta:

`node index.js dev`


###Despliegue:

Bikingos está hosteado en Digital Ocean; puedes desplegar tu propia copia allí o en tu servicio de hosting preferido.

Para levantarlo, [puedes usar nuestros scripts de configuración](https://gist.github.com/Alevardi/5d4ad514457ddd42ced8)
