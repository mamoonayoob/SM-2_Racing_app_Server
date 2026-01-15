 const axios = require("axios");

module.exports.sendToMake = async (data) => {
  try {
    const response = await axios.post(
      process.env.MAKE_WEBHOOK_URL,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 8000,
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
};