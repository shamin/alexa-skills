const axios = require("axios");

const getStories = async (type) => {
  try {
    const response = await axios.get(`https://hacker-news.firebaseio.com/v0/${type}stories.json?print=pretty`)
    return response
  } catch (e) {
    console.error(e)
  }
  return
}

const getDetailedStories = async (type) => {
  const stories = await getStories(type)
  const subset = stories.data.slice(0, 10);
  const detailStories = subset.map(getStory)
  try {
    const data = await Promise.all(detailStories)
    return data.join(", Next Story : ")
  } catch (e) {
    console.error(e)
  }
  return
}

const getStory = async (story) => {
  try {
    const response = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${story}.json?print=pretty`)
    return response.data.title
  } catch (e) {
    console.error(e)
  }
  return
}

module.exports = getDetailedStories
