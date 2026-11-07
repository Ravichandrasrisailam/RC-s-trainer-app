# Release and UAT process

## Review and validation

1. Review the exact commit and confirm there are no uncommitted changes.
2. Run `npm --prefix frontend ci`, `npm --prefix frontend test`, and `npm --prefix frontend run build`.
3. Run `supabase start` and `supabase test db` to apply the tracked migrations locally and run the
   RLS/schema contract checks.
4. Configure a dedicated, disposable, onboarded test account and a Preview URL as GitHub Actions
   secrets `E2E_BASE_URL`, `E2E_USER_EMAIL`, and `E2E_USER_PASSWORD`. For Vercel-protected Preview
   deployments, also add the project's `VERCEL_AUTOMATION_BYPASS_SECRET` from Vercel's deployment
   protection settings. Dispatch the `Authenticated browser UAT` workflow. It writes one daily
   steps value and weight for that test account, then checks that those records survive a browser
   reload. Never use a customer account as the E2E test account.
5. Before claiming remote schema verification or two-account isolation, run the migration and
   `supabase/tests/data_isolation.test.sql` against the intended Supabase environment. The local
   test is not a substitute for verifying live RLS policies and migrations.

## Preview to Production

Deploy one reviewed commit to Vercel Preview and record its deployment URL and build commit shown
in the app footer. Complete the authenticated browser UAT and verify the corresponding Supabase
migrations and Edge Functions on Preview. Promote that exact ready Vercel deployment with
`vercel promote <preview-deployment-url>`; do not rebuild from a different branch or use
`vercel deploy --prod` as a substitute for promotion. Verify the Production alias resolves to the
promoted deployment and that its displayed commit matches the reviewed Preview commit.

Apply database migrations and deploy Edge Functions to Production only after Preview verification.
Confirm the target project ref before every remote Supabase operation. Keep provider and service
role credentials in Supabase secrets, never in the frontend or Git.

## Known environment limitations

The automated browser workflow needs a dedicated test account and Preview URL configured in GitHub
Actions secrets. The local Supabase test requires Docker. If either prerequisite is absent, mark
that UAT check blocked rather than treating a build or a direct endpoint request as a pass.
