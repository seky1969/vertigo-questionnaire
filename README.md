# めまい問診 Web Questionnaire

ICVD国際前庭疾患分類に基づくめまい問診アプリ。LINE風のチャットUIで、患者さんが対話形式で症状を入力できます。

## 学会用デモ

- **目的**: 第127回日本耳鼻咽喉科頭頸部外科学会総会・学術講演会
- **発表者**: せきね耳鼻咽喉科医院 × 徳島大学耳鼻咽喉科

## 機能

- ICVD/Bárány Society基準準拠の14疾患を網羅
- 4分岐(急性持続/反復性/慢性持続/セーフティネット)による効率的な問診
- カルテ出力プレビュー機能(構造化テキストでEMR貼り付け可能)
- QRコード共有機能
- フィードバック収集機能(学会用)

## ローカル実行

```bash
npm install
npm run dev
```

ブラウザで http://localhost:5173 を開く

## ビルド

```bash
npm run build
```

`dist/` フォルダに静的ファイルが生成されます。

## デプロイ(Vercel)

1. このリポジトリをGitHubにpush
2. https://vercel.com にGitHubアカウントでサインイン
3. 「Add New Project」 → このリポジトリを選択
4. Vercelが自動でVite設定を検出してデプロイ
5. 公開URLが発行される(例: vertigo-app-xxx.vercel.app)

## ライセンス

学術研究目的での利用に限定します。
