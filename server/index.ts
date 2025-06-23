import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { setupStaticServing } from './static-serve.js';
import { db } from './database/index.js';
import { authenticateToken, AuthRequest } from './middleware/auth.js';

dotenv.config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register endpoint
app.post('/api/auth/register', async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    
    console.log('Registration attempt:', { email, firstName, lastName });

    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Check if user already exists
    const existingUser = await db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();

    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const result = await db
      .insertInto('users')
      .values({
        email,
        password_hash: passwordHash,
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
        employment_status: 'pending_verification',
        unemployment_verification_status: 'pending',
        fol_balance: 0.00,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .returning(['id', 'email', 'first_name', 'last_name'])
      .executeTakeFirst();

    console.log('User created:', result);

    // Generate JWT token
    const token = jwt.sign({ id: result?.id, email: result?.email }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: result
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', { email });

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password required' });
      return;
    }

    // Find user
    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

    console.log('Login successful:', { userId: user.id, email: user.email });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        employment_status: user.employment_status,
        unemployment_verification_status: user.unemployment_verification_status,
        fol_balance: user.fol_balance
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile
app.get('/api/auth/profile', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const user = await db
      .selectFrom('users')
      .select([
        'id', 'email', 'first_name', 'last_name', 'phone',
        'employment_status', 'unemployment_verification_status',
        'unemployment_start_date', 'previous_employer', 'previous_job_title',
        'fol_balance', 'created_at'
      ])
      .where('id', '=', req.user!.id)
      .executeTakeFirst();

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit unemployment verification
app.post('/api/unemployment/verify', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const { 
      unemploymentStartDate, 
      previousEmployer, 
      previousJobTitle, 
      documentType, 
      documentUrl 
    } = req.body;

    console.log('Unemployment verification submission:', {
      userId: req.user!.id,
      unemploymentStartDate,
      previousEmployer,
      previousJobTitle,
      documentType
    });

    if (!unemploymentStartDate || !previousEmployer || !previousJobTitle || !documentType) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Update user employment info
    await db
      .updateTable('users')
      .set({
        employment_status: 'unemployed',
        unemployment_start_date: unemploymentStartDate,
        previous_employer: previousEmployer,
        previous_job_title: previousJobTitle,
        updated_at: new Date().toISOString()
      })
      .where('id', '=', req.user!.id)
      .execute();

    // Create verification record
    const verification = await db
      .insertInto('unemployment_verifications')
      .values({
        user_id: req.user!.id,
        document_type: documentType,
        document_url: documentUrl || 'pending_upload',
        status: 'pending',
        submitted_at: new Date().toISOString()
      })
      .returning(['id', 'status', 'submitted_at'])
      .executeTakeFirst();

    console.log('Verification submitted:', verification);

    res.json({
      message: 'Unemployment verification submitted successfully',
      verification
    });
  } catch (error) {
    console.error('Verification submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export a function to start the server
export async function startServer(port) {
  try {
    if (process.env.NODE_ENV === 'production') {
      setupStaticServing(app);
    }
    app.listen(port, () => {
      console.log(`API Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Start the server directly if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Starting server...');
  startServer(process.env.PORT || 3001);
}