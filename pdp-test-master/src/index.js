import React, { Component } from 'react';
// eslint-disable-next-line no-unused-vars
import ReactDOM, { render } from 'react-dom';
import ExportJsonExcel from 'js-export-excel';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/radar';
import 'rsuite/dist/styles/rsuite-default.css';
import './index.css';
import { Alert } from 'rsuite';


let questions = require('./question.json');
questions.sort(function () {
  return (0.5 - Math.random());
})

let myResultTab = null;
let userName = '';
const tabFormateRs = [
  {
    // Tiger
    cateKey: 'T',
    cateName: '老虎型',
    score: 0,
    type: '老虎型',
    info: '具有老虎族群特质者，约占人口15 %，其共同性格为充满自信、竞争心强、主动且企图心强烈，是个有决断力的领导者。一般而言，老虎型的人胸怀大志，勇于冒险，看问题能够直指核心，并对目标全力以赴。他们在领导风格及决策上，强调权威与果断，擅长危机处理，此种性格最适合开创性与改革性的工作。全世界首富，微软公司的总裁比尔盖兹就是典型的代表人物。'
  },
  {
    // Peacock 
    cateKey: 'P',
    cateName: '孔雀型',
    score: 0,
    type: '孔雀型',
    info: '孙中山先生及美国总统克林顿皆是营造气氛、宣扬理念、塑造愿景的能手，他们都是属于占人口15%的孔雀型领导族群。孔雀型的共同特质为：人际关系能力极强，擅长以口语表达感受而引起共鸣，很会激励并带动气氛。他们喜欢跟别人互动，重视群体的归属感，基本上是比较「人际导向」。由于他们富同理心并乐于分享，具有很好的亲和力，在服务业、销售业、传播业及公共关系等领域中，孔雀型的领导者都有很杰出的表现。'
  },
  {
    // Koala
    cateKey: 'K',
    cateName: '考拉型',
    score: 0,
    type: '考拉型',
    info: '他们的共同特质为平易近人、敦厚可靠、避免冲突与不具批判性。在行为上，表现出不慌不忙、冷静自持的态度。他们注重稳定与中长程规划，现实生活中，常会反思自省并以和谐为中心，即使面对困境，亦能泰然自若，从容应付。 在决策上，他们需要较充足的时间做规划，意志坚定、步调稳健。考拉型可以说是一群默默耕耘的无名英雄，在平凡中见其伟大，占人口20 %。南非国父曼德拉，即是最佳的写照。'
  },
  {
    // Owl
    cateKey: 'O',
    cateName: '猫头鹰型',
    score: 0,
    type: '猫头鹰型',
    info: '他们的共同特质为重计划、条理、细节精准。在行为上，表现出喜欢理性思考与分析、较重视制度、结构、规范。他们注重执行游戏规则、循规蹈矩、巨细靡遗、重视品质、敬业负责。'
  },
  {
    // Chameleon
    cateKey: 'C',
    cateName: '变色龙型',
    score: 0,
    type: '变色龙型',
    info: '他们的共同特征为适应力及弹性都相当强，擅于整合内外资源，兼容并蓄，以合理化及中庸之道来待人处事。变色龙型了人，会依组织目标及所处环境的任务需求，随时调整自己，因为他们没有明确的预设立场，不走极端，柔软性高，是个称职的谈判斡旋高手，也是手腕圆融的外交人才。在环境骤变的时代，他们更能随机应变，因此不论在企业开创期、过度期或转型期，均非常需要此种人才参与。占人口30 %，诸葛孔明是代表性人物。'
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
        max: 30
      }
    })
  }
}

// 头部
const Header = (props) => {
  return (
    <header>PDP行为风格测试</header>
  )
}

// 介绍
class Introduce extends Component {
  render () {
    return (
      <div className={this.props.show ? 'introduce' : 'hide'}>
        PDP行为风格测试的全称是Professional Dyna-Metric Programs（行为特质动态衡量系统），它是一个用来衡量个人的行为特质、活力、动能、压力、精力及能量变动情况的系统。PDP根据人的天生特质，将人群分为五种类型，包括：支配型、外向型、耐心型、精确型、整合型；为了将这五种类型的个性特质形象化，根据其各自的特点，这五类人群又分别被称为“老虎”、“孔雀”、“考拉”、“猫头鹰”、“变色龙”。PDP是一个进行人才管理的专业系统，能够帮助人们认识与管理自己，帮助组织做到“人尽其才”。
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
        }
        myResults[question.cateKey] += answer
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
      }
      myResults[question.cateKey] += answer
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
        <p className="title">{this.state.questions[this.state.no - 1].title}</p>
        <p className="action">
          <span className="button" onClick={this.handleAnswer.bind(this, 5)}>非常同意</span>
          <span className="button" onClick={this.handleAnswer.bind(this, 4)}>比较同意</span>
          <span className="button" onClick={this.handleAnswer.bind(this, 3)}>差不多</span>
          <span className="button" onClick={this.handleAnswer.bind(this, 2)}>一点同意</span>
          <span className="button" onClick={this.handleAnswer.bind(this, 1)}>不同意</span>
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
      // 将下载结果写入数据库--不可用
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
    // 查询前三的结果
    rsData.sort((x, y) => {
      if (x.score > y.score) {
        return -1
      } else if (x.score < y.score) {
        return 1;
      } else {
        return 0;
      }
    })
    console.log("测试结果如下：", rsData)
    this.setState({
      rs: rsData[0].cateKey,
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
    // 重新排序
    rsData.sort((x, y) => {
      if (x.score > y.score) {
        return -1
      } else if (x.score < y.score) {
        return 1;
      } else {
        return 0;
      }
    })
    const data = rsData;
    var option = {};
    let dataTable = [];
    // console.log("结果表格数据为：", data)
    // 获取排序第一的内容，传送到dataTable中
    if (data) {
      let obj = {
        '测试者姓名': userName,
        'PDP类型是': data[0].cateKey,
        '类型名称': data[0].cateName,
        '得分': data[0].score,
        '测试数据': JSON.stringify(data)
      }
      dataTable.push(obj);
    }
    // console.log(dataTable)
    option.fileName = userName + '的PDP性格测试结果'
    option.datas = [
      {
        sheetData: dataTable,
        sheetName: 'sheet',
        sheetFilter: ['测试者姓名', 'PDP类型是', '类型名称', '得分', '测试数据'],
        sheetHeader: ['测试者姓名', 'PDP类型是', '类型名称', '得分', '测试数据'],
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
  //   //增
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
        <span className="rs">PDP行为风格类型是：{this.state.rs} -- {this.state.type}</span>
        <div id="myResultTab"></div>
        <div className="info">
          <span className="title">结果解读</span>
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
    <footer>©2020 炜盛科技 版权所有</footer>
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
    if (this.state.userName !== '') {
      this.setState({
        isStarted: true
      });
    } else {
      Alert.error('请输入名字后再开始测试！！！')
      this.setState({
        isStarted: false
      });
    }
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
