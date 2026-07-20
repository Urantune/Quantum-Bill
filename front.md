# Frontend API Guide

Tai lieu nay mo ta cach frontend ket noi voi backend Quantum-Bill. Backend hien chay Spring Boot, khong dung auth token. Frontend chi can luu `userId` va `roles` sau login/register de goi cac API tiep theo.

## Base URL

Local backend:

```txt
http://localhost:8080
```

Local frontend Vite thuong chay:

```txt
http://localhost:5173
```

Tat ca request JSON can header:

```http
Content-Type: application/json
```

## Rule chung

- Khong co JWT/token. API admin/investor/owner hien chua chan role bang security.
- Frontend tu dieu huong theo `roles` tra ve tu login/register.
- User role hop le: `ADMIN`, `OWNER`, `INVESTOR`.
- Owner dang ky xong co `status=PENDING`, admin phai approve thi moi co role `OWNER`.
- Investor dang ky xong co `status=ACTIVE`, role `INVESTOR`, backend tao wallet mac dinh `100000000 VND`.
- Giao dich mua/ban chi cho phep tu `10:00` den `18:00` theo gio server.
- Phi san la `3.6%` tren gia tri giao dich.
- Gia co phieu tang/giam random qua API market. Gia va thong tin chinh nam MySQL; lich su tang/giam nam MongoDB.
- Bien do ngay duoc backend gioi han toi da `+9%` va `-9%`.

## Error Format

Khi loi, backend thuong tra:

```json
{
  "timestamp": "2026-07-14T10:20:45.991517452",
  "status": 400,
  "message": "Trading is only allowed from 10:00 to 18:00",
  "error": "Bad Request"
}
```

Frontend nen hien `message`.

## Auth APIs

### Register

Dung cho man hinh dang ky investor/owner.

```http
POST /api/auth/register
```

Body:

```json
{
  "fullName": "Nguyen Van A",
  "email": "a@example.com",
  "username": "nguyenvana",
  "password": "123456",
  "role": "INVESTOR"
}
```

Role co the la:

```txt
INVESTOR | OWNER
```

Response:

```json
{
  "id": 2,
  "fullName": "Nguyen Van A",
  "email": "a@example.com",
  "username": "nguyenvana",
  "status": "ACTIVE",
  "roles": ["INVESTOR"],
  "createdAt": "2026-07-14T10:15:15"
}
```

Frontend can luu:

```txt
userId = response.id
roles = response.roles
status = response.status
```

### Login

Dung cho man hinh dang nhap. Khong tra token.

```http
POST /api/auth/login
```

Body:

```json
{
  "username": "nguyenvana",
  "password": "123456"
}
```

Response giong register:

```json
{
  "id": 2,
  "fullName": "Nguyen Van A",
  "email": "a@example.com",
  "username": "nguyenvana",
  "status": "ACTIVE",
  "roles": ["INVESTOR"],
  "createdAt": "2026-07-14T10:15:15"
}
```

Routing frontend goi y:

- `roles` co `ADMIN`: vao admin dashboard.
- `roles` co `OWNER`: vao owner/company dashboard.
- `roles` co `INVESTOR`: vao investor trading dashboard.
- `status=PENDING`: hien man hinh cho admin duyet.

## Admin APIs

### Health Check

Dung de frontend check backend co online khong.

```http
GET /api/admin/health
```

Response:

```json
{
  "message": "Backend is running"
}
```

### Get Users

Dung cho admin user management.

```http
GET /api/admin/users
```

Response:

```json
[
  {
    "id": 2,
    "fullName": "Test Investor",
    "email": "investor@example.com",
    "username": "investor",
    "status": "ACTIVE",
    "roles": ["INVESTOR"],
    "createdAt": "2026-07-14T10:15:15"
  }
]
```

### Approve Owner

Dung khi owner dang ky cong ty/tai khoan va admin can duyet.

```http
POST /api/admin/owners/{userId}/approve
```

Example:

