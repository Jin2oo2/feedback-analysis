# DynamoDB - "analysed_feedbacks"
resource "aws_dynamodb_table" "analysed_feedbacks" {
  name         = "analysed_feedbacks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "FeedbackID"

  attribute {
    name = "FeedbackID"
    type = "S"
  }
}

# Lambda function - "feedback_analyser"
resource "aws_lambda_function" "feedback_analyser" {
  function_name = "feedback_analyser"
  role          = var.lambda_role_arn
  handler       = "handler.lambda_handler"
  runtime       = "python3.11"

  filename         = "${path.module}/../lambda/handler.zip"
  source_code_hash = filebase64sha256("${path.module}/../lambda/handler.zip")

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.analysed_feedbacks.name
    }
  }
}

# API Gateway
resource "aws_api_gateway_rest_api" "sentiment_api" {
  name        = "SentimentAPI"
  description = "REST API for sentiment analysis"
}

# Create path - /feedback-analysis
resource "aws_api_gateway_resource" "feedback_analysis" {
  rest_api_id = aws_api_gateway_rest_api.sentiment_api.id
  parent_id   = aws_api_gateway_rest_api.sentiment_api.root_resource_id
  path_part   = "feedback-analysis"
}

# Methods - GET, POST
resource "aws_api_gateway_method" "get_feedback" {
  rest_api_id   = aws_api_gateway_rest_api.sentiment_api.id
  resource_id   = aws_api_gateway_resource.feedback_analysis.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "post_feedback" {
  rest_api_id   = aws_api_gateway_rest_api.sentiment_api.id
  resource_id   = aws_api_gateway_resource.feedback_analysis.id
  http_method   = "POST"
  authorization = "NONE"
}

# Integrate API Gateway with Lambda function
resource "aws_api_gateway_integration" "lambda_get" {
  rest_api_id             = aws_api_gateway_rest_api.sentiment_api.id
  resource_id             = aws_api_gateway_resource.feedback_analysis.id
  http_method             = aws_api_gateway_method.get_feedback.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.feedback_analyser.invoke_arn
}

resource "aws_api_gateway_integration" "lambda_post" {
  rest_api_id             = aws_api_gateway_rest_api.sentiment_api.id
  resource_id             = aws_api_gateway_resource.feedback_analysis.id
  http_method             = aws_api_gateway_method.post_feedback.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.feedback_analyser.invoke_arn
}

# Allow excution from API Gateway
resource "aws_lambda_permission" "allow_api_gateway" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.feedback_analyser.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.sentiment_api.execution_arn}/*/*"
}

# Enable CORS 
resource "aws_api_gateway_method_response" "cors_response_get" {
  rest_api_id = aws_api_gateway_rest_api.sentiment_api.id
  resource_id = aws_api_gateway_resource.feedback_analysis.id
  http_method = aws_api_gateway_method.get_feedback.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = true
  }
}

resource "aws_api_gateway_method_response" "cors_response_post" {
  rest_api_id = aws_api_gateway_rest_api.sentiment_api.id
  resource_id = aws_api_gateway_resource.feedback_analysis.id
  http_method = aws_api_gateway_method.post_feedback.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = true
  }
}

# Deployment
resource "aws_api_gateway_deployment" "deployment" {
  depends_on = [
    aws_api_gateway_integration.lambda_get,
    aws_api_gateway_integration.lambda_post
  ]
  rest_api_id = aws_api_gateway_rest_api.sentiment_api.id
}

resource "aws_api_gateway_stage" "prod" {
  stage_name    = "prod"
  rest_api_id   = aws_api_gateway_rest_api.sentiment_api.id
  deployment_id = aws_api_gateway_deployment.deployment.id
}