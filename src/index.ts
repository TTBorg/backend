import express from 'express';
import mongoose, { version } from 'mongoose';
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import adminRoutes from './routes/adminRoutes';
import pmRoutes from './routes/pmRoutes';
import projectRoutes from './routes/projectRoutes';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc'

dotenv.config();

const app = express();

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'TTB API',
            version: '1.0.0',
            description: 'TTB API Documentation',
            contact: {
                name: 'TTB backend',
                email: 'darmhoo@hotmail.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['src/routes/*.ts']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', express.static('built/api-docs'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(cors({
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


app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));


// Connect to MongoDB
if (process.env.MONGO_URI) {
    console.log('got here')
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.log('MongoDB connection error: ', err));
}




// Use the admin routes
app.use('/api/admin', adminRoutes);
app.use('/api/pm', pmRoutes);
app.use('/api/projects', projectRoutes);


// Basic Test Route (You can test this by visiting http://localhost:3000/)
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});