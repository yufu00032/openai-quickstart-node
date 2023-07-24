import { Configuration, OpenAIApi } from 'openai';
import HOTEL from '../../public/hotel.json';
import { getGPTContent } from '../../public/common';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const value = req.body.value || '';
  const noHotel = '很抱歉，您諮詢的酒店不在本系統查詢的範圍內，建議您查看酒店介紹頁來了解詳細的資訊';
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
            '我會提供各種關於酒店推薦的問題，你需要找出問題中的國家、城市與特色' +
            '特色是指酒店特色，將找到的國家、城市與特色用 { country: country, city: city, tag: tag } 回覆，只要找出一筆資料即可，' +
            'key 使用英文，value 使用繁體中文，除此之外不要有其他文字或符號',
        },
        {
          role: 'user',
          content: value,
        },
      ],
    });
    let area = getGPTContent(areaCompletion);
    console.log('area\n');
    console.log(area);
    console.log('\narea\n');

    try {
      area = JSON.parse(area);
    } catch (e) {
      area = 'not found';
    }

    if (area === 'not found') {
      res.status(200).json({
        result: '很抱歉，您諮詢的酒店不在本系統查詢的範圍內，建議您查看酒店介紹頁來了解詳細的資訊',
      });
      return;
    }

    const findHotel = HOTEL.filter((item) => item.country === area.country || item.city === area.city);
    console.log(findHotel);

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
        { role: 'user', content: '我會提供一連串的酒店，你需要將其記住，直到我說"以上是全部的酒店"時停止' },
        ...trainHotel,
        {
          role: 'user',
          content:
            '以上是全部的酒店，接下來從我提供的問題，找出記住的酒店中最接近使用者想要尋找的酒店，最多三間' +
            '回覆找到的酒店的 id，用"id1 id2 id3"方式回覆，除此之外不要回覆額外的文字或標點符號',
        },
        {
          role: 'user',
          content: JSON.stringify(area),
        },
      ],
    });
    let hotelId = getGPTContent(hotelCompletion);
    hotelId = hotelId.split(' ').map((item) => parseInt(item));
    const hotelResponse = HOTEL.filter((item) => hotelId.find((id) => item.id === id));
    console.log(hotelId);

    res.status(200).json({
      result: hotelResponse.length > 0 ? hotelResponse : noHotel,
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
