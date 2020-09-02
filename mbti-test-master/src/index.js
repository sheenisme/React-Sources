import React, { Component } from 'react';
// eslint-disable-next-line no-unused-vars
import ReactDOM, { render } from 'react-dom';
import ExportJsonExcel from 'js-export-excel';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/radar';
import './index.css';
let questions = require('./question.json');
questions.sort(function () {
  return (0.5 - Math.random());
})

let myResultTab = null;
let userName = '';
const tabFormateRs = [
  {
    cateKey: 'E',
    cateName: '外倾型',
    cateId: 1,
    score: 0,
    type: '行动先于思考',
    info: '外倾的人倾向于将注意力和精力投注在外部世界，外在的人，外在的物，外在的环境等。'
  },
  {
    cateKey: 'I',
    cateName: '内倾型',
    cateId: 2,
    score: 0,
    type: '思考先于行动',
    info: '内倾的人较为关注自我的内部状况，如内心情感、思想。两种类型的个体在自己偏好的世界里会感觉自在、充满活力，而到相反的世界里则会不安、疲惫。'
  },
  {
    cateKey: 'S',
    cateName: '感觉型',
    cateId: 3,
    score: 0,
    type: '着眼于现实',
    info: '感觉型的人关注的是事实本身，注重细节；感觉型的人信赖五官听到、看到、闻到、感觉到、尝到的实实在在、有形有据的事实和信息。'
  },
  {
    cateKey: 'N',
    cateName: '直觉型',
    cateId: 4,
    score: 0,
    type: '着眼于未来，留意事物的变化趋势，惯于从长远角度看待事物',
    info: '直觉型的人注重的是基于事实的含义、关系和结论;直觉型的人注重"第六感觉"，注重"弦外之音"，直觉型的人的许多结论在感觉型的人眼里，也许是飘忽的，不实在的。'
  },
  {
    cateKey: 'T',
    cateName: '思维型',
    cateId: 5,
    score: 0,
    type: '退后一步思考，对问题进行客观的、非个人立场的分析',
    info: '思维型的人则比较注重依据客观事实的分析，一以贯之、一视同仁地贯彻规章制度，不太习惯根据人情因素变通，哪怕做出的决定并不令人舒服。'
  },
  {
    cateKey: 'F',
    cateName: '情感型',
    cateId: 6,
    score: 0,
    type: '超前思考，考虑行为对他人的影响',
    info: '情感型的人常从自我的价值观念出发，变通地贯彻规章制度，做出一些自己认定是对的决策，比较关注决策可能给他人带来的情绪体验，人情味较浓。'
  },
  {
    cateKey: 'P',
    cateName: '知觉型',
    cateId: 7,
    score: 0,
    type: '着重过程(重点在于如何完成工作)',
    info: '知觉型的人好奇性、适宜性强，他们会不断关注新的信息，喜欢变化，也会考虑许多可能的变化因素，更愿意以比较灵活、随意、开放的方式生活。'
  },
  {
    cateKey: 'J',
    cateName: '判断型',
    cateId: 8,
    score: 0,
    type: '着重结果(重点在于完成任务)',
    info: '判断型的人目的性较强，一板一眼，他们喜欢有计划、有条理的世界，更愿意以比较有序的方式生活。'
  }
];
let tabFormateConfig = {
  radar: {
    name: {
      textStyle: {
        color: '#333333'
      }
    },
    radius: '70%',
    indicator: tabFormateRs.map(single => {
      return {
        name: single.cateKey,
        max: 60
      }
    })
  }
}

// 头部
const Header = (props) => {
  return (
    <header>MBTI职业性格测试</header>
  )
}

// 介绍
class Introduce extends Component {
  render () {
    return (
      <div className={this.props.show ? 'introduce' : 'hide'}>
        MBTI人格理论的基础是著名心理学家卡尔·荣格先生关于心理类型的划分。
        MBTI职业性格测试是国际最为流行的职业人格评估工具，作为一种对个性的判断和分析，是一个理论模型，从纷繁复杂的个性特征中，归纳提炼出4个关键要素——动力、信息收集、决策方式、生活方式，进行分析判断，从而把不同个性的人区别开来。
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        测试须知：（1）您有足够的时间答题，请您仔细阅读题目，根据您的第一反应做出决定。（2）以下各题目没有正误好坏之分，请按照与您性格符合的程度进行打分。（3）请注意，以下题目的打分默认是给A选项打分，B选项分数为：5分-A选项的得分(系统自动计算)。
        <br />
      </div>
    )
  }
}

