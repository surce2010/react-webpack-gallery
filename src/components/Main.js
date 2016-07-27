require('normalize.css/normalize.css');
require('styles/App.css');
require('styles/main.less');

import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

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

// 获取图片相关的数组
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
        imgArrange = _.get(props, 'imgArrange'),
        styleObj = {};

    _.set(styleObj, 'left', _.get(imgArrange, 'pos.left'));
    _.set(styleObj, 'top', _.get(imgArrange, 'pos.top'));

    _.get(imgArrange, 'rotate') && _.map(['Webkit', 'O', 'ms', 'Moz', 'Khtml'], (item) => {
      return styleObj[item + 'Transform'] = 'rotate(' + _.get(imgArrange, 'rotate') + 'deg)';
    });

    _.get(imgArrange, 'isCenter') && _.set(styleObj, 'zIndex', '101');

    console.log(_.get(imgArrange, 'isInverse'), '反面', _.get(imgArrange, 'isCenter'), '居中');

    return (
    	<figure className={classNames('img-figure', {'is-inverse': _.get(imgArrange, 'isInverse')})}
              onClick={me.props.changeCenterIndex}
              ref={(c) => {this.figure = c}}
              style={styleObj} >
        <img src={_.get(props, 'imagesData.imageURL')} />
        <figcaption className="img-title">{_.get(props, 'imagesData.fileName')}</figcaption>
        <div className='text'>{_.get(props, 'imagesData.desc')}</div>
      </figure>
    );
  }
}

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgsArrangeArr: [{
        pos: { //位置
          left: '',
          top: ''
        },
        rotate: '', //旋转角度
        isInverse: false, //是否正面
        isCenter: false //是否居中
      }]
    };
  }

  render() {
    let me = this,
        state = me.state,
        imgFiguresJSX = [],
        controllerUnits = [];

  	_.map(imagesData, function (item, index) {
      if (!_.get(state, ['imgsArrangeArr', index])) {
        _.set(state, ['imgsArrangeArr', index], {
          pos: {
            left:0,
            top:0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        });
      }

  		imgFiguresJSX.push(
        <ImageFigure key={index}
                     imagesData={item}
                     ref={'imgFigure' + index}
                     changeCenterIndex={me.handleChangeCenterIndex.bind(me, index)}
                     imgArrange={_.get(state, ['imgsArrangeArr', index])} />
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
    let imgFigureDOM = me.refs.imgFigure0.figure,
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

    me.hanlderLayoutPicture(2);
  }

  /*
   * 计算随机数
   * @param low, high取值区间的端点值
   */
  calcRandomNumber (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
  }

  /*
   * 旋转随机角度
   * return 随机输出正负30Deg
   */
  rotateRandomDeg () {
    return (Math.random() > 0.5 ? '-' : '') + Math.ceil(Math.random() * 30);
  }

  /*
   * 切换居中图片
   * @param 居中图片索引值
   * 如果点击的图片不为居中图片,则居中;反之,则翻转;
   */
  handleChangeCenterIndex (index) {
    let me = this,
        { state } = me,
        imgsArrangeArr = _.get(state, 'imgsArrangeArr');

    let centerIndex = _.findIndex(imgsArrangeArr, (item) => {
      return item.isCenter === true;
    });

    if (centerIndex === index) {
      if (_.get(imgsArrangeArr, [index, 'isInverse'])) {
        _.set(imgsArrangeArr, [index, 'isInverse'], false);
      } else {
        _.set(imgsArrangeArr, [index, 'isInverse'], true);
      }
      me.setState({
        imgsArrangeArr: imgsArrangeArr
      });
    } else {
      me.hanlderLayoutPicture(index);
    }
  }

  /*
   * 重新布局图片
   * @param centerIndex 居中图片索引
   */
  hanlderLayoutPicture (centerIndex) {
    let me = this,
        state = me.state,
        imgsArrangeArr = _.get(state, 'imgsArrangeArr');

    imgsArrangeArr.splice(centerIndex, 1);
    if (imgsArrangeArr.length > 0) {
      let topIndex = Math.floor(Math.random() * (imgsArrangeArr.length - 1));
      imgsArrangeArr.splice(topIndex, 1);

      //重绘左,右侧图片
      if (imgsArrangeArr.length) {
        let l = imgsArrangeArr.length;
        for (let i = 0, j = Math.floor(l / 2); i < j, j < l; i++, j++) {
          imgsArrangeArr[i] = {
            pos: {
              left: me.calcRandomNumber(_.get(CONSTANT, ['hPosRange', 'leftSecX', 0]), _.get(CONSTANT, ['hPosRange', 'leftSecX', 1])),
              top: me.calcRandomNumber(_.get(CONSTANT, ['hPosRange', 'y', 0]), _.get(CONSTANT, ['hPosRange', 'y', 1]))
            },
            rotate: me.rotateRandomDeg()
          };
          imgsArrangeArr[j] = {
            pos:{
              left: me.calcRandomNumber(_.get(CONSTANT, ['hPosRange', 'rightSecX', 0]), _.get(CONSTANT, ['hPosRange', 'rightSecX', 1])),
              top: me.calcRandomNumber(_.get(CONSTANT, ['hPosRange', 'y', 0]), _.get(CONSTANT, ['hPosRange', 'y', 1]))
            },
            rotate: me.rotateRandomDeg()
          };
        }
      }

      imgsArrangeArr.splice(topIndex, 0, {
        pos: {
          left: me.calcRandomNumber(_.get(CONSTANT, ['vPosRange', 'x', 0]), _.get(CONSTANT, ['vPosRange', 'x', 1])),
          top: me.calcRandomNumber(_.get(CONSTANT, ['vPosRange', 'topY', 0]), _.get(CONSTANT, ['vPosRange', 'topY', 1]))
        },
        rotate: me.rotateRandomDeg()
      });
    }

    imgsArrangeArr.splice(centerIndex, 0, {
      pos: _.get(CONSTANT, 'centerPos'),
      isCenter: true
    });

    me.setState({
      imgsArrangeArr: imgsArrangeArr
    }, () => {
      console.log(state, 'imgsArrangeArr');
    });

  }


}

AppComponent.defaultProps = {
};

export default AppComponent;
