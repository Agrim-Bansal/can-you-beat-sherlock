import {GoogleGenerativeAI, HarmCategory, HarmBlockThreshold} from "@google/generative-ai";



const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  systemInstruction: "Do not acknowledge prompts in your response and do not break the fourth wall. Do not bold or bullet the text.",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};




async function run() {
  
  console.log(result.response.text());
  }
  
export default async function Handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if(req.body.function == "start"){
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });
    const result = await chatSession.sendMessage(`create a modern and unique murder mystery scenario with 1 victim and ${req.body.suspects} viable suspects. \nThis will be a game of detective where i, the user will ask you to assume a character and then question you. You have to try not to reveal the culprit in those question but give subtle hints.\nGive me a setup scene and short info about the victim and suspects each in its own paragraph. separate the info about suspects with a new line.`);
    
    res.status(200).json({ text: result.response.text() });
  }

  if(req.body.function == "interrogate"){
    const chatSession = model.startChat({
      generationConfig,
      history: req.body.history,
    });
    const result = await chatSession.sendMessage(`Assume the character of ${req.body.suspect} and answer to the question with straight to point answer: \"${req.body.question}\". answer in a single paragraph. If there exists no such person in the story, respond by saying that.`);    
    res.status(200).json({text : result.response.text() });
  }

  if(req.body.function == "arrest"){
    const chatSession = model.startChat(
      {
        generationConfig,
        history: req.body.history,
      });
    const result = await chatSession.sendMessage(`I have made up my mind the killer is ${req.body.suspect}. Check if it is correct. Reveal the killer. And a small explanation in the next line also include how he was to be caught.`);
    res.status(200).json({text : result.response.text()});
  }

}


