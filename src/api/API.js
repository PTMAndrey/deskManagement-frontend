import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.headers = {
  // 'Content-Type': 'multipart/form-data',
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
};

// access control axios
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

// ---------------------------- Calls ----------------------------------

// login  authenticate
export const login = async (email, password) => {
  try {
    const response = await axios.get(
      "/persoana/login?email=" + email + "&parola=" + password
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

// get user by id
export const getUserById = async (id) => {
  try {
    const response = await axios.get("/persoana/get/" + id);
    return response;
    // return {
    //   data: {
    //     userId: "44232",
    //     firstName: "Andrei",
    //     lastName: "Andries",
    //     token: "tkn123",
    //     email: "email@email.com",
    //     password: "1234",
    //   },
    //   response: 200,
    // };
  } catch (error) {
    console.log(error);
  }
};

export const getBirouriPeEtaj = async (etaj) => {
  try {
    const response = await axios.get(
      "/birou/get/etaj/" + etaj);
    return response;
  } catch (error) {
    console.log(error);
  }
};



export const getBirouriLiberePeEtaj = async (data) => {
  try {
    const response = await axios.get(
      "/birou/get/freeDesks/" + data.etaj + '/' + data.ziuaCautare + '/' + data.oraInceput + '/' + data.oraIncheiere
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getIsBirouFree= async (id,data) => {
  try {
    const response = await axios.get(
      "/birou/get/isBirouFree/" + id + '/' + data.ziuaCautare + '/' + data.oraInceput + '/' + data.oraIncheiere
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};



export const addBirouri = async (etajID, camera, x, y) => {
  try {
    const response = await axios.post(
      "/birou/add?numar=" + camera + '&etaj=' + etajID + '&coordX=' + x + '&coordY=' + y
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};



export const rezervaBirou = async (idBirou, userID, data) => {
  try {
    const response = await axios.post(
      "/rezervare/add/" + idBirou + '/' + userID, {'data':data.ziuaCautare, 'oraFinal' : data.oraIncheiere, 'oraInceput':data.oraInceput}
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

