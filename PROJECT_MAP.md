# Quantum Bill - Project Map

Tai lieu ban giao cho agent tiep theo. Noi dung phan anh code va database tai thoi diem 2026-07-21.

## 1. Muc tieu he thong

Quantum Bill la san giao dich chung khoan gia lap gom 3 role:

- `OWNER`: nguoi dau tu ca nhan, co vi, mua/ban co phieu, xem danh muc va lich su.
- `INVESTOR`: cong ty niem yet/chủ phat hanh. Quan ly co phieu cua chinh cong ty va duyet/tu choi lenh mua ban co phieu do.
- `ADMIN`: quan tri he thong, duyet tai khoan cong ty, duyet ma co phieu, khoa user, chay simulation va dat gio giao dich.

Luu y: ten package `investor` trong backend dang chua nghiep vu giao dich cua `OWNER`. Day la ten cu, khong nen suy ra role tu ten package.

## 2. Cau truc repository

```text
Quantum-Bill/
|- Back/                         Spring Boot backend
|  |- pom.xml
|  `- src/main/java/quantum_bill/stock/
|     |- auth/                   login, register, JWT, refresh/logout
|     |- admin/                  user/stock approval, wallet adjustment
|     |- investor/               trading, wallet, portfolio, orders
|     |- owner/                  stock listing, market simulation, Mongo history
|     `- common/                 bootstrap, trading-time setting
|- Front/frontend/               React + Vite frontend
|  |- src/routes/AppRoutes.jsx   route/role map
|  |- src/context/AuthContext.jsx
|  |- src/constants/navigation.js
|  |- src/services/              backend API adapters
|  `- src/pages/                 screens by role
`- PROJECT_MAP.md                file nay
```

## 3. Cong nghe va lenh chay

Backend:

- Java source target: 21.
- Spring Boot 4.1.0.
- Spring MVC, JPA/Hibernate, Security, Validation.
- MySQL Connector/J.
- Spring Data MongoDB.
- JWT Nimbus/JJWT dependencies.

Frontend:

- React 19, React Router, Vite 6.
- Axios, Tailwind CSS, Recharts, Framer Motion, Lucide.

May hien tai can ep `JAVA_HOME` sang JDK co `javac`:

```bash
cd Back
JAVA_HOME=/usr/lib/jvm/java-26 ./mvnw spring-boot:run
```

Backend: `http://localhost:8080`

```bash
cd Front/frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

Vite proxy request `/api` sang backend 8080. Neu frontend bao `ECONNREFUSED /api/...`, backend chua chay hoac da dung vi DB cloud timeout.

Lenh kiem tra da dung:

```bash
cd Back
JAVA_HOME=/usr/lib/jvm/java-26 ./mvnw test