// 测试题目
class Question extends Component {
  constructor() {
    super();
    this.state = {
      questions: questions,
      no: 1,
      nums: questions.length,
      myResults: {}
    }
  }

  handleAnswer (answer) {
    let no = this.state.no,
      question = this.state.questions[this.state.no - 1],
      myResults = this.state.myResults;
    if (no >= this.state.nums) {
      if (no === this.state.nums) {
        if (!myResults[question.cateKey]) {
          myResults[question.cateKey] = 0
          // 下面初始化对立项的分数
          if (question.cateKey === 'E') {
            myResults['I'] = 0
          } else if (question.cateKey === 'S') {
            myResults['N'] = 0
          } else if (question.cateKey === 'T') {
            myResults['F'] = 0
          } else if (question.cateKey === 'P') {
            myResults['J'] = 0
          }
        }
        myResults[question.cateKey] += answer
        // 下面计算对立项的分数
        if (question.cateKey === 'E') {
          myResults['I'] += (5 - answer)
        } else if (question.cateKey === 'S') {
          myResults['N'] += (5 - answer)
        } else if (question.cateKey === 'T') {
          myResults['F'] += (5 - answer)
        } else if (question.cateKey === 'P') {
          myResults['J'] += (5 - answer)
        }
        this.setState({
          no: ++no,
          myResults: myResults
        })
      }
      // 问题回答结束
      this.props.finishQuestion(myResults);
      this.setState({
        no: 1
      })
    } else {
      if (!myResults[question.cateKey]) {
        myResults[question.cateKey] = 0
        // 下面初始化对立项的分数
        if (question.cateKey === 'E') {
          myResults['I'] = 0
        } else if (question.cateKey === 'S') {
          myResults['N'] = 0
        } else if (question.cateKey === 'T') {
          myResults['F'] = 0
        } else if (question.cateKey === 'P') {
          myResults['J'] = 0
        }
      }
      myResults[question.cateKey] += answer
      // 下面计算对立项的分数
      if (question.cateKey === 'E') {
        myResults['I'] += (5 - answer)
      } else if (question.cateKey === 'S') {
        myResults['N'] += (5 - answer)
      } else if (question.cateKey === 'T') {
        myResults['F'] += (5 - answer)
      } else if (question.cateKey === 'P') {
        myResults['J'] += (5 - answer)
      }
      this.setState({
        no: ++no,
        myResults: myResults
      })
    }
  }

  render () {
    return (
      <div className={this.props.show ? 'question' : 'hide'}>
        <div className="questionNo"><span className="no">{this.state.no}</span><span className="nums"> / {this.state.nums}</span></div>
        <p className="title">
          {this.state.questions[this.state.no - 1].title}<br />
          A.&nbsp;{this.state.questions[this.state.no - 1].answerA}<br />
          B.&nbsp;{this.state.questions[this.state.no - 1].answerB}<br />
        </p>
        <p className="action">
          <span className="answer-title">请为A选项打分:</span><br />
          <span className="button" onClick={this.handleAnswer.bind(this, 5)}>非常同意(5分)</span>
          <span className="button" onClick={this.handleAnswer.bind(this, 4)}>比较同意(4分)</span>
          <span className="button" onClick={this.handleAnswer.bind(this, 3)}>差不多同意(3分)</span>
          <span className="button" onClick={this.handleAnswer.bind(this, 2)}>一点同意(2分)</span>
          <span className="button" onClick={this.handleAnswer.bind(this, 1)}>不同意(1分)</span>
        </p>
      </div>
    )
  }
}

// 测试结果
class Result extends Component {
  constructor() {
    super()
    this.state = {
      rs: '待测试',
      type: '还没有分析',
      info: '还不知道是什么类型，你说信息，我能展示出来吗？'
    }
  }

