import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class EmailService {
  private readonly BREVO_API_KEY = process.env.BREVO_API_KEY;

  async sendPasswordResetEmail(to: string, resetCode: string) {
    const emailData = {
      sender: { email: process.env.EMAIL_FROM, name: 'Suporte' },
      to: [{ email: to, name: to }],
      subject: 'Redefinição de Senha',
      textContent: `Seu código de redefinição de senha é: ${resetCode}`,
    };

    try {
      const response = await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        emailData,
        {
          headers: {
            'api-key': this.BREVO_API_KEY,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      console.error('Error sending email:', error.response?.data || error);
    }
  }
}