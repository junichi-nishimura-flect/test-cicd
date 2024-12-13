import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { ContextParams } from "../config/context-params";
import Iam from "./resource/iam";
import Lambda from "./resource/lambda";
import EventBridge from "./resource/event-bridge";

export class Ec2StopSchedulerStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    params: ContextParams,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    // 1. Lambdaロールの作成
    const role = new Iam(this).createLambdaRole(params, params.lambda);

    // 2. Lambdaの構築
    const lambdaFunc = new Lambda(this).create(params, params.lambda, role);

    // 3. EventBridge Schedulerの構築
    new EventBridge(this).createScheduleRule4Function(
      params,
      params.eventBridge,
      lambdaFunc
    );
  }
}