  // 初始化图表
  componentDidMount () {
    if (!myResultTab) {
      myResultTab = echarts.init(document.getElementById('myResultTab'));
    }
  }
  componentWillReceiveProps (props) {
    // 画图
    if (props.results) {
      // console.log("props：", props)
      this.resultAnalysis(props.results)
      // 下载结果表格
      this.downloadExcel(props.results)
      // 将结果写入后台数据库
      // this.insertToSQL(props.results)
    }
  }
  // 测试结果分析
  resultAnalysis (results) {
    let tempTypes = tabFormateRs.map(single => {
      single.score = results[single.cateKey] || single.score
      return single
    });
    let rsData = tempTypes.concat();
    // // 排序
    // rsData.sort((x, y) => {
    //   if (x.score > y.score) {
    //     return -1
    //   } else if (x.score < y.score) {
    //     return 1;
    //   } else {
    //     return 0;
    //   }
    // })
    // 双重循环找到最后结果
    var rsType1 = '';
    var rsType2 = '';
    var rsType3 = '';
    var rsType4 = '';
    for (let i = 0; i < rsData.length; i++) {
      for (let j = 0; j < rsData.length; j++) {
        if (rsData[i].cateKey === 'E' && rsData[j].cateKey === 'I' && rsData[i].score >= rsData[j].score) {
          rsType1 = 'E'
        }
        if (rsData[i].cateKey === 'E' && rsData[j].cateKey === 'I' && rsData[i].score <= rsData[j].score) {
          rsType1 = 'I'
        }
        if (rsData[i].cateKey === 'S' && rsData[j].cateKey === 'N' && rsData[i].score >= rsData[j].score) {
          rsType2 = 'S'
        }
        if (rsData[i].cateKey === 'S' && rsData[j].cateKey === 'N' && rsData[i].score <= rsData[j].score) {
          rsType2 = 'N'
        }
        if (rsData[i].cateKey === 'T' && rsData[j].cateKey === 'F' && rsData[i].score >= rsData[j].score) {
          rsType3 = 'T'
        }
        if (rsData[i].cateKey === 'T' && rsData[j].cateKey === 'F' && rsData[i].score <= rsData[j].score) {
          rsType3 = 'F'
        }
        if (rsData[i].cateKey === 'P' && rsData[j].cateKey === 'J' && rsData[i].score >= rsData[j].score) {
          rsType4 = 'P'
        }
        if (rsData[i].cateKey === 'P' && rsData[j].cateKey === 'J' && rsData[i].score <= rsData[j].score) {
          rsType4 = 'J'
        }
      }
    }

    console.log("测试结果如下：", rsData)
    this.setState({
      rs: rsType1 + rsType2 + rsType3 + rsType4,
      name:rsData[0].cateName,
      type: rsData[0].type,
      info: rsData[0].info
    })

    tabFormateConfig.series = [{
      type: 'radar',
      data: [
        {
          value: tempTypes.map(single => single.score),
          symbol: 'circle',
          symbolSize: 1,
          lineStyle: {
            normal: {
              color: '#ea8973'
            }
          },
          areaStyle: {
            normal: {
              opacity: 0.7,
              color: '#ea8973'
            }
          }
        }
      ]
    }];
    myResultTab.setOption(tabFormateConfig)
  }

  downloadExcel (results) {
    let tempTypes = tabFormateRs.map(single => {
      single.score = results[single.cateKey] || single.score
      return single
    });
    let rsData = tempTypes.concat();
    // 双重循环找到最后结果
    var rsType1 = '';
    var rsType2 = '';
    var rsType3 = '';
    var rsType4 = '';
    for (let i = 0; i < rsData.length; i++) {
      for (let j = 0; j < rsData.length; j++) {
        if (rsData[i].cateKey === 'E' && rsData[j].cateKey === 'I' && rsData[i].score >= rsData[j].score) {
          rsType1 = 'E'
        }
        if (rsData[i].cateKey === 'E' && rsData[j].cateKey === 'I' && rsData[i].score <= rsData[j].score) {
          rsType1 = 'I'
        }
        if (rsData[i].cateKey === 'S' && rsData[j].cateKey === 'N' && rsData[i].score >= rsData[j].score) {
          rsType2 = 'S'
        }
        if (rsData[i].cateKey === 'S' && rsData[j].cateKey === 'N' && rsData[i].score <= rsData[j].score) {
          rsType2 = 'N'
        }
        if (rsData[i].cateKey === 'T' && rsData[j].cateKey === 'F' && rsData[i].score >= rsData[j].score) {
          rsType3 = 'T'
        }
        if (rsData[i].cateKey === 'T' && rsData[j].cateKey === 'F' && rsData[i].score <= rsData[j].score) {
          rsType3 = 'F'
        }
        if (rsData[i].cateKey === 'P' && rsData[j].cateKey === 'J' && rsData[i].score >= rsData[j].score) {
          rsType4 = 'P'
        }
        if (rsData[i].cateKey === 'P' && rsData[j].cateKey === 'J' && rsData[i].score <= rsData[j].score) {
          rsType4 = 'J'
        }
      }
    }
    var option = {};
    let dataTable = [];
    // console.log("结果表格数据为：", data)
    // 获取排序第一的内容，传送到dataTable中
    if (rsData) {
      let obj = {
        '测试者姓名': userName,
        'MBTI类型': rsType1 + rsType2 + rsType3 + rsType4,
        '测试结果数据': JSON.stringify(rsData)
      }
      dataTable.push(obj);
    }
    // console.log(dataTable)
    option.fileName = userName + '的MBTI性格测试结果.xlsx'
    option.datas = [
      {
        sheetData: dataTable,
        sheetName: 'sheet',
        sheetFilter: ['测试者姓名', 'MBTI类型', '测试结果数据'],
        sheetHeader: ['测试者姓名', 'MBTI类型', '测试结果数据'],
      }
    ];
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  }

