import { Configuration, OpenAIApi } from 'openai';
import { getGPTContent } from '../../public/common';
import HOTEL from '../../public/hotel.json';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const user = req.body.user || undefined;
  const DEFAULT_RECOMMEND = [17, 18, 19];

  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: 'OpenAI API key not configured, please follow instructions in README.md',
      },
    });
    return;
  }

  if (!user) {
    res.status(500).json({
      error: {
        message: 'Invalid user infomation',
      },
    });
    return;
  }

  try {
    const countrys = [...new Set(HOTEL.map((hotel) => hotel.country))];
    const bestHotel = user.mostHotels.map((id) => HOTEL.find((hotel) => id === hotel.id));
    let rand = Math.random() * (countrys.length - 1);
    rand = Math.floor(rand);
    const country = countrys[rand];
    const findHotel = HOTEL.filter((hotel) => hotel.country === country);

    const userRecommendCompletion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      temperature: 0.2,
      messages: [
        {
          role: 'user',
          content:
            '# 提示\n你現在被用於奢華旅遊網站上的推薦系統，目的是在酒店列表 json 中，' +
            '根據使用者最常去的酒店 json 中找出與使用者常去的酒店 json 相似的酒店，優先尋找 tag 有精選的酒店' +
            '但不是在使用者最常去的酒店中出現過的酒店，回傳找到的 id，固定為三個，用,分隔\n' +
            '# 限制\n必須回覆找到的 id\n除了 , 與 id 不回覆其他的文字與符號\n如果沒有找到問題，回覆的 id 為 -1\n' +
            `# 使用者最常去的酒店 json\n${JSON.stringify(bestHotel)}\n` +
            `# 酒店列表 json\n${JSON.stringify(findHotel)}\n`,
        },
      ],
    });

    let userRecommend = getGPTContent(userRecommendCompletion);
    userRecommend = userRecommend.split(',');
    userRecommend = userRecommend.map((id) => parseInt(id));
    const recommendResponse = userRecommend.map((id) => HOTEL.find((hotel) => hotel.id === id));
    const defaultResponse = DEFAULT_RECOMMEND.map((id) => HOTEL.find((hotel) => hotel.id === id));

    if (userRecommend.length > 0 && userRecommend[0] !== -1) {
      res.status(200).json({
        result: recommendResponse.length > 0 ? recommendResponse : defaultResponse,
      });
    } else {
      res.status(200).json({
        result: defaultResponse,
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
