INSERT INTO department (id, name)
VALUES (1, "Sales"),
       (2, "Engineering"),
       (3, "Finance"),
       (4, "Legal");
       

INSERT INTO role (id, title, salary, department_id)
VALUES (1, "Salesperson", 80000, 1),
       (2, "Lead Engineer", 150000, 2),
       (3, "Software Engineer", 120000, 2),
       (4, "Account Manager", 160000, 3),
       (5, "Accountant", 125000, 3),
       (6, "Legal Team Lead", 250000, 4),
       (7, "Lawyer", 190000, 4),
       (8, "Lead Sales", 150000, 1);
       

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, "Mike", "Chan", 8, null),
       (2, "Ashley", "Rodriguez", 2, null),
       (3, "Kevin", "Tupik", 3, 2),
       (4, "Kunal", "Singh", 4, null),
       (5, "Malia", "Brown", 5, 4),
       (6, "Sarah", "Lourd", 6, null),
       (7, "Tom", "Allen", 7, 6),
       (8, "Dwight", "Schrute", 1, 1)
       
