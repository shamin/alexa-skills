const axios = require("axios");

const getTrendingRepos = async () => {
    try{
      const response = await axios.get(`https://api.github.com/search/repositories?q=language:javascript+created:>${getPastDate()}&sort=stars&order=desc`)
      return response
    } catch(e)
    {
      console.error(e)
    }
    return 
}

const getPastDate = () => {
  let days = 7; 
  let date = new Date();
  let last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
  let day = last.getDate();
  let month = last.getMonth() + 1;
  let year = last.getFullYear();
  return `${year}-${month}-${day}`
}

module.exports = getTrendingRepos
