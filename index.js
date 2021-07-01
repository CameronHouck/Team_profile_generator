const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");

const Employee = require("./lib/Employee");
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");

const teamMembers = [];

const writeFileAsync = util.promisify(fs.writeFile);

const managerQuestion = [
  {
    type: "input",
    name: "officeNum",
    message: "Please input the office number.",
  },
];
const engineerQuestion = [
  {
    type: "input",
    name: "github",
    message: "Enter your employees GitHub username.",
  },
];
const internQuestion = [
  {
    type: "input",
    name: "schoolName",
    message: "Enter the name of your intern's school.",
  },
];
const additionalMember = () => {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "addMore",
        message: "Would you like to add another employee?",
      },
    ])
    .then((userInput) => {
      if (userInput.addMore === true) {
        console.log("prompting for another employee");
        userPrompt();
      } else {
        const htmlCard = generateHTMLCard(teamMembers);
        const htmlPage = generateHTMLPage(htmlCard);
        writeFileAsync("./dist/index.html", htmlPage);
      }
    });
};

const userPrompt = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "role",
        message: "Select a role card you'd like to build.",
        choices: ["Manager", "Engineer", "Intern"],
      },
      {
        type: "input",
        name: "name",
        message: "What is your employee's name?",
      },
      {
        type: "input",
        name: "id",
        message: "What is your employee's ID?",
      },
      {
        type: "input",
        name: "email",
        message: "Enter your employees email adress.",
      },
    ])
    .then((userInput) => {
      if (userInput.role === "Manager") {
        inquirer.prompt(managerQuestion).then((userInput2) => {
          const ManagerDude = new Manager(
            userInput.name,
            userInput.id,
            userInput.email,
            userInput2.officeNumber
          );
          teamMembers.push(ManagerDude);
          promptAnotherEmployee();
        });
      } else if (userInput.role === "Engineer") {
        inquirer.prompt(engineerQuestion).then((userInput2) => {
          const EngineerDude = new Engineer(
            userInput.name,
            userInput.id,
            userInput.email,
            userInput2.github
          );
          teamMembers.push(EngineerDude);
          promptAnotherEmployee();
        });
      } else if (userInput.role === "Intern") {
        inquirer.prompt(internQuestion).then((userInput2) => {
          const InternDude = new Intern(
            userInput.name,
            userInput.id,
            userInput.email,
            userInput2.schoolName
          );
          teamMembers.push(InternDude);
          promptAnotherEmployee();
        });
      } else {
        const employee = new Employee(
          userInput.name,
          userInput.id,
          userInput.email,
          userInput.role
        );
        teamMembers.push(employee);
      }
    });
};
