# Sign-in emails (password reset and sign-up confirmation)

Supabase sends these. Out of the box it uses its own shared sender, which is heavily limited and, on the
free plan, only delivers to your own team. To send them to real members from your domain, point Supabase at
Resend and use the templates below.

## 1. Use Resend as Supabase's mail server

1. In Resend, **API Keys → Create API key**. Name it `supabase-auth`, permission **Sending access**, domain
   `azukyouthassociation.com`. Copy the key (shown once). Use a separate key from the one for event emails.
2. In the Supabase dashboard, open **Authentication → Emails → SMTP Settings** (older layout:
   *Project Settings → Authentication → SMTP Settings*) and switch **Enable custom SMTP** on:

| Field | Value |
|---|---|
| Sender email | `no-reply@azukyouthassociation.com` |
| Sender name | `UK-Azerbaijan Youth Association` |
| Host | `smtp.resend.com` |
| Port | `465` |
| Username | `resend` |
| Password | the `supabase-auth` API key |

3. Save. In **Authentication → Rate Limits** the default for emails is low; raise it (for example 30 per
   hour) if many people may sign up or reset at once. Resend's free plan also has its own daily cap that is
   shared with the event emails.
4. In **Authentication → URL Configuration** the Site URL must be `https://www.azukyouthassociation.com`, or
   the links in these emails point at the wrong site.

`no-reply@` needs no mailbox. Resend sends from any address on your verified domain. Nobody reads replies to it.

## 2. Paste the templates

In **Authentication → Emails → Templates**, edit the two templates. Keep the `{{ .ConfirmationURL }}` parts as they are.

### Confirm signup

Subject: `Confirm your email · UK-Azerbaijan Youth Association`

```html
<div style="background:#f6f9fe;padding:32px 16px;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;color:#0e1f45">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:20px;border:1px solid #dce5f3">
    <tr><td style="padding:28px 28px 8px">
      <img src="https://www.azukyouthassociation.com/icon-192.png" width="56" height="56" alt="UK-Azerbaijan Youth Association" style="display:block;border-radius:14px">
    </td></tr>
    <tr><td style="padding:8px 28px 0">
      <h1 style="margin:0 0 12px;font-size:24px;line-height:1.25;font-weight:600">Confirm your email</h1>
      <p style="margin:0 0 24px;font-size:16px;line-height:1.55;color:#46557a">Thanks for joining the UK-Azerbaijan Youth Association. Please confirm your email address to finish creating your account.</p>
      <p style="margin:0 0 24px"><a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#c23028;color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;padding:14px 28px;border-radius:999px">Confirm my email</a></p>
      <p style="margin:0 0 8px;font-size:14px;line-height:1.55;color:#46557a">If you did not sign up, you can safely ignore this email.</p>
      <p style="margin:0 0 24px;font-size:12px;line-height:1.5;color:#7a86a3;word-break:break-all">If the button does not work, copy this link into your browser:<br>{{ .ConfirmationURL }}</p>
    </td></tr>
    <tr><td style="padding:16px 28px 24px;border-top:1px solid #dce5f3;font-size:12px;color:#7a86a3">UK-Azerbaijan Youth Association · <a href="https://www.azukyouthassociation.com" style="color:#7a86a3">azukyouthassociation.com</a></td></tr>
  </table>
</div>
```

### Reset password

Subject: `Reset your password · UK-Azerbaijan Youth Association`

```html
<div style="background:#f6f9fe;padding:32px 16px;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;color:#0e1f45">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:20px;border:1px solid #dce5f3">
    <tr><td style="padding:28px 28px 8px">
      <img src="https://www.azukyouthassociation.com/icon-192.png" width="56" height="56" alt="UK-Azerbaijan Youth Association" style="display:block;border-radius:14px">
    </td></tr>
    <tr><td style="padding:8px 28px 0">
      <h1 style="margin:0 0 12px;font-size:24px;line-height:1.25;font-weight:600">Reset your password</h1>
      <p style="margin:0 0 24px;font-size:16px;line-height:1.55;color:#46557a">We received a request to reset the password for your account. Press the button below to choose a new one. The link works for a limited time.</p>
      <p style="margin:0 0 24px"><a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#c23028;color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;padding:14px 28px;border-radius:999px">Choose a new password</a></p>
      <p style="margin:0 0 8px;font-size:14px;line-height:1.55;color:#46557a">If you did not ask for this, you can safely ignore this email. Your password stays the same.</p>
      <p style="margin:0 0 24px;font-size:12px;line-height:1.5;color:#7a86a3;word-break:break-all">If the button does not work, copy this link into your browser:<br>{{ .ConfirmationURL }}</p>
    </td></tr>
    <tr><td style="padding:16px 28px 24px;border-top:1px solid #dce5f3;font-size:12px;color:#7a86a3">UK-Azerbaijan Youth Association · <a href="https://www.azukyouthassociation.com" style="color:#7a86a3">azukyouthassociation.com</a></td></tr>
  </table>
</div>
```

The logo in the templates is loaded from the live site (`/icon-192.png`), so it appears once the site is deployed.

## 3. Test

Open the live site, press **Log in → Forgot password?**, enter an address you own, and check the inbox
(and spam) for the reset email from `no-reply@azukyouthassociation.com`. The link should open
`https://www.azukyouthassociation.com/reset-password`.
