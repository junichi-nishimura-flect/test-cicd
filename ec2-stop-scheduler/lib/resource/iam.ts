import { Stack } from "aws-cdk-lib";
import { PolicyStatement, Effect, IRole } from "aws-cdk-lib/aws-iam";
import { Role, ServicePrincipal, ManagedPolicy } from "aws-cdk-lib/aws-iam";
import { PREFIX, ContextParams, LambdaInfo } from "../../config/context-params";

export default class Iam {
  private readonly stack: Stack;

  /** コンストラクタ */
  constructor(stack: Stack) {
    this.stack = stack;
  }

  /** Lambda関数用のロールを作成します */
  public createLambdaRole(params: ContextParams, info: LambdaInfo): IRole {
    // 関数名
    const name = `${PREFIX}-${params.envName}-${info.name}`;

    // 1. 設定するロールを生成
    const roleName = `${name}-role`;
    const role = new Role(this.stack, roleName, {
      roleName,
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaBasicExecutionRole"
        ),
      ],
    });
    // EC2を停止するためのポリシーを追加する
    // TODO
    role.addToPolicy(
      Iam.createUpdateServiceStatement(
        params.accountId,
        params.region,
        info.environment.WIP_AWS_CLUSTER_NAME,
        info.environment.WIP_AWS_SERVICE_NAME
      )
    );

    return role;
  }

  /** ECSタスクを入れ替えるためのポリシーステートメントを作成する */
  public static createUpdateServiceStatement(
    accountId: String,
    region: String,
    clusterName: String,
    serviceName: String
  ): PolicyStatement {
    return new PolicyStatement({
      actions: ["ecs:UpdateService"],
      resources: [
        `arn:aws:ecs:${region}:${accountId}:service/${clusterName}/${serviceName}`, // サービスのARN
      ],
      effect: Effect.ALLOW,
    });
  }

  /** タスクを実行するためのポリシーステートメントを作成する */
  public static createAccessTaskStatement(
    accountId: string,
    taskExeRoleArn: string
  ): PolicyStatement {
    return new PolicyStatement({
      actions: ["iam:PassRole"],
      resources: [
        `arn:aws:iam::${accountId}:role/${taskExeRoleArn}`, // TaskDefinitionのタスク実行ロールのARN
      ],
      effect: Effect.ALLOW,
    });
  }
}
