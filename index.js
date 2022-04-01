const art = require("ascii-art");
const mysql = require("mysql2");
const cTable = require("console.table");
const inquirer = require("inquirer");
const { ui } = require("inquirer");
const seed = require("./db/seed.sql");
require("dotenv").config();

const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: process.env.USER,
    // MySQL password
    password: process.env.PASS,
  },
  console.log(`Connected to the database.`)
);

mainmenu = () => {
  try {
    let rendered = art
      .font("THE WONDEROUS EMPLOYEE TRACKER", "doom")
      .completed();
  } catch (err) {
    console.error("Something went wrong with the ASCII");
  }

  inquirer
    .prompt([
      {
        type: "list",
        name: "menuchoice",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "Add Employee",
          "Update Employee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
          "Quit",
        ],
      },
    ])
    .then((choice) => {
      switch (choice.menuchoice) {
        case "View All Employees":
          viewEmployees();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Employee Role":
          updateEmployRole();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "Add Role":
          addRole();
          break;
        case "View All Departments":
          viewDepartments();
          break;
        case "Add Department":
          addDepartments();
          break;
        case "Quit":
          return;
        default:
          console.log(
            "I'm sorry I didn't understand your choice, please start over."
          );
          mainmenu();
      }
    });
};

viewDepartments = () => {};

addEmployee = () => {};

updateEmployRole = () => {};

viewRoles = () => {};

addRole = () => {};

viewDepartments = () => {};

addDepartments = () => {};

mainmenu();