cd Front/frontend
npm run build
```

Ca Spring context test va frontend production build da pass vao 2026-07-21. Frontend co warning bundle lon hon 1000 kB, chua can xu ly trong scope hien tai.

## 4. Database va quyen so huu du lieu

### MySQL

MySQL la source of truth cho du lieu nghiep vu cung:

- `users`, `roles`, `user_roles`
- `stocks`
- `wallets`, `wallet_transactions`
- `portfolio_holdings`
- `stock_transactions`
- audit/error/token tables

Quan he chinh:

```text
User --< UserRole >-- Role
User --1 Wallet
User --< PortfolioHolding >-- Stock
User --< StockTransaction >-- Stock
User(INVESTOR) --< Stock.createdBy
Wallet --< WalletTransaction
```

`stocks.created_by` la tai khoan cong ty so huu ma co phieu. Tat ca API dashboard cong ty phai loc theo field nay.

Thong tin ket noi MySQL/Mongo/JWT nam tai:

`Back/src/main/resources/application.properties`

File nay dang co credential cloud that. Khong dua credential vao response, log, commit moi hoac tai lieu khac. Khi chuyen may, phai chuyen file config theo kenh rieng hoac chuyen sang environment variables.

### MongoDB

MongoDB database: `quantumbill`.

Collections:

- `stock_price_histories`: tung tick gia, gom stockId, symbol, old/new price, amount/percent, direction, reason, recordedAt.
- trading-time collection qua `TradingTimeSetting`: mot document duy nhat co key co dinh, openTime va closeTime. Update document hien tai, khong tao document moi moi lan.

Gia hien tai van duoc cap nhat trong MySQL `stocks.current_price`; lich su bien dong duoc ghi MongoDB. Neu Mongo tam thoi mat ket noi, simulation van cap nhat MySQL va bo qua loi save history de backend khong chet.

## 5. Tai khoan hien tai

Tai khoan mau:

| Role | Username | Password | Ghi chu |
|---|---|---|---|
| ADMIN | `admin` | `123` | Quan tri |
| OWNER | `hehe` | `123` | Nguoi dau tu mau |
| OWNER | `tt` | `123456` | Tai khoan test cu, tuy DB hien tai |

Database da dong bo 19 ma co phieu thuoc 18 cong ty va dung 18 account `INVESTOR`. Password bootstrap cho cac account cong ty la `123`:

`fpt`, `btc`, `tcl`, `vic`, `vnm`, `vcb`, `aapl`, `tsla`, `nvda`, `gold`, `eth`, `dudinh`, `rich`, `qbt1015`, `egqub`, `eqube`, `egqub123`, `eqrquba`.

Username cong ty la chu thuong ASCII, khong dau, khong khoang trang. Form register validate regex:

```regex
^[a-z0-9_]{2,30}$
```

`DataBootstrap` trong `common/DataBootstrap.java`:

- Dam bao 3 role ton tai.
- Dam bao `admin` va `hehe`.
- Moi company duy nhat co mot account INVESTOR.
- Username account bootstrap lay tu symbol dau tien cua company va lowercase.
- Gan moi stock ve dung `createdBy`.
- Reset password account company ve `123` moi lan backend khoi dong.

## 6. Auth va quy trinh duyet cong ty

### Register OWNER

1. `POST /api/auth/register` voi role `OWNER`.
2. `AuthService.register()` tao user `ACTIVE`.
3. Gan role OWNER va tao wallet ban dau 100,000,000 VND.
4. Frontend luu session va dieu huong theo role.

### Register INVESTOR

1. Dung cung trang `/auth/register`, chon `INVESTOR (Cong ty niem yet)`.
2. Backend tao user `PENDING`, chua gan role.
3. Frontend khong luu session, dua ve login va thong bao cho Admin duyet.
4. User PENDING khong login duoc (`USER_NOT_ACTIVE`).
5. Admin vao `/admin/users`, nut `Duyet cong ty` chi hien cho status PENDING.
6. `POST /api/admin/owners/{userId}/approve` chuyen ACTIVE va gan role INVESTOR.
7. Neu `fullName` trung `stocks.company_name`, `AdminService.approveOwner()` gan stock do cho account vua duyet.

### Login/session frontend

`AuthContext.jsx` goi `/api/auth/login`, decode JWT payload, luu:

- `quantum_bill_user`
- `quantum_bill_token`

trong `localStorage`, sau do gan `Authorization: Bearer ...` vao Axios.

Canh bao security hien tai: `SecurityConfig` dang `.anyRequest().permitAll()`. Frontend co route guard va backend co check ownership bang `companyUserId`, nhung client co the gia mao ID neu goi API truc tiep. User truoc day yeu cau tam bo auth token. Neu dua len production, viec dau tien la bat JWT resource-server va lay user ID tu authenticated principal thay vi query/body/path.

## 7. Frontend route theo role

Public:

- `/`: trang chu/market overview.
- `/auth/login`, `/auth/register`, `/auth/forgot-password`.
- `/owner/topup/:token` va `/investor/topup/:token`: trang hoan tat nap tien ao.

OWNER (nguoi dau tu):

- `/owner`: dashboard thi truong.
- `/owner/wallet`: vi va tao QR nap tien.
- `/owner/stocks`: bang gia + mua/ban chung tren mot man hinh.
- `/owner/stocks/:id`: chi tiet/chart mot co phieu.
- `/owner/portfolio`: danh muc.
- `/owner/transactions`: lich su giao dich.
- `/owner/ranking`: xep hang.
- `/owner/buy`, `/owner/sell`: redirect ve `/owner/stocks`, khong con menu rieng.

INVESTOR (cong ty):

- `/investor`: `OwnerDashboard`, chi load stocks va pending orders cua account hien tai.
- `/investor/stocks/:id`: chi tiet stock cong ty.

ADMIN:

- `/admin`: tong quan.
- `/admin/users`: duyet/khoa user.
- `/admin/stocks`: duyet/reject listing.
- `/admin/simulation`: force market tick.
- `/admin/settime`: doc/cap nhat gio giao dich.

`Sidebar.jsx` loc `NAV_ITEMS` bang `getEffectiveRole(user)` va status. Khi them menu phai khai bao `roles`, tranh lam lo menu admin sang OWNER/INVESTOR.

## 8. Backend API map

### Auth: `/api/auth`

| Method | Path | Ham |
|---|---|---|
| POST | `/register` | `AuthService.register` |
| POST | `/login` | `AuthService.authenticated` |
| POST | `/introspect` | `AuthService.introspect` |
| POST | `/logout` | `AuthService.logout` |
| POST | `/refresh` | `AuthService.refreshToken` |
| POST | `/forgot-password` | `AuthService.forgotPassword` |

### Stock/listing: `/api/stocks`

| Method | Path | Ham/chuc nang |
|---|---|---|
| GET | `/api/stocks` | page tat ca stock |
| GET | `/api/stocks/active?q=` | active stocks, co search |
| GET | `/api/stocks/company/{userId}` | stocks co `createdBy.id=userId` |
| GET | `/api/stocks/{id}` | chi tiet |
| POST | `/api/stocks` | save stock, can `createdById` |
| POST | `/api/stocks/submit` | tao listing `PENDING`, can `createdById` |
| PUT | `/api/stocks/{id}` | cap nhat |
| DELETE | `/api/stocks/{id}` | xoa |

Frontend cong ty dung `ownerService.js`; `getCurrentUserId()` lay ID tu localStorage va tu dong gui `createdById`/`companyUserId`.

### Market/Mongo: `/api/market`

| Method | Path | Chuc nang |
|---|---|---|
| POST | `/simulate?force=false` | random mot tick cho tat ca ACTIVE stocks |
| GET | `/stocks/{stockId}/history` | lich su Mongo cua stock |

`MarketPriceScheduler.updateMarketPrices()` chay moi 15 giay (`fixedRate=15000`). Scheduler chi random trong gio giao dich. Admin simulation gui `force=true` de bo qua gio.

Random price trong `MarketSimulationService`:

- Gioi han ngay: +/-9% so voi gia tham chieu dau ngay.
- Moi tick tong hop Gaussian market mood, 8% event shock va liquidity noise.
- Moi tick clamp khoang +/-2.5%, sau do clamp tiep daily band +/-9%.
- Luu `Stock.currentPrice` MySQL va `StockPriceHistory` Mongo.

### Trading: `/api/trading`

| Method | Path | Chuc nang |
|---|---|---|
| POST | `/buy` | tao BUY PENDING |
| POST | `/sell` | tao SELL PENDING |
| GET | `/wallet/{userId}` | vi |
| GET | `/portfolio/{userId}` | danh muc/tong tai san/P&L |
| GET | `/transactions/{userId}` | lich su mot OWNER |
| GET | `/transactions` | tat ca giao dich, admin/report |
| GET | `/orders/pending?companyUserId=` | chi pending cua stocks thuoc company |
| POST | `/orders/{id}/approve?companyUserId=` | company duyet lenh cua minh |
| POST | `/orders/{id}/reject?companyUserId=` | company reject lenh cua minh |
| GET | `/ranking` | xep hang theo tong tai san |
| POST | `/topup-sessions` | tao URL/QR token random, het han 15 phut |
| POST | `/topup-sessions/{token}/complete` | nap mot lan va huy token |

Trade flow:

1. OWNER gui buy/sell trong gio mo cua.
2. `TradingService.buy/sell` validate user, stock, wallet/holding va tao `StockTransaction(PENDING)`; chua tru/cong tien.
3. INVESTOR cua stock load pending bang ownership `Stock.createdBy.id`.
4. Khi approve BUY: check so du lan nua, tru `gross + 3.6%`, cap nhat holding/average price, ghi wallet transaction.
5. Khi approve SELL: check quantity lan nua, cong `gross - 3.6%`, tru holding, ghi wallet transaction.
6. Reject chi doi order sang `REJECTED`.

Phi san:

```text
FEE_RATE = 0.036 (3.6%)
BUY net  = gross + fee
SELL net = gross - fee
```

### Trading time: `/api/settime`

| Method | Path | Chuc nang |
|---|---|---|
| GET | `/api/settime` | load open/close hien tai tu Mongo |
| POST | `/api/settime` | update open/close cung document |

Mac dinh every day; chi set gio, khong set ngay. Frontend route hien tai la `/admin/settime` va can ADMIN, du yeu cau cu tung noi `/settime` public.

### Admin: `/api/admin`

| Method | Path | Chuc nang |
|---|---|---|
| GET | `/health` | health message |
| GET | `/users` | users + roles/status |
| POST | `/owners/{id}/approve` | approve PENDING company -> ACTIVE INVESTOR |
| POST | `/users/{id}/status?status=` | ACTIVE/LOCKED... |
| POST | `/stocks/{id}/approve` | listing ACTIVE |
| POST | `/stocks/{id}/reject` | listing REJECTED |
| POST | `/wallets/adjust` | admin dieu chinh vi |

## 9. Entity/document quan trong

MySQL:

- `User`: id, fullName, email, username, passwordHash, status, timestamps, roles.
- `Role`, `UserRole`: many-to-many role mapping.
- `Stock`: symbol, companyName, industry, currentPrice, status, description, createdBy.
- `Wallet`: user, balance, currency, timestamps.
- `WalletTransaction`: wallet, type, amount, before/after balance, reference.
- `PortfolioHolding`: user, stock, quantity, averageBuyPrice.
- `StockTransaction`: user, stock, BUY/SELL, quantity, price, totalAmount, PENDING/APPROVED/REJECTED.

Mongo:

- `StockPriceHistory`: chart/history tick.
- `TradingTimeSetting`: singleton trading schedule.

Top-up session khong luu DB: dang nam trong `ConcurrentHashMap` cua `TradingService`. Restart backend se lam tat ca QR/link chua dung mat hieu luc.

## 10. Trang/component quan trong

- `pages/Investor/Dashboard.jsx`: dashboard OWNER.
- `pages/Investor/StockList.jsx`: market + buy/sell cung trang.
- `pages/Investor/StockDetail.jsx`: chart stock.
- `components/Investor/StockChart.jsx`: TradingView-like custom Recharts chart, wheel zoom handling.
- `pages/Owner/OwnerDashboard.jsx`: dashboard cong ty INVESTOR, listing va pending approval.
- `pages/admin/AdminUsers.jsx`: duyet company PENDING va lock user.
- `pages/admin/AdminStocks.jsx`: duyet listing.
- `pages/SetTime/SetTime.jsx`: trading hours.
- `services/investorService.js`: API cua OWNER trader.
- `services/ownerService.js`: API cua company INVESTOR.
- `services/adminApi.js`: API Admin.

## 11. Trang thai da lam va da test

Da lam:

- Register/login/logout frontend va JWT response parsing.
- INVESTOR register PENDING, Admin approve moi login duoc.
- Tach dashboard/menu OWNER, INVESTOR, ADMIN.
- Company ownership bang `stocks.created_by`.
- Company chi xem/duyet order cua stock minh.
- OWNER mua/ban PENDING, wallet, portfolio, transactions, ranking.
- Phi giao dich 3.6%.
- Market simulation 15 giay, daily cap +/-9%.
- Mongo history va fallback khi Mongo timeout.
- Admin set trading time singleton Mongo document.
- QR nap tien ao voi token random one-time.
- 18 account cong ty duoc dong bo vao MySQL, username ASCII ngan, password 123.

Test thuc te gan nhat:

- `fpt / 123` login thanh cong.
- `/api/stocks/company/12` chi tra stock FPT.
- Pending endpoint cua company FPT tra 4 order va ca 4 deu symbol FPT.
- Backend Spring context test pass voi MySQL + Mongo cloud.
- Frontend `npm run build` pass.

## 12. No ky thuat va viec agent tiep theo can biet

1. Backend authorization dang `permitAll`; ownership hien dua vao ID client gui len. Can JWT principal neu muon an toan that.
2. Package/role naming bi nguoc: `OWNER` la trader, `INVESTOR` la company. Khong doi hang loat neu chua co migration plan.
3. Top-up token chi in-memory, restart la mat.
4. Mongo Atlas co luc timeout/refused do mang/port 27017; service history da co fallback nhung TradingTime van can Mongo.
5. `spring.jpa.show-sql=true` tao log rat nhieu, co the tat khi debug xong.
6. Application config dang chua secret that. Nen doi sang `${DB_URL}`, `${DB_USERNAME}`, `${DB_PASSWORD}`, `${MONGODB_URI}`, `${JWT_SECRET}` truoc khi public repo.
7. Frontend forgot-password dang hien ngoai scope du backend co endpoint stub/email logic.
8. Admin dashboard co shortcut path cu nhu wallet/ranking nhung AppRoutes khong khai bao day du; can xoa shortcut hoac them route neu tiep tuc scope admin.
9. `GET /api/trading/transactions` va cac overload approve/reject global con trong service; khong de company UI goi nham.
10. Cac thay doi hien tai chua duoc commit trong luot ban giao nay. Kiem tra `git status` va khong revert file nguoi dung da sua.

## 13. Cach agent moi tiep tuc nhanh

1. Doc file nay.
2. Doc `AGENTS.md`, `/home/urantune/.codex/RTK.md`, `/home/urantune/.codex/SERENA.md`.
3. Activate Serena project tai root Quantum-Bill.
4. Chay `git status --short`, khong reset thay doi hien co.
5. Start backend bang JDK 26 command o muc 3.
6. Xac nhan `curl http://localhost:8080/api/admin/health`.
7. Start frontend va test role bang `admin/123`, `hehe/123`, `fpt/123`.
8. Sau moi thay doi, chay Maven test va Vite build.

