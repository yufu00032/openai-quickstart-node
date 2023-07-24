/**
 * return chat completion API content
 * @param {*} completion
 * @returns {string}
 */
export const getGPTContent = (completion) => completion['data']['choices'][0]['message']['content'];
