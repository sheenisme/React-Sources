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
    cateName: '实际型',
    score: 0,
    type: '家里你说了算',
    info: '愿意使用工具从事操作性工作，动手能力强，做事手脚灵活，动作协调。偏好于具体任务，不善言辞，做事保守，较为谦虚。缺乏社交能力，通常喜欢独立做事。'
  },
  {
    cateKey: 'I',
    cateName: '常规型',
    score: 0,
    type: '非常细心的人，另一半很幸福',
    info: '尊重权威和规章制度，喜欢按计划办事，细心、有条理，习惯接受他人的指挥和领导，自己不谋求领导职务。喜欢关注实际和细节情况，通常较为谨慎和保守，缺乏创造性，不喜欢冒险和竞争，富有自我牺牲精神。'
  },
  {
    cateKey: 'S',
    cateName: '企业型',
    score: 0,
    type: '你就是传说中的领导',
    info: '追求权力、权威和物质财富，具有领导才能。喜欢竞争、敢冒风险、有野心、抱负。为人务实，习惯以利益得失，权利、地位、金钱等来衡量做事的价值，做事有较强的目的性。'
  },
  {
    cateKey: 'N',
    cateName: '社会型',
    score: 0,
    type: '没办法，你到处都有朋友',
    info: '喜欢与人交往、不断结交新的朋友、善言谈、愿意教导别人。关心社会问题、渴望发挥自己的社会作用。寻求广泛的人际关系，比较看重社会义务和社会道德。'
  },
  {
    cateKey: 'T',
    cateName: '艺术型',
    score: 0,
    type: '没错，艺术家就该留长发',
    info: '有创造力，乐于创造新颖、与众不同的成果，渴望表现自己的个性，实现自身的价值。做事理想化，追求完美，不重实际。具有一定的艺术才能和个性。善于表达、怀旧、心态较为复杂。'
  },
  {
    cateKey: 'F',
    cateName: '研究型',
    score: 0,
    type: '很牛逼（除了头发）',
    info: '思想家而非实干家,抽象思维能力强，求知欲强，肯动脑，善思考，不愿动手。喜欢独立的和富有创造性的工作。知识渊博，有学识才能，不善于领导他人。考虑问题理性，做事喜欢精确，喜欢逻辑分析和推理，不断探讨未知的领域。'
  },
  {
    cateKey: 'P',
    cateName: 'PP型',
    score: 0,
    type: 'PPPPPP',
    info: 'PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP'
  },
  {
    cateKey: 'J',
    cateName: 'JJ型',
    score: 0,
    type: 'JJJJJJJJJJJ',
    info: 'JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ'
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
        测试须知：（1）您有足够的时间答题，请您仔细阅读题目，根据您的第一反应做出决定。（2）以下各题目没有正误好坏之分，请按照与您性格符合的程度进行打分。
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
          <span className="button" onClick={this.handleAnswer.bind(this, 5)}>5分</span>
          <span className="button" onClick={this.handleAnswer.bind(this, 4)}>4分</span>
          <span className="button" onClick={this.handleAnswer.bind(this, 3)}>3分</span>
          <span className="button" onClick={this.handleAnswer.bind(this, 2)}>2分</span>
          <span className="button" onClick={this.handleAnswer.bind(this, 1)}>1分</span>
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
      this.insertToSQL(props.results)
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
      rs: rsData[0].cateKey + rsData[1].cateKey + rsData[2].cateKey,
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
      }
      dataTable.push(obj);
    }
    // console.log(dataTable)
    option.fileName = userName + '的PDP性格测试结果.xlsx'
    option.datas = [
      {
        sheetData: dataTable,
        sheetName: 'sheet',
        sheetFilter: ['测试者姓名', 'PDP类型是', '类型名称', '得分'],
        sheetHeader: ['测试者姓名', 'PDP类型是', '类型名称', '得分'],
      }
    ];
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  }

  insertToSQL (results) {
    // 获取排序后的结果数据
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

    var mysql = require('mysql');

    var connection = mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '123456',
      port: '3306',
      database: 'test'
    });

    connection.connect();

    var addSql = 'INSERT INTO PDPTest(name,type,typeName,score) VALUES(?,?,?,?)';
    var addSqlParams = [ userName, rsData[0].cateKey, rsData[0].cateName, rsData[0].score];
    // 增
    connection.query(addSql, addSqlParams, function (err, result) {
      if (err) {
        console.log('[INSERT ERROR] - ', err.message);
        return;
      }
      console.log('--------------------------INSERT----------------------------');
      //console.log('INSERT ID:',result.insertId);        
      console.log('INSERT ID:', result);
      console.log('-----------------------------------------------------------------\n\n');
    });

    connection.end();
  }

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
