export const htmlEmail = (name, message, topic) => {
  /* eslint-disable @next/next/no-img-element */
  return (
    <div style={{ fontFamily: `'Trebuchet MS', sans-serif, 'Open Sans'` }}>
      <h1>Hello {name}</h1>
      <p>This is a confirmation, that your message to Moonshire has indeed been received sucessfully.<br />I&apos;ll come back to you as soon as possible.</p>
      <p>Thank you so much,<br />Moonshire</p>
      <p style={{ marginTop: '40px' }}>
        {topic && <p>Subject: {topic}</p>}
        Your message:<br />
        {message}
      </p>
    </div>
  )
  /* eslint-enable @next/next/no-img-element */
}
