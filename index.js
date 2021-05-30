const { query } = require('express');
const express = require('express')
const mysql = require('mysql')


const port = 3000;

var app = express();
app.use(express.json())

// mysql connection 생성// mysql connection 생성
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1dnjsvltm!',
    database: 'jolup'
});

connection.connect(function(err) {
    if (err) throw err;
    connection.query("SELECT * FROM jolup.privacy", function(err, result, fields) {
        if (err) throw err;
        console.log(result);
    });
})

//get은 보안상의 문제로 안쓰는게 좋다고 생각중 그래서 post로 하려고 시도중
app.get('/', (req, res) => { // getUserData 경로에 GET 요청이 왔을 경우
    console.log(`이곳은 졸업작품을 위한 홈페이지 입니다`)
    res.send("이곳은 졸업작품을 위한 홈페이지 입니다");
})


//get은 보안상의 문제로 안쓰는게 좋다고 생각중 그래서 post로 하려고 시도중
app.get('/getUserData', (req, res) => { // getUserData 경로에 GET 요청이 왔을 경우
    console.log(`param id : ${req.query.id}`)
    connection.query(
        `SELECT * FROM jolup.privacy WHERE user_id >= ${req.query.id};`, // 전달 받은 id(학번) 의 값으로 학생 조회
        (err, rows, fields) => { // SQL 문 Callback 함수
            res.send(rows);
            console.log(rows);
        });
})

//회원 가입
app.post('/setUserData', (req, res) => {
    console.log(req.body);
    console.log(`body : ${JSON.stringify(req.body)}`)
    connection.query(
        // 쿼리 문 작성 시 리터럴 함수를 사용하더라도 '' string 표시는 꼭! 해주어야 한다.
        `INSERT INTO jolup.privacy VALUES (null, '${req.body.name}', '${req.body.id}', '${req.body.password}', 0, '${req.body.admin}');`,
        (err, rows, fields) => {
            if (err) { // sql 문 에러 발생 시, error 전송
                res.status(300).send({
                    state: "ERROR",
                    message: err.sqlMessage
                }); -
                console.log("에러 발생");
                console.log(err.sqlMessage);
            } else { // success 전송
                res.status(200).send({
                    state: "OK",
                    message: "회원가입에 성공하셨습니다!",
                    code: 200
                });
            }
        }
    );
})

//중복확인
app.post('/double_check', (req, res) => {
    console.log(req.body);
    console.log(`body : ${JSON.stringify(req.body)}`)
    console.log(`${req.body.id}`)
    connection.query(
        // 쿼리 문 작성 시 리터럴 함수를 사용하더라도 '' string 표시는 꼭! 해주어야 한다.
        //`SELECT * FROM jolup.privacy WHERE id = ${req.body.id};`,
        `SELECT COUNT(id) AS cnt FROM jolup.privacy WHERE id='${req.body.id}';`,
        (err, rows, fields) => {
            //console.log(rows[0].cnt);
            //console.log(rows[0]['cnt']);
            if (err) { // sql 문 에러 발생 시, error 전송
                res.status(300).send({
                    state: "ERROR",
                    message: err.sqlMessage
                });
                console.log("에러 발생");
                console.log(err.sqlMessage);
            } else { // success 전송
                console.log(rows[0].cnt);
                if (rows[0].cnt != 0) {
                    res.status(201).send({
                        state: "OK",
                        message: "중복되는 ID입니다.",
                        code: 201
                    });
                } else {
                    res.status(200).send({
                        state: "OK",
                        message: "사용 가능한 ID입니다.",
                        code: 200
                    });
                }
            }
        }
    );
})

//로그인
app.post('/login', (req, res) => {
    var id_ = 0;
    var query_stop = 0;
    console.log(req.body);
    console.log(`body : ${JSON.stringify(req.body)}`)
    console.log(`${req.body.id}`)

    if (id_ == 0) {
        query_step = 1;
        connection.query( // id가 존재하는지?
            // 쿼리 문 작성 시 리터럴 함수를 사용하더라도 '' string 표시는 꼭! 해주어야 한다.
            //`SELECT * FROM jolup.privacy WHERE id = ${req.body.id};`,
            `SELECT COUNT(id) AS cnt FROM jolup.privacy WHERE id='${req.body.id}';`,
            (err, rows, fields) => {
                query_step = 1;
                //console.log(rows[0].cnt);
                //console.log(rows[0]['cnt']);
                if (err) { // sql 문 에러 발생 시, error 전송
                    query_stop = 1;
                    res.status(300).send({
                        state: "ERROR",
                        message: err.sqlMessage
                    });
                    console.log("에러 발생");
                    console.log(err.sqlMessage);
                } else { // success 전송
                    console.log(rows[0].cnt);
                    if (rows[0].cnt != 0) { //id가 존재한다면.
                        id_ = 1;
                    } else {
                        query_stop = 1;
                        res.status(201).send({
                            state: "OK",
                            message: "ID가 존재하지 않습니다",
                            code: 201
                        });
                    }
                }
                console.log("아이디 맞음?: " + id_);
            }
        );
    } else if (id_ == 1) { //id가 존재한다면 id와 패스워드까지 같은게 존재하는지 확인
        connection.query(
            // 쿼리 문 작성 시 리터럴 함수를 사용하더라도 '' string 표시는 꼭! 해주어야 한다.
            //`SELECT * FROM jolup.privacy WHERE id = ${req.body.id};`,
            `SELECT COUNT(id) AS cnt FROM jolup.privacy WHERE id='${req.body.id}', password='${req.body.password}';`,
            (err, rows, fields) => {
                query_step = 2;
                //console.log(rows[0].cnt);
                //console.log(rows[0]['cnt']);
                if (err) { // sql 문 에러 발생 시, error 전송
                    res.status(300).send({
                        state: "ERROR",
                        message: err.sqlMessage
                    });
                    console.log("에러 발생");
                    console.log(err.sqlMessage);
                } else { // success 전송
                    console.log(rows[0].cnt);
                    if (rows[0].cnt != 0) { //패스워드까지 맞는 id가 존재한다면.
                        id_ = 2;
                    } else {
                        query_stop = 1;
                        res.status(201).send({
                            state: "OK",
                            message: "패스워드가 일치하지 않습니다",
                            code: 201
                        });
                    }
                    console.log("패스워드 맞음?: " + id_);
                }
            }
        );
    }
    if (id_ == 2) { //패스워드가 같은 id가 존재한다면 그 유저값을 보내준다
        connection.query(
            // 쿼리 문 작성 시 리터럴 함수를 사용하더라도 '' string 표시는 꼭! 해주어야 한다.
            //`SELECT * FROM jolup.privacy WHERE id = ${req.body.id};`,
            `SELECT * FROM jolup.privacy WHERE id='${req.body.id}', password='${req.body.password}';`,
            (err, rows, fields) => {
                query_step = 3;
                //console.log(rows[0].cnt);
                //console.log(rows[0]['cnt']);
                if (err) { // sql 문 에러 발생 시, error 전송
                    query_stop = 1;
                    res.status(300).send({
                        state: "ERROR",
                        message: err.sqlMessage
                    });
                    console.log("에러 발생");
                    console.log(err.sqlMessage);
                } else { // success 전송
                    query_stop = 1;
                    res.status(201).send({
                        state: "OK",
                        message: rows[0].name + "님 어서오세요.",
                        code: 201
                    });
                }
            }
        );
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://lockup.kro.kr:${port}`)
})