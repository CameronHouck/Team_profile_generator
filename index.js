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
    inquirer.prompt([
      {
        type:'confirm',
        name: 'addMore',
        message: 'Would you like to add another employee?',
      },
    ])
    .then((userInput) => {
      if (userInput.addMore === true) {
        console.log("prompting for another employee");
        questions();
    }
    else {
      const htmlCard = generateHTMLCard(teamMembers);
      const htmlPage = generateHTMLPage(htmlCard);
      writeFileAsync('./dist/index.html', htmlPage);
  }
    });
  };