// 一、所有的變數、常數====================================================
    //這3個空陣列，是當axios傳回資料後，會塞入資料到空陣列中
    let totalArr = []; 
    let unfinishedArr = [];
    let finishedArr = [];
    // renderData變數搭配rendering()函式，根據字串內容，會渲染不同畫面
    let renderData = ""; 
    const card = document.querySelector('.card_list');
    const list = document.querySelector('.list');
    const allBtn = document.querySelector('.all_btn');
    const unfinishedBtn = document.querySelector('.unfinished_btn');
    const finishedBtn = document.querySelector('.finished_btn');
    const unfinishedItem = document.querySelector('#unfinished_item')
    const noDataCard = document.querySelector('.no_data_card');
    const nickname = localStorage.getItem('nickname');
    const nicknameTodoList = document.querySelector('.nickname_todolist');
    const btnAdd = document.querySelector('.btn_add');
    const inputAdd = document.querySelector('.input_add');
    const btnDelete = document.querySelector('.delete');
    const deleteAll = document.querySelector('#delete_all');
    const logout = document.querySelector('.logout');
    const apiUrl = `https://todoo.5xcamp.us`;
// 所有變數、常數的區域 結束=================================================


// 二、常用的函式===========================================================
    // 下面4個函式用了promise，會依序執行：
    // getTodo() -> process() -> rendering() -> renderAllData()
    // 這4個函式做CRUD時，會常常被呼叫，以下是程式運作的邏輯：
    // 1. getTodo()，用axios把資料帶回來
    // 2. process()，將資料塞進3個空陣列中：totalArr、unfinishedArr、finishedArr
    // 3. rendering()，會判斷渲染畫面時，要使用3個陣列中的哪一個？
    // 4. renderAllData()，決定好哪個陣列後，將陣列帶入參數中，最後渲染畫面到網頁上
    const getTodo = ()=>{
        return new Promise((resolve, reject) => {
            let res = axios.get(`${apiUrl}/todos`);
            resolve(res);
        })
    }

    const process = (res)=>{
        if(res.data.todos.length!==0){
            card.setAttribute('style','display: block');
            noDataCard.setAttribute('style','display: none');
        }else{
            card.setAttribute('style','display: none');
            noDataCard.setAttribute('style','display: block');
        }
        totalArr = res.data.todos;
        finishedArr = totalArr.filter((value)=>{
            return value.completed_at !== null;
        });
        unfinishedArr = totalArr.filter((value)=>{
            return value.completed_at === null;
        });
    }

    const rendering = ()=>{
        if(renderData === '顯示全部資料'){
            renderAllData(totalArr);
        }else if(renderData === '顯示待完成資料'){
            renderAllData(unfinishedArr);
        }else if(renderData === '顯示已完成資料'){
            renderAllData(finishedArr);
        }
    }

    const renderAllData = (whatArr)=>{
        console.log(whatArr)
        let str = ``;
        whatArr.forEach((value)=>{
            // if判斷式，如果陣列裡面，completed_at不是空值，
            // 就在<input>裡加上checked屬性，
            // 表示這個項目的狀態，是被選中的。
            if(value.completed_at!==null){
                addContent =
                `<li>
                    <label class="checkbox" for="">
                        <input class="${value.id}" type="checkbox" checked/>
                        <span>${value.content}</span>
                    </label>
                    <a href="#" class="delete"></a>
                </li>`;
            }else{
                addContent =
                `<li>
                    <label class="checkbox" for="">
                        <input class="${value.id}" type="checkbox"/>
                        <span>${value.content}</span>
                    </label>
                    <a href="#" class="delete"></a>
                </li>`;
            }
            str += addContent;
        })
        list.innerHTML = str;
        unfinishedItem.textContent = `${unfinishedArr.length }個待完成項目`;
    }
// 常用的函式 結束=========================================================


// 三、進入頁面最先執行的事情：=============================================
    window.onload = function (){
        // 判斷token是否有值，沒有值就跳離此頁，返回登入註冊畫面；
        // 有值就把token存入axios的headers裡，以備之後使用
        if(localStorage.getItem('token')===null){
            alert('請先登入或註冊');
            window.location.href = 'login_signup.html';
        }else{
            axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
        }
        // 右上方顯示為：某某某的代辦
        nicknameTodoList.textContent = `${nickname} 的代辦`;

        renderData = '顯示全部資料';

        // 執行常用的函式
        getTodo()
        .then((res)=>{
            process(res);
        })
        .then(()=>{
            rendering();
        })
        .catch(error=>{
            alert('請先登入或註冊');
            window.location.href = 'login_signup.html';})
    }
