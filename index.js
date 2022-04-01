const art = require("ascii-art");
const mysql = require("mysql2");
const cTable = require("console.table");
const inquirer = require("inquirer");
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

const opener = () =>
  art.font("THE WONDEROUS EMPLOYEE TRACKER", "doom", (err, rendered) => {
    if (err) {
      console.log(err);
    }
    console.log(rendered);
  });

mainmenu = () => {
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
    ])
    .then((choices) => {
      const answers = [choices.first_name, choices.last_name];
      db.query(`SELECT roles.id, roles.title FROM roles`, (err, results) => {
        if (err) throw err;
        const roles = [];
        roles.push({ id: results.roles.id, value: results.roles.title });
        inquirer.prompt([]);
      });

      console.log("Employee added successfully!");
      mainmenu();
    });
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

addRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "What is the title of the new Role?",
      },
      {
        type: "number",
        name: "salary",
        message: "What is the salary of the new Role?",
      },
    ])
    .then((choices) => {
      const answers = [choices.title, choices.salary];
      let sql = "SELECT * FROM departments";
      db.query(sql, (err, results) => {
        const departments = [];
        departments.push({
          id: results.departments.id,
          value: results.departments.name,
        });
        inquirer
          .prompt([
            {
              type: "list",
              name: "dep_id",
              message: "What department does this role belong to?",
              choices: departments,
            },
          ])
          .then((choices) => {
            answers.push(choices.dep_id);
            let sql = `INSERT INTO roles (title, salary, department_id)
            VALUES (?, ?, ?)`;
            db.query(sql, answers, (err, results) => {
              if (err) {
                console.log(err);
                return;
              }
              console.log("Role successfully added!");
              mainmenu();
            });
          });
      });
    });
};

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

addDepartments = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "depname",
        message: "What is the name of the new department?",
      },
    ])
    .then((choices) => {
      let sql = `INSERT INTO departments (name)
        VALUES (?)`;
      db.query(sql, choices.depname, (err, results) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Department added successfully!");
        mainmenu();
      });
    });
};
opener();
mainmenu();
