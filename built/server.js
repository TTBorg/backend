"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
require('dotenv').config();
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const pmRoutes_1 = __importDefault(require("./routes/pmRoutes"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: '*', // Allow any origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Optional, depends on your cookie/session setup
}));
// const allowedOrigins = ['https://your-production-site.com'];
// app.use(cors({
//   origin: (origin, callback) => {
//     if (allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true,
// }));
app.use(express_1.default.json());
// Connect to MongoDB
(0, db_1.default)();
// Use the admin routes
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/pm', pmRoutes_1.default);
app.use('/api/projects', projectRoutes_1.default);
app.get('/', (req, res) => {
    res.send('Server is running!');
});
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