// 進入頁面最先執行的事情 結束================================================


// 四、畫面中「全部」、「待完成」、「已完成」按鈕===============================
    // 點擊「全部」、「待完成」、「已完成」按鈕，
    // 會改變<li>元素的className，改變css的顯示。
    // 最後執行rendering()，重新渲染畫面。
    allBtn.addEventListener('click',()=>{
        allBtn.setAttribute('class','all_btn active');
        unfinishedBtn.setAttribute('class','unfinished_btn');
        finishedBtn.setAttribute('class','finished_btn');
        renderData = '顯示全部資料';
        rendering();
    })
    unfinishedBtn.addEventListener('click',()=>{
        allBtn.setAttribute('class','all_btn');
        unfinishedBtn.setAttribute('class','unfinished_btn active');
        finishedBtn.setAttribute('class','finished_btn');
        renderData = '顯示待完成資料';
        rendering();
    })
    finishedBtn.addEventListener('click',()=>{
        allBtn.setAttribute('class','all_btn');
        unfinishedBtn.setAttribute('class','unfinished_btn');
        finishedBtn.setAttribute('class','finished_btn active');
        renderData = '顯示已完成資料';
        rendering();
    })
// 畫面中「全部」、「待完成」、「已完成」按鈕 結束=============================


// 五、新增功能============================================================
    btnAdd.addEventListener('click',()=>{
        addTodoList(inputAdd.value);
    })
    const addTodoList = (todo)=>{
        axios.post(`${apiUrl}/todos`,{
            "todo": {
              "content": todo
            }
        })
        .then(()=>{
            getTodo()
            .then((res)=>{
                process(res);
            })
            .then(()=>{
                rendering();
            })
            inputAdd.value = "";
        })
        .catch(error=>console.log(error.response))
    }
// 新增功能 結束============================================================


// 六、改變「工作已完成」、「工作未完成」的狀態 ===============================
    list.addEventListener('click',(e)=>{isChecked(e)})
    const isChecked = (e)=>{
        if(e.target.nodeName==='INPUT'){
            let todoID = e.target.getAttribute('class');
            axios.patch(`${apiUrl}/todos/${todoID}/toggle`)
            .then(()=>{
                getTodo()
                .then((res)=>{
                    process(res);
                })
                .then(()=>{
                    rendering();
                })
            })
            .catch(error=>console.log(error.response))
        }
    }
// 改變「工作已完成」、「工作未完成」的狀態 結束===============================


// 七、刪除功能（單筆）======================================================
    list.addEventListener('click',(e)=>{deleteTodo(e)})
    const deleteTodo = (e)=>{
        if(e.target.nodeName==='A'){
            // 從<a>標籤抓附近的<input class="...">，抓class的值
            let todoID = e.target.previousSibling.previousSibling.firstChild.nextSibling.getAttribute('class');
            axios.delete(`${apiUrl}/todos/${todoID}`)
            .then(()=>{
                getTodo()
                .then((res)=>{
                    process(res);
                })
                .then(()=>{
                    rendering();
                })
            })
            .catch(error=>console.log(error.response))
        }
    }
// 刪除功能（單筆） 結束======================================================


// 八、刪除全部（已完成項目）=================================================
    deleteAll.addEventListener('click',()=>{deleteAllTodo()})
    const deleteAllTodo = ()=>{
        const multiAxios = finishedArr.map((value=>{
            return axios.delete(`${apiUrl}/todos/${value.id}`);
        }))
        Promise.all(multiAxios)
        .then(()=>{
            getTodo()
            .then((res)=>{
                process(res);
            })
            .then(()=>{
                rendering();
            })
        })
        .catch(error=>console.log(error))
    }
// 刪除全部（已完成項目） 結束=================================================


// 九、登出功能=======================================================
    logout.addEventListener('click',()=>{
        Swal.fire({
            icon: 'info',
            title: '是否要登出？',
            showCancelButton: true,
        }).then((result)=>{
            // 按下確定後，清除所有儲存在localStorage的資料
            if(result.isConfirmed){
                localStorage.removeItem('email');
                localStorage.removeItem('nickname');
                localStorage.removeItem('token');
                window.location.href = 'login_signup.html';
            }
        })
    })
// 登出功能 結束=======================================================
