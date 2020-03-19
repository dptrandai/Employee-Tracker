const mysql = reqruire("mysql");
const inquirer = require("inquirer");

//Makes the SQL connectu=ion
const connection = mysql.createConnection({
    host:"localhost",
    port: 3306,
    password: "dp47964796",
    user: "root",
    database: "employee_tracker"
});

//connecting to the database
connection.connect(function(err){
    if (err) throw err
    start()
})

function start() {
    inquirer.prompt([
        {
            name: "options",
            type: "list",
            message: "Which would you like to do?",
            choices: [
                "add department",
                "add roles",
                "add emplloyees",
                "view department",
                "view roles",
                "view employees",
                "update employee roles"

            ]

        }
    ]).then(function(answers){
        switch(answers.options){
            case "add department": addDepartment()
                break;
            case "view department": viewDepartment()
                break;
            case "add roles": addRole()
                break;
            case "view roles": viewRole()
                break;
            case "add employees": addEmployees()
                break;
            case "view employees": viewEmployees()
                break;
            default:
                break;
        }
    })

}

//function that adds department
function addDepartment(){
    inquirer.prompt([
        {
            type: "input",
            name: "departmentName",
            message: "What is the department's name?"
        },
        {
            type: "number",
            name: "depId",
            message: "What is the department's ID?"
        }
        
    ]).then(function(answer){
        const query = "INSERT into department SET ?"
        connection.query(query, {
            name: answer.departmentName,
            id: answer.depId
        },
            function (err){
                if (err) throw err
                console.log("The department has been added")
                start()
            })
    })
};

//function to view the department
function viewDepartment() {
    const query = "SELECT * FROM department"
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].id + "-" + res[i].name)
        }
        start()
    })
}

//function that adds role
function addRole() {

    inquirer.prompt([
        {
            type: "number",
            name: "roleId",
            message: "What is the role ID?"
        },
        {
            type: "input",
            name: "roleTitle",
            message: "What is the roles title?"
        },
        {
            type: "number",
            name: "roleSalary",
            message: "What is the salary for this role?"
        },
        {
            type: "input",
            name: "roleDepId",
            message: "What is the roles department ID?"
        }
    ]).then(function (answers) {
        const query = "INSERT INTO roles SET ?";
        connection.query(query, {
            id: answers.roleId,
            salary: answers.roleSalary,
            title: answers.roleTitle,
            department_id: answers.roleDepId
        },
            function (err) {
                if (err) throw err;
                console.log("role added")
                start()
            })

    })

}

//function to view roles
function viewRole() {
    const query = "SELECT * FROM roles"
    connection.query(query, function (err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            console.log('role id:' + res[i].id + "||" + ' role salary:' + res[i].salary + "||" + ' role title:' + res[i].title + "||" + ' roles department id:' + res[i].department_id)
        }
        start()
    })
}

//function to add employees
function addEmployees() {
    inquirer.prompt([
        {
            name: 'employeeId',
            type: 'number',
            message: 'What is the employees ID?'
        },
        {
            name: 'employeesFirstName',
            type: 'input',
            message: 'What is the employees first name?'
        },
        {
            name: 'employeesLastName',
            type: 'input',
            message:'What is the employees last name?'
        },
        {
            name: 'employeeRoleId',
            type: 'number',
            message: 'What is the employees role ID?'
        },
        {
            name: 'employeeManagerId',
            type: 'number',
            message: 'What is the employees managers ID?'
        }
    ]).then(function (answers) {
        const query = "INSERT INTO employees SET ?"
        connection.query(query, {
            id: answers.employeeId,
            first_name: answers.employeesFirstName,
            last_name: answers.employeesLastName,
            role_id: answers.employeeRoleId,
            manager_id: answers.employeeManagerId

        }, function (err) {
            if (err) throw err;
            console.log("employee added")
            start()
        })
    })
}

//function to view all employess
function viewEmployees() {
    const query = "SELECT * FROM employees"
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log('employee id: ' + res[i].id + '||' + ' employee first name: ' + res[i].first_name + '||' + 'employee last name: ' + res[i].last_name + '||' + 'employees role id: ' + res[i].role_id + '||' + 'employees manager id: ' + res[i].manager_id)
        }
        start()
    })
}
