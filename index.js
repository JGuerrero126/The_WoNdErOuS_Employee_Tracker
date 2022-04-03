const figlet = require("figlet");
const mysql = require("mysql2");
const cTable = require("console.table");
const inquirer = require("inquirer");
require("dotenv").config();

const opener = () => {
  figlet.text(
    "WELCOME TO THE WONDEROUS EMPLOYEE TRACKER",
    {
      font: "Doom",
      horizontalLayout: "fitted",
      verticalLayout: "fitted",
      width: 80,
      whitespaceBreak: true,
    },
    function (err, data) {
      if (err) {
        console.log("UH OH SOMETHING WENT WRONG WITH FIGLET! OH FIG!");
        console.dir(err);
        return;
      }
      console.log(data);
    }
  );
};

const db = mysql.createConnection(
  {
    host: "localhost",
    user: process.env.USER,
    password: process.env.PASS,
    database: process.env.DB,
  },
  console.log()
);

const mainmenu = () => {
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

const viewEmployees = () => {
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

const addEmployee = () => {
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
        const roles = results.map(({ id, title }) => ({
          name: title,
          value: id,
        }));
        inquirer
          .prompt([
            {
              type: "list",
              name: "role",
              message: "What will this Employee's role be?",
              choices: roles,
            },
          ])
          .then((rolechoice) => {
            const role = rolechoice.role;
            answers.push(role);
            db.query(
              `SELECT * FROM employees WHERE manager_id IS NULL`,
              (err, results) => {
                if (err) throw err;
                const managers = results.map(
                  ({ id, first_name, last_name }) => ({
                    name: first_name + " " + last_name,
                    value: id,
                  })
                );
                inquirer
                  .prompt([
                    {
                      type: "list",
                      name: "manager",
                      message: "Who will be their manager?",
                      choices: managers,
                    },
                  ])
                  .then((managerchoice) => {
                    const manager = managerchoice.manager;
                    answers.push(manager);
                    let sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                        VALUES (?, ?, ?, ?)`;
                    db.query(sql, answers, (err) => {
                      if (err) throw err;
                      console.log("Employee added successfully!");
                      viewEmployees();
                      mainmenu();
                    });
                  });
              }
            );
          });
      });
    });
};

const updateEmployRole = () => {
  db.query(`SELECT * FROM employees`, (err, results) => {
    if (err) throw err;
    const employees = results.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "employee",
          message: "Which Employee did you want to update the Role for?",
          choices: employees,
        },
      ])
      .then((employeeChoice) => {
        const answers = [employeeChoice.employee];
        db.query(`SELECT roles.id, roles.title FROM roles`, (err, results) => {
          if (err) throw err;
          const roles = results.map(({ id, title }) => ({
            name: title,
            value: id,
          }));
          inquirer
            .prompt([
              {
                type: "list",
                name: "role",
                message: "What will this Employee's new Role be?",
                choices: roles,
              },
            ])
            .then((roleChoice) => {
              const role = roleChoice.role;
              answers.push(role);
              const { employee, roles } = answers;
              const choices = [roles, employee];
              let sql = `UPDATE employees
              SET role_id = ?
                WHERE id = ?`;
              db.query(sql, choices, (err, results) => {
                if (err) throw err;
                viewEmployees();
                console.log("Employees Role Successfully Updated!! Wooo!");
                mainmenu();
              });
            });
        });
      });
  });
};

const viewRoles = () => {
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

const addRole = () => {
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
        if (err) throw err;
        const departments = results.map(({ id, name }) => ({
          name: name,
          value: id,
        }));
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
              viewRoles();
              console.log("Role successfully added!");
              mainmenu();
            });
          });
      });
    });
};

const viewDepartments = () => {
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

const addDepartments = () => {
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
