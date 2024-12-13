import { TimeZone } from "aws-cdk-lib";
import { Runtime, Architecture } from "aws-cdk-lib/aws-lambda";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { LambdaInfo, EventBridgeInfo } from "./context-params";

/** EventBridge情報 */
export const EventBridgeInfoCommon: EventBridgeInfo = {
  name: "ec2-stop-scheduler", //-{環境名}-」がプレフィックスとして付与される。ポリシー名は「{ruleName}-policy」
  description: "EC2インスタンスを定期的に停止するスケジュールです。",
  // 日次 20:00 に実行 ※ 時刻はJSTで設定
  schedule: {
    hour: "20",
    minute: "0",
    timeZone: TimeZone.ASIA_TOKYO,
  },
  enabled: true,
};

/** Lambda情報 */
export const LambdaInfoCommon: LambdaInfo = {
  name: "ec2-stop", //-{環境名}-」がプレフィックスとして付与される。
  description: "EC2を停止する関数です。",
  environment: {
    LOG_LEVEL: "10", // CRITICAL = 50, FATAL = CRITICAL, ERROR = 40, WARNING = 30, WARN = WARNING, INFO = 20, DEBUG = 10, NOTSET = 0
  },
  runtime: Runtime.PYTHON_3_12, // ランタイムは「python 3.12」
  architecture: Architecture.X86_64, // アーキテクチャは「X86_64」
  timeout: 30,
  memorySize: 128,
  storageSize: 512,
  logRetention: RetentionDays.ONE_MONTH, // ログの保持期間は1ヶ月
  retryAttempts: 0, // 非同期実行時のエラーのリトライ回数
  tags: [

  ],
  handler: "ec2-stop.lambda_handler",
};
