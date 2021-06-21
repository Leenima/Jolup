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
/*
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
*/
//회원가입
app.post('/setUserData', async(req, res) => {
    console.log(req.body);
    console.log(`body : ${JSON.stringify(req.body)}`)
    try {
        await connection.query(
            // 쿼리 문 작성 시 리터럴 함수를 사용하더라도 '' string 표시는 꼭! 해주어야 한다. 
            `INSERT INTO jolup.privacy VALUES (null, '${req.body.name}', '${req.body.id}', '${req.body.password}', 0, '${req.body.admin}', );`,
            (err, rows, fields) => {
                console.log("회원가입에 성공하셨습니다");
                res.status(200).send({
                    state: "OK",
                    message: "회원가입에 성공하셨습니다!",
                    code: 200
                });
            }
        );
    } catch (error) {
        res.status(300).send({
            state: "ERROR",
            message: err.sqlMessage
        }); -
        console.log("에러 발생");
        console.log(error);
    }
})

//중복확인
app.post('/double_check', (req, res) => {
    console.log(req.body);
    console.log(`body : ${JSON.stringify(req.body)}`)
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
                    console.log("중복되는 ID입니다");
                    res.status(201).send({
                        state: "OK",
                        message: "중복되는 ID입니다.",
                        code: 201
                    });
                } else {
                    console.log("사용 가능한 ID입니다");
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
app.post('/login', async(req, res) => {
    var id_ = 0;
    try {
        await connection.query(
            `SELECT COUNT(id) AS cnt FROM jolup.privacy WHERE id='${req.body.id}';`,
            (err, rows, fields) => {
                console.log(rows[0].cnt);
                console.log("id: " + id_);
                if (rows[0].cnt != 0) { //id가 존재한다면.
                    console.log("id가 존재합니다");
                } else {
                    id_ = 1;
                    console.log("id가 존재하지 않습니다");
                    res.status(200).send({
                        state: "OK",
                        message: "ID가 존재하지 않습니다",
                        code: 200
                    });
                }
            }
        ); // query A
        await connection.query(

            `SELECT COUNT(id) AS cnt FROM jolup.privacy WHERE id='${req.body.id}' and password='${req.body.password}';`,
            (err, rows, fields) => {
                console.log(rows);
                console.log("id: " + id_);
                if (rows[0].cnt != 0) { //패스워드까지 맞는 id가 존재한다면.
                    console.log("패스워드가 맞습니다");
                } else {
                    if (id_ == 0) {
                        id_ = 2;
                        console.log("패스워드가 틀립니다");
                        res.status(200).send({
                            state: "OK",
                            message: "패스워드가 일치하지 않습니다",
                            code: 200
                        });
                    }
                }
            }
        ); // query B

        await connection.query(
            // 쿼리 문 작성 시 리터럴 함수를 사용하더라도 '' string 표시는 꼭! 해주어야 한다.
            //`SELECT * FROM jolup.privacy WHERE id = ${req.body.id};`,
            `SELECT * FROM jolup.privacy WHERE id='${req.body.id}' and password='${req.body.password}';`,
            (err, rows, fields) => {
                console.log("id: " + id_);
                console.log(rows);
                if (id_ == 0) {
                    id_ = 3;
                    console.log(rows);
                    console.log(rows[0].name + "님 이 로그인합니다");
                    res.status(200).json({
                        state: "OK",
                        message: rows[0].name + "님 어서오세요.",
                        code: 200,
                        items: [{
                            id: rows[0].id,
                            name: rows[0].name,
                            admin: rows[0].admin,
                            livecode: rows[0].live_code,
                            house: rows[0].house
                        }]

                    })

                }
            }
        );
    } catch (err) {
        res.status(300).send({
            state: "ERROR",
            message: err.sqlMessage
        });
        console.log("에러 발생");
        console.log(err.sqlMessage);

    }
})

        /*
//호스트 메뉴 - 게스트 목록 
app.post('/guest_list', async(req, res) => {
    var q = 0;
    var rows2;
    console.log(req.body);
    console.log(`body : ${JSON.stringify(req.body)}`)
    try {

        var userInfo = {
        };
          function guest_list1() {
            return new Promise({
                await connection.query(
                    // 쿼리 문 작성 시 리터럴 함수를 사용하더라도 '' string 표시는 꼭! 해주어야 한다.
                    //`SELECT * FROM jolup.privacy WHERE id = ${req.body.id};`,
                    `SELECT * FROM jolup.privacy WHERE id='${req.body.id}';`,
                    (err, rows, fields) => {
                        console.log("q: " + q);
                        console.log(rows);
                        admin_code = rows[0].user_id
                        console.log("호스트의 유저아이디: " + rows[0].user_id);
                        rows2 = rows
                    }
                );
            });
          }
          function guest_list2() {
            return new Promise({
                await connection.query(
                    `SELECT COUNT(id) AS cnt FROM jolup.privacy WHERE live_code=` + rows2[0].user_id + `;`,
                    (err, rows, fields) => {
                        while (admin_code == 0) {};
                        console.log("cnt: " + rows[0].cnt);
                        console.log("q: " + q);
                        if (rows[0].cnt != 0) { //id가 존재한다면.
                            console.log("게스트가 있습니다");
                        } else {
                            q = 1;
                            console.log("게스트가 없습니다");
                            res.status(200).send({
                                state: "OK",
                                message: "게스트가 존재하지 않습니다",
                                code: 200
                            });
                        }
                    }
                ); // query A
            });
          }
          function guest_list3() {
            return new Promise({
               await connection.query(
                    // 쿼리 문 작성 시 리터럴 함수를 사용하더라도 '' string 표시는 꼭! 해주어야 한다.
                    //`SELECT * FROM jolup.privacy WHERE id = ${req.body.id};`,
                    `SELECT * FROM jolup.privacy WHERE live_code=` + rows2[0].user_id + `;`,
                    (err, rows, fields) => {
                        console.log("2admin code:" + rows2[0].user_id);
                        if (q == 0) {
                            console.log(rows);
                            res.status(200).json({
                                state: "OK",
                                message: "게스트를 성공적으로 불러왔습니다.",
                                code: 200,
                                items: [{
                                    guest: rows
                                }]
                            })
                        }
                    }
                );
            });
        }





        getData(userInfo)
        .then(parseValue)
        .then(auth);




        await connection.query(
            // 쿼리 문 작성 시 리터럴 함수를 사용하더라도 '' string 표시는 꼭! 해주어야 한다.
            //`SELECT * FROM jolup.privacy WHERE id = ${req.body.id};`,
            `SELECT * FROM jolup.privacy WHERE id='${req.body.id}';`,
            (err, rows, fields) => {
                console.log("q: " + q);
                console.log(rows);
                admin_code = rows[0].user_id
                console.log("호스트의 유저아이디: " + rows[0].user_id);
                rows2 = rows
            }
        );
        await connection.query(
            `SELECT COUNT(id) AS cnt FROM jolup.privacy WHERE live_code=` + rows2[0].user_id + `;`,
            (err, rows, fields) => {
                while (admin_code == 0) {};
                console.log("cnt: " + rows[0].cnt);
                console.log("q: " + q);
                if (rows[0].cnt != 0) { //id가 존재한다면.
                    console.log("게스트가 있습니다");
                } else {
                    q = 1;
                    console.log("게스트가 없습니다");
                    res.status(200).send({
                        state: "OK",
                        message: "게스트가 존재하지 않습니다",
                        code: 200
                    });
                }
            }
        ); // query A
        await connection.query(
            // 쿼리 문 작성 시 리터럴 함수를 사용하더라도 '' string 표시는 꼭! 해주어야 한다.
            //`SELECT * FROM jolup.privacy WHERE id = ${req.body.id};`,
            `SELECT * FROM jolup.privacy WHERE live_code=` + rows2[0].user_id + `;`,
            (err, rows, fields) => {
                console.log("2admin code:" + rows2[0].user_id);
                if (q == 0) {
                    console.log(rows);
                    res.status(200).json({
                        state: "OK",
                        message: "게스트를 성공적으로 불러왔습니다.",
                        code: 200,
                        items: [{
                            guest: rows
                        }]
                    })
                }
            }
        );
    } catch (err) {
        res.status(300).send({
            state: "ERROR",
            message: err.sqlMessage
        });
        console.log("에러 발생");
        console.log(err.sqlMessage);

    }

})
*/

app.listen(port, () => {
    console.log(`Example app listening at http://lockup.kro.kr:${port}`)
})