  // insertToSQL (results) {
  //   // 获取排序后的结果数据
  //   let tempTypes = tabFormateRs.map(single => {
  //     single.score = results[single.cateKey] || single.score
  //     return single
  //   });
  //   let rsData = tempTypes.concat();
  //   // 重新排序
  //   rsData.sort((x, y) => {
  //     if (x.score > y.score) {
  //       return -1
  //     } else if (x.score < y.score) {
  //       return 1;
  //     } else {
  //       return 0;
  //     }
  //   })

  //   var mysql = require('mysql');

  //   var connection = mysql.createConnection({
  //     host: '127.0.0.1',
  //     user: 'root',
  //     password: '123456',
  //     port: '3306',
  //     database: 'test'
  //   });

  //   connection.connect();

  //   var addSql = 'INSERT INTO PDPTest(name,type,typeName,score) VALUES(?,?,?,?)';
  //   var addSqlParams = [userName, rsData[0].cateKey, rsData[0].cateName, rsData[0].score];
  //   // 增
  //   connection.query(addSql, addSqlParams, function (err, result) {
  //     if (err) {
  //       console.log('[INSERT ERROR] - ', err.message);
  //       return;
  //     }
  //     console.log('--------------------------INSERT----------------------------');
  //     //console.log('INSERT ID:',result.insertId);        
  //     console.log('INSERT ID:', result);
  //     console.log('-----------------------------------------------------------------\n\n');
  //   });

  //   connection.end();
  // }

  render () {
    return (
      <div className={this.props.show ? 'result' : 'hide'}>
        <span className="rs">MBTI测评的类型是：{this.state.rs} -- {this.state.name}</span>
        <div id="myResultTab"></div>
        <div className="info">
          <span className="title">结果解读-- {this.state.type}</span>
          <p>
            {this.state.info}
          </p>
        </div>
      </div>
    )
  }
}

// 尾部
const Footer = (props) => {
  return (
    <footer>©2020 炜盛科技版权所有</footer>
  )
}


class MkTest extends Component {
  constructor() {
    super()
    this.state = {
      userName: '',
      isStarted: false,
      isFinished: false
    }
    this.handleChange = this.handleChange.bind(this);
  }

  startTest () {
    this.setState({
      isStarted: true
    });
  }

  finishQuestion (results) {
    this.setState({
      isFinished: true,
      results: results
    });
  }

  handleChange (event) {
    userName = event.target.value
    this.setState({ userName: event.target.value });
  }

  render () {
    return (
      <div className="mktest">
        <Header />
        <div className="testBody">
          <Introduce show={!this.state.isStarted} />
          <div className={!this.state.isStarted ? 'userNameInput' : 'hide'}>
            <label>您的名字是：</label>
            <input type="text" value={this.state.userName} onChange={this.handleChange}></input>
          </div>
          <span className={!this.state.isStarted ? 'startButton' : 'hide'} onClick={this.startTest.bind(this)}>开始测试</span>
          <Question show={this.state.isStarted && !this.state.isFinished} finishQuestion={this.finishQuestion.bind(this)} />
          <Result show={this.state.isFinished} results={this.state.results} />
        </div>
        <Footer />
      </div>
    )
  }
}

ReactDOM.render(
  <MkTest />,
  document.getElementById('root')
)
