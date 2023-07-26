import { Configuration, OpenAIApi } from 'openai';
import HOTEL from '../../public/hotel.json';
import { getGPTContent } from '../../public/common';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const value = req.body.value || '';
  const NOHOTEL =
    '很抱歉，您諮詢的酒店不在本系統查詢的範圍內，建議您提供更多的資訊給系統，或是查看酒店介紹頁來了解詳細的資訊';
  let trainHotel = [];

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
    const areaCompletion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      temperature: 0,
      messages: [
        {
          role: 'user',
          content:
            '# 提示\n你現在被用於奢華旅遊網站上的分析系統，目的是從輸入文字中找出使用者想去的國家、城市與特色，' +
            '如果輸入文字中對某個特色是抱持負面態度，需要排除該特色' +
            '將分析出來的資訊用 json 方式回覆，只要找出一筆資料即可\n' +
            '# 限制\n必須用 json 回覆\n回覆的 json key 使用英文\n回覆的 json key 使用中文\n' +
            `# 輸入文字\n${value}\n` +
            `# 輸出文字\n{ country: 找到的國家, city: 找到的城市, tag: 找到的特色 }\n`,
        },
      ],
    });
    let area = getGPTContent(areaCompletion);

    try {
      area = JSON.parse(area);
    } catch (e) {
      area = 'not found';
    }

    if (area === 'not found') {
      res.status(200).json({
        result: NOHOTEL,
      });
      return;
    }

    const findHotel = HOTEL.filter((item) => item.country === area.country || item.city === area.city);

    findHotel.forEach((item) => {
      trainHotel.push({
        role: 'user',
        content: JSON.stringify({
          id: item.id,
          hotel: item.hotel,
          description: item.description,
        }),
      });
    });

    const hotelCompletion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
      messages: [
        {
          role: 'user',
          content:
            '# 提示\n你現在被用於奢華旅遊網站上的推薦系統，目的是在酒店列表 json 中，' +
            '根據輸入文字中找出符合的幾間酒店，優先尋找 tag 有精選的酒店，找到的酒店盡量不連續，' +
            '回傳找到的 id，最多為三間酒店，用 , 分隔\n' +
            '# 限制\n必須回覆找到的 id\n除了 , 與 id 不回覆其他的文字與符號\n如果找不到任何相似的酒店，回覆的 id 為 -1\n' +
            `# 酒店列表 json\n${JSON.stringify(findHotel)}\n` +
            `# 輸入文字\n${value}`,
        },
      ],
    });
    let hotelId = getGPTContent(hotelCompletion);
    hotelId = hotelId.split(',').map((item) => parseInt(item));
    const hotelResponse = HOTEL.filter((item) => hotelId.find((id) => item.id === id));

    res.status(200).json({
      result: hotelResponse.length > 0 ? hotelResponse : NOHOTEL,
    });
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
