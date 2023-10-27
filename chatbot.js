// chatbot.js

// Retrieve the chatbox and user input elements
const chatboxElement = document.getElementById("chatbox");
const userInputElement = document.getElementById("userInput");

let medicineDatabase = null;

// Function to load the medicine database
function loadMedicineDatabase() {
  medicineDatabase = medicine_database;
}

// Function to initialize the chatbot
function initializeChatbot() {
  loadMedicineDatabase();
  // Perform any additional initialization steps here
}

// Function to process user input
function processUserInput() {
  const userInput = userInputElement.value.trim();
  userInputElement.value = "";
  displayUserMessage(userInput);

  if (medicineDatabase) {
    if (isGreeting(userInput)) {
      displayMessage("Hello! How can I assist you today?", "bot");
    } else if (userInput.toLowerCase().startsWith("i have")) {
      const symptoms = extractSymptoms(userInput);
      if (symptoms.length > 0) {
        const foundConditions = [];
        const unmatchedSymptoms = [];

        symptoms.forEach((symptom) => {
          const condition = findConditionBySymptom(symptom.trim());
          if (condition) {
            foundConditions.push(condition);
          } else {
            unmatchedSymptoms.push(symptom);
          }
        });

        if (foundConditions.length > 0) {
          displayConditions(foundConditions);
        } else {
          displayMessage(
            "Sorry, I couldn't find information for the following symptoms: " +
              unmatchedSymptoms.join(", "),
            "bot"
          );
        }
      } else {
        displayMessage("Please specify the symptoms after 'I have'.", "bot");
      }
    } else {
      displayMessage("I'm sorry, I didn't understand. Can you please rephrase your input?", "bot");
    }
  } else {
    displayMessage("Please wait. Loading the medicine database...", "bot");
  }
}

// Function to find a condition in the medicine database based on a symptom
function findConditionBySymptom(symptom) {
  const symptomLowercase = symptom.toLowerCase();
  for (const condition in medicineDatabase) {
    if (medicineDatabase.hasOwnProperty(condition)) {
      const conditionData = medicineDatabase[condition];
      const medications = conditionData.medications.map((medication) =>
        medication.toLowerCase()
      );
      if (
        medications.includes(symptomLowercase) ||
        condition.toLowerCase() === symptomLowercase ||
        conditionData.usage.toLowerCase().includes(symptomLowercase)
      ) {
        return condition;
      }
    }
  }
  return null;
}

// Function to display the conditions and medication information
function displayConditions(conditions) {
  conditions.forEach((condition) => {
    const conditionData = medicineDatabase[condition];
    const medications = conditionData.medications.join(", ");
    const usage = conditionData.usage;
    const sideEffects = conditionData.side_effects;
    const precautions = conditionData.precautions;

    const message =
      `Condition: ${condition}\n` +
      `Medications: ${medications}\n` +
      `Usage: ${usage}\n` +
      `Side Effects: ${sideEffects}\n` +
      `Precautions: ${precautions}`;

    displayMessage(message, "bot");
  });
}

// Function to display a message in the chatbox
function displayMessage(message, sender) {
  const messageElement = document.createElement("p");
  messageElement.textContent = message;
  messageElement.classList.add("message", sender + "Message");
  chatboxElement.appendChild(messageElement);
  chatboxElement.scrollTop = chatboxElement.scrollHeight;
}

// Function to display a user message in the chatbox
function displayUserMessage(message) {
  displayMessage(message, "user");
}

// Function to check if user input is a greeting
function isGreeting(userInput) {
  const greetings = ["hello", "hi", "hey"];
  const userInputLowercase = userInput.toLowerCase();

  for (const greeting of greetings) {
    if (userInputLowercase.includes(greeting)) {
      return true;
    }
  }

  return false;
}

// Function to extract symptoms from user input
function extractSymptoms(userInput) {
  const symptomText = userInput.toLowerCase().replace("i have", "").trim();
  return symptomText.split(",").map((symptom) => symptom.trim());
}

// Initialize the chatbot
initializeChatbot();