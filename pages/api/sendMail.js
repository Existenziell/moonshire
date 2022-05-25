import ReactDOMServer from 'react-dom/server'
import sgMail from '@sendgrid/mail'
import { htmlEmail } from '../../lib/htmlEmail'

sgMail.setApiKey(process.env.NEXT_PUBLIC_MAIL_API_KEY)

const sendMail = async (req, res) => {
  const { name, email, message, topic } = req.body
  const html = ReactDOMServer.renderToStaticMarkup(htmlEmail(name, message, topic))

  const notificationMessage = topic
    ? `From: ${name}\nEmail: ${email}\nTopic: ${topic.replace(/-/g, ' ')}\n\n${message}`
    : `From: ${name}\nEmail: ${email}\n\n${message}`

  // Goes to me
  const notificationMsg = {
    to: process.env.NEXT_PUBLIC_MAIL_TO,
    from: process.env.NEXT_PUBLIC_MAIL_FROM,
    subject: `Contact request on Project Moonshire`,
    text: notificationMessage,
  }

  // Goes to the user
  const confirmationMsg = {
    to: email,
    from: process.env.NEXT_PUBLIC_MAIL_FROM,
    subject: `Confirmation | Project Moonshire`,
    text: `Hello ${name},\nThis is a confirmation, that your message to Project Moonshire has indeed been received successfully.\nWe'll come back to you as soon as possible.\nThank you so much.\nProject Moonshire`,
    html,
  }

  try {
    await sgMail.send(notificationMsg)
    await sgMail.send(confirmationMsg)
    res.status(200).json({ message: `Emails have been sent.` })
  } catch (error) {
    res.status(500).json({ error })
  }
}

export default sendMail
