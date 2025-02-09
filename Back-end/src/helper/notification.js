const sendEmail = require('./Email');

const sendContactNotification = async (contactData) => {
  const emailOptions = {
    email: process.env.SENDER_EMAIL, // Add this to your .env file
    subject: `New Contact Form Submission - ${contactData.queryType}`,
    text: `
      New contact form submission received:
      
      Query Type: ${contactData.queryType}
      Name: ${contactData.name}
      Email: ${contactData.email}
      Phone: ${contactData.phone}
      Message: ${contactData.message}
      Submitted on: ${new Date(contactData.createdAt).toLocaleString()}
    `,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Query Type:</strong> ${contactData.queryType}</p>
      <p><strong>Name:</strong> ${contactData.name}</p>
      <p><strong>Email:</strong> ${contactData.email}</p>
      <p><strong>Phone:</strong> ${contactData.phone}</p>
      <p><strong>Message:</strong> ${contactData.message}</p>
      <p><strong>Submitted on:</strong> ${new Date(
        contactData.createdAt
      ).toLocaleString()}</p>
    `,
  };

  return sendEmail(emailOptions);
};

module.exports = {
  sendContactNotification
};
