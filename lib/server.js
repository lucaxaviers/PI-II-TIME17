"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use("/app", express_1.default.static(path_1.default.join(__dirname, "../frontend")));
app.get("/", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "funcionando",
    });
});
app.get("/demandas", (req, res) => {
    res.redirect("/app/pages/lista_demandas.html");
});
app.get("/dashboard", (req, res) => {
    res.redirect("/app/pages/dashboard.html");
});
app.listen(PORT, () => {
    console.log(`Servidor executando em http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map