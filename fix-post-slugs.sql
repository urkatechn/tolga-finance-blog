-- Fix post slugs to be URL-safe
-- This migration updates existing posts with non-URL-safe slugs

-- Update post slugs to be URL-safe
-- Post: Being Multinational Company in Turkey! Root Cause of FX Loss!
-- Current slug: FX1
-- New slug: being-multinational-company-in-turkey-root-cause-of-fx-loss
UPDATE posts SET slug = 'being-multinational-company-in-turkey-root-cause-of-fx-loss' WHERE id = '3f58a1e2-7ed9-4d4d-8210-f9723801fb30';

-- Post: Docs Tool - Online Rate
-- Current slug: Rates Online
-- New slug: docs-tool-online-rate
UPDATE posts SET slug = 'docs-tool-online-rate' WHERE id = '6348d6e3-d21d-4bfc-bac4-793c3461990d';

-- Post: Economic and Accounting Effects of FX Rates Volatility
-- Current slug: FX Changes and Results
-- New slug: economic-and-accounting-effects-of-fx-rates-volatility
UPDATE posts SET slug = 'economic-and-accounting-effects-of-fx-rates-volatility' WHERE id = 'c0d1612e-b95d-41f0-a298-cb391f2af49f';

-- Post: Finance Test 2
-- Current slug: f2
-- New slug: finance-test-2
UPDATE posts SET slug = 'finance-test-2' WHERE id = 'e5fbccbb-5a0f-49a4-bf5b-2bdff63526f3';

-- Summary of changes:
-- 'FX1' → 'being-multinational-company-in-turkey-root-cause-of-fx-loss'
-- 'Rates Online' → 'docs-tool-online-rate'
-- 'FX Changes and Results' → 'economic-and-accounting-effects-of-fx-rates-volatility'
-- 'f2' → 'finance-test-2'