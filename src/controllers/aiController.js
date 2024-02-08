import axios from 'axios'
export const generateCode = async(req,res,next) =>{
    const {prompt,language} = req.body

}

/*
const axios = require("axios").default;

const options = {
  method: "POST",
  url: "https://api.edenai.run/v2/text/code_generation",
  headers: {
    authorization: "Bearer 🔑 Your_API_Key",
  },
  data: {
    providers: "openai",
    prompt: "",
    instruction: "Write a function in python that calculates fibonacci",
    temperature: 0.1,
    max_tokens: 500,
    fallback_providers: "",
  },
};

axios
  .request(options)
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error(error);
  });
*/