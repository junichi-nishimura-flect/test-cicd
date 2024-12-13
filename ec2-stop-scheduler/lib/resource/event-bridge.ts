import { Stack } from "aws-cdk-lib";
import { Schedule, ScheduleExpression } from "@aws-cdk/aws-scheduler-alpha";
import { LambdaInvoke } from "@aws-cdk/aws-scheduler-targets-alpha";
import { IFunction } from "aws-cdk-lib/aws-lambda";

import {
  PREFIX,
  ContextParams,
  EventBridgeInfo,
} from "../../config/context-params";

export default class EventBridge {
  /** CdkStackオブジェクト */
  private readonly stack: Stack;

  constructor(stack: Stack) {
    this.stack = stack;
  }

  /** EventBridgeのスケジュールを構築します。 */
  createScheduleRule4Function(
    params: ContextParams,
    info: EventBridgeInfo,
    target: IFunction
  ) {
    // スケジュール名
    const scheduleName = `${PREFIX}-${params.envName}-${info.name}`;

    // EventBridge のスケジュールを生成する
    new Schedule(this.stack, scheduleName, {
      scheduleName,
      description: info.description,
      schedule: ScheduleExpression.cron(info.schedule),
      target: new LambdaInvoke(target),
      enabled: info.enabled,
    });

    // スケジュールにタグは付与できない
  }
}
