# openmeteo-ts

> 零外部依賴、強型別的 TypeScript SDK，包裝 [Open-Meteo](https://open-meteo.com/) 氣象 API，並提供可擴充的業務分析器功能。

## 專案動機

在使用 Open-Meteo時，大概會遇到這幾種問題:

### 問題 1：API 回傳的平行陣列極易出錯

Open-Meteo 的資料格式是**平行陣列**——時間、溫度、降雨各自存在獨立的陣列中，依靠相同的 index 建立關聯：

```json
{
  "hourly": {
    "time": ["2024-01-01T00:00", "2024-01-01T01:00"],
    "temperature_2m": [1.2, 0.8],
    "precipitation": [0.0, 0.5]
  }
}
```

這種結構在實務上非常脆弱：取 `temperature_2m[3]` 和 `time[3]` 時沒有編譯期保證它們對齊。
**這個SDK會幫你把平行陣列轉成物件陣列**：

```ts
// 轉換後的結果——每個時間點都是一個獨立的物件
[
  { time: Date, temperature_2m: 1.2, precipitation: 0.0 },
  { time: Date, temperature_2m: 0.8, precipitation: 0.5 },
]
```

### 問題 2：缺乏型別安全

直接呼叫 HTTP API 拿到的回應型別是 `any`。本 SDK 為 Open-Meteo 的**每一個氣象變數提供字面值聯集型別（literal union type）**，
讓 IDE 在編譯期就能攔截拼字錯誤，而不是讓錯誤流到生產環境。

### 問題 3：缺少業務邏輯的擴充功能

實際場景中，微服務通常需要在原始氣象資料之上疊加領域邏輯——
物流系統需要車隊風險評估、農業系統需要作物壓力分析、能源系統需要發電量預測。
**本 SDK 設計了一套 `WeatherAnalyzer` 介面**，開發者可以撰寫自己的業務分析器，
以外掛形式注入資料管線，不須修改 SDK 原始碼。

## 架構設計

```
使用者程式碼
    │
    ▼
WeatherClient（主編排器）
    │
    ├── QueryBuilder   ──► 強型別查詢參數建構
    ├── HttpClient     ──► 原生 fetch 封裝（零外部依賴）
    ├── Mapper         ──► 平行陣列 → 物件陣列轉換
    └── Analyzer       ──► 可插拔的業務邏輯外掛
```

### 為甚麼這樣設計?

| 決策 | 選擇 | 原因 |
|---|---|---|
| HTTP 層 | Node.js 原生 `fetch` | 零外部依賴，降低第三方套件的安全性風險與安裝體積 |
| 型別系統 | 字面值聯集型別 | 編譯期攔下無效參數，取代執行時驗證 |
| 模組格式 | ESM + CJS 雙輸出 | 相容現代 `import` 與舊版 `require` |
| 擴充功能 | Analyzer 介面模式 | 開放/封閉原則：對擴充開放，對修改封閉 |
| 測試策略 | Unit + Integration 分層 | 單元測試保證模組正確性，整合測試驗證管線協作 |

## 安裝

```bash
npm install openmeteo-ts
```

## 快速開始

```ts
import {
  QueryBuilder,
  WeatherClient,
  createFleetRiskAnalyzer,
} from 'openmeteo-ts'

// 1. 建立查詢：台北車隊營運範圍，要求每小時的溫度、風速、降雨、能見度與天氣代碼
const query = new QueryBuilder()
  .latitude(25.033)
  .longitude(121.565)
  .hourly([
    'temperature_2m',
    'wind_speed_10m',
    'precipitation',
    'visibility',
    'weather_code',
  ])
  .build()

// 2. 掛載車隊風險分析器（型別自動保留，無需手動 cast）
const client = WeatherClient.create().use(createFleetRiskAnalyzer())

// 3. 取回結果：result.fleetRisk 已型別化，與 hourly 依 index 對齊
const result = await client.fetchWeather(query)

for (const risk of result.fleetRisk) {
  console.log(risk.riskLevel, risk.riskScore, risk.riskFactors)
}
```

## 自訂分析器

任何業務邏輯都可以透過實作 `WeatherAnalyzer<TExtension>` 介面注入，不必修改 SDK 原始碼：

```ts
import type { WeatherAnalyzer, WeatherResponse } from 'openmeteo-ts'

// 作物壓力分析器：回傳每小時的熱逆境指數
const heatStressAnalyzer: WeatherAnalyzer<{ heatStress: number[] }> = {
  id: 'heat-stress-analyzer',
  analyze(data: WeatherResponse) {
    const heatStress =
      data.hourly?.map((h) => Math.max(0, (h.temperature_2m ?? 0) - 32) * 2) ?? []
    return { ...data, heatStress }
  },
}

const client = WeatherClient.create().use(heatStressAnalyzer)
const result = await client.fetchWeather(query)
// result.heatStress 已型別化
```

## API 總覽

| 匯出 | 型別 | 說明 |
|------|------|------|
| `WeatherClient` | class | 主編排器；`create()` 建立、`use()` 掛 analyzer |
| `QueryBuilder` | class | 強型別查詢參數建構 |
| `HttpClient` | class | 原生 fetch 封裝（可注入自訂 baseUrl / timeout） |
| `mapWeatherResponse` | function | 平行陣列 → 物件陣列轉換 |
| `createFleetRiskAnalyzer` | function | 車隊風險分析器工廠（可傳閾值覆寫） |
| `WeatherError` 及 4 個子類 | class | 錯誤階層：`WeatherAPIError` / `WeatherNetworkError` / `WeatherValidationError` / `WeatherMappingError` |
| `WeatherAnalyzer` | type | 分析器介面 |
| `WeatherResponse` 等 | type | 正規化回應型別 |
| `RiskLevel` / `FleetRiskData` / `FleetRiskExtension` / `FleetRiskThresholds` | type | FleetRisk 相關型別 |

## 專案結構

```
src/
├── types/          # 型別定義（零執行時邏輯）
│   ├── query.ts    #   API 查詢參數型別
│   ├── response.ts #   API 回應型別（原始 + 正規化）
│   └── analyzer.ts #   WeatherAnalyzer 介面
├── builder/        # Fluent QueryBuilder
├── http/           # fetch 封裝 + 自訂錯誤階層
├── mapper/         # 平行陣列轉換器
├── client.ts       # 主編排器
├── analyzers/      # 擴充分析器
│   └── fleet-risk.ts  # 內建範例：車隊風險評估
└── index.ts        # Public API 統一出入口
```

## 核心特色

- **完全零外部依賴**：不使用 axios、got 等第三方 HTTP 套件，僅依賴 Node.js 20+ 內建 `fetch`
- **強型別優先**：所有 API 變數以 TypeScript 字面值型別定義，違法參數在編譯期就會報錯
- **自動資料正規化**：平行陣列自動轉物件陣列，開發者永遠不需要手動對齊 index
- **開放擴充架構**：實作 `WeatherAnalyzer` 介面即可注入自定義業務邏輯

## 開發狀態

✅ **Phase 1（核心 SDK）已完成** — 型別定義層、HttpClient、QueryBuilder、WeatherMapper、WeatherClient 均已實作並通過測試。

✅ **Phase 2（業務分析器）已完成** — 以 `WeatherAnalyzer` 擴充架構實作車隊風險分析器（`createFleetRiskAnalyzer`），支援研究依據的氣象閾值與配置覆寫，並通過單元（數值邊界）與整合（完整管線）測試。`WeatherClient` 同步重構為 builder pattern（`create()` + `use()`），analyzer 的擴充型別在型別層累積保留，無需手動 cast。

## 技術棧

| 類別 | 工具 |
|---|---|
| 語言 | TypeScript 5.7 |
| 執行環境 | Node.js 20+ |
| 打包 | tsup（esbuild 驅動） |
| 測試 | Vitest |
| 程式碼風格 | Prettier + ESLint（flat config） |
| CI/CD | GitHub Actions |

## 授權

ISC
