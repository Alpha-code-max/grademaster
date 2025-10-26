# Error Log & Solutions

## 2025-10-17 - JWT_SECRET Environment Variable Error
**Error**: `Error: JWT_SECRET must be set in environment variables`
**Cause**: dotenv.config() wasn't being called before middleware imported
**Solution**: Added `import dotenv from 'dotenv'; dotenv.config();` at the top of middleware.ts
**Status**: ✅ Resolved

## 2025-10-17 - Request Body Empty Error
**Error**: `{"success":false,"message":"Request body is empty"}`
**Cause**: Missing `Content-Type: application/json` header in request
**Solution**: Set header in Hoppscotch Headers tab
**Status**: ✅ Resolved

## 2025-10-17 - Rate Limit Error
**Error**: `Too many registration attempts, retryAfter: 347`
**Cause**: Exceeded 5 requests in 15 minutes
**Solution**: Restarted server to clear rate limit cache
**Status**: ✅ Resolved 