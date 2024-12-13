import { ContextParams } from "./context-params";
import { LambdaInfoCommon, EventBridgeInfoCommon } from "./common";

export const Staging: ContextParams = {
  // アカウントID
  accountId: "",
  // リージョン
  region: "ap-northeast-1",
  // 環境名 (dev, stg)
  envName: "stg",
  // EventBridge設定
  eventBridge: EventBridgeInfoCommon,
  // Lambda設定
  lambda: LambdaInfoCommon,
};
