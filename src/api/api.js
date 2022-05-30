import axios from "axios";
export default axios.create({
  baseURL: "https://ptitvpn.herokuapp.com",
  headers: {
    "Content-type": "application/json"
  }
});