import express, { Request, Response } from 'express';
import dotenv from 'dotenv'
dotenv.config()

const app = express();

// Middleware
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: `Welcome to The Alter Office Assignment Server! \n You Must Login to access the API's`,
  });
});

const PORT = process.env.PORT

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});