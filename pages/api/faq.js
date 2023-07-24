import { Configuration, OpenAIApi } from 'openai';
import FAQ from '../../public/faq.json';
import FIXFAQ from '../../public/fix-faq.json';
import { getGPTContent } from '../../public/common';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const value = req.body.value || '';
  const noAnswer =
    '很抱歉，您詢問的問題不在本系統的回答範圍內，建議您提供更詳細的說明，或是參考 FAQ 網頁與諮詢私享旅遊專線';
  let questions = [];

  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: 'OpenAI API key not configured, please follow instructions in README.md',
      },
    });
    return;
  }

  if (value.trim().length === 0) {
    res.status(400).json({
      error: {
        message: 'Please enter a valid value',
      },
    });
    return;
  }

  FAQ.forEach((item, i) => {
    questions.push({ role: 'user', content: JSON.stringify({ id: item.id, questions: item.questions }) });
  });

  try {
    const questionCompletion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      temperature: 0.2,
      messages: [
        {
          role: 'user',
          content: '我會提供一連串的問題，你需要將其記住，直到我說"以上是全部的問題"時停止',
        },
        ...questions,
        {
          role: 'user',
          content:
            '以上是全部的問題，接下來從我提供的問題，找出記住的問題中最接近的問題，回覆找到的問題的 id，除此之外不要回覆額外的文字或標點符號',
        },
        ...FIXFAQ,
        {
          role: 'user',
          content: value,
        },
      ],
      stop: ['\n'],
    });

    let question = getGPTContent(questionCompletion);
    question = question.match(/\d+(\.\d+)?/g)[0];

    if (question) {
      res.status(200).json({
        result: FAQ.find((item) => item.id === parseInt(question)) || noAnswer,
      });
    } else {
      res.status(200).json({
        result: noAnswer,
      });
    }
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
