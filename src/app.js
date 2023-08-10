const express = require("express");

const app = express();

const router = require("./routers");

app.use(router);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Запуск сервера на ${PORT}`);
})