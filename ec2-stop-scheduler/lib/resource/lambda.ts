import { Stack, Duration, Size, Tags, RemovalPolicy } from "aws-cdk-lib";
import { IFunction, Function, Code } from "aws-cdk-lib/aws-lambda";
import { IRole } from "aws-cdk-lib/aws-iam";
import { LogGroup } from "aws-cdk-lib/aws-logs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { Runtime, Architecture } from "aws-cdk-lib/aws-lambda";
import {
  PREFIX,
  ContextParams,
  LambdaInfo,
  EnvironmentalVariables,
} from "../../config/context-params";
import * as ConstantVariable from "../../../wowow-keycloak-ts/lib/constant-variable";

export default class Lambda {
  private readonly stack: Stack;

  /** コンストラクタ */
  constructor(stack: Stack) {
    this.stack = stack;
  }

  /** Lambda環境を構築します */
  create(params: ContextParams, info: LambdaInfo, role: IRole): IFunction {
    // 関数名
    const name = `${PREFIX}-${params.envName}-${info.name}`;

    // 1. Lambda関数を生成する
    const func = this.createFunction(
      name,
      info.description,
      "./lambda",
      info.handler,
      info.runtime,
      info.architecture,
      info.timeout,
      info.memorySize,
      info.storageSize,
      info.environment,
      info.logRetention,
      info.retryAttempts,
      role
    );

    // 2. タグを設定する
    for (const tag of info.tags) {
      Tags.of(func).add(tag.key, tag.value);
    }
    // 環境とリージョンのタグを追加する。環境名は頭文字を大文字にする
    const envTag = `${params.envName.charAt(0).toUpperCase()}${params.envName
      .slice(1)
      .toLowerCase()}`;
    Tags.of(func).add(ConstantVariable.TAG_KEY_ENV, envTag);
    Tags.of(func).add(ConstantVariable.TAG_KEY_Region, params.region);

    return func;
  }

  /** Lambda関数を生成します */
  private createFunction(
    name: string,
    description: string,
    codePath: string,
    handler: string,
    runtime: Runtime,
    architecture: Architecture,
    timeout: number,
    memorySize: number,
    storageSize: number,
    environment: EnvironmentalVariables,
    logRetention: RetentionDays,
    retryAttempts: number,
    role: IRole
  ): Function {
    // 関数の作成
    const func = new Function(this.stack, name, {
      functionName: name,
      description,
      handler,
      runtime,
      architecture,
      code: Code.fromAsset(codePath),
      memorySize: memorySize || 128, // メモリはデフォルト「128 MB」
      timeout: Duration.seconds(timeout || 60), // タイムアウト時間はデフォルト「60秒」
      ephemeralStorageSize: Size.mebibytes(storageSize || 512), // タイムアウト時間はデフォルト「512MB」
      environment, // 環境変数
      retryAttempts, // 非同期実行時のリトライ回数
      role,
    });

    // LogGroupを作成する
    // FunctionのlogRetentionで設定すると、logRetention設定用のLambda関数、IAMロールが余計に作成されてしまう
    // よって、独自にLogGroupを作成する
    new LogGroup(this.stack, `${name}-log-group`, {
      logGroupName: `/aws/lambda/${name}`, // 名前は「/aws/lambda/{lambda関数名}」
      retention: logRetention,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    return func;
  }
}
