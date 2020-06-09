//requirements
const inquire = require("inquirer");
const mysql = require("mysql");
const ctable = require("console.table");

// answer choices strings
//for queryUser();
const TEXT_ADD = "Add";
const TEXT_VIEW = "View";
const TEXT_UPDATE = "Update";
const TEXT_EXIT = "Exit";

//for add() and view();
const TEXT_DEPARTMENT = "Department";
const TEXT_ROLE = "Role";
const TEXT_EMPLOYEE = "Employee";

//for update();
const TEXT_YES = "yes";
const TEXT_NO = "no";

//setup the connection
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "cms_DB"
});

//start the connection and prompt the user for how to use the table
connection.connect(function(error){
    if(error) throw error;

    console.log("Connected with ID: ", connection.threadId);

    //start the main function 
    queryUser();
});

function queryUser(){
    inquire.prompt({
        name: "action",
        type: "list",
        message: "Would you like to Add, View, or Update?",
        choices: [TEXT_ADD, TEXT_VIEW, TEXT_UPDATE, TEXT_EXIT]
    }).then(function(response){
        
        //switch function handle responses to first question about adding, viewing, and updating
        switch(response.action){
            case TEXT_ADD:
                addToTable();
                break;
            case TEXT_VIEW:
                view();
                break;
            case TEXT_UPDATE:
                update();
                break;
            case TEXT_EXIT:
                connection.end();
                break;
            default:
                console.log("text shouldn't appear, there is something wrong with the queryUser() prompt or the switch after.");
        }
    });
}

//the function called when the user selects to add in the program
function addToTable(){
    inquire.prompt({
        name: "action",
        type: "list",
        message: "Add a department, role, or employee?",
        choices: [TEXT_DEPARTMENT, TEXT_ROLE, TEXT_EMPLOYEE]
    }).then(function(response){

        //switch function to chose which add function to employ
        switch(response.action){
            case TEXT_DEPARTMENT:
                addDepartment();
                break;
            case TEXT_ROLE:
                addRole();
                break;
            case TEXT_EMPLOYEE:
                addEmployee();
                break;
            default:
                console.log("text shouldn't appear, something's wrong with the add() prompt, or the switch after.")
        }
    });
}

//function to add department to the department table
function addDepartment(){
    inquire.prompt({
        name: "name",
        type: "input",
        message: "Name of department to add"
    }).then(function(response){
        connection.query(
        "INSERT INTO department SET ?",
        { 
            name: response.name
        },
        function(err){
            if(err) throw err;
            console.log(`New department ${response.name} created.`);
            
        })
    });
}

//function to add a role to the role table
function addRole(){
    //select all the departments to put the role into
    const departments = [];
    connection.query("SELECT name FROM department", function(err, res){
        if(err) throw err;
        
        res.forEach(result =>{
            departments.push(result.name);
        });
    });

    inquire.prompt([{
        name: "title",
        type: "input",
        message: "Enter new role's title"
    },
    {
        name: "salary",
        type: "input",
        message: "Enter the yearly salary of the new role"
    },
    {
        name: "department",
        type: "list",
        message: "Choose a department for the role",
        choices: departments
    }]).then(function(response){
        const departmentId = departments.indexOf(response.department) + 1;

        connection.query("INSERT INTO role SET ?",
        {
            title: response.title,
            salary: response.salary,
            department_id: departmentId
        },
        function(error){
            if(error) throw error;
            console.log(`New role added, ${response.title}, salary: ${response.salary}`);
        })
    });
}

//add employee function adds an employee
function addEmployee(){
    //used for the none option on manager
    const TEXT_NONE = "none";
    
    //create the list of roles that the new employee can fill
    const roles = [];
    connection.query("SELECT title FROM role", function(err, res){
        if(err) throw err;
        
        res.forEach(result =>{
            roles.push(result.title);
        });
    });

    //create list of employee's that could be the new employee's manager
    const employees = [];
    connection.query("SELECT first_name FROM employee", function(err, res){
        if(err) throw err;

        res.forEach(result =>{
            employees.push(result.first_name)
        });
        employees.push(TEXT_NONE);
    });
    
    inquire.prompt([{
        name: "firstName",
        type: "input",
        message: "Employee's first name"
    },
    {
        name: "lastName",
        type: "input",
        message: "Employee's last name"
    },
    {
        name: "role",
        type: "list",
        choices: roles,
        message: "Select role for the new Employee"
    },
    {
        name: "manager",
        type: "list",
        choices: employees,
        message: "Choose the new employee's manager"
    }
    ]).then(function(response){
        const newRoleId = roles.indexOf(response.role) + 1;
        let newManagerId;
        if(response.manager === TEXT_NONE){
            newManagerId = null;
        }
        else{
            newManagerId = employees.indexOf(response.manager) + 1;
        }
    
        connection.query("INSERT INTO employee SET ?",{
            first_name: response.firstName,
            last_name: response.lastName,
            role_id: newRoleId,
            manager_id: newManagerId
        }, function(error){
            if(error) throw error;

            console.log(`New employee added, ${response.firstName} ${response.lastName}, ${response.role}, manager: ${response.manager}`);
        });
    });
}

//similar to add, a function that views the table requested
function view(){
    inquire.prompt({
        name: "action",
        type: "list",
        message: "View departments, roles, or employees?",
        choices: [TEXT_DEPARTMENT, TEXT_ROLE, TEXT_EMPLOYEE]
    }).then(function(response){

        //switch function to chose which table to view
        switch(response.action){
            case TEXT_DEPARTMENT:
                viewData("department");
                break;
            case TEXT_ROLE:
                viewData("role");
                break;
            case TEXT_EMPLOYEE:
                viewData("employee");
                break;
            default:
                console.log("text shouldn't appear, something's wrong with the view() prompt, or the switch after.")
        }

    });
}

//function should console table from the database based on the name of table passed into
function viewData(table){
    console.log("\n\n\n");
    connection.query("SELECT * FROM " + table, function(error, results){
        if(error) throw error;

        console.table(results);
    });
}

//update function when the user chooses to update, displays a yes or no confirmation
function update(){
    const employeeList = [];
    const roles = [];
    connection.query("SELECT * FROM employee", function(error, results){
        if(error) throw error;

        results.forEach(result =>{
            employeeList.push(result.first_name);
        });
        //console.log(employeeList);
    });
    connection.query("SELECT title FROM role", function(err, res){
        if(err) throw err;
        
        res.forEach(result =>{
            roles.push(result.title);
        });
    });

    inquire.prompt([{
        name: "buffer",
        type: "list",
        message: "press enter to start the update",
        choices: ["enter"]
    },
    {
        name: "employee",
        type: "list",
        message: "choose employee to update role",
        choices: employeeList
    },
    {
        name: "role",
        type: "list",
        message: "Choose the employee's new role",
        choices: roles
    }]).then(function(response){
        connection.query("UPDATE employee SET ? WHERE ?", [{ role_id: roles.indexOf(response.role) + 1 },{ first_name: response.employee }], function(error, response){
            if(error) throw error;

            console.log(response.affectedRows + " employee role updated");
        });
    });
}