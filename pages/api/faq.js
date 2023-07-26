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
  const NOANSWER =
    '很抱歉，您詢問的問題不在本系統的回答範圍內，建議您提供更詳細的說明，或是參考 FAQ 網頁與諮詢私享旅遊專線';
  const questions = FAQ.map((item) => ({ id: item.id, questions: item.questions }));

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

  try {
    const questionCompletion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      temperature: 0.2,
      messages: [
        {
          role: 'user',
          content:
            '# 提示\n你現在被用於奢華旅遊網站上的客服系統，' +
            '目的是從已經定義好的問題 json 中找出與使用者詢問的問題最接近的問題，並回傳找到的 id\n' +
            '# 限制\n必須回覆找到的 id\n不回覆非 id 的文字與符號\n如果沒有找到問題，回覆的 id 為 -1\n' +
            `# 輸入文字\n${JSON.stringify(questions)}\n` +
            '# 輸出文字\n1\n2\n3...以此類推，只回覆 id\n' +
            `# 修正\n${JSON.stringify(FIXFAQ)}\n`,
        },
        {
          role: 'user',
          content: value,
        },
      ],
    });

    let question = getGPTContent(questionCompletion);
    question = question.match(/\d+(\.\d+)?/g)[0];

    if (question && question !== -1) {
      res.status(200).json({
        result: FAQ.find((item) => item.id === parseInt(question)) || NOANSWER,
      });
    } else {
      res.status(200).json({
        result: NOANSWER,
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
