const clubInbox = process.env.CLUB_NOTIFICATION_EMAIL || "Clubcavm@gmail.com";
const defaultFrom = process.env.NOTIFICATION_FROM_EMAIL || "CAVM Club <onboarding@resend.dev>";

type NotificationField = [label: string, value?: string | null];

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatText(subject: string, body: string, fields: NotificationField[] = []) {
  const lines = [`${subject}`, "", body];
  const filledFields = fields.filter(([, value]) => value);

  if (filledFields.length) {
    lines.push("", "Details:");
    filledFields.forEach(([label, value]) => {
      lines.push(`${label}: ${value}`);
    });
  }

  return lines.join("\n");
}

function formatHtml(subject: string, body: string, fields: NotificationField[] = []) {
  const rows = fields
    .filter(([, value]) => value)
    .map(([label, value]) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#475569;font-weight:700;">${escapeHtml(label)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#0f172a;">${escapeHtml(String(value))}</td>
      </tr>
    `)
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;">
      <h1 style="font-size:20px;margin:0 0 12px;">${escapeHtml(subject)}</h1>
      <p style="margin:0 0 18px;color:#334155;">${escapeHtml(body)}</p>
      ${rows ? `<table style="border-collapse:collapse;width:100%;max-width:720px;border:1px solid #e2e8f0;">${rows}</table>` : ""}
    </div>
  `;
}

export async function queueNotification(subject: string, body: string, fields: NotificationField[] = []) {
  const text = formatText(subject, body, fields);
  const html = formatHtml(subject, body, fields);

  if (!process.env.RESEND_API_KEY) {
    console.info("[notification:email-not-configured]", {
      to: clubInbox,
      subject,
      body,
      fields: fields.filter(([, value]) => value),
    });
    return;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: defaultFrom,
        to: [clubInbox],
        subject,
        text,
        html,
        reply_to: fields.find(([label]) => label === "Email")?.[1] || undefined,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[notification:email-failed]", {
        status: response.status,
        to: clubInbox,
        subject,
        error: errorText,
      });
    }
  } catch (error) {
    console.error("[notification:email-error]", { to: clubInbox, subject, error });
  }
}