```http
POST /api/admin/owners/3/approve
```

Response la user sau khi duyet:

```json
{
  "id": 3,
  "fullName": "Test Owner",
  "email": "owner@example.com",
  "username": "owner",
  "status": "ACTIVE",
  "roles": ["OWNER"],
  "createdAt": "2026-07-14T10:15:24"
}
```

### Update User Status

Dung de khoa/mo user.

```http
POST /api/admin/users/{userId}/status?status=ACTIVE
```

Status thuong dung:

```txt
ACTIVE | LOCKED | PENDING
```

Example:

```http
POST /api/admin/users/2/status?status=LOCKED
```

### Approve Stock

Dung cho admin duyet co phieu owner submit.

```http
POST /api/admin/stocks/{stockId}/approve
```

Response:

```json
{
  "id": 18,
  "symbol": "QBT",
  "companyName": "Quantum Bill JSC",
  "industry": "Technology",
  "description": "Test stock",
  "currentPrice": 100000.00,
  "status": "ACTIVE",
  "createdAt": "2026-07-14T10:15:59"
}
```

### Reject Stock

Dung cho admin tu choi co phieu.

```http
POST /api/admin/stocks/{stockId}/reject
```

Response la stock voi `status=REJECTED`.

### Adjust Wallet

Dung cho admin nap tien/chinh so du cho investor.

```http
POST /api/admin/wallets/adjust
```

Body:

```json
{
  "userId": 2,
  "amount": 5000000,
  "reason": "Admin top up"
}
```

Response:

```json
{
  "id": 1,
  "userId": 2,
  "balance": 105000000.00,
  "currency": "VND"
}
```

## Stock APIs

### Get All Stocks

Dung cho admin/owner xem tat ca stock moi trang thai.

```http
GET /api/stocks
```

Response:

```json
[
  {
    "id": 18,
    "symbol": "QBT",
    "companyName": "Quantum Bill JSC",
    "industry": "Technology",
    "description": "Test stock",
    "currentPrice": 100000.00,
    "status": "ACTIVE",
    "createdAt": "2026-07-14T10:15:59"
  }
]
```

### Get Active Stocks

Dung cho investor market screen. Co search optional.

```http
GET /api/stocks/active
GET /api/stocks/active?q=FPT
```

Chi tra stock `ACTIVE`.

### Get Stock Detail

Dung cho stock detail page.

```http
GET /api/stocks/{id}
```

Example:

```http
GET /api/stocks/18
```

### Create Stock Directly

Dung cho admin/dev tao stock truc tiep. Neu `status` khong truyen, backend xu ly theo service hien tai.

```http
POST /api/stocks
```

Body:

```json
{
  "symbol": "QBT",
  "companyName": "Quantum Bill JSC",
  "industry": "Technology",
  "description": "Company description",
  "currentPrice": 100000,
  "status": "ACTIVE",
  "createdById": 3
}
```

### Submit Stock For Approval

Dung cho owner gui cong ty/co phieu cho admin duyet.

```http
POST /api/stocks/submit
```

Body:

```json
{
  "symbol": "QBT",
  "companyName": "Quantum Bill JSC",
  "industry": "Technology",
  "description": "Company description",
  "currentPrice": 100000,
  "createdById": 3
}
```

Response co `status=PENDING`.

### Update Stock

Dung cho owner/admin sua thong tin stock.

```http
PUT /api/stocks/{id}
```

Body giong create stock.

### Delete Stock

Dung cho admin/dev xoa stock.

```http
DELETE /api/stocks/{id}
```

Response rong neu thanh cong.

## Market APIs

### Auto Market Updates

Backend tu dong random gia moi `15s` trong gio giao dich `10:00-18:00`.

Frontend khong can goi API simulate lien tuc. De hien gia realtime, frontend nen poll:

```txt
GET /api/stocks/active
GET /api/market/stocks/{stockId}/history
```

Tan suat poll goi y:

