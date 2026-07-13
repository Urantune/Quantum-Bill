# Quantum-Bill Project Map

Tai lieu nay danh cho coding agents doc nhanh truoc khi sua code. Muc tieu la nam cau truc, quan he module va cac file nen mo truoc, tranh doc lan man ton token.

## Tong Quan

Repo gom 2 ung dung chinh:

- `Back/`: Spring Boot backend, Java 21, Maven wrapper, JPA/MySQL, MongoDB, Spring Security, validation.
- `Front/frontend/`: Vite React frontend, React 19, Tailwind CSS, React Router, Axios, Recharts, Framer Motion.

Backend va frontend hien chua duoc noi chat voi nhau:

- Backend co REST CRUD that cho `Stock` tai `/api/stocks`.
- Frontend hien dung mock data qua `src/services/marketService.js`.
- `src/services/api.js` da co Axios client de chuyen sang API that sau nay.

## Lenh Hay Dung

Luon dung `rtk` khi chay shell command trong Codex.

```bash
rtk npm run dev
rtk npm run build
rtk npm run lint
rtk ./mvnw test
rtk ./mvnw spring-boot:run
```

Thu muc chay lenh:

- Frontend: `Front/frontend`
- Backend: `Back`

## Backend Map

Entry point:

- `Back/src/main/java/quantum_bill/stock/StockApplication.java`

Config:

- `Back/pom.xml`: Spring Boot `4.1.0`, Java `21`, JPA, MongoDB, Web MVC, Security, Validation, MySQL Connector/J, Lombok.
- `Back/src/main/resources/application.properties`: MySQL + MongoDB connection config. File nay dang co credentials hardcoded; khong echo lai secret neu khong can.
- `Back/src/main/java/quantum_bill/stock/owner/config/SecurityConfig.java`: tat CSRF, `anyRequest().permitAll()`. Cac `@PreAuthorize` trong controller dang comment.

Package domain:

```text
quantum_bill.stock
├── admin
│   ├── entity: User, Role, UserRole, AuditLog, SystemError
│   └── repository: JpaRepository cho cac entity admin
├── investor
│   ├── entity: PortfolioHolding, StockTransaction, Wallet, WalletTransaction, RefreshToken
│   └── repository: JpaRepository cho cac entity investor
└── owner
    ├── config: SecurityConfig
    ├── controller: StockController
    ├── dto/request: StockRequestDTO
    ├── dto/response: StockResponseDTO
    ├── document: StockPriceHistory
    ├── entity: Stock, MarketNews
    ├── exception: ApiError, GlobalExceptionHandler, ResourceNotFoundException
    ├── mongo: StockPriceHistoryRepository
    ├── repository: StockRepository, MarketNewsRepository
    └── service: IStockService, impl/StockService
```

### Backend Stock Flow

Request flow:

```text
HTTP /api/stocks
  -> owner/controller/StockController
  -> owner/service/IStockService
  -> owner/service/impl/StockService
  -> owner/repository/StockRepository
  -> owner/entity/Stock
  -> MySQL table stocks
```

Important files:

- `owner/controller/StockController.java`
  - `GET /api/stocks?page=0&size=20`
  - `GET /api/stocks/{id}`
  - `POST /api/stocks`
  - `PUT /api/stocks/{id}`
  - `DELETE /api/stocks/{id}`
- `owner/service/impl/StockService.java`
  - Converts entity to `StockResponseDTO`.
  - Sets `symbol` uppercase/trim.
  - Defaults `status` to `ACTIVE`.
  - Throws `ResourceNotFoundException` when stock missing.
- `owner/repository/StockRepository.java`
  - Extends `JpaRepository<Stock, Long>`.
  - Adds `findBySymbol(String symbol)`.

### Backend Persistence Split

MySQL stores relational/accounting data:

