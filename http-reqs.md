# HTTP Requests
Send the contents directly via a TCP connection using netcat or telnet
`$ netcat <hostname> <port>`

## POST /sum
`POST /sum HTTP/1.1
Content-Type: application/json
Content-Length: 23
Connection: close

{"num1":2001,"num2":32}`

## GET /
`GET / HTTP/1.1`

## HEAD /
`HEAD / HTTP/1.1`
