# Korea Hacks Backend
## API Guide
### User & Auth
1. Auth - Login
    - Endpoint: (POST) api/auth/login
    - Description: username, password로 로그인. token을 return
    - Require:
        - Body
        ```json
        {
            "username" : "nickname1",
            "password" : "password1"
        }
        ```
    - Response Example:
        ```json
        {
            "success": true,
            "message": null,
            "errors": null,
            "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OThkZGI2MzIyYWMxMDExZTA3MDJjYjAiLCJ1c2VybmFtZSI6InRlc3QxIiwibmFtZSI6InRlc3QxIiwiZW1haWwiOiIiLCJpYXQiOjE1MDQ3MzI2NzcsImV4cCI6MTUwNDgxOTA3N30.4eG2zGpSeY2XezKB4Djf6usy7DdygIybR1VKUBj-ScE"
        }
        ```
1. Auth - Me
    - Endpoint: (GET) api/auth/me
    - Description: token에 해당하는 user를 return
    - Require: 
        - Header: x-access-token
    - Response Example:
        ```json
        {
            "success": true,
            "message": null,
            "errors": null,
            "data": {
                "_id": "598ddb6322ac1011e0702cb0",
                "username": "nickname1",
                "name": "name1",
                "email": "example@example.com"
            }
        }
        ```
1. User - List
    - Endpoint: (GET) api/users
    - Description: 모든 user의 목록을 return
    - Require: 
        - Header: x-access-token
    - Response Example:
        ```json
        {
            "success": true,
            "message": null,
            "errors": null,
            "data": [
                {
                    "_id": "598ddb6322ac1011e0702cb0",
                    "username": "test1",
                    "name": "test1",
                    "__v": 0,
                    "email": ""
                },
                {
                    "_id": "59a748199e6e4e138033c687",
                    "username": "test2",
                    "name": "test2",
                    "email": "",
                    "__v": 0
                }
            ]
        }
        ```
1. User - One
    - Endpoint: (GET) api/users/{username}
    - Description: 닉네임이 username인 유저 정보를 return
    - Require:
        - Header: x-access-token
        - Query: username
    - Response Example:
        ```json
        {
            "success": true,
            "message": null,
            "errors": null,
            "data": {
                "_id": "598ddb6322ac1011e0702cb0",
                "username": "test1",
                "name": "test1",
                "__v": 0,
                "email": ""
             }
            
        }
    ```
1. User - Create
    - Endpoint: api/users
    - Description: 새로운 유저를 생성한다
    - Require:
        - Body:
            ```json
            {
                "username": "test3",
                "password": "password1",
                "passwordConfirmation": "password1",
                "name": "test3",
                "email": "test3@gmail.com"
            }
            ``` 
    - Response Example:
        ```json
        {
            "success": true,
            "message": null,
            "errors": null,
            "data": {
                "__v": 0,
                "username": "test3",
                "password": "$2a$10$.UAMVa/QcC.8ckk8sDEZXu1KFhNjINNDJZPx4o9tmaR1kmTmst3Be",
                "name": "test3",
                "email": "test3@gmail.com",
                "_id": "59b06d017479637420168a4c"
            }
        }
        ```
