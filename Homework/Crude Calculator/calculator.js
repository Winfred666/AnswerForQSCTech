function $(id){
    return document.getElementById(id);
}

//植入数字输入按钮
let html1=" ";
let symbol=['+','-','*','/','(',')'];
for(let e=0;e<=15;e++){
    //写为html后必须按源码来写，注意符号
    let r=e;
    if(e>9) r=symbol[e-10];
    html1=html1.concat("<button id=\"bot"+r+
    "\" class=\"bot\" onclick=\"press("+e+")\">"+r+"</button>");
    if(e%4 == 3) html1=html1.concat("</br>")
}

$("keys").innerHTML=html1;


function press(i){
    if(i>9) i=symbol[i-10];
    $('inp').value=$('inp').value+i;
}

//将字符串转化为数字，或直接用Number()
function strToNum(ori){
    let ret=0;
    let sym=1;

    if(ori[0] == '-'){//考虑负数
        sym=-1;
        ori=ori.slice(1);
    }

    let flag=ori.length;

    for(let w=0;w<flag;w++){
        if(ori[w] == '.'){//考虑小数
            let ori2=ori.slice(w+1);
            let flag2=ori2.length;
            for(let q2=0;q2<flag2;q2++){
                ret+=(10**(-q2-1))*(ori2[q2]-'0');
            }
            ori=ori.slice(0,w);
        }
    }

    flag = ori.length;
    for(let q=0;q<flag;q++){
        ret+=(10**(flag-q-1))*(ori[q]-'0');
    }
    ret*=sym;

    return ret;
}

//基于数组创建数据结构栈
class Stack{
    constructor(){
        this.data = [];//存储数据的数组
    }
    push(ele){//向栈顶添加一个元素
        this.data.push(ele);
    }
    pop(){//删除栈顶元素并返回
        return this.data.pop();
    }
    peek(){//只是查看栈顶元素
        return this.data[this.data.length-1];
    }
    length(){//防止数组越界
        return this.data.length;
    }
}

let syms=null;
let nums=null;


//单步计算
function cal(a,b,s){
    if(s == '+') return a+b;
    if(s == '-') return a-b;
    if(s == '*') return a*b;
    if(s == '/'){
        if(b == 0) window.alert("除数不能为0！！");
        return a/b;
    }
    
}

//单步出栈计算,每次选两个数字和一个符号,运算结果入栈
//注意：first in last out,后面入栈的是被操作数
function calStack(){
    let b=nums.pop();
    let a=nums.pop();
    nums.push(cal(a,b,syms.pop()));
}


//出错信息
function opps(){
    window.alert("输入的计算式不合规范！");
}

function calculation(){
    let str=$("inp").value;
    let ret=0;

    syms=new Stack();
    nums=new Stack();

    str = str.replace(/\s*/g,"");
    //栈计算器，用符号和数字两个栈读取，转化为后缀表达式
    for(let q=0;q<str.length;q++){
        if((str[q]>='0' && str[q]<='9')){
            let q1=q;
            do{
                q1++;
            }while((str[q1]>='0'&&str[q1]<='9')||str[q1]=='.');
            let tempStr=str.slice(q,q1);
            
            nums.push(strToNum(tempStr));//数字直接入栈

            q=q1-1;//跳过该数字
            
        }else if(str[q] == '('){//从右括号开始出栈的结束标志
            syms.push(str[q]);

        }else if(str[q] == ')'){//优先级最高，直接开始出栈运算
            while(syms.peek() != '('){
                calStack();
            }
            syms.pop();//直接丢掉'('
        
        }else if((str[q] == '*')||(str[q]=='/')){
            syms.push(str[q]);
        
        }else if((str[q] == '+')||(str[q] == '-')){//优先级最低，确定栈顶运算符
            while((syms.peek() == '*')||(syms.peek() == '/')){
                calStack();
            }
            syms.push(str[q]);

        }else opps();
    }
    //运算结束，只剩下一点+-计算
    while(syms.length()>0){
        calStack();
    }
    let ans=nums.pop();//自处理小数

    let tempStr=ans.toString().split(".")[1];
    if(typeof(tempStr) != "undefined"){
        for(let q=0;q<tempStr.length;q++){
            if(tempStr[q] == '0'){
                ans=ans.toFixed(q);
                break;
            }
        }
    }
    $("oup").innerHTML=ans;
}


