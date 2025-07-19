import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAccessCodeEmail(email: string, code: number, expires: Date) {
    const expireString = expires.toLocaleString();

    try {
        const { data, error } = await resend.emails.send({
            from: 'Your Restaurant <myrestuarant@kennethobi.software>',
            to: [email],
            subject: 'Your Staff Access Code',
            html: `
        <p>Hello,</p>
        <p>Your 6-digit access code is: <b>${code}</b></p>
        <p>This code will expire at: <b>${expireString}</b></p>
        <p>Use this code to start your session in the restaurant system.</p>
      `,
        });

        if (error) {
            console.error('Resend Error:', error);
            throw new Error('Failed to send access code email.');
        }

        return data;
    } catch (err) {
        console.error('Unexpected error:', err);
        throw err;
    }
}
