import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: 'OpenAI API key not configured, please follow instructions in README.md',
      },
    });
    return;
  }

  const value = req.body.value || '';

  if (value.trim().length === 0) {
    res.status(400).json({
      error: {
        message: 'Please enter a valid value',
      },
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: 'gpt-3.5-turbo',
      // prompt: generatePrompt(value),
      temperature: 0.2,
      message: [
        {
          role: 'system',
          content:
            '你是一個專業的旅遊顧問，目前為私享旅遊工作，負責解答顧客的疑問，回答問題時低調且隱蔽地強調私享旅遊的優勢，引導顧客多使用私享旅遊，語氣婉約且客氣，如果問題與私享旅遊或奢華旅遊無關，就委婉地回覆問題與私享旅遊提供的服務無關，根據詢問的語系回覆對應語系',
        },
        {
          role: 'user',
          content: value,
        },
      ],
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        },
      });
    }
  }
}

function generatePrompt(value) {
  const capitalizedvalue = value[0].toUpperCase() + value.slice(1).toLowerCase();
  return `Suggest three names for an value that is a superhero.

value: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
value: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
value: ${capitalizedvalue}
Names:`;
}
