import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactUsEmail({
    name,
    email,
    message,
}: {
    name: string;
    email: string;
    message: string;
}) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Contact Form <myrestuarant@kennethobi.software>',
            to: ['obikenneth913@gmail.com'],
            subject: 'New Contact Us Message',
            replyTo: email,
            html: `
                <h2>New Message from Contact Form</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <div style="background:#f7f7f9;padding:1em;border-radius:8px">${message.replace(/\n/g, '<br/>')}</div>
            `,
        });

        if (error) {
            console.error('Resend Error:', error);
            throw new Error('Failed to send contact email.');
        }

        return data;
    } catch (err) {
        console.error('Unexpected error sending contact email:', err);
        throw err;
    }
}

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
