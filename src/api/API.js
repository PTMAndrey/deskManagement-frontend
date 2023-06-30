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


export const getAllUsers = async (id) => {
  try {
    const response = await axios.get("/persoana/get/all");
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const addUser = async (data) => {
  try {
    const response = await axios.post(
      
     '/persoana/inregistrare?nume='+data.nume+'&prenume='+data.prenume+'&email='+data.email+'&parola='+data.parola+'&departament='+data.departmanet+'&rol='+data.rol+'&nume_proiect='+data.nume_proiect+'&manager='+data.manager+'&tara='+data.tara+'&oras='+data.oras+'&nationalitate='+data.nationalitate+'&dataNasterii='+data.dataNasterii

    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (data) => {
  try {
    const response = await axios.put(
      
     '/persoana/update/'+data.id+'?nume='+data.nume+'&prenume='+data.prenume+'&email='+data.email+'&parola='+data.parola+'&departament='+data.departament+'&rol='+data.rol+'&nume_proiect='+data.nume_proiect+'&manager='+data.manager+'&tara='+data.tara+'&oras='+data.oras+'&nationalitate='+data.nationalitate+'&dataNasterii='+data.dataNasterii

    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axios.delete("/persoana/delete/" + id);
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

export const searchEmployee = async(string) =>{
  try {
    const response = await axios.get("/persoana/get/persoane/filtrare?searchString=" + string);
    return response;
  } catch (error) {
    console.log(error)
  }
}

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

export const getIsBirouFree = async (id, data) => {
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
      "/birou/add?camera=" + camera + '&etaj=' + etajID + '&coordX=' + x + '&coordY=' + y
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};


export const updateBirouri = async (birouri) => {
  try {
    const response = await axios.put("/birou/put/update/birouri", birouri);
    return response;
  } catch (error) {
    console.log(error);
  }
};


export const rezervaBirou = async (idBirou, userID, data) => {
  try {
    const response = await axios.post(
      "/rezervare/add/" + idBirou + '/' + userID, { 'data': data.ziuaCautare, 'oraFinal': data.oraIncheiere, 'oraInceput': data.oraInceput }
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};


export const getRezervariByUserID = async (userID) => {
  try {
    const response = await axios.get(
      "/persoana/get/rezervari/" + userID
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};


export const deleteRezervareByID = async (rezID) => {
  try {
    const response = await axios.delete(
      "/rezervare/delete/" + rezID
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};




export const updateUserPoza = async (userid, data) => {
  try {
    const response = await axios.put(
      "/persoana/update/poza/" + userid, data, {
      headers: { 'Content-Type': 'multipart/form-data', },
      // params:{file:file ? file : null}
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};