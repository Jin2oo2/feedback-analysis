output "api_url" {
  value = "https://${aws_api_gateway_rest_api.sentiment_api.id}.execute-api.${var.aws_region}.amazonaws.com/${aws_api_gateway_stage.prod.stage_name}/feedback-analysis"
}

output "lambda_function_name" {
  value = aws_lambda_function.feedback_analyser.function_name
}