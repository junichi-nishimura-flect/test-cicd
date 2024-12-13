#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { MemorySweepStack } from "../lib/memory-sweep-stack";
import { ContextParams, PREFIX } from "../config/context-params";
import { Develop } from "../config/develop";
import { Staging } from "../config/staging";

/**
 * メイン関数です。
 * target : 環境名（develop | stagingで指定）
 **/
const mainFunc = (app: App, target: string) => {
  // 1. 環境毎に設定ファイル決定する
  const params: ContextParams =
    target === "staging" ? Staging : target === "develop" ? Develop : Develop;

  // 2. スタックのプロパティ
  const props = {
    env: { account: params.accountId, region: params.region },
  };

  // 3. 環境の構築
  const vpc = new MemorySweepStack(
    app,
    `${PREFIX}-${params.envName}-ec2-stop-scheduler-stack`,
    params,
    props
  );
};

const app = new App();
const target = app.node.tryGetContext("target");

mainFunc(app, target);
