import os
import logging
from types import SimpleNamespace
import boto3
from botocore.exceptions import ClientError

# ロガーの生成
logger = logging.getLogger("keycloak-memory-sweep")
# 出力レベルの設定
logger.setLevel(int(os.environ["LOG_LEVEL"]))

def lambda_handler(event, context):
    try:
        client = boto3.client('ecs')
        response = client.update_service(
            cluster = os.environ["WIP_AWS_CLUSTER_NAME"],
            service = os.environ["WIP_AWS_SERVICE_NAME"],
            taskDefinition = os.environ["WIP_AWS_TASKDEF_FAMILY"],
            forceNewDeployment=True
        )
        # レスポンスはデバッグログに出力
        logger.debug(response)
        # 処理結果を出力
        result = SimpleNamespace(**response['service'])
        logger.info(f"更新コマンドが完了しました。status={result.status},desired={result.desiredCount}, running={result.runningCount}, pending={result.pendingCount}")

    except ClientError as e:
        logger.exception("更新コマンドでエラーが発生しました。")
