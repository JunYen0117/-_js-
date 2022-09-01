// 1.以下是所有常數的區域=============================================

    //登入欄位
    const loginEmail = document.querySelector('#login_email_input');
    const loginPwd = document.querySelector('#login_pwd_input');
    const loginBtn = document.querySelector('.login_btn');
    
    //註冊欄位
    const signupEmail = document.querySelector('#signup_email_input');
    const signupNickname = document.querySelector('#signup_nickname_input');
    const signupPwd = document.querySelector('#signup_pwd_input');
    const signupRePwd = document.querySelector('#signup_repwd_input');
    const signupBtn = document.querySelector('.signup_btn');
    
    //切換註冊帳號、登入的按鈕
    const loginArea = document.querySelector('.right_side_content_login');
    const switchBtnToSignup = document.querySelector('.switch_btn_tosignup');
    const signupArea = document.querySelector('.right_side_content_signup');
    const switchBtnToLogin = document.querySelector('.switch_btn_tologin');

    const apiUrl = `https://todoo.5xcamp.us`;

// 常數區域結束===============================================================


// 2.以下是有關登入的程式碼===================================================

    //事件監聽：登入
    //先執行表單驗證：doLoginValidation()函式。通過驗證後，再執行註冊doLogin()函式。
    loginBtn.addEventListener('click',(e)=>{
        e.preventDefault();
        doLoginValidation(loginEmail.value, loginPwd.value)
    })

    //表單驗證函式：僅簡單寫1種驗證（是否空欄位？）。
    //其他的驗證交由登入函式：doLogin()裡面的.catch來檢查。
    const doLoginValidation = (email, pwd)=>{
        if(email==="" || pwd===""){
            Swal.fire({
                icon: 'error',
                title: '您有欄位未填寫',
            })
            return;
        }
        doLogin(email, pwd)
    }

    //登入函式
    const doLogin = (email, pwd)=>{
        axios.post(`${apiUrl}/users/sign_in`,{
            "user": {
                "email": email,
                "password": pwd,
            }
        })
        .then(
            (res)=>{
                Swal.fire({
                icon: 'success',
                title: res.data.message,
                text: '將以使用者身份造訪網站',
                confirmButtonText: '確定',
                })
                //result.isConfirmed，是sweetalert套件的文件寫法
                //當sweetalert按下確定後，就滿足if判斷式
                //會將資料放進localStorage裡，並超連結到tolist.html
                .then(
                    (result)=>{
                        if(result.isConfirmed){
                            localStorage.setItem('token',`${res.headers.authorization}`)
                            localStorage.setItem('email',`${email}`) 
                            localStorage.setItem('nickname',`${res.data.nickname}`)
                            window.location.href = 'todolist.html'
                        }
                    }
                )
            }
        )
        .catch(                
            (error)=>{
                Swal.fire({
                    icon: 'error',
                    title: error.response.data.message,
                })
            }
        )
    }

// 登入區域結束================================================================


// 3.以下是有關註冊的程式碼====================================================

    //事件監聽：註冊
    //先執行表單驗證：doSignupValidation()函式。通過驗證後，再執行註冊doSignup()函式。
    signupBtn.addEventListener('click',(e)=>{
        e.preventDefault();
        doSignupValidation(signupEmail.value, signupNickname.value, signupPwd.value, signupRePwd.value);
    })

    //表單驗證函式：只簡單寫2種驗證（空欄位？、密碼不一致？）。
    //其他的驗證交由註冊函式：doSignup()裡面的.catch來檢查。
    const doSignupValidation = (email, nickname, pwd, rePwd)=>{
        if(email==="" || nickname==="" || pwd==="" || rePwd===""){
            Swal.fire({
                icon: 'error',
                title: '您有欄位未填寫',
            })
            return;
        }
        if(pwd!==rePwd){
            Swal.fire({
                icon: 'error',
                title: '2次輸入的密碼不一致',
            })
            return;
        }
        doSignup(email, nickname, pwd);
    }

    //註冊函式
    const doSignup = (email, nickname, pwd)=>{
        console.log(email, nickname, pwd)
        axios.post(`${apiUrl}/users`,{
            "user": {
                "email": email,
                "nickname": nickname,
                "password": pwd,
            }
        })
        .then(
            (res)=>{
                Swal.fire({
                icon: 'success',
                title: res.data.message,
                text: '將以使用者身份造訪網站',
                confirmButtonText: '確定',
                })
                .then(
                    (result)=>{
                        if(result.isConfirmed){
                            localStorage.setItem('token',`${res.headers.authorization}`)
                            localStorage.setItem('email',`${email}`) 
                            localStorage.setItem('nickname',`${nickname}`)
                            window.location.href = 'todolist.html'
                        }
                    }
                )
            }
        )
        .catch(
            (error)=>{
                Swal.fire({
                    icon: 'error',
                    title: error.response.data.message,
                    text: error.response.data.error[0],
                })
            }
        )
    }

// 註冊區域結束======================================================================


// 4.以下是有關於<顯示or隱藏：登入區域><顯示or隱藏：註冊區域>===========================

    //事件監聽：切換註冊帳號、登入的按鈕，會改變HTML顯示的<div>元素
    switchBtnToSignup.addEventListener('click',()=>{
        loginArea.setAttribute('class','right_side_content_login none');
        signupArea.setAttribute('class','right_side_content_signup');
    })
    switchBtnToLogin.addEventListener('click',()=>{
        signupArea.setAttribute('class','right_side_content_signup none');
        loginArea.setAttribute('class','right_side_content_login');
    })

// 顯示or隱藏區域結束==================================================================