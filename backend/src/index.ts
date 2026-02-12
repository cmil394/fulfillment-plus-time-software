import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running!' });
});

app.post('/api/test-user', async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: {
        email: `test${Date.now()}@example.com`,
        password: 'hashedpassword123',
        firstName: 'Test',
        lastName: 'User',
        role: 'EMPLOYEE',
        status: 'APPROVED'
      }
    });
    
    res.json({ 
      status: 'success',
      message: 'User created successfully!',
      data: user
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to create user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});