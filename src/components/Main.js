require('normalize.css/normalize.css');
require('styles/App.css');
require('styles/main.less');

import React from 'react';
import _ from 'lodash';

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
      },
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
    let me = this,
        state = me.state;

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
    _.set(state, 'centerPos.left', halfStageW - halfImgW);
    _.set(state, 'centerPos.top', halfStageH - halfImgH);

    //计算左侧,右侧图片位置取值区间
    _.set(state, 'hPosRange.leftSecX', [-halfImgW, halfStageW - halfImgW * 3]);
    _.set(state, 'hPosRange.rightSecX', [halfStageW + halfImgW, stageW - halfImgW]);
    _.set(state, 'hPosRange.y', [-halfImgH, halfStageH - halfImgH]);

    //计算上侧图片位置取值区间
    _.set(state, 'vPosRange.x', [halfStageW - halfImgW, halfStageW]);
    _.set(state, 'vPosRange.topY', [-halfImgW, halfStageH - halfImgH * 3]);

    me.hanlderLayoutPicture();
  }

  /*
   * 重新布局图片
   * @param centerIndex 制定居中图片
  */
  hanlderLayoutPicture (centerIndex) {
    let me = this,
        state =  me.state;

    let imagesPos = _.get(state, 'imagesPos');
    _.set(imagesPos, [centerIndex || 0], _.get(state, 'centerPos'));

  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
