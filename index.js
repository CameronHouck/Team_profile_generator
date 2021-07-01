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
const promptAnotherEmployee = () => {
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
        message: "Enter your employees email address.",
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

let generateHTMLCard = (newTeamObj) => {
  console.log("team object", newTeamObj);
  let newCard = "";
  for (let i = 0; i < newTeamObj.length; i++) {
    let finalPrompt =
      newTeamObj[i].office || newTeamObj[i].github || newTeamObj[i].school;
    let keys = Object.keys(newTeamObj[i]);
    let lastKey = keys[3];
    let finalOption = lastKey + ":" + finalPrompt;
    if (lastKey === undefined) {
      finalOption = "";
    } else if (lastKey === "github") {
      finalOption = `GitHub : <a value="Open Window"
        onclick="window.open('https://www.github.com/${newTeamObj[i].github}')"> ${newTeamObj[i].github}</a>`;
      console.log(finalOption);
    } else {
      console.log(finalOption);
    }
    let { name, id, email } = newTeamObj[i];
    console.log(name, id, email, finalOption);
    newCard += `  
  <div class="card" style="width: 18rem;">
  <div class="container">
    <div style="background-color:rgb(66, 57, 240); color: white;">
       <h4 class="display-6">${name}</h4>
       <h4>${newTeamObj[i].constructor.name}</h4>
     </div> 
      <ul class="list-group">
        <li class="list-group-item">ID: ${id}</li>
        <li class="list-group-item">Email: <a href="mailto:${email}">${email}</a></li>
        <li class="list-group-item">${finalOption} </li>
      </ul>
  </div>
  </div>`;
  }
  return newCard;
};
const generateHTMLPage = (htmlCard) =>
  `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <link rel="stylesheet" type="text/css" href="./style.css" />
      <title>Document</title>
    </head>
    <body>
  ${htmlCard}
    </body>
    </html>`;
const writeToFile = (data) => {
  fs.writeFile("./dist/index.html", data, (error) =>
    error ? console.log("Error!") : console.log("Success!")
  );
};

const init = () => {
  userPrompt();
};
init();
