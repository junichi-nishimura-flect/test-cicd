import { CronOptionsWithTimezone } from "@aws-cdk/aws-scheduler-alpha";
import { Runtime, Architecture } from "aws-cdk-lib/aws-lambda";
import { RetentionDays } from "aws-cdk-lib/aws-logs";


/** 環境情報 */
export type ContextParams = {
  readonly accountId: string;
  readonly region: string;
  readonly envName: string;
  readonly eventBridge: EventBridgeInfo;
  readonly lambda: LambdaInfo;
};

/** EventBridgeの環境情報 */
export type EventBridgeInfo = {
  readonly name: string;
  readonly description: string;
  readonly schedule: CronOptionsWithTimezone;
  readonly enabled?: boolean;
};

/** Lambda情報 */
export type LambdaInfo = {
  readonly name: string;
  readonly description: string;
  readonly environment: EnvironmentalVariables;
  readonly runtime: Runtime;
  readonly architecture: Architecture;
  readonly timeout: number;
  readonly memorySize: number;
  readonly storageSize: number;
  readonly logRetention: RetentionDays;
  readonly retryAttempts: number;
  readonly tags: KeyValue[];
  readonly handler: string;
};

/** 環境変数 */
export type EnvironmentalVariables = {
  [name: string]: string;
};

/** key-value */
export type KeyValue = {
  readonly key: string;
  readonly value: string;
};
