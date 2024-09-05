import axios from "axios";

// export const BASE_URL = "http://localhost:3016/"; // Your API base URL

export const BASE_URL = "https://cue-balls-be.caprover-demo.mtechub.com/"; // Your API base URL

export const get = async (url = {}) => {
  // const queryParams = new URLSearchParams(params);
  const response = await fetch(`${BASE_URL}${url}`);

  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};
export const universalLinkPost = async (url, data) => {
  // const queryParams = new URLSearchParams(params);
  try {
    const response = await axios.post(`${url}`, data);
    return response.data;
  } catch (error) {
    throw new Error(`Error posting data: ${error.message}`);
  }
};

export const post = async (url, data) => {
  try {
    const response = await axios.post(`${BASE_URL}${url}`, data);
    return response.data;
  } catch (error) {
    throw new Error(`Error posting data: ${error.message}`);
  }
};
export const put = async (url, data) => {
  try {
    const response = await axios.put(`${BASE_URL}${url}`, data);
    return response.data;
  } catch (error) {
    throw new Error(`Error posting data: ${error.message}`);
  }
};
export const deleteReq = async (url, data) => {
  try {
    const response = await axios.delete(`${BASE_URL}${url}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error posting data: ${error.message}`);
  }
};
export const deleteApi = async (url, data) => {
  try {
    const response = await axios.delete(`${BASE_URL}${url}`, { data: data });
    return response.data;
  } catch (error) {
    throw new Error(`Error posting data: ${error.message}`);
  }
};
export const postFormData = async (data) => {
  console.log(data);
  const formData = new FormData();
  formData.append("image", data.image);

  try {
    const response = await axios.post(`${BASE_URL}upload-image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(`Error posting data: ${error.message}`);
  }
};
