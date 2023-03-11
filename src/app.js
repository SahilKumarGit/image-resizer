import express from "express";
import multer from "multer";
import router from "./routing.js";
(async () => {
  try {
    console.log("Server Starting...");
    const $PORT = process.env.PORT || 2000;
    const app = express();
    app.use(express.json());
    app.use(multer().any());
    app.use("/", router);
    
    app.listen($PORT, (_e) => {
      if (_e) return console.log("Server Crashed!", _e);
      console.log("Server Connected successfully!");
      return console.log(`Server Running On ${$PORT}!`);
    });
  } catch (_e) {
    console.log("Server Crashed!", _e);
  }
})();
