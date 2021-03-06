"use strict"
/**
 * Created by garusis on 14/02/17.
 */
import _ from "lodash"
import Promise from "bluebird"


const testimonies = [
  {
    "nameStudent": "Lucenith Toscano",
    "occupation": "Comerciante",
    "content": "Se nace de nuevo cuando se aprende a entender la vida y se hace adicto a la felicidad, la tranquilidad y la realización de los sueños; eso ha sido para mí hacer parte de este equipo. He visto un nuevo amanecer. Gracias a Dios por haberlos puesto en mí camino.",
    "photo": "successcases/lucenith.jpg"
  },
  {
    "nameStudent": "Adiz Camacho",
    "occupation": "Estilista Profesional",
    "content": "Sea este el momento para agradecerle a nuestro líder por el aporte tan importante para nuestras vidas. Espero nos ayude a seguir con sus conocimientos este nuevo año. Le agradezco. Dios le bendiga.",
    "photo": "successcases/adiz.jpg"
  },
  {
    "nameStudent": "Jeremías Graterón",
    "occupation": "Gerente",
    "content": "Tengo el privilegio de haber conocido al DR. Marco Lino por el año 1997, pero fue hacia el año 2008 cuando atravesaba por una no muy buena situación cuando solicite su consejo y fue en ese momento que conocí Marlin Coach Intl. y comencé a practicar sus conocimientos y sus técnicas. Desde ese momento mi vida cambio al punto de poder decir que soy una feliz y llena de bendiciones.",
    "photo": "successcases/jeremias.jpg"
  },
  {
    "nameStudent": "Nercis Patricia Maestre",
    "occupation": "Profesional en artes plásticas.",
    "content": "Gracias Marlin Coach Intl. por cambiar mi estilo de vida, por enseñarme que mis sueños se hacen realidad. Hoy soy una persona nueva, tengo buena salud, mucho amor y gran prosperidad.",
    "photo": "successcases/nercis.jpg"
  },
  {
    "nameStudent": "Deisy Castañeda",
    "occupation": "Estilista Profesional",
    "content": "Por 4 años estuve continuamente enferma, era una persona muy negativa y puedo decir que tuve un pie en la tumba. A gradezco a Dios por haber conocido Marlin Internacional. Conocí sus técnicas, las puse en práctica y ahora confió en mí, soy positiva, soy feliz y tengo éxito en mi vida. Les aconsejo que se den la oportunidad de conocer Marlin Coach Intl.",
    "photo": "successcases/deisy.jpg"
  },
  {
    "nameStudent": "Yanidis Josefina Maestre",
    "occupation": "Coordinadora creativa y ventas.",
    "content": "Soy la seguidora #1 de Marlin Coach Intl. Cuando inicie practicando las técnicas de PNL que enseña del Dr. Marco Lino Alvarez hice la técnica del Swich e inmediatamente vi y sentí los resultados. Es cierto lo que él dice, son técnicas poderosas para producir cambios en tu persona a corto plazo si las practicas. Mediante las técnicas estoy insertando en mi, todo lo bueno y grandioso que yo quiero en mi vida. Hoy día, soy la persona que quiero ser y soy inmensamente feliz.",
    "photo": "successcases/yanidis.jpg"
  },
  {
    "nameStudent": "Delfina Martínez",
    "occupation": "Madre Sustituta (ICBF)",
    "content": "Hasta hace un tiempo, en mi vida solo veía problemas, en miles de formas. Alguna vez llegue a pensar que por mis dolencias físicas iba a morir pronto. Desde que empecé la programación neurolingüística y la participación en todas las conferencias, me di cuenta que poco a poco fui capaz de ir transformando mi propia vida y así mismo, desplegando esa tranquilidad hacia mis seres queridos. Ahora, en mi familia, todo es felicidad. Entonces la unión y la paz en mi hogar, la dicha de aprovechar mi tiempo y hallarle sentido a mi existencia. Soy privilegiada por estar en este maravilloso mundo, cumpliendo una misión.",
    "photo": "successcases/delfina.jpg"
  },
  {
    "nameStudent": "Martha Ballesteros",
    "occupation": "Gerente",
    "content": "Dios los bendiga por ayudarme a salir adelante porque estuvieron conmigo cuando los necesitaba. Gracias a Dios y a ustedes comienzo el mejor año de mi vida. Dios los bendiga para que sigan ayudando a tanta gente como yo. Los necesitamos.",
    "photo": "successcases/martha.jpg"
  },
  {
    "nameStudent": "Leonel Quintero",
    "occupation": "Asesor de procesos de cambio",
    "content": "Los conocimientos que he adquirido en Marlin Coach Intl. se podrían llamar milagrosas y no alcanza la vida para agradecer al Coach  Marco Lino Alvarez y a las técnicas que me ha trasmitido.    Me gusta tanto los resultados de la programación neurolingüística que decidí convertirme en asesor de procesos de cambio y Coaching para aportar mi grano de arena al mundo,  logros conseguidos con PNL",
    "photo": "successcases/leonel.jpg"
  }
]

module.exports = async function (app) {
  let Testimony = app.models.Testimony

  let promises = _.map(testimonies, (testimony) => Testimony.create(testimony))
  await Promise.all(promises)
}
