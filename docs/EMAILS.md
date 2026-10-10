# Registration emails: setup

How it works: database triggers put a row in `email_outbox` whenever someone registers,
joins the waitlist, is promoted, cancels, or an event is cancelled. A scheduled job calls the
`process-emails` Edge Function every 5 minutes. It queues 24-hour reminders, then sends
everything that is waiting through Resend. Failed sends retry (up to 5 times). A problem with
email can never block or undo a booking.

## 1. Resend account and sender domain

1. Create a free account at https://resend.com (3,000 emails a month).
2. **Domains → Add domain**, enter a domain the association controls, then add the DNS records
   Resend shows (SPF, DKIM) at your domain registrar. Wait until the domain shows *Verified*.
   - Without a verified domain Resend only delivers to your own address, so real members
     will not receive anything.
3. **API Keys → Create API key** (sending access). Copy it once.

## 2. Apply the migration

```bash
supabase db push
```

## 3. Set the secrets (you run this; the key never goes in the website code)

Generate a long random value for `EMAIL_WEBHOOK_SECRET` (for example `openssl rand -hex 32`).

```bash
supabase secrets set RESEND_API_KEY=re_xxxxxxxx EMAIL_FROM="Azerbaijan UK Youth Association <events@yourdomain.org>" SITE_URL=https://azerbaijan-uk-youth-association.vercel.app EMAIL_WEBHOOK_SECRET=PASTE_THE_RANDOM_VALUE
```

## 4. Deploy the function

```bash
supabase functions deploy process-emails --use-api
```

## 5. Schedule it

In the Supabase dashboard, open **Database → Extensions** and enable `pg_cron` and `pg_net`.
Then run this in the SQL editor, replacing `PASTE_THE_RANDOM_VALUE` with the same secret:

```sql
select cron.schedule(
  'process-emails',
  '*/5 * * * *',
  $$ select net.http_post(
       url := 'https://tobcodgmetnajycytqjc.supabase.co/functions/v1/process-emails',
       headers := jsonb_build_object('x-webhook-secret', 'PASTE_THE_RANDOM_VALUE', 'content-type', 'application/json'),
       body := '{}'::jsonb
     ) $$
);
```

To stop it later: `select cron.unschedule('process-emails');`

## 6. Test

Register for an event on the live site. Within five minutes a confirmation should arrive.
Check delivery problems with:

```sql
select kind, status, attempts, last_error, created_at from email_outbox order by created_at desc limit 20;
```

## Emails sent

| When | Email |
|---|---|
| Someone registers and gets a place | Registration confirmed (ticket code, calendar link) |
| Someone joins a full event | On the waitlist |
| A waitlisted person gets a place | A place opened up |
| Someone cancels, or staff removes them | Registration cancelled |
| Staff cancels an event | Event cancelled (to everyone registered or waitlisted) |
| 24 hours before the start | Reminder (only for people who registered more than 24 hours ahead) |
