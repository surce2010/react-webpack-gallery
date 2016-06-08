require('normalize.css/normalize.css');
require('styles/App.css');
require('styles/main.less');

import React from 'react';
import _ from 'lodash';

let CONSTANT = {
  centerPos: { //中间取值范围
    left: 0,
    top: 0
  },
  hPosRange: { //水平方向取值范围
    leftSecX: [0, 0],
    rightSecX: [0, 0],
    y: [0, 0]
  },
  vPosRange: { //垂直方向取值范围
    x: [0, 0],
    topY: [0, 0]
  }
};

// 获取图片相关的数
var imagesData = require('../data/imagesData.json');
// 利用自执行函数， 将图片名信息转成图片URL路径信息
imagesData = ((imagesDataArr) => {
  for (let i = 0, j = imagesDataArr.length; i < j; i++) {
    let singleImageData = imagesDataArr[i];
    singleImageData.imageURL = require('../images/' + singleImageData.fileName);
    imagesDataArr[i] = singleImageData;
  }

  return imagesDataArr;
})(imagesData);

class ImageFigure extends React.Component {
  render() {
  	let me = this,
        props = me.props,
        pos = _.get(props, 'pos');

    return (
    	<figure className="img-figure" ref={(c) => {this.figure = c}} style={pos}>
        <img src={_.get(props, 'imagesData.imageURL')} />
        <figcaption className="img-title">{_.get(props, 'imagesData.fileName')}</figcaption>
      </figure>
    );
  }
}

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imagesPos: [] //图片数组位置
    };
  }

  render() {
    let me = this,
        state = me.state,
        imgFiguresJSX = [],
        controllerUnits = [];

  	_.map(imagesData, function (item, index) {
      if (!_.get(state, ['imagesPos', index])) {
        _.set(state, ['imagesPos', index], {left:0, top:0});
      }

  		imgFiguresJSX.push(
        <ImageFigure key={index} imagesData={item} ref={'imgFigure' + index} pos={_.get(state, ['imagesPos', index])} />
      );
  	}.bind(me));

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFiguresJSX}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }

  //组件加载以后,为每一个图片计算位置取值区间
  componentDidMount() {
    let me = this;

    //舞台大小
    let stageDOM = me.refs.stage,
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);

    //单个图片组件大小
    let imgFigureDOM = me.refs.imgFigure0.figure, //TODO 获取的不是DOM元素
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);

    //计算中心图片的位置点
    _.set(CONSTANT, 'centerPos.left', halfStageW - halfImgW);
    _.set(CONSTANT, 'centerPos.top', halfStageH - halfImgH);

    //计算左侧,右侧图片位置取值区间
    _.set(CONSTANT, 'hPosRange.leftSecX', [-halfImgW, halfStageW - halfImgW * 3]);
    _.set(CONSTANT, 'hPosRange.rightSecX', [halfStageW + halfImgW, stageW - halfImgW]);
    _.set(CONSTANT, 'hPosRange.y', [-halfImgH, halfStageH - halfImgH]);

    //计算上侧图片位置取值区间
    _.set(CONSTANT, 'vPosRange.x', [halfStageW - halfImgW, halfStageW]);
    _.set(CONSTANT, 'vPosRange.topY', [-halfImgH, halfStageH - halfImgH * 3]);

    me.hanlderLayoutPicture(5);
  }

  /*
   * 计算随机数
   * @param low, high取值区间的端点值
   */
  calcRandomNumber (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
  }

  /*
   * 重新布局图片
   * @param centerIndex 居中图片索引
   */
  hanlderLayoutPicture (centerIndex) {
    let me = this,
        state = me.state,
        imagesPos = _.get(state, 'imagesPos');

    //重绘居中图片
    imagesPos.splice(centerIndex, 1);

    //重绘上侧图片
    if (imagesPos.length > 1) {
      let topIndex = Math.floor(Math.random() * (imagesPos.length - 1));
      imagesPos.splice(topIndex, 1);

      //重绘左,右侧图片
      if (imagesPos.length) {
        let l = imagesPos.length;
        for (let i = 0, j = Math.floor(l / 2); i < j, j < l; i++, j++) {
          imagesPos[i] = {left: me.calcRandomNumber(_.get(CONSTANT, ['hPosRange', 'leftSecX', 0]), _.get(CONSTANT, ['hPosRange', 'leftSecX', 1])), top: me.calcRandomNumber(_.get(CONSTANT, ['hPosRange', 'y', 0]), _.get(CONSTANT, ['hPosRange', 'y', 1]))};
          imagesPos[j] = {left: me.calcRandomNumber(_.get(CONSTANT, ['hPosRange', 'rightSecX', 0]), _.get(CONSTANT, ['hPosRange', 'rightSecX', 1])), top: me.calcRandomNumber(_.get(CONSTANT, ['hPosRange', 'y', 0]), _.get(CONSTANT, ['hPosRange', 'y', 1]))};
        }
      }

      imagesPos.splice(topIndex, 0, {left: me.calcRandomNumber(_.get(CONSTANT, ['vPosRange', 'x', 0]), _.get(CONSTANT, ['vPosRange', 'x', 1])), top: me.calcRandomNumber(_.get(CONSTANT, ['vPosRange', 'topY', 0]), _.get(CONSTANT, ['vPosRange', 'topY', 1]))});
    }

    imagesPos.splice(centerIndex, 0, _.get(CONSTANT, 'centerPos'));

    me.setState({
      imagesPos: imagesPos
    }, () => {
      console.log(state, 'imagesPos');
    });

  }


}

AppComponent.defaultProps = {
};

export default AppComponent;