- User, role, auth/session-ish tables: `User`, `Role`, `UserRole`, `RefreshToken`.
- Account, wallet, holdings, transaction totals: `Wallet`, `WalletTransaction`, `PortfolioHolding`, `StockTransaction`.
- Stock master/current summary: `Stock.currentPrice` remains in MySQL so account/portfolio calculations can join it.

MongoDB stores time-series-ish market movement data:

- `owner/document/StockPriceHistory.java`
- Collection: `stock_price_histories`
- Stores `stockId`, `symbol`, `oldPrice`, `newPrice`, `changeAmount`, `changePercent`, `direction`, `changeReason`, `changedByUserId`, `recordedAt`.
- It does not store JPA relations to `Stock` or `User`; it stores IDs/symbol snapshot only.
- `StockService.update()` writes a Mongo history document only when `currentPrice` changes.

### Backend Entity Relationships

Core relationships visible from JPA annotations:

```text
User
├── UserRole.user -> User
├── AuditLog.user -> User
├── Stock.createdBy -> User
├── MarketNews.createdBy -> User
├── PortfolioHolding.user -> User
├── StockTransaction.user -> User
├── Wallet.user -> User (one-to-one)
└── RefreshToken.user -> User

Role
└── UserRole.role -> Role

Stock
├── MarketNews.stock -> Stock
├── PortfolioHolding.stock -> Stock
└── StockTransaction.stock -> Stock

Wallet
└── WalletTransaction.wallet -> Wallet
```

Stock entity fields:

- `id`, `symbol`, `companyName`, `industry`, `description`, `currentPrice`, `status`, `createdBy`, `createdAt`, `updatedAt`.
- Table: `stocks`.
- `symbol` unique, max length 20.

Stock DTO contract:

- Request: `symbol`, `companyName`, `industry`, `description`, `currentPrice`, `status`, `createdById`.
- Response: `id`, `symbol`, `companyName`, `industry`, `description`, `currentPrice`, `status`, `createdAt`.
- Note: `createdById` is present in request DTO but currently not used by `StockService`.

## Frontend Map

Entry/config:

- `Front/frontend/src/main.jsx`: React app mount.
- `Front/frontend/src/App.jsx`: loads `AppRoutes`.
- `Front/frontend/vite.config.js`: alias `@` -> `src`, dev server port `5173`.
- `Front/frontend/tailwind.config.js`, `src/index.css`, `src/App.css`: styling.

Routing:

```text
src/App.jsx
  -> src/routes/AppRoutes.jsx
    -> src/layouts/MainLayout.jsx
      -> Sidebar + Navbar + Outlet + Footer
```

Routes:

```text
/           -> pages/Dashboard/Dashboard.jsx
/markets    -> pages/Markets/Markets.jsx
/watchlist  -> pages/WatchlistPage/WatchlistPage.jsx
/portfolio  -> pages/Portfolio/Portfolio.jsx
/news       -> pages/News/News.jsx
/analytics  -> pages/Analytics/Analytics.jsx
/pricing    -> pages/PricingPage/PricingPage.jsx
/settings   -> pages/Settings/Settings.jsx
*           -> pages/NotFound/NotFound.jsx
```

Layout:

- `layouts/MainLayout.jsx`
  - Owns sidebar state: open/collapsed.
  - Renders `Sidebar`, `Navbar`, main `<Outlet />`, `Footer`.

Data flow:

```text
Page
  -> Component
  -> hooks/useFetch.js
  -> services/marketService.js
  -> data/*.js mock datasets
```

API-ready path:

```text
Component/hook
  -> services/marketService.js
  -> services/api.js
  -> Backend REST API
```

`marketService.js` currently simulates async API calls with `simulateDelay`. To integrate backend, replace methods with `apiClient.get/post/...` while keeping component call sites stable.

## Frontend Component Ownership

Dashboard composition:

```text
pages/Dashboard/Dashboard.jsx
├── Hero
├── MarketCard/MarketCardOverview
├── StockChart/StockChart
├── Watchlist/Watchlist
├── MarketCard/TopMovers
├── News/NewsList
├── Statistics/Statistics
├── SectorPerformance/SectorPerformance
├── Portfolio/PortfolioSummary
├── Pricing/Pricing
├── Testimonials/Testimonials
└── FAQ/FAQ
```

