export async function queueNotification(subject: string, body: string) {
  const smtpReady = Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM);

  if (!smtpReady) {
    console.info("[notification:queued]", { subject, body });
    return;
  }

  console.info("[notification:smtp-ready]", {
    subject,
    body,
    note: "SMTP transport can be connected here without changing form actions.",
  });
}
