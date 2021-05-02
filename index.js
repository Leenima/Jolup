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
        `SELECT * FROM jolup.privacy WHERE user_id = ${req.query.id};`, // 전달 받은 id(학번) 의 값으로 학생 조회
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
            `INSERT INTO jolup.privacy VALUES (null, '${req.body.id}', '${req.body.name}', '${req.body.password}', 0, 0);`,
            (err, rows, fields) => {
                if (err) { // sql 문 에러 발생 시, error 전송
                    res.status(300).send({
                        state: "ERROR",
                        message: err.sqlMessage
                    });
                    console.log("에러 발생");
                    console.log(err.sqlMessage);
                } else { // success 전송
                    res.status(200).send({
                        state: "OK",
                        message: "Data insert success!"
                    });
                }
            });
    })
    /*
    //회원 가입
    app.post('/setUserMaxid', (req, res) => {
        console.log(req.body);
        console.log(`body : ${JSON.stringify(req.body)}`)
        connection.query(
            // 쿼리 문 작성 시 리터럴 함수를 사용하더라도 '' string 표시는 꼭! 해주어야 한다.
            `INSERT INTO jolup.privacy VALUES (null, '${req.body.id}', '${req.body.name}', '${req.body.password}', 0, 0);`,
            (err, rows, fields) => {
                if (err) { // sql 문 에러 발생 시, error 전송
                    res.status(300).send({
                        state: "ERROR",
                        message: err.sqlMessage
                    });
                    console.log("에러 발생");
                    console.log(err.sqlMessage);
                } else { // success 전송
                    res.status(200).send({
                        state: "OK",
                        message: "Data insert success!"
                    });
                }
            });
    })

    */
    // database 연결 종료
    //connection.end();

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})