```txt
Market board: moi 15s
Stock detail/chart: moi 15s
Portfolio: moi 15-30s
```

### Simulate Market Manually

Dung cho admin/dev bam nut random gia thu cong.

```http
POST /api/market/simulate
POST /api/market/simulate?force=true
```

Rule:

- `force=false` hoac khong truyen: chi chay trong gio 10:00-18:00.
- `force=true`: bo qua rule gio, tien cho nut admin test.
- Backend random gia, cap nhat MySQL, va luu lich su vao MongoDB.

Response:

```json
[
  {
    "stockId": 18,
    "symbol": "QBT",
    "oldPrice": 100000.00,
    "newPrice": 99650.20,
    "changeAmount": -349.80,
    "changePercent": -0.3498,
    "direction": "DOWN"
  }
]
```

Frontend market board nen dung:

- `newPrice` de update gia hien tai.
- `changeAmount`, `changePercent`, `direction` de hien mau xanh/do.

### Get Stock Price History

Dung cho chart detail cua mot stock. Data doc tu MongoDB.

```http
GET /api/market/stocks/{stockId}/history
```

Example:

```http
GET /api/market/stocks/18/history
```

Response:

```json
[
  {
    "id": "6a55ac01915be8bd3b30d957",
    "stockId": 18,
    "symbol": "QBT",
    "oldPrice": 100000.00,
    "newPrice": 99650.20,
    "changeAmount": -349.80,
    "changePercent": -0.3498,
    "direction": "DOWN",
    "changeReason": "RANDOM_MARKET_TICK",
    "changedByUserId": null,
    "recordedAt": "2026-07-14T10:24:49.972"
  }
]
```

Frontend chart goi y:

- X axis: `recordedAt`
- Y axis: `newPrice`
- Tooltip: `changeAmount`, `changePercent`, `direction`

## Trading APIs

### Buy Stock

Dung cho investor buy modal.

```http
POST /api/trading/buy
```

Body:

```json
{
  "userId": 2,
  "stockId": 18,
  "quantity": 10
}
```

Response:

```json
{
  "transactionId": 1,
  "type": "BUY",
  "symbol": "QBT",
  "quantity": 10,
  "price": 99650.20,
  "grossAmount": 996502.00,
  "fee": 35874.07,
  "netAmount": 1032376.07,
  "walletBalance": 98967623.93
}
```

Frontend tinh preview truoc khi submit:

```txt
grossAmount = currentPrice * quantity
fee = grossAmount * 0.036
netAmount = grossAmount + fee
```

Neu ngoai gio giao dich, backend tra 400:

```json
{
  "status": 400,
  "message": "Trading is only allowed from 10:00 to 18:00",
  "error": "Bad Request"
}
```

### Sell Stock

Dung cho investor sell modal.

```http
POST /api/trading/sell
```

Body:

```json
{
  "userId": 2,
  "stockId": 18,
  "quantity": 4
}
```

Response:

```json
{
  "transactionId": 2,
  "type": "SELL",
  "symbol": "QBT",
  "quantity": 4,
  "price": 99650.20,
  "grossAmount": 398600.80,
  "fee": 14349.63,
  "netAmount": 384251.17,
  "walletBalance": 99351875.10
}
```

Frontend tinh preview:

```txt
grossAmount = currentPrice * quantity
fee = grossAmount * 0.036
netAmount = grossAmount - fee
```

### Get Wallet

Dung cho header/sidebar investor hien so du.

```http
GET /api/trading/wallet/{userId}
```

Response:

```json
{
  "id": 1,
  "userId": 2,
  "balance": 99351875.10,
  "currency": "VND"
}
```

### Get Portfolio

Dung cho investor portfolio/dashboard.

```http
GET /api/trading/portfolio/{userId}
```

Response:

```json
{
  "userId": 2,
  "cashBalance": 99351875.10,
  "holdingsValue": 597901.20,
  "totalAssets": 99949776.30,
  "profitLoss": 0.00,
  "holdings": [
    {
      "stockId": 18,
      "symbol": "QBT",
      "companyName": "Quantum Bill JSC",
      "quantity": 6,
      "averageBuyPrice": 99650.20,
      "currentPrice": 99650.20,
      "marketValue": 597901.20,
      "profitLoss": 0.00
    }
  ]
}
```

### Get Transactions

Dung cho lich su giao dich investor.

```http
GET /api/trading/transactions/{userId}
```

Response:

```json
[
  {
    "id": 2,
    "type": "SELL",
    "symbol": "QBT",
    "quantity": 4,
    "price": 99650.20,
    "totalAmount": 398600.80,
    "createdAt": "2026-07-14T17:26:57"
  },
  {
    "id": 1,
    "type": "BUY",
    "symbol": "QBT",
    "quantity": 10,
    "price": 99650.20,
    "totalAmount": 996502.00,
    "createdAt": "2026-07-14T17:26:11"
  }
]
```

### Ranking

Dung cho leaderboard.

```http
GET /api/trading/ranking
```

Response:

```json
[
  {
    "userId": 2,
    "username": "investor",
    "fullName": "Test Investor",
    "totalAssets": 99949776.30,
    "profitLoss": 0.00
  }
]
```

## Frontend Screen Mapping

### Login Page

Call:

```txt
POST /api/auth/login
```

Sau response:

- Luu `userId`, `username`, `roles`, `status` vao local state/localStorage.
- Redirect theo role.

### Register Page

Call:

```txt
POST /api/auth/register
```

Neu role `OWNER` va response `PENDING`, hien thong bao cho admin duyet.

### Investor Dashboard

Load song song:

```txt
GET /api/stocks/active
GET /api/trading/wallet/{userId}
GET /api/trading/portfolio/{userId}
GET /api/trading/transactions/{userId}
```

Nut buy:

```txt
POST /api/trading/buy
```

Nut sell:

```txt
POST /api/trading/sell
```

Sau buy/sell thanh cong, reload:

```txt
GET /api/trading/wallet/{userId}
GET /api/trading/portfolio/{userId}
GET /api/trading/transactions/{userId}
GET /api/stocks/active
```

### Stock Detail Page

Load:

```txt
GET /api/stocks/{id}
GET /api/market/stocks/{stockId}/history
```

### Owner Dashboard

Load stock cua he thong:

```txt
GET /api/stocks
```

Submit cong ty/co phieu:

```txt
POST /api/stocks/submit
```

Neu can sua:

```txt
PUT /api/stocks/{id}
```

### Admin Dashboard

Load:

```txt
GET /api/admin/users
GET /api/stocks
GET /api/trading/ranking
```

Duyet owner:

```txt
POST /api/admin/owners/{userId}/approve
```

Duyet/reject stock:

```txt
POST /api/admin/stocks/{stockId}/approve
POST /api/admin/stocks/{stockId}/reject
```

Chay random market:

```txt
POST /api/market/simulate?force=true
```

Nap tien/chinh wallet:

```txt
POST /api/admin/wallets/adjust
```

## Minimal Fetch Wrapper

Frontend co the tao wrapper:

```js
const API_BASE_URL = "http://localhost:8080";

export async function api(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || `HTTP ${response.status}`);
  }

  return data;
}
```

Example:

```js
export function login(username, password) {
  return api("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function getActiveStocks(q = "") {
  const query = q ? `?q=${encodeURIComponent(q)}` : "";
  return api(`/api/stocks/active${query}`);
}

export function buyStock(userId, stockId, quantity) {
  return api("/api/trading/buy", {
    method: "POST",
    body: JSON.stringify({ userId, stockId, quantity }),
  });
}
```

## CORS Note

Neu frontend `localhost:5173` bi CORS khi goi backend `localhost:8080`, can them CORS config trong backend cho origin:

```txt
http://localhost:5173
```

Hien tai neu fetch bi loi CORS tren browser nhung Postman/curl OK, do la loi browser policy, khong phai API.
