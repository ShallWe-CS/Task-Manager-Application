import axios from "axios";

let authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null;

const params = {
    headers: {
        Authorization: "Bearer " + authTokens?.access
    },
};

export const fetchDataFromApi = async (url) => {
    try {
        const {data} = await axios.get(
            process.env.REACT_APP_DEV_URL + url, 
            params
        );
        return data;
    } catch (error) {
        console.log(error)
        return error;
    }
};

export const postDataToApi = async (url, requestData) => {
    try {
        const { data } = await axios.post(
            // axios.put(url, data, config) -> this is the order, change it may cause errors
            process.env.REACT_APP_DEV_URL + url,
            requestData,
            params
        );
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
};

export const putDataWithAuthentication = async (url, requestData) => {
    try {
        const { data } = await axios.put(
            // axios.put(url, data, config) -> this is the order, change it may cause errors
            process.env.REACT_APP_DEV_URL + url,
            requestData,
            params
        );
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
};

export const deleteDataWithAuthentication = async (url) => {
    try {
        const { data } = await axios.delete(
            process.env.REACT_APP_DEV_URL + url,
            params
        );
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
};