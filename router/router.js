const express = require("express");
const router = express.Router();

// DB 세팅
const mysql = require("mysql");

const path = require("path");

let conn = mysql.createConnection({
    host : "127.0.0.1",
    user : "root",
    password : "zkddl9197@",
    port : "3306",
    database : "nodejs"
});


// 회원가입 라우터
router.post("/joinData", (req, res) => {

    let id = req.body.joinData.id
    let pw = req.body.joinData.pw
    let name = req.body.joinData.name
    let birth = req.body.joinData.birth
    let gender = req.body.joinData.gender
    let tel = req.body.joinData.tel
    let mail = req.body.joinData.mail
    let belong = req.body.joinData.belong
    let address = req.body.joinData.address


    let sql = 'insert into nursing_home values (NULL,?,?,?,?,?,?,?,?,?)'
    let findid = 'select * from nursing_home where id=?'

    conn.query(findid, [id], (err, row) => {
        if(row[0] === undefined) {
            conn.query(sql, [id, pw, name, birth, gender, tel, mail, belong, address], (err, row) => {
                if(row) {
                    console.log("회원가입 성공")
                    res.json({
                        result : "success"
                    })
                } else {
                    console.log(err)
                    res.json({
                        result : "fail"
                    })
                }
                res.end();
            })
        } else {
            console.log("중복");
        };   
    })
});


// 로그인 라우터
router.post("/loginData", (req, res) => {
    
    let id = req.body.loginData.id
    let pw = req.body.loginData.pw

    let sql = "select * from nursing_home where id = ? and pw = ?"

    conn.query(sql, [id, pw] , (err, row) => {
        if(err) {
            console.log("정보없음" + err);
        } else if(row.length > 0) { 
            console.log("로그인 성공")
            res.json({
                result : "login success"
            })
        } else if(row.length == 0) {
            console.log("로그인 실패")
            res.json({
                result : "login fail"
            })
        }
    })
});



router.get("*", (request, response) => {
    console.log("happy hacking!")
    response.sendFile(path.join(__dirname, '..', 'build', 'index.html'))
});

module.exports = router;