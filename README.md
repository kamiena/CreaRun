# CreaRun
CreaRun official WebSite

『走れ！クレアちゃん』（Crea Run!）の公式紹介サイトです。
ビルド不要の静的サイト（HTML / CSS / JavaScript）なので、GitHub Pages などにそのまま置いて公開できます。

## ページ構成（1ページ）

| セクション | 内容 |
| --- | --- |
| トップ | ロゴ・キービジュアル・キャッチコピー・Steamボタン |
| NEWS | お知らせ（30,000DL突破、Steam版配信開始） |
| ゲーム紹介 | ゲーム概要、RUN / JUMP / CRAFT の3つの特徴 |
| 遊び方 | 3ステップ、操作方法（マウス / キーボード / コントローラー）、攻略メモ |
| 乗り物 | 車 / 列車 / ロケット / ？？？ |
| ギャラリー | スクリーンショット6枚（クリックで拡大） |
| 製品情報 | ゲーム情報、動作環境、実況・配信について |
| フッター | クレアクラン公式HP・X・YouTube・BOOTH へのリンク |

ページ内の ★ や積み木をクリック／タップすると右上の「Score」が増えるミニ演出つきです（スター10pt・積み木50pt はゲーム本編と同じ配点）。

## ファイル構成

```
index.html            … ページ本体（文章の修正はここ）
favicon.ico
assets/
  css/style.css       … デザイン（色は先頭の :root にまとめています）
  js/main.js          … メニュー、ギャラリー拡大、スクロール演出、★集め
  img/                … 画像
```

## ローカルで確認する

```sh
python3 -m http.server 8000
# ブラウザで http://localhost:8000 を開く
```

## GitHub Pages で公開する

1. `main` ブランチにマージ
2. リポジトリの Settings → Pages → Build and deployment で「Deploy from a branch」、Branch を `main` / `/(root)` にして保存
3. 数分後に `https://kamiena.github.io/CreaRun/` で公開されます

独自ドメインなど別のURLで公開する場合は、`index.html` の `og:url` / `og:image` と JSON-LD 内の `image` を公開URLに書き換えてください（SNSでシェアしたときのカード画像に使われます）。

## 画像素材

| ファイル | 用途 | 状態 |
| --- | --- | --- |
| `kv-crea-rocket.webp` / `-900.webp` | キービジュアル（トップ・最後のCTA） | 支給素材（右下の煙の切れ目をぼかし加工） |
| `logo.webp` / `logo.png` / `logo-sm.webp` | タイトルロゴ（トップ・ヘッダー・CTA） | 支給素材 |
| `title-bg.webp` | トップ・CTAの背景（タイトル画面の床） | 支給素材 |
| `recipe-rocket.webp` / `recipe-train.webp` | 乗り物セクションのレシピ | 支給素材 |
| `recipe-car.webp` | 車のレシピ | **仮**（支給レシピの羊皮紙に車のシルエットを描いたもの） |
| `recipe-mystery.webp` | ？？？のレシピ | **仮**（羊皮紙に「?」） |
| `ss-01`〜`ss-06.webp`（＋`-thumb`） | ギャラリー・遊び方 | Steamストアのスクリーンショット |
| `ogp.jpg` | SNSシェア用カード（1200×630） | 支給素材から合成 |
| `favicon-64.png` / `apple-touch-icon.png` / `/favicon.ico` | ファビコン | **仮**（キービジュアルの顔を切り抜き） |

画像を差し替えるときは、同じファイル名で上書きすればページ側の修正は不要です（縦横比が変わる場合は `index.html` の `width` / `height` も合わせて変更）。

## 情報の出典

- クレアクラン公式HP：https://sites.google.com/view/creaclan/works/走れクレアちゃん
- Steam ストアページ：https://store.steampowered.com/app/2547610/
