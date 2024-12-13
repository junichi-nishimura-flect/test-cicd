# wowow-ec2-stop-scheduler

## 動作環境

- Node.js

## 前提条件

- なし

## セットアップ

リポジトリから clone したら以下のコマンドを実行して依存パッケージをインストールします。

```
npm install
```

## デプロイ方法

### 認証情報の設定

作業端末に AWS アカウントの認証情報を設定します。
プロファイル名は以下の通りとします。

1. 開発環境 (Develop) : dev-wip-wowow
2. 検証環境 (Staging) : stg-wip-wowow
3. 検証環境 2 (Staging) : stg2-wip-wowow
4. 本番環境 (Production) : prd-wip-wowow

### スタックのデプロイ

アカウントに初めてデプロイする場合は、デプロイの前に `cdk bootstrap` を実行しておきます。

```shell
$ # 1. 開発環境の構築
$ export AWS_DEFAULT_PROFILE=dev-wip-wowow
$ npx cdk deploy wip-dev-keycloak-memory-sweep-stack -c target=develop
$
$ # 2. 検証環境の構築
$ export AWS_DEFAULT_PROFILE=stg-wip-wowow
$ npx cdk deploy wip-stg-keycloak-memory-sweep-stack -c target=staging
$
```
