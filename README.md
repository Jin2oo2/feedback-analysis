# Serverless Sentiment Analysis for Customer Feedback
This serverless REST API gets integrated with  web applications that allows users to submit customer feedback and automatically analyzes the sentiment of the feedback. It leverages AWS Lambda, API Gateway, DynamoDB, and Amazon Comprehend.


## Architecture 
![architecture diagram](api-lambda-comprehend.drawio.png)


## Features
- Collect customer feedback via a web interface
- Sentiment analysis (positive, negative, neutral, mixed) using Amazon Comprehend
- Store feedback and analysis results in DynamoDB
- Optional real-time dashboard for visualizing overall sentiment trends


## Request and Response

### Request example POST
Sends feedback to Amazon comprehend for sentiment analysis
```
curl -X POST https://123456789.execute-api.eu-west-2.amazonaws.com/prod/feedback-analysis \
-H "Content-Type: application/json" \
-d '{
  "feedback":"I ordered a small and expected it to fit just right but it was a little bit more like a medium-large. It was great quality. Its a lighter brown than pictured but fairly close. Would be ten times better if it was lined with cotton or wool on the inside.", 
  "language_code":"en"
}'
```
### Response POST
```
{
  "statusCode": 200, 
  "body": "{\"sentiment_lable\": \"POSITIVE\", \"sentiment_score\": 0.9994593262672424}"
}
```


## **DynamoDB Items**

| Attribute        | Data Type  | Description                                |
|------------------|------------|--------------------------------------------|
| `FeedbackID`     | `String`   | Unique ID for each feedback                |
| `UserFeedback`   | `String`   | The actual feedback text from the user     |
| `SentimentScore` | `Number`   | The sentiment score calculated by Comprehend |
| `SentimentLabel` | `String`   | Sentiment label (Positive, Negative, Neutral, Mixed) |
| `Timestamp`      | `String`   | Time when the feedback was submitted       |


## License
This project is licensed under the MIT License - see the LICENSE file for details.