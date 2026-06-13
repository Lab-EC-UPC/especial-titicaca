import type { CreditDepartment } from "./types";

export const CREDITS: CreditDepartment[] = [
  {
    title: "Coordinación de Proyecto",
    groups: [
      { role: "Coordinación general", names: ["Mayté Ciriaco"] },
      { role: "Edición general", names: ["Lorena Obregón"] },
      {
        role: "Coordinación de proyecto",
        names: ["Andre Poma", "Maria Isabel Jiménez"],
        columns: 2,
      },
    ],
  },
  {
    title: "Diseño Gráfico",
    groups: [
      { role: "Coordinación de Diseño Gráfico", names: ["Maria Isabel Jiménez"] },
      {
        role: "Diseño de personajes",
        names: ["Jessica Quispe", "Stefania Pastus", "Claudia Navarrete", "Rosa Palpa"],
        columns: 4,
      },
      {
        role: "Diseño de props",
        names: ["Kimberly Zevallos", "Claudia Navarrete"],
        columns: 2,
      },
      {
        role: "Diseño de entornos",
        names: ["Stefany More", "Camila Medina", "Betzabeth Chavez", "Diana Anaya"],
        columns: 4,
      },
      {
        role: "Diseño de gráficos",
        names: [
          "Stefany More",
          "Claudia Navarrete",
          "Betzabeth Chavez",
          "Jessica Quispe",
          "Flavia Torres",
          "Stefania Pastus",
          "Kimberly Zevallos",
          "Rosa Palpa",
          "Diana Anaya",
          "Camila Medina",
        ],
        columns: 4,
      },
      {
        role: "Animación y modelado 3D",
        names: ["Xiomara Pucllas", "Edgar Viviano", "Camila Lara"],
        columns: 3,
      },
    ],
  },
  {
    title: "Audiovisuales y redes sociales",
    groups: [
      { role: "Coordinación de Audiovisuales y redes sociales", names: ["Andre Poma"] },
      { role: "Montajista Documental", names: ["Ximena Maticorena"] },
      { role: "Community manager", names: ["Jhordan Canchari"] },
      {
        role: "Redes sociales",
        names: ["Paolo Alejandro Lovaton Flores", "Diana Anaya", "Claudia Navarrete"],
        columns: 3,
      },
      { role: "Diseño de campañas", names: ["Letymar Namoc"] },
    ],
  },
  {
    title: "Análisis de datos y políticas públicas",
    groups: [
      {
        role: "Coordinación de Análisis de datos y políticas públicas",
        names: ["Fabrizio Monge"],
      },
      {
        role: "",
        names: [
          "Angel Chavez",
          "Antony Alvarez",
          "Kimberly Rojas",
          "Valentina Elías",
          "Diego Jesús",
          "Rosa Retuerto",
          "José Bellido",
        ],
        columns: 4,
      },
      {
        role: "Pedidos y recopilación inicial de información",
        names: [
          "Renzo Peña",
          "Maria Fe Chirinos",
          "Gabriel Morales",
          "Xiomara Yon",
          "Sunmy Soto",
          "Joaquín Suazo",
        ],
        columns: 4,
      },
    ],
  },
  {
    title: "Desarrollo",
    groups: [
      {
        role: "Coordinación de Desarrollo",
        names: ["Matías Ascasibe"],
      },
      {
        role: "",
        names: [
          "Rody Vilchez",
          "Lucero Obispo",
          "Vilder Sandoval",
          "Alfredo Aragón",
          "Luciano Ruiz",
        ],
        columns: 4,
      },
    ],
  },
  {
    title: "Periodismo",
    groups: [
      {
        role: "Coordinación de Periodismo",
        names: ["Joselyn Gavancho", "Nadira Jave Berríos"],
      },
      {
        role: "",
        names: [
          "Joshua Durán",
          "Dayanara Velázquez",
          "Romina Briceño",
          "Greta Lomas",
          "Dana Toro",
          "Luciana López",
        ],
        columns: 4,
      },
    ],
  },
];
