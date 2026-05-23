import express from 'express';
import { sendApplicationConfirmation, validateEmailDomain } from '../services/emailService.js';

const router = express.Router();

/**
 * POST /api/apply
 * Submit a job application and send confirmation email
 */
router.post('/', async (req, res) => {
  const { name, email, phone, experience, coverLetter, jobTitle, company, location, salary, jobId } = req.body;

  // Validations
  if (!name || !email || !jobTitle || !company) {
    return res.status(400).json({ message: 'Name, email, job title and company are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }

  const isValidDomain = await validateEmailDomain(email);
  if (!isValidDomain) {
    return res.status(400).json({ message: 'Please use a real email address. Disposable emails are not allowed.' });
  }

  if (phone && !/^[+\d\s\-()]{7,15}$/.test(phone)) {
    return res.status(400).json({ message: 'Please provide a valid phone number.' });
  }

  try {
    const result = await sendApplicationConfirmation({
      to: email,
      name,
      jobTitle,
      company,
      location: location || 'Not specified',
      salary: salary || 'Not disclosed',
    });

    // If using Ethereal test account, return preview URL
    if (result?.previewUrl) {
      console.log(`📧 Preview email at: ${result.previewUrl}`);
      return res.json({
        success: true,
        message: `Application submitted! Preview your confirmation email here:`,
        previewUrl: result.previewUrl,
        note: 'Gmail SMTP not configured. Using test email — click the preview link to see your email.',
      });
    }

    res.json({
      success: true,
      message: `Application submitted! A confirmation email has been sent to ${email}.`,
    });
  } catch (emailError) {
    console.error('❌ Email send error:', emailError.message);
    res.json({
      success: true,
      message: 'Application submitted successfully! (Email delivery failed — check server logs.)',
      emailError: emailError.message,
    });
  }
});

/**
 * POST /api/apply/validate-email
 */
router.post('/validate-email', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ valid: false, message: 'Email is required.' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.json({ valid: false, message: 'Invalid email format.' });
  }

  const isValid = await validateEmailDomain(email);
  res.json({
    valid: isValid,
    message: isValid ? 'Email domain is valid.' : 'Disposable or invalid email domain.',
  });
});

export default router;