Market/portfolio/news reuse:

- `pages/Markets/Markets.jsx`: market overview, chart, movers, sectors.
- `pages/Portfolio/Portfolio.jsx`: portfolio summary + watchlist.
- `pages/News/News.jsx`: fetches market news and filters/categories locally.
- `pages/Analytics/Analytics.jsx`: chart + sector/statistics.
- `pages/WatchlistPage/WatchlistPage.jsx`: wraps `components/Watchlist/Watchlist`.

Shared utilities:

- `hooks/useFetch.js`: standard loading/error/data/refetch wrapper for promise services.
- `utils/formatters.js`: currency, percent, change, compact number helpers.
- `utils/cn.js`: class name composition helper.
- `constants/theme.js`: motion/colors/theme constants.
- `constants/navigation.js`: nav/footer/social links.
- `components/common/*`: `Skeleton`, `ErrorState`, `EmptyState`, `SectionHeader`.

## Integration Notes

When wiring frontend to backend stocks:

1. Set `VITE_API_BASE_URL` to backend base URL, likely `http://localhost:8080`.
2. Update `src/services/api.js` fallback from placeholder API if needed.
3. Replace selected `marketService` functions with `apiClient` calls.
4. Match backend pageable response shape for `GET /api/stocks`; Spring returns a `Page` object, not a plain array.
5. Keep `useFetch` contract stable: service methods should return the exact data components expect.

Potential frontend-backend mismatch:

- Frontend mock stock shape may differ from `StockResponseDTO`.
- Backend route is `/api/stocks`; frontend market service has broader concepts: indices, watchlist, movers, sectors, statistics, portfolio, chart, news.
- Only stock CRUD exists in backend right now. Other frontend dashboards are mock-only unless new backend endpoints are added.

## What To Open First

For backend stock CRUD:

1. `Back/src/main/java/quantum_bill/stock/owner/controller/StockController.java`
2. `Back/src/main/java/quantum_bill/stock/owner/service/impl/StockService.java`
3. `Back/src/main/java/quantum_bill/stock/owner/entity/Stock.java`
4. `Back/src/main/java/quantum_bill/stock/owner/dto/request/StockRequestDTO.java`
5. `Back/src/main/java/quantum_bill/stock/owner/dto/response/StockResponseDTO.java`
6. `Back/src/main/java/quantum_bill/stock/owner/repository/StockRepository.java`

For frontend routing/layout:

1. `Front/frontend/src/routes/AppRoutes.jsx`
2. `Front/frontend/src/layouts/MainLayout.jsx`
3. `Front/frontend/src/constants/navigation.js`
4. Target page under `Front/frontend/src/pages/...`

For frontend data/component work:

1. Target page under `Front/frontend/src/pages/...`
2. Target component under `Front/frontend/src/components/...`
3. `Front/frontend/src/hooks/useFetch.js`
4. `Front/frontend/src/services/marketService.js`
5. Related mock data under `Front/frontend/src/data/...`

For API integration:

1. `Front/frontend/src/services/api.js`
2. `Front/frontend/src/services/marketService.js`
3. Backend controller/service files for the endpoint.

## Current Gotchas

- `application.properties` contains hardcoded database credentials. Avoid copying them into logs/docs/chat unless explicitly required.
- MySQL Aiven connectivity has previously timed out on some networks/ports. If DB connect fails before auth, test TCP with `nc -vz host port`.
- Stock price movement history is MongoDB-only; do not reintroduce `StockPriceHistory` as a JPA entity unless the persistence split changes.
- `MainLayout.jsx` filename casing matters on Linux; imports use `@/layouts/MainLayout`.
- Frontend mock data may make screens look complete even when backend endpoints are not wired.
- Security currently permits all requests; uncommenting `@PreAuthorize` requires real authentication/authorities first.
