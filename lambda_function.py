import json
import os
import uuid
from datetime import datetime, timezone
import logging
import boto3


# set up logging
logger = logging.getLogger('__name__')
logger.setLevel(logging.INFO)


# set up aws clients 
comprehend_client = boto3.client('comprehend')
dynamodb_client = boto3.client('dynamodb')
dynamodb_resource = boto3.resource('dynamodb')
table_name = os.environ.get('TABLE_NAME')


def lambda_handler(event, context):
  logger.info('The lambda function is running.')
  print("Received event: " + json.dumps(event, indent=2))
  
  http_method = event['httpMethod']
   
  try:
    if http_method == 'GET':
      logger.info('Retrieving records from DynamoDB')
      table = dynamodb_resource.Table(table_name)
      response = table.scan(
        Select='ALL_ATTRIBUTES'
      )

      items = response['Items']
      while 'LastEvaluatedKey' in response:
        response = dynamodb_client.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
        items.extend(response['Items'])
      
      counts = len(items)
      
      logger.info(f'Retuend items: {items}')
      logger.info(f'Number of returned items: {counts}')
      
      response_body = {
        'items': items,
        'counts': counts
      }

      return {
        'statusCode': 200,
        'body': json.dumps(response_body, default=float)
      }

    elif http_method == 'POST':
      # get feedback and language code from API Gateway
      print(f"Event body: {event['body']}")
      if isinstance(event['body'], str):
        body = json.loads(event['body'])
      else:
        body = event['body']
      user_feedback = body['feedback']
      language_code = body['language_code']

      logger.info('Proccessing the feedback from Amazon Comprehend')
      # process feedback using Amazon Comprehend
      response = comprehend_client.detect_sentiment(
        Text=user_feedback,
        LanguageCode=language_code
      )
    
      sentiment_lable = response['Sentiment']
      sentiment_score = response['SentimentScore'][sentiment_lable.capitalize()]
      
      logger.info(f'user_feedback={user_feedback}\nsentiment_lable={sentiment_lable}, sentiment_score={sentiment_score}')
      
      logger.info('Writing the result from Comprehend to DynamoDB')
      # store the result from Comprehend in DynamoDB
      dynamodb_client.put_item(
        TableName=table_name,
        Item={
          "FeedbackID": {'S': str(uuid.uuid4())},
          "UserFeedback": {'S': user_feedback},
          "SentimentLabel": {'S': sentiment_lable},
          "SentimentScore": {'N': str(sentiment_score)},
          "Timestamp": {'S': datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z')}
        }
      )    
      
      response_body = {
        "sentiment_lable": sentiment_lable,
        "sentiment_score": sentiment_score
      }
      
      return {
        'statusCode': 200,
        'body': json.dumps(response_body)
      }
    
    else:
      return {
        'statusCode': 405,
        'body': json.dumps('Method not allowed')
      }
  
  except Exception as e:
    logger.error(f'An error occurred: {str(e)}')
    
    return {
      'statusCode': 500,
      'body': 'Internal Server Error'
    }