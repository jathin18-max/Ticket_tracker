$body = @{
    username = "kamal"
    password = "test123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/login" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing

Write-Host "Status Code: $($response.StatusCode)"
Write-Host "Response: $($response.Content)"
