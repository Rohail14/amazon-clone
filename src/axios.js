import axios from "axios";

const instance = axios.create({
    baseURL: "https://us-central1-clone-270ae.cloudfunctions.net/api"

});

export default instance;

// 'http://localhost:5001/clone-270ae/us-central1/api'

