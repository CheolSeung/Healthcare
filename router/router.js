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
    database : "healthcare_db"
});

// 로그인 라우터
router.post("/loginData", (req, res) => {
    
    console.log('login')
    
    let id = req.body.loginData.id
    let pw = req.body.loginData.pw

    let sql = "select * from tb_member where mb_id = ? and mb_pw = ?"

    conn.query(sql, [id, pw] , (err, row) => {
        if(err) {
            console.log("정보없음" + err);
        } else if(row.length > 0) { 

            //세션 등록 코드 
            req.session.user = {
               "id": row[0].id,
               "name": row[0].name,
               "birth": row[0].birth,
               "gender": row[0].gender,
               "tel": row[0].tel,
               "mail": row[0].mail,
               "belong": row[0].belong,
               "address": row[0].address,
            };   // session이라는 공간에 user라는 이름으로 코드 안에 값이 들어감

            console.log('session 값 : ', req.session.user)

            res.json({
                result : 'login success',
                user : req.session.user
            })

        } else if(row.length == 0) {
            console.log("로그인 실패")
            res.json({
                result : "login fail"
            })
        }
    })
});


// 로그아웃(세션삭제)
router.get("/logout", (req,res) => {
    // localStorage.removeItem("user");
    res.redirect('http://localhost:3001/');
    // delete req.session.user;
    // res.end();
})


// 메인
router.get('/', (req, res) => {

    // let sql = "select * from nursing_home where id = ?"

    if(req.session.user) {
        // conn.query(sql, [req.session.user.id], (err, row) => {
        //     console.log(row);
        //     // 로그인 상태 
        // })
        res.json({
            state : 'success',
            // userID : req.session.user.id
        })
    } else {
        console.log("세션에 값이 없습니다.")
        res.send('failed')
    }
    res.end()
})


// 회원가입 라우터 (빈칸 존재시 회원가입 안되야하는 기능 필요)
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

    let sql = 'insert into tb_member values (?,?,?,?,?,?,?,?,?)'
    let findid = 'select * from tb_member where mb_id=?'

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


// 세션값 가져오기
// router.get("/session", (req,res)=> {
//     // console.log(req.session.user);
//     // res.send({id: req.session.user})
//     // res.send(res.data.userID.id)
// })


// 환자정보 추가
router.post("/patientData", (req, res) => {

    let p_name = req.body.patientData.p_name;
    let p_birth = req.body.patientData.p_birth;
    let p_gender = req.body.patientData.p_gender;
    let p_tel = req.body.patientData.p_tel;
    let p_addr = req.body.patientData.p_addr;
    let h_room = req.body.patientData.h_room;

    let sql = 'insert into tb_patient values (NULL,?,?,?,?,?,?)'

    conn.query(sql, [p_name, p_birth, p_gender, p_tel, p_addr, h_room], (err, row) => {
        if(row.affectedRows == 1) {
            console.log("환자 추가 성공");
            res.json({
                result : "success"
            })
        } else {
            console.log(err)
        }
        res.end();
    });
});


// Chart.js 차트불러오기
router.get("/patientAll", (req, res) => {

    let sql = "select * from tb_patient";

    conn.query(sql, (err, row) => {
        if(err) {
            console.log("실패 : " + err);
        } else if(row.length > 0) {
            console.log("전체 데이터의 수 : " + row.length);
            res.json ({
                patient : row,
            })
        } else if(row.length == 0) {
            console.log("데이터가 없습니다.");
        }
    })
});


// Chart.js 환자삭제
router.post('/patientDelete', (req, res) => {

    let patient_cd = req.body.patient_cd;

    let sql = "delete from tb_patient where patient_cd = ?";
    conn.query(sql, [patient_cd], (err, row) => {
        if(err){
            console.log("삭제실패 : " + err);
        } else if(row.affectedRows > 0) {
            console.log("삭제에 성공한 수 : " + row.affectedRows);
            res.json({
                result : "success"
            })
        } else if(row.affectedRows == 0) {
            console.log("삭제된 값이 없습니다.")
        }
    })
})


// 환자 검색
router.post('/patientSearch', (req,res) => {

    let patient_name = req.body.patient_name;

    let sql = "select * from tb_patient where patient_name = ? "

    conn.query(sql, [patient_name], (err,row) => {
        if(err){
            console.log("검색실패 : " + err);
        } else if(row.length > 0) {
            console.log("검색에 성공한 수 : " +row.length);
            res.json({
                patient : row,
                name : row[0].patient_name
            })
        } else if(row.length == 0) {
            console.log("검색된 값이 없습니다.")
        }
    })
})


// 환자 상세 정보
router.post('/patientDetail', (req, res) => {
    
    const patient_cd = req.body.uid;

    let sql = "select * from tb_patient where patient_cd = ?"

    conn.query(sql, [patient_cd], (err, row) => {
        console.log("det_info에서 넘어온 값: " + patient_cd)
        if(err){
            console.log("상세정보 불러오기 실패: " + err);
        } else if(row.length > 0) {
            console.log("상세정보 수: " + row.length);
            res.json({
                patient : row,
                patient_cd  : row[0].patient_cd,
                name : row[0].patient_name,
                birthdate : row[0].patient_birthdate,
                gender : row[0].patient_gender,
                phone : row[0].patient_phone,
                addr : row[0].patient_addr,
                h_room : row[0].hospital_room,
            })
        } else if(row.length == 0) {
            console.log("상세정보 값이 없습니다.")
        }
    })
})





router.get("*", (req, res) => {
    console.log("happy hacking!")
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'))
});

module.exports = router;
