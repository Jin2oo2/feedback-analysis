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
table_name = os.environ.get('TABLE_NAME')


def lambda_handler(event, context):
  logger.info('The lambda function is running.')
  # get feedback and language code from API Gateway
  user_feedback = event['feedback']
  language_code = event['language_code']
  
  
  try:
    logger.info('Proccessing the feedback from Amazon Comprehend')
    # process feedback using Amazon Comprehend
    response = comprehend_client.detect_sentiment(
      Text=user_feedback,
      LanguageCode=language_code
    )
  
    sentiment_lable = response['Sentiment']
    sentiment_score = response['SentimentScore'][sentiment_lable.capitalize()]
    
    logger.info(f'sentiment_lable={sentiment_lable}, sentiment_score={sentiment_score}')
    
    
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
  
  except Exception as e:
    logger.error(f'An error occurred: {str(e)}')
    
    return {
      'statusCode': 500,
      'body': 'Internal Server Error'
    }