const art = require("ascii-art");
const mysql = require("mysql2");
const cTable = require("console.table");
const inquirer = require("inquirer");
const { ui } = require("inquirer");
require("dotenv").config();

const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: process.env.USER,
    // MySQL password
    password: process.env.PASS,
    database: process.env.DB,
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

viewEmployees = () => {
  let sql = "SELECT * FROM employees";

  db.query(sql, (err, results) => {
    if (err) {
      console.log(err);
    }
    let table = cTable.getTable(results);
    console.log(table);
    mainmenu();
  });
};

addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the Employees first name?",
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the Employees last name?",
      },
      {
        type: "list",
        name: "role_id",
        message: "What is this Employees Role be?",
        choices: [checkRoles],
      },
      {
        type: "list",
        name: "manager_id",
        message: "What is the Employees first name?",
        choices: [checkManagers],
      },
    ])
    .then((choices) => {});
};

updateEmployRole = () => {};

viewRoles = () => {
  let sql = "SELECT * FROM roles";

  db.query(sql, (err, results) => {
    if (err) {
      console.log(err);
    }
    let table = cTable.getTable(results);
    console.log(table);
    mainmenu();
  });
};

addRole = () => {};

viewDepartments = () => {
  let sql = "SELECT * FROM departments";

  db.query(sql, (err, results) => {
    if (err) {
      console.log(err);
    }
    let table = cTable.getTable(results);
    console.log(table);
    mainmenu();
  });
};

addDepartments = () => {};

mainmenu();

const checkRoles = db.query(
  `SELECT roles.id, roles.title FROM roles`,
  (err, rows) => {
    if (err) throw err;
    const roles = [];

    for (let i = 0; i < rows.length; i++) {
      roles.push({ id: rows[i].roles.id, value: rows[i].roles.title });
    }
    roles.push({ name: "None", value: null });
    return roles;
  }
);

const checkManagers = db.query(
  `SELECT CONCAT(first_name, ' ',  last_name) AS manager FROM employee WHERE manager_id IS NULL;`,
  (err, rows) => {
    if (err) throw err;
    const managers = [];

    for (let i = 0; i < rows.length; i++) {
      managers.push({ name: rows[i].manager, value: i + 1 });
    }
    managers.push({ name: "None", value: null });
    return managers;
  }
);
