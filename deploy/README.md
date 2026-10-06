# AIGen-One プロダクトサイトの本番配信

## 現在の構成（2026-10-06）

- ソース: `shinq3/aigen-web`、ブランチ `codex/lp-business-story`
- 公開URL: `https://www.aigen.tokyo/`（`/ja`、`/en`、`/vi`）
- サーバー: `ubuntu@13.193.44.69`
- 配信先: `/var/www/aigen-one/releases/lp/current`
- 初回配信ソース: `c2dbaabad7e322448fce316484a6be5918e63513`
- 公開リリース情報: `/aigen-lp-release.json`（コミット、クリーンソース、成果物SHA-256）

プロダクトサイトはWeb CMSの公開先から分離し、このリポジトリをビルドして配信する。
`https://aigen.tokyo/` はAigen-One本体/PWA、`https://aigen.d-auchy.studio/` は旧サイト。LP更新でこれらの配信先を変更しない。

## ビルド・更新の手順

1. 配信するGitコミットを指定し、`git archive <commit>` などで隔離したクリーンなソースを作る。未コミットのファイルや共有作業ディレクトリの`dist`を配信しない。
2. `npm ci`、`npm run build`、`npx tsc --noEmit --incremental false`を実行する。成果物は`dist/aigen/`。
3. スクリーンショット、タブ切り替え、モバイル表示をプレビューで確認する。
4. `/var/www/aigen-one/releases/lp/.staging-<commit>`に新しい配信領域を作る。現在の配信物をコピーして既存のお問い合わせページ・関連アセットと旧ハッシュ付きアセットを保持したうえで、新しい成果物を重ねる。旧アセットは切り替え中の閲覧者のために残す。
5. `aigen-lp-release.json`にコミット、`sourceDirty:false`、ビルド日時、成果物SHA-256を記録する。転送後に全成果物のハッシュとお問い合わせページの保持を確認する。
6. 検証済みの領域を`lp/<commit>`へ移し、`lp/current`を新しいリリースへ原子的に切り替える。既存リリースを上書きしない。
7. 外部HTTPSで配信コミットと成果物ハッシュ、`/`、`/ja`、`/en`、`/vi`、`/contact/`、AI相談を確認する。

通常のLP更新ではAPI再起動やNginx設定変更は不要。

## Nginxと既存機能

設定は`/etc/nginx/sites-available/aigen.tokyo.conf`。`www.aigen.tokyo`のルートは`/var/www/aigen-one/releases/lp/current`で、`try_files $uri $uri/ /index.html`により言語URLを配信する。

- `/api/public/advisor/`のみを`http://127.0.0.1:5080/api/public/advisor/`にプロキシする。ストリーミング用に`proxy_buffering off`、`proxy_read_timeout 300s`を設定。
- 問い合わせページは既存CMSリリース`fc0298a177951f84316f63e7a85c157b2d18bd22`から保持。`contact/index.html`、`assets/contact.css`、`assets/contact-form.js`が必要。
- 問い合わせフォームの送信先は既存の`https://aigen.tokyo/api/public/web-cms/4f16bf05-6ac2-45e3-ae42-d4a8fa3fa953/contact`。公開確認のために実際の問い合わせを送信しない。
- `deploy/configs/nginx/aigen.conf`は旧ドメインの設定例であり、現在のwww本番へそのまま適用しない。

## 切り戻し

以後のLP更新は`lp/current`を前のコミットのリリースへ原子的に戻す。

今回のCMSからLPへの切り替え前設定は`/var/www/aigen-one/releases/lp/nginx-before-c2dbaab.conf`、元CMSのパスは`cms-before-c2dbaab.txt`に保存した。CMS配信へ戻す場合はこの設定を復元して`sudo nginx -t`が通ることを確認し、Nginxをreloadする。

## 今回の確認結果

ビルド・型チェック、公開HTTPSで11ファイルのハッシュ一致、全言語URLと問い合わせページのHTTP 200、問い合わせHTMLのハッシュ保持、ブラウザでのヒーロー・機能画面・AI相談の回答完了を確認。本体の`/api/healthz`も正常。
