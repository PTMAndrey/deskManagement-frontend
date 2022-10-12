import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// get user by id
export const getUserById = async (id) => {
  //try {
  //   const response = await axios.get("/user/" + id);
  //   return response;
  return {
    data: {
      userId: "44232",
      firstName: "Andrei",
      lastName: "Andries",
      token: "tkn123",
      email: "email@email.com",
      password: "1234",
    },
    response: 200,
  };
  //   } catch (error) {
  //     console.log(error);
  //   }
};
