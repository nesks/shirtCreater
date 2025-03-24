
const production = {
  backendUrl: "https://shirtcreaterserver.onrender.com/api/",
  socketUrl: "wss://shirtcreaterserver.onrender.com"
};

const development =  {
  backendUrl: "http://localhost:8080/api/",
  socketUrl: "ws://localhost:8080"
}
const validacao =  window.location.hostname == "localhost";
const config = validacao ? development : production;


export default config;
