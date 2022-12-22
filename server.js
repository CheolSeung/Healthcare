const express = require("express");
const app = express();
const router = require("./router/router");

const session = require("express-session");  // 세션기능
const mysql_session = require("express-mysql-session");   // 세션이 저장되는 영역(mysql)


// (1) 경로처리를 하는 모듈 : path
// 여러 환경 때문에 경로를 단순히 문자열로 접근하면
// 프로그램이 특정 운영체제에서만 돌아간다
// 이러한 위험을 방지해주는 모듈 => path  :  npm install path
const path = require("path");

// (2) 외부에 있는 정보들을 요청할 때 사용하는 모듈 : cors
// 데이터를 주고받을 때 필수적으로 등록할 것  npm install cors
const cors = require("cors");


// mysql 정보를 담고있는 변수
let conn = {
    host : "127.0.0.1",
    user : "root",
    password : "zkddl9197@",
    port : "3306",
    database : "healthcare_db"
}


// 인증절차
let conn_session = new mysql_session(conn)

// 세션 기능 등록 (저장 위치 : mysql)
app.use(session ({
    secret : "Smart",    // 비밀키(의미없음)
    resave : false,           // 저장할건지 말건지 
    saveUninitialized : true, // 서버 실행시마다 초기화여부
    store : conn_session      // 저장 장소
}))


// 이 폴더 안에 있는 static 파일을 사용할게요!
app.use(express.static(path.join(__dirname, 'build')));

// 값을 주고받을 때 필요
app.use(cors());

// json형식 사용
app.use(express.json());

app.use(router);
app.listen(3001,()=>{console.log('port 3001')});
