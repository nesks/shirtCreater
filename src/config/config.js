const config = {
  development: {
    backendUrl: "http://localhost:8080/api/",
    socketUrl: "ws://localhost:3000"
  },
  production: {
    backendUrl: "https://shirtcreaterserver.onrender.com/api/",
    socketUrl: "wss://shirtcreaterserver.onrender.com"
  },
};

export default config;
