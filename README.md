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
        - Header:
        
        |  Key |  Value  |
        |:--------:|:--------:|
        |**x-access-token** |**eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...**|
        
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
        - Header: 
        
        |  Key |  Value  |
        |:--------:|:--------:|
        |**x-access-token** |**eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...**|
        
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
        - Header: 
        
        |  Key |  Value  |
        |:--------:|:--------:|
        |**x-access-token** |**eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...**|
        - Query: 
        
        |  Key |  Value  |
        |:--------:|:--------:|
        |**{username}** |**nickname1**|
        
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
    - Endpoint: (POST) api/users
    - Description: 새로운 유저를 생성 
        - username(nickname), email 은 unique
        - password와 passwordConfirmation의 값은 동일해야
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

1. User - Update
    - Endpoint: (PUT) api/users/{username}
    - Description: {username}에 해당하는 유저의 정보를 업데이트
    - Require:
        - Header: 
                
        |  Key |  Value  |
        |:--------:|:--------:|
        |**x-access-token** |**eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...**|
        
        - Query: 
        
        |  Key |  Value  |
        |:--------:|:--------:|
        |**{username}** |**nickname1**|
        
        - Body:
        ```json5
        {
            "username": "changedNickName",
            "name": "changedName",
            "password": "password1",              // optional
            "passwordConfirmation": "password1",  // optional
            "email": "change@gmail.com"            // optional
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
                "username": "changedNickName",
                "password": "$2a$10$.UAMVa/QcC.8ckk8sDEZXu1KFhNjINNDJZPx4o9tmaR1kmTmst3Be",
                "name": "changedName",
                "email": "change@gmail.com",
                "_id": "59b06d017479637420168a4c"
            }
        }
        ```
### Review & Tag
1. Review - Create
    - Endpoint: (POST) api/reviews
    - Description: userId, tags, photos, review를 받아서 리뷰를 생성
    - Require:
        - Header: 
                
        |  Key |  Value  |
        |:--------:|:--------:|
        |**x-access-token** |**eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...**|
        
        - Body:
        ```json5
        {
            "userId": "5e0ef859073d002703e68641",
            "tags": ["tag1", "tag2"],
            "photos": ["binary_photo1...", "binary_photo2..."], // optional
            "review": "review contents",                        // optional
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
                "userId": "5e0ef859073d002703e68641",
                "photos": [],
                "tags": ["tag1", "tag2"],
                "review": "review contents",
                "_id": "5e0f361500f7ef2f2e119b5a",
                "created_at": "2020-01-03T12:39:49.342Z",
                "updated_at": "2020-01-03T12:39:49.342Z"
            }
        }
        ```
      
      
## Feature Implement List
- User & Auth
    - [ ] username(닉네임), password, name, email, 프사, 경험치를 value로 가짐
    - [ ] method: 레벨은 경험치로 계산
    - [ ] method: 평가를 n개 이상 했는지 여부
    - [x] api: 아이디와 패스워드(확인)와 닉네임으로 회원가입
    - [x] api: 아이디와 패스워드를 확인해서 로그인하는 기능
    - [x] api: 로그인한 사용자에게 토큰을 발급하는 기능
    - [x] api: 토큰이 없거나 만료된 사용자는 다시 로그인

- Reviews
    - [x] 외래키: user_id, [tag명]
    - [x] 사진, 글, 조회수, 생성/수정 날짜를 value로 가짐
    - [x] 리뷰는 여러 개의 tag를 가질 수 있음(# 식으로 유저가 입력)
        - Tag와 Many-to-Many 관계를 갖는다고 할 수 있음
    - [x] api: 리뷰를 작성/수정/삭제하는 기능
    - [x] api: 리뷰를 조회하는 기능
        - [x] {username}으로 조회
        - [ ] 추천 순으로 조회
    - [x] api: 조회수를 1만큼 증가시키는 기능
        - [x] 조회수는 한 유저가 하루에 한 번씩만 증가시킬 수 있음

- Tag
    - [ ] mongoose populate 공부하기
    - [x] _id: tag명
    - [x] 외래키: [리뷰 id]
    - [x] Review 저장 시 파라미터로 받아서 태그가 존재하지 않으면 생성 
    - [ ] api: tag 이름으로 review 목록을 가져오는 기능

- Evaluation
    - [x] 외래키: user_id, review_id
    - [x] 평점(0~5), 글(필수?, 아직 생성 안함), 생성/수정 날짜를 value로 가짐
    - [ ] api: 평가를 작성/수정/삭제하는 기능
        - [ ] 한 user는 한 review에 하나의 평가만을 할 수 있음
    - [ ] api: 평가를 조회하는 